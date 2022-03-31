<template>
    <n-card :title="title">
         <n-list bordered>
            <template #header>
             <n-space justify="space-between" style="margin: -10px;">
                <n-button @click="open">PC</n-button>
                <div style="font-size:12px; font-family:'Malgun Gothic','맑은 고딕';letter-spacing: -0.5px;">
                    총 {{fileList.length}} | {{fileSizeFormat(totalSize)}} <n-button quaternary type="success">△</n-button>
                </div>
             </n-space>
            </template>
            <div style="max-height: 175px; overflow: auto;">
                <n-list-item v-for="file in fileList" :key="file.fileId">
                    <n-space justify="space-between" style="padding: 5px;">
                        <div style="font-size:12px; font-family:'Malgun Gothic','맑은 고딕';letter-spacing: -0.5px;">         
                           <i class="fa-solid fa-file-pdf" v-if="getFileType(file.type) == 'pdf'" style="font-size: 17px;"></i>
                           <i class="fa-solid fa-file-excel" v-else-if="getFileType(file.type) == 'spreadsheet'" style="font-size: 17px;"></i>
                           <i class="fa-solid fa-file-image" v-else-if="getFileType(file.type) == 'image'" style="font-size: 17px;"></i>
                           <i class="fa-solid fa-file-zipper" v-else-if="getFileType(file.type) == 'zip'" style="font-size: 17px;"></i>
                           <i class="fa-solid fa-file" v-else style="font-size: 17px;"></i>
                           <a @click="downloadFile(file)">{{file.name}}</a> ({{fileSizeFormat(file.size)}})
                        </div>    
                        <div v-if="!file.progress" style="font-size:10px; font-family:'Malgun Gothic','맑은 고딕';letter-spacing: -0.5px; color: green;">
                            [ Uploaded: <n-time :time="file.createdDate" type="datetime" /> ]
                            <n-button tertiary size="tiny">
                                <template #icon>
                                    <n-icon><close-icon /></n-icon>
                                </template>
                            </n-button>
                        </div>
                    </n-space>
                </n-list-item>
            </div>
        </n-list>

        <file-upload
            :input-id="inputId"
            v-model="fileList"            
            :multiple="true"
            :size="size || 0"
            :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
            :drop="true"
            :addIndex="true"
            :post-action="postUrl"
            :data="document"
            @input-filter="inputFilter"
            @input-file="inputFile"
            :headers="{'Authorization': token}"
            ref="upload"
        >
            <div v-show="fileList.length === 0" style="padding-top: 40px;">
             Drag files here to attachment or <n-button type="tertiary" @click="open">PC</n-button>
            </div>

        </file-upload>
    </n-card>
</template>

<script>
import {get} from '@/api/http'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { fileSizeFormat } from '@/utils'
import { defineComponent, ref, onMounted } from 'vue'
import VueUploadComponent from 'vue-upload-component'
import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
import axios from '@/api/axios.config'

  export default defineComponent({
    name: 'InputFile',
    
    components: {
        ArchiveIcon,
        'file-upload': VueUploadComponent,
        CloseIcon
    },

    props: {
        inputId: {
            type: String,
            default: 'upload'
        },  
        title: {
            type: String,
            default: "File upload"
        },
        documentId: {
            type: String,
            default: null
        },
        uploadAuto: {
            type: Boolean,
            default: true
        }
    },

    setup(props, {emit}) {
        const fileListRef = ref([])
        const createColumns = () => {
            return [
                {
                title: 'Name',
                key: 'fileOrgName'
                },
                {
                title: 'Size',
                key: 'fileSize'
                },
                {
                title: 'Type',
                key: 'fileType'
                },
                {
                title: 'Server',
                key: 'serverInfo'
                },
                {
                title: 'Action',
                key: 'actions'
                }
            ]
        }
        const totalSize = ref(0)

        return {
            token: sessionStorage.getItem('token'),
            // postUrl: ref('http://prusoft.synology.me:28080/api/document/createDocument'),
            // downloadUrl: ref('http://prusoft.synology.me:28080/api/file-attch/download/'),
            postUrl: ref('http://localhost:8080/api/document/createDocument'),
            downloadUrl: ref('http://localhost:8080/api/fileAttach/download/'),
            fileList: fileListRef,
            columns: createColumns(),
            size: ref(1024 * 1024 * 1000),
            totalSize: totalSize,
            thread: ref(3),
            minSize: ref(0),
            document: ref({
                documentId: props.documentId
            }),
        }
    },

    data() {
        return {
            loadFlag: false,
        }
    },

    async mounted() {
        await this.loadData()
    },

    watch: {
        fileList: async function(value){
            if(this.$refs.upload && this.$refs.upload.uploaded){
                if(!this.loadFlag){
                    this.loadData()
                }
            }
        }
    },

    methods: {
        open(){
            document.getElementById(this.inputId).click()
        },

        async loadData(){
            await get({url: '/api/document/get/'+this.documentId}).then(res => {
                this.fileList = []
                let data = res['fileAttachList']
                for(let i in data){
                    this.fileList.push({
                        fileObject: true,
                        fileId: data[i].fileId,
                        size: data[i].fileSize,
                        name: data[i].fileOrgName,
                        type: data[i].fileType,
                        active: false,
                        success: true,
                        createdDate: new Date(data[i].createdDate)
                    })
                }

                this.fileList = this.fileList.sort((a, b) => {
                    return b.createdDate - a.createdDate
                })

                let size = 0
                for(let i in data){
                    size += data[i].fileSize
                }
                this.totalSize = size
                this.loadFlag = true
            })
        },
        inputFilter(newFile, oldFile, prevent){
            if (newFile && !oldFile) {
                if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                return prevent()
                }

                if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                return prevent()
                }

                if(newFile.size > this.size || this.totalSize + newFile.size > this.size){
                    return prevent()
                }

                let findFile = this.fileList.filter(function(e){
                    return e.name === newFile.name && e.size === newFile.size
                })

                if(findFile.length > 0){
                    console.log('동일한 파일이 이미 등록되었습니다.')
                    return prevent()
                }
            }

            this.loadFlag = false

            if(newFile && newFile.error === '' && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
                newFile.blob = ''
                let URL = (window.URL || window.webkitURL)
                if(URL) {
                    newFile.blob = URL.createObjectURL(newFile.file)
                }
            }
        },
        inputFile(newFile, oldFile) {
            if(newFile){
            }
            if (newFile && oldFile) {
                if (newFile.active && !oldFile.active) {
                    if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
                        this.$refs.upload.update(newFile, { error: 'size' })
                    }
                }
                if (newFile.progress !== oldFile.progress) {
                }
                if (newFile.error && !oldFile.error) {
                    // error
                }
                if (newFile.success && !oldFile.success) {
                    // success
                }
                }
                if (!newFile && oldFile) {
                    // remove
                    if (oldFile.success && oldFile.response.id) {
                    // $.ajax({
                    //   type: 'DELETE',
                    //   url: '/upload/delete?id=' + oldFile.response.id,
                    // })
                    }
                }
                // Automatically activate upload
                if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                    if(newFile){

                    }
                    if (this.uploadAuto && !this.$refs.upload.active) {
                        this.$refs.upload.active = true
                    }
                }
            },

            fileSizeFormat(source) {
                return fileSizeFormat(source)
            },

            getFileType(source) {
                if(source.indexOf('pdf') > -1) {
                    return 'pdf'
                }else if(source.indexOf('zip') > -1) {
                    return 'zip'
                }else if(source.indexOf('csv') > -1) {
                    return 'csv'
                }else if(source.indexOf('image') > -1) {
                    return 'image'
                }else if(source.indexOf('spreadsheet') > -1) {
                    return 'spreadsheet'
                }

                
                return 'unknown'
            },

             downloadFile(file) {
                axios({
                    url: this.downloadUrl+file.fileId,
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                    console.log(response)
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');
                    
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', file.name);
                    document.body.appendChild(fileLink);
                    
                    fileLink.click();
                });
                }
        }
})
</script>