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
            <n-button @click="showFormModal('VIEW')">View Test</n-button>
            <n-button @click="showFormModal('NEW')">Add</n-button>
            <n-button @click="showFormModal('EDIT')">Edit</n-button>
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
                @cell-value-changed="cellValueChanged"

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
            <FormSection :domainId="domainId" :classId="classId" :columnData="columnData" ref="formSectionRef" :mode="mode" />
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
  import { useMessage } from 'naive-ui'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'

  export default defineComponent({
    name: 'MdmData',

    components: {
        CloseIcon
    },

    setup(){
      const store = useStore()
      const msg = useMessage()
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
          msg,
          showModal: ref(false),
          showDetailModal: ref(false),
          columnDefs,
          state: store?.state,
          classTreeData, 
          classGridOption,
          mode: ref('EDIT')
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
                    this.loadData()
                })
            }
        },

        refresh() {
            get({url: '/api/master/getData/'+this.domainId +'/'+ this.classId}).then(res=> {
                this.gridApi2.setRowData(res)
            })
        },

        convertPropData(columns) {
            this.columnDefs = []
            this.columnDefs.push({headerName: "Master", children: [{headerName: "ID", width: 130, field: 'master_id'}]})
            let sections = columns.msections
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
                                }, editable: (props[k].options.propMode == 'GENERAL')})
                            }else{ 
                                group.children.push({headerName: props[k].message, width: props[k].width, field: props[k].propId, editable: props[k].options.propMode != 'IDENTITY'})
                            }   
                        } 
                    }
                    this.columnDefs.push(group)
                }
            }
        },

        getMasterSelectedItem(params) {           
            let dataProp = JSON.parse(JSON.stringify(params.data))
            delete dataProp.master_id
            delete dataProp.domain_id
            delete dataProp.class_id

            let keys = Object.keys(dataProp)
            let data = []

            for(let i in keys){
                data.push({
                    propId: keys[i],
                    value: dataProp[keys[i]]
                })
            }

            let msections = this.columnData.msections
            msections.forEach(section => {
                let mgroups = section.mgroups
                mgroups.forEach(group => {
                    let props = group.props                    
                    props.forEach(prop => {
                        data.forEach(d => {
                            if(prop.propId === d.propId){
                                prop.value = d.value
                            }
                        })
                    })
                })
            })
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

        loadData() {
            get({
                url: '/api/master/getData/'+this.domainId +'/'+this.classId
            }).then(res=> {
                this.gridApi2.setRowData(res)
            })
        },

        saveData() {
            if(this.$refs.formSectionRef.validation()){
                let selected = this.gridApi2.getSelectedRows()
                post({url: '/api/master', data: () => this.$refs.formSectionRef.getValue(selected[0])}).then(res=> {
                    this.loadData()
                    this.showModal = false
                })
            }           
        },

        remove() {
            let selected = this.gridApi2.getSelectedRows()
            get({url: '/api/master/delete/'+selected[0].domain_id+'/'+selected[0].master_id}).then(res=> {
                this.loadData()
            })

        },

        cellValueChanged(params) {
             post({
                url: '/api/master',
                data: this.getMasterData(params)
            }).then(res=> {
                this.msg.success('Success!!')
            })
        },

        getMasterData(params) { 
            let masterData = {
                "masterId": params.data.master_id,
                "domainId": params.data.domain_id,
                "classId": params.data.class_id,
                "data": [
                    {"propId": params.colDef.field, "value": params.newValue}
                ]
            }
            return masterData
        },

        showFormModal(mode){
            this.mode = mode

            if(mode == 'NEW'){
                let msections = this.columnData.msections
                msections.forEach(section => {
                    let mgroups = section.mgroups
                    mgroups.forEach(group => {
                        let props = group.props                    
                        props.forEach(prop => {
                            prop.value = ''
                        })
                    })
                })
            }else {
                let selected = this.gridApi2.getSelectedRows()
                let dataProp = JSON.parse(JSON.stringify(selected[0]))
                delete dataProp.master_id
                delete dataProp.domain_id
                delete dataProp.class_id

                let keys = Object.keys(dataProp)
                let data = []

                for(let i in keys){
                    data.push({
                        propId: keys[i],
                        value: dataProp[keys[i]]
                    })
                }
                let msections = this.columnData.msections
                msections.forEach(section => {
                    let mgroups = section.mgroups
                    mgroups.forEach(group => {
                        let props = group.props                    
                        props.forEach(prop => {
                            data.forEach(d => {
                                if(prop.propId === d.propId){
                                    prop.value = d.value
                                }
                            })
                        })
                    })
                })
            }           

            this.showModal = true
        }
    }
  })
</script>