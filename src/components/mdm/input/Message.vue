<template>
    <n-input-group>    
        <n-input v-model:value="value" placeholder="Click search button." readonly />
        <n-button type="primary" ghost @click="showModal = true"> 
            Search            
        </n-button>
         <n-modal 
            v-model:show="showModal"
            >
                <n-card
                title="Message Management"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
                style="max-width: 1000px;"
            >
                <template #header-extra>
                <n-button tertiary circle type="error" @click="searchText = ''; showModal = false">
                    <template #icon>
                        <n-space >
                            <n-icon><close-icon /></n-icon>   
                        </n-space>
                    </template>
                </n-button>
                </template>

                <n-space vertical>
                    <n-input size="small" round placeholder="Small" v-model:value="searchText"  @change="searchHandler" clearable />
                    <InputAgGrid style="height: 400px; padding-top: 10px;" class="ag-theme-alpine" 
                        :columnDefs="columnDefs" 
                        @grid-ready="gridReady"
                        @cell-clicked="pickMessage" 
                        @cell-value-changed="cellValueChanged"
                        ref="agGrid"
                        rowSelection="single"
                        pagination
                    />
                </n-space>        
                <template #footer>
                    <n-space justify="space-between">
                        <n-button round type="primary" @click="showMessageModal = true; init()">
                            Add
                        </n-button>
                        <n-button round type="primary" @click="searchText = ''; showModal = false">
                            Select
                        </n-button>
                    </n-space>
                </template>
            </n-card>

            </n-modal>

            <n-modal 
            v-model:show="showMessageModal"
            >
            <n-card
                title="Message Form"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
                style="width: 600px;"
            >
                <template #header-extra>
                <n-button tertiary circle type="error" @click="showMessageModal = false">
                    <template #icon>
                    <n-icon><close-icon /></n-icon>
                    </template>
                </n-button>
                </template>
                <n-space vertical>
                <n-form
                ref="messageFormRef"
                :model="messageModel"
                :rules="messageRules"
                label-placement="left"
                require-mark-placement="right-hanging"
                label-width="auto"
                :style="{
                    maxWidth: '640px'
                }"
                >
                <n-form-item label="Message ID" path="messageId">
                    <InputIdentity v-model:value="messageModel.messageId" />
                </n-form-item>
                <n-form-item label="Korean" path="messageKo">
                    <n-input v-model:value="messageModel.messageKo" placeholder="Input" />
                </n-form-item>
                <n-form-item label="English" path="messageEn">
                    <n-input v-model:value="messageModel.messageEn" placeholder="Input" />
                </n-form-item>          
                <n-form-item label="Enable" path="isEnable">
                    <n-select
                    v-model:value="messageModel.isEnable"
                    placeholder="Select"
                    :options="selectOptions"
                    />
                </n-form-item>
                </n-form>
                </n-space>
                <template #footer>   
                    <n-space justify="end">
                        <n-button round type="primary" @click="saveMessage">
                            Save
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </n-input-group>   
</template>

<script>
import { get, post } from '@/api/http'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { messageGetterKo, messageSetterKo, messageGetterEn, messageSetterEn, messageGetter} from '@/utils'
import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

export default {
    name: 'InputMessage',

    components: {
        CloseIcon
    },

    props: {
        value:{
            type: String
        }
    },

    setup(props, { emit }){
        const columnDefs = ref([
            {headerName: 'ID', width:200, field: 'messageId'},
            {headerName: 'Korean', flex: 1, valueGetter: messageGetterKo, valueSetter: messageSetterKo, editable: true},
            {headerName: 'English', flex: 1, valueGetter: messageGetterEn, valueSetter: messageSetterEn, editable: true},
            {headerName: 'USE', width:120, field: 'isEnable', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true},
        ])

        const msg = useMessage()

        const message = computed({ 
            get: () => props.value, 
            set: (value) => emit('update:value', value) 
        }) 

        const messageModel = ref({
            messageId: "",
            messageKo: "",
            messageEn: "",
            isEnable: "Y"
        })

        return {
            msg,
            showModal: ref(false),  
            showMessageModal: ref(false),
            columnDefs, 
            message ,
            messageModel,
            messageRules: {
                messageId: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: 'Required'
                },
                messageKo: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: 'Required'
                },
                messageEn: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: 'Required'
                },
                isEnable: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: 'Required'
                },
            },
            selectOptions: [
                {
                    label: "Y",
                    value: 'Y',
                },
                {
                    label: 'N',
                    value: 'N'
                }
            ],      
        }
    },

    data() {
        return {
            gridApi: null,
            searchText: ""
        }
    },

    mounted(){
        
    },

    methods: {
        init(){
            this.messageModel = {
                messageId: "AUTO",
                messageKo: "",
                messageEn: "",
                isEnable: "Y"
            }
        },
        searchHandler(){
            this.gridApi.setQuickFilter(this.searchText);
            this.gridApi.deselectAll();
        },

        pickMessage(params) {
            this.message = messageGetter(params)
            this.$emit('pickMessageId', params.data.messageId)            
        },

        gridReady(params){
            this.gridApi = params.api
            this.searchHandler()

            this.loadMessage()           
        },

        getMessageFormValue() {
            return {
                messageId: this.messageModel.messageId,
                isEnable: this.messageModel.isEnable,
                messageLangs: [{
                    lang: 'ko',
                    messageId: this.messageModel.messageId,
                    message: this.messageModel.messageKo      
                },{
                    lang: 'en',
                    messageId: this.messageModel.messageId,
                    message: this.messageModel.messageEn  
                }]
            }
        },

        getMessageValue(data) {
            let en = ''
            let ko = ''
            for(let i in data.messageLangs){
               if(data.messageLangs[i].lang == 'en') {
                   en = data.messageLangs[i].message
               }else if(data.messageLangs[i].lang == 'ko'){
                   ko = data.messageLangs[i].message
               }
            }
            return {
                messageId: data.messageId,
                isEnable: data.isEnable,
                messageLangs: [{
                    lang: 'ko',
                    messageId: data.messageId,
                    message: ko      
                },{
                    lang: 'en',
                    messageId: data.messageId,
                    message: en 
                }]
            }
        },

        loadMessage(){
            get({
                url: '/api/messages',
                data() {
                    return {}
                }
            }).then(res=> {
                this.gridApi.setRowData(res)
            })
        },

        saveMessage(e){
            this.$refs.messageFormRef.validate(
            (errors) => {
                if (!errors) {
                     post({
                        url: '/api/messages',
                        data: this.getMessageFormValue()
                    }).then(res=> {
                        this.msg.success('Success!!')
                        this.showMessageModal = false
                        this.loadMessage()
                    })
                } else {
                    message.error('Invalid')
                }
            }
            )
        },

        cellValueChanged(params) {
             post({
                url: '/api/messages',
                data: this.getMessageValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
                this.loadMessage()
            })
        }
    }    
}
</script>