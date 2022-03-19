<template>
   <n-space vertical size="large">
       <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Data Manager
          </n-gradient-text>
        </template>
        <template #avatar>
          <n-avatar
            src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
          />
        </template>
        <template #extra>
          <n-space>
            <n-button @click="showModal = true">Add</n-button>
            <n-button @click="remove">Delete</n-button>
          </n-space>
        </template>
      </n-page-header>  
      <n-layout has-sider position="static">          
        <n-layout-sider ref="siderRef" style="min-width:300px; width: 300px; height: calc(80vh - 15px);"> 
          <InputAgGrid style="padding: 2px; height: 100%;"
                class="ag-theme-alpine"      
                @cell-clicked="selectedClass"
                @grid-ready="gridReady"

                rowSelection="single"
                :columnDefs="classGridOption.columnDefs"
                :options="classGridOption.options"
            /> 
        </n-layout-sider>
        <n-layout-content
          ref="contentRef"
        >
          <InputAgGrid style="padding: 2px; height: 100%;"
                class="ag-theme-alpine"
                @cell-clicked="getMasterSelectedItem"
                @grid-ready="gridReady2"

                rowSelection="single"
                :columnDefs="columnDefs"
            /> 
        </n-layout-content>
      </n-layout>

    <n-modal 
      v-model:show="showModal"
    >
      <n-card
        title="Master Management"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        style="width: 1000px;"
      >
        <template #header-extra>
          <n-button tertiary circle type="error" @click="showModal = false">
            <template #icon>
              <n-icon><close-icon /></n-icon>
            </template>
          </n-button>
        </template>
        <n-space vertical>
            <FormSection :domainId="domainId" :classId="classId" :columnData="columnData" ref="formSectionRef" />
        </n-space>
        <template #footer>
          <n-space justify="end">
              <n-button round type="primary" @click="saveData">
                  Save
              </n-button>
          </n-space>
        </template>
      </n-card>
  </n-modal>

  </n-space>
</template>

<script>  
  import { get, post, del } from '@/api/http'
  import { defineComponent, ref, onMounted } from 'vue'
  import { messageGetter, messageSetter, makeTreePath, dataGetter } from '@/utils'
  import { useStore } from '@/store/store'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'

  export default defineComponent({
    name: 'MdmData',

    components: {
        CloseIcon
    },

    setup(){
      const store = useStore()
      store.dispatch('domain/setDomainList')

      const columnDefs = ref([      
          
      ])

      const classTreeData = ref({
          enable: true,
          id: 'classId',
          parentId: 'parentId',
          children: 'children'
      })

      const classGridOption = ref({
          columnDefs: [
              {headerName: 'Display Seq', field: 'dispSeq', type: 'numericColumn', sortable: true, sort: 'asc', hide: true}, 
          ],
          options: {
              sideBar: false,
              rowSelection: 'single',
              treeData: true,
              pagination: false,
              getDataPath: function(data) {
                  return data.treePath
              },
              autoGroupColumnDef: {
                  id: 'classId',
                  headerName: '분류체계',
                  width: 294,
                  cellRendererParams: {
                      suppressCount: false
                  },
                  valueGetter: messageGetter
              }
          }
      })

      return {
          showModal: ref(false),
          columnDefs,
          state: store?.state,
          classTreeData, 
          classGridOption
      }
    },

    data(){
        return {
            gridApi: null,
            gridApi2: null,
            domainId: "",
            classId: "",
            columnDefsData: null          
        }
    },

    computed: {
        lang() {
            return this.state.user.lang
        }
    },

    methods: {
        setColumnDef() {   
            if(this.domainId != '' && this.classId != ''){
                get({url: '/api/master/form/'+this.domainId +'/'+this.classId+'?lang='+this.lang})
                .then(res=> {
                    this.columnData = res
                    this.convertPropData(res)

                    get({
                        url: '/api/master/getData/'+this.domainId +'/'+this.classId
                    }).then(res=> {
                        this.gridApi2.setRowData(res)
                    })
                })
            }
        },

        refresh() {
            get({url: '/api/master/getData/'+this.domainId +'/'+ this.classId}).then(res=> {
                this.gridApi2.setRowData(res)
            })
        },

        convertPropData(data) {
            this.columnDefs = []
            this.columnDefs.push({headerName: "Master", children: [{headerName: "ID", width: 130, field: 'master_id'}]})
            let sections = data.msections
            sections.sort(function(a, b){
                return a.dispSeq - b.dispSeq
            }) 
            for(let i in sections) {
                let groups = sections[i].mgroups
                groups.sort(function(a, b){
                    return a.dispSeq - b.dispSeq
                }) 
                for(let j in groups) {
                    let group = {}
                    group.headerName = groups[j].message
                    group.children = []
                    let props = groups[j].props

                    props.sort(function(a, b){
                        return a.options.dispSeq - b.options.dispSeq
                    })                    
                    for(let k in props) {
                        if(props[k].options.isShow == 'Y'){
                            if(props[k].type == 'DATE'){
                                group.children.push({headerName: props[k].message, width: props[k].width, field: props[k].propId, valueFormatter: function(params){
                                    if(params.value){
                                        let date = new Date(params.value)       
                                        return moment(date).format('YYYY-MM-DD')
                                    }
                                }})
                            }else{
                                group.children.push({headerName: props[k].message, width: props[k].width, field: props[k].propId})
                            }   
                        } 
                    }
                    this.columnDefs.push(group)
                }
            }
        },

        getMasterSelectedItem(params) {
            console.log(params)
        },

        selectedClass(params){
            this.domainId = params.data.domain.domainId
            this.classId = params.data.classId
            this.setColumnDef()
        },

        gridReady(params){
            this.gridApi = params.api
            this.loadClass()
        },

        gridReady2(params) {
            this.gridApi2 = params.api
            this.gridApi2.setRowData([])
        },

        loadClass() {
            get({url: '/api/classes?isEnable=Y'})
            .then(res => {
                let data = makeTreePath(res, 'classId', 'parentId', 'children')                
                this.gridApi.setRowData(data)
            })
            .catch(err => console.log(err))

        },

        saveData() {
            if(this.$refs.formSectionRef.validation()){
                post({url: '/api/master', data: () => this.$refs.formSectionRef.getValue()}).then(res=> {
                    this.showModal = false
                })
            }           
        }
    }
  })
</script>