<template>
<div class="main-container" >
    <n-card  style="height:calc(80vh - 15px);" :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Class Manager
          </n-gradient-text>
        </template>
        <template #avatar>
          <n-avatar
            src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
          />
        </template>
        <template #extra>          
          <n-space>
            <n-button @click="showClassPropModal = true" :disabled="classId == null">Set Props</n-button>
            <n-button @click="showModal = true">Add</n-button>
            <n-button @click="deleteData">Delete</n-button>
          </n-space>
        </template>
      </n-page-header>  
      <InputAgGrid style="padding-top: 10px; height: 100%;"
        class="ag-theme-alpine"

        @cell-clicked="selectedItem"
        @grid-ready="gridReady"
        @cell-value-changed="cellValueChanged"

        rowSelection="single"
        :columnDefs="columnDefs" :options="classGridOption.options"
    /> 
    </n-card>
    <n-modal 
      v-model:show="showModal"
    >
      <n-card
        title="Class Management"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        style="width: 600px;"
      >
        <template #header-extra>
          <n-button tertiary circle type="error" @click="showModal = false">
            <template #icon>
              <n-icon><close-icon /></n-icon>
            </template>
          </n-button>
        </template>
        <n-space vertical>
          <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="left"
          require-mark-placement="right-hanging"
          label-width="auto"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="Domain" path="domainId">
            <InputRef v-model:value="model.domainMessage" placeholder="Input" url="/api/domains" entityId="domainId" :columnDefs="domainColumnDefs" @pickEntityId="setDomainId" />
          </n-form-item>
          <n-form-item label="Class ID" path="classId">
            <n-input v-model:value="model.classId" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
          </n-form-item>
          <n-form-item label="Parent Class" path="parentId">
            <InputRef v-model:value="model.parentMessage" placeholder="Input" :columnDefs="classGridOption.columnDefs" :gridOptions="classGridOption.options" :url="'/api/classes'" entityId="classId" :treeData="classTreeData"  @pickEntityId="setParentId"/>
          </n-form-item>
          <n-form-item label="Display Seq" path="dispSeq">
            <n-input-number v-model:value="model.dispSeq" clearable />
          </n-form-item>    
          <n-form-item label="Enable" path="isEnable">
            <n-select
              v-model:value="model.isEnable"
              placeholder="Select"
              :options="selectOptions"
            />
          </n-form-item>
        </n-form>
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
  <n-modal 
      v-model:show="showClassPropModal"
    >
      <n-card
        title="Settings Prop"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        style="width: 1000px;"
      >
        <template #header-extra>
          <n-button tertiary circle type="error" @click="showClassPropModal = false">
            <template #icon>
              <n-icon><close-icon /></n-icon>
            </template>
          </n-button>
        </template>
        <n-space vertical>
          <InputAgGrid style="height: 500px; padding-top: 10px;"
              class="ag-theme-alpine"

              @grid-ready="gridReady2"
              @cell-value-changed="classPropChanged"

              rowSelection="single"
              :columnDefs="classPropColumnDefs"
          /> 
        </n-space>
        <template #footer>
          <n-space justify="end">
              <n-button round type="primary" @click="classPropInit">
                  Add
              </n-button>
              <n-button round type="primary" @click="deleteClassProp">
                  Delete
              </n-button>
          </n-space>
        </template>
      </n-card>
  </n-modal>
  <n-modal 
      v-model:show="showClassPropInputModal"
    >
      <n-card
        title="Class-Prop Add"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        style="width: 600px;"
      >
        <template #header-extra>
          <n-button tertiary circle type="error" @click="showClassPropInputModal = false">
            <template #icon>
              <n-icon><close-icon /></n-icon>
            </template>
          </n-button>
        </template>
        <n-space vertical>
          <n-form
          ref="formRef2"
          :model="classPropModel"
          :rules="classPropRules"
          label-placement="left"
          require-mark-placement="right-hanging"
          label-width="auto"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="Domain" path="domainId">
            <InputRef v-model:value="classPropModel.domainMessage" placeholder="Input" url="/api/domains" entityId="domainId" :disabled="true" />
          </n-form-item>
          <n-form-item label="Class" path="classId">
            <InputRef v-model:value="classPropModel.classMessage" placeholder="Input" url="/api/classes" entityId="classId" :disabled="true" />
          </n-form-item>
          <n-form-item label="Prop" path="propId">
            <InputRef v-model:value="classPropModel.propMessage" placeholder="Input"  :columnDefs="propColumnDefs" :url="'/api/props'" entityId="propId"  @pickEntityId="setPropId" />
          </n-form-item> 
          <n-form-item label="Display Seq" path="dispSeq">
            <n-input-number v-model:value="classPropModel.dispSeq" clearable />
          </n-form-item>
          <n-form-item label="Show" path="isShow">
            <n-select
              v-model:value="classPropModel.isShow"
              placeholder="Select"
              :options="selectOptions"
            />
          </n-form-item>
          <n-form-item label="ReadOnly" path="isReadOnly">
            <n-select
              v-model:value="classPropModel.isReadOnly"
              placeholder="Select"
              :options="selectOptions"
            />
          </n-form-item>
          <n-form-item label="Disable" path="isDisabled">
            <n-select
              v-model:value="classPropModel.isDisabled"
              placeholder="Select"
              :options="selectOptions"
            />
          </n-form-item>
        </n-form>
        </n-space>
        <template #footer>
          <n-space justify="end">
              <n-button round type="primary" @click="saveClassProp">
                  Save
              </n-button>
          </n-space>
        </template>
      </n-card>
  </n-modal>
</div>
</template>

<script>  
  import { get, post, del } from '@/api/http'
  import { defineComponent, ref } from 'vue'
  import { messageGetter, messageSetter, makeTreePath, dataGetter, dataSetter } from '@/utils'
  import { useMessage } from 'naive-ui'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
  import MessageEditor from '@/components/mdm/input/ag-grid/MessageEditor.vue'
  import MessageRenderer from '@/components/mdm/input/ag-grid/MessageRenderer.vue'
  import RefEditor from '@/components/mdm/input/ag-grid/RefEditor.vue'
  import RefRenderer from '@/components/mdm/input/ag-grid/RefRenderer.vue'
  import NumberEditor from '@/components/mdm/input/ag-grid/NumberEditor.vue'
  import { useStore } from '@/store/store'

  export default defineComponent({
    name: 'MdmManageClass',
    components: {
      messageEditor: MessageEditor, 
      messageRenderer: MessageRenderer,
      refEditor: RefEditor,
      refRenderer: RefRenderer,
      numberEditor: NumberEditor,
      CloseIcon
    },
    setup() {
      const store = useStore()
      store.dispatch('domain/setDomainList')

      const formRef = ref<null>(null)
      const msg = useMessage()

      const model = ref({
        domainId: null,
        domainMessage: null,
        classId: null,
        message: null,
        messageId: "",
        parentId: "",
        dispSeq: 0,
        isEnable: null
      })

      const classPropModel = ref({
        domainMessage: null,
        classMessage: null,
        propMessage: null,
        propId: null,
        dispSeq: 0,
        isReadOnly: 'N',
        isDisabled: 'N',
        isShow: 'Y'
      })

      const domainColumnDefs = ref([
        {headerName: 'ID', field: 'domainId'},
        {headerName: 'NAME', valueGetter: messageGetter, cellEditor: "messageEditor", cellRenderer: "messageRenderer", width: 260},
        {headerName: 'USE', width:120, field: 'isEnable'},
      ])

      const columnDefs = ref([ 
        {headerName: 'Domain', valueGetter: dataGetter, valueSetter: dataSetter, toColDef: { field: 'domain', entityId: 'domainId', entityColDef: domainColumnDefs, url: '/api/domains'}, 
          cellEditor: "refEditor", cellRenderer: "refRenderer", editable: true},
        {headerName: 'ID', field: 'classId'},        
        {headerName: 'NAME', valueGetter: messageGetter, valueSetter: messageSetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: true, flex: 1},    
        {headerName: 'Display Seq', field: 'dispSeq', editable: true, type: 'numericColumn', cellEditor: 'numberEditor', sortable: true, sort: 'asc'},   
        {headerName: 'USE', width:120, field: 'isEnable', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true},
      ])

      const propColumnDefs = ref([
        {headerName: 'Group', valueGetter: dataGetter, toColDef: { field: 'mgroup', entityId: 'groupId'},
          cellEditor: "refEditor", cellRenderer: "refRenderer", editable: false},
        {headerName: 'ID', field: 'propId'},
        {headerName: 'NAME', valueGetter: messageGetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: false, width: 260},
        {headerName: 'Area', valueGetter: dataGetter, toColDef: { field: 'area', entityId: 'areaId'},
         cellEditor: "refEditor", cellRenderer: "refRenderer", editable: false},
        {headerName: 'Type', valueGetter: dataGetter, toColDef: { field: 'propType', entityId: 'type'},
         cellEditor: "refEditor", cellRenderer: "refRenderer", editable: false},
        {headerName: 'Mode', field: 'propMode', editable: false},
        {headerName: 'DB Type', field: 'dbType', editable: false},
        {headerName: 'Unit', field: 'unit', editable: false}
      ])

      const classPropColumnDefs = ref([
        { headerName: '속성ID', field: 'propId', width: 150 },
        { headerName: '속성명', field: 'propId'},
        { headerName: '보임', field: 'isShow', width: 80, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true },
        { headerName: '읽기', field: 'isReadOnly', width: 80, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true },
        { headerName: '수정', field: 'isDisabled', width: 80, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true },
        { headerName: '순서', field: 'dispSeq', width: 120, sort: 'asc', editable: true, sortable: true },
        { headerName: '수정일', field: 'updateDate', width: 200 },
        { headerName: '수정자', field: 'updater', width: 200 },
      ])

      const classTreeData = ref({
          enable: true,
          id: 'classId',
          parentId: 'parentId',
          children: 'children'
      })

      const classGridOption = ref({
          columnDefs: [
              { headerName: 'Enable', field: 'isEnable'}
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
                  width: 300,
                  cellRendererParams: {
                      suppressCount: false
                  },
                  valueGetter: messageGetter
              }
          }
      })

      return {
        columnDefs, classPropColumnDefs, propColumnDefs, domainColumnDefs,
        classTreeData, classGridOption,
        state: store?.state,
        msg,
        showModal: ref(false),
        showClassPropModal: ref(false),
        showClassPropInputModal: ref(false),
        formRef,
        model, classPropModel,
        rules: {
          classId: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          message: {
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
        classPropRules: {
          propId: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          isShow: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },   
          isReadOnly: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          isDisalbed: {
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

    data(){
      return {
        gridApi: null,
        gridApi2: null,
        classId: null
      }
    },

    computed: {
        domainId() {
            return this.state.domain.domainId
        },
        domainName() {
            return this.state.domain.domainName
        }
    },

    methods: {
      gridReady(params){
        this.gridApi = params.api    
        this.loadData(this.domainId)             
      },

      gridReady2(params){
        this.gridApi2 = params.api         
        this.loadClassPropData(this.domainId, this.classId)    
      },

      loadData(){  
          get({
            url: '/api/classes',
            data: () => {
                return {
                
                }
            },
            })
            .then((res) => {
                let data = makeTreePath(res, 'classId', 'parentId', 'children')
                this.gridApi.setRowData(data)
            })
            .catch(console.log)
      },

      loadClassPropData(domainId, classId){  
          if(domainId != ''){
              get({
                url: '/api/classes/' + classId,
                data: () => {
                    return {}
                },
                })
                .then((res) => {
                    this.gridApi2.setRowData(res.classProp)
                })
                .catch(console.log)
          }
      },

      selectedItem(params){ 
        this.classId = params.data.classId  
        this.classPropModel.domainMessage = '['+this.domainId+'] ' + this.domainName
        this.classPropModel.classMessage = '['+this.classId+'] ' + messageGetter(params) 
      },

      setMessageId(value){
        this.model.messageId = value
      },

      getFormValue(){
        return {
          domainId: this.model.domainId,
          classId: this.model.classId,
          parentId: this.model.parentId,
          messageId: this.model.messageId,
          dispSeq: this.model.dispSeq,
          isEnable: this.model.isEnable
        }
      },

      getClassPropFormValue(){
        return {
          domainId: this.domainId,
          classId: this.classId,
          propId: this.classPropModel.propId,          
          isReadOnly: this.classPropModel.isReadOnly,
          isDisabled: this.classPropModel.isDisabled,
          isShow: this.classPropModel.isShow,
          dispSeq: this.classPropModel.dispSeq
        }
      },

      saveClassProp(){
        this.$refs.formRef2.validate(
          (errors) => {
            if (!errors) {
                  post({
                    url: '/api/classProps',
                    data: this.getClassPropFormValue()
                }).then(res=> {
                    this.msg.success('Success!!')
                    this.showClassPropInputModal = false
                    this.loadClassPropData(this.domainId, this.classId)
                })
            } else {
                msg.error('Invalid')
            }
          }
        )
      },
      saveData() {
        this.$refs.formRef.validate(
          (errors) => {
            if (!errors) {
                  post({
                    url: '/api/classes',
                    data: this.getFormValue()
                }).then(res=> {
                    this.msg.success('Success!!')
                    this.showModal = false
                    this.loadData()
                })
            } else {
                msg.error('Invalid')
            }
          }
        )
      },

      deleteData(){
        let selectedData = this.gridApi.getSelectedRows()
        if(selectedData.length > 0) {         

          del({
            url: '/api/classes/'+selectedData[0].classId
          }).then(res=> {
             this.gridApi.applyTransaction({ remove: selectedData });
          })
        }
      },

      deleteClassProp(){
        let selectedData = this.gridApi2.getSelectedRows()
        if(selectedData.length > 0) {  
          del({
            url: '/api/classProps/'+this.classId +'/' +selectedData[0].propId
          }).then(res=> {
             this.gridApi2.applyTransaction({ remove: selectedData });
          })
        }
      },

      getValue(data) {
            return {
                domainId: data.domain.domainId,
                parentId: data.parentId,
                classId: data.classId,
                isEnable: data.isEnable,
                messageId: data.message.messageId,
                dispSeq: data.dispSeq
            }
        },

      getClassPropValue(data){
        return {
          domainId: data.domain.domainId,
          classId: data.classId,
          propId: data.propId,          
          isReadOnly: data.isReadOnly,
          isDisabled: data.isDisabled,
          isShow: data.isShow,
          dispSeq: data.dispSeq
        }
      },

      cellValueChanged(params) {
             post({
                url: '/api/classes',
                data: this.getValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
            })
        },

      classPropChanged(params) {
             post({
                url: '/api/classProps',
                data: this.getClassPropValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
            })
        },
      setParentId(parentId){
          this.model.parentId = parentId
      },
      setPropId(propId){
        this.classPropModel.propId = propId
      },
      setDomainId(domainId){
        this.model.domainId = domainId
      },
      classPropInit(){
        this.showClassPropInputModal = true
      }
    }
  })
</script>
