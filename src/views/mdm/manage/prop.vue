<template>
<div class="main-container">
    <n-card style="height:calc(80vh - 15px);" :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Prop Manager
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
      
      <InputAgGrid style="height: 100%; padding-top: 10px;"
        class="ag-theme-alpine"

        @grid-ready="gridReady"
        @cell-value-changed="cellValueChanged"

        rowSelection="single"
        :columnDefs="columnDefs"
    /> 
    </n-card>

    <n-modal 
      v-model:show="showModal"
    >
      <n-card
        title="Prop Management"
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
          <n-form-item label="Group" path="groupMessage">
            <InputRef v-model:value="model.groupMessage" placeholder="Input" :columnDefs="groupColumnDefs" url="/api/groups" entityId="groupId" @pickEntityId="setGroupId" />
          </n-form-item>
          <n-form-item label="Area" path="areaMessage">
            <InputRef v-model:value="model.areaMessage" placeholder="Input" :columnDefs="areaColumnDefs" url="/api/areas" entityId="areaId" @pickEntityId="setAreaId" />
          </n-form-item>
          <n-form-item label="Prop ID" path="propId">
            <n-input v-model:value="model.propId" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
          </n-form-item>
          <n-form-item label="Data Type" path="typeMessage">
            <InputRef v-model:value="model.typeMessage" placeholder="Input" :columnDefs="typeColumnDefs" url="/api/propTypes" entityId="type" @pickEntityId="setType" />
          </n-form-item>

          <n-form-item label="DB Type" path="dbType">
            <n-input v-model:value="model.dbType" placeholder="Input" />
          </n-form-item>

          <n-form-item label="Mode" path="propMode">
            <n-select
              v-model:value="model.propMode"
              placeholder="Select"
              :options="selectOptions"
            />
          </n-form-item>

          <n-form-item label="Width" path="width">
            <n-input-number v-model:value="model.width" clearable />
          </n-form-item>

          <n-form-item label="Regex" path="regex">
            <n-input v-model:value="model.regex" placeholder="Input" />
          </n-form-item>

        </n-form>
        </n-space>
        <template #footer>
          <n-space justify="end">
              <n-button round type="primary" @click="save">
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
  import { defineComponent, ref, onMounted } from 'vue'
  import { messageGetter, messageSetter, dataGetter, dataSetter } from '@/utils'
  import { useMessage } from 'naive-ui'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
  import MessageEditor from '@/components/mdm/input/ag-grid/MessageEditor.js'
  import MessageRenderer from '@/components/mdm/input/ag-grid/MessageRenderer.js'
  import RefEditor from '@/components/mdm/input/ag-grid/RefEditor.js'
  import RefRenderer from '@/components/mdm/input/ag-grid/RefRenderer.js'
  import NumberEditor from '@/components/mdm/input/ag-grid/NumberEditor.js'

  export default defineComponent({
    name: 'MdmManageProp',
    components: {
      messageEditor: MessageEditor, 
      messageRenderer: MessageRenderer,
      numberEditor: NumberEditor,
      refEditor: RefEditor,
      refRenderer: RefRenderer,
      CloseIcon
    },
    setup() {
      const formRef = ref<null>(null)
      const msg = useMessage()

      const areaColumnDefs = ref([
        { headerName: 'ID', field: 'areaId'},
        { headerName: 'Name', valueGetter: messageGetter},
        { headerName: 'Status', field: 'status', flex: 1},
      ])

      const typeColumnDefs = ref([
        { headerName: 'Type', field: 'type'},
        { headerName: 'Name', valueGetter: messageGetter},
        { headerName: 'Description', field: 'description', flex: 1},
      ])

      const groupColumnDefs = ref([
        {headerName: 'Section', valueGetter: dataGetter, toColDef: { field: 'msection', entityId: 'sectionId'}},
        {headerName: 'ID', field: 'groupId'},
        {headerName: 'NAME', valueGetter: messageGetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", flex: 1},
        {headerName: 'Display Seq', field: 'dispSeq', type: 'numericColumn'},
        {headerName: 'USE', width:120, field: 'isEnable'},
      ])

      const columnDefs = ref([
        {headerName: 'Group', valueGetter: dataGetter, valueSetter: dataSetter, toColDef: { field: 'mgroup', entityId: 'groupId', entityColDef: groupColumnDefs, url: '/api/groups'},
          cellEditor: "refEditor", cellRenderer: "refRenderer", editable: true},
        {headerName: 'ID', field: 'propId'},
        {headerName: 'NAME', valueGetter: messageGetter, valueSetter: messageSetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: true, width: 260},
        {headerName: 'Area', valueGetter: dataGetter, valueSetter: dataSetter, toColDef: { field: 'area', entityId: 'areaId', entityColDef: areaColumnDefs, url: '/api/areas'},
         cellEditor: "refEditor", cellRenderer: "refRenderer", editable: true},
        {headerName: 'Type', valueGetter: dataGetter, valueSetter: dataSetter, toColDef: { field: 'propType', entityId: 'type', entityColDef: typeColumnDefs, url: '/api/propTypes'},
         cellEditor: "refEditor", cellRenderer: "refRenderer", editable: true},
        {headerName: 'Mode', field: 'propMode', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['IDENTITY', 'NAME', 'GENERAL']}},
        {headerName: 'DB Type', field: 'dbType', editable: true},
        {headerName: 'Unit', field: 'unit', editable: true},
        {headerName: 'Width', field: 'width', editable: true},
        {headerName: 'Regex', field: 'regex', editable: true},
        {headerName: 'Rule Code', field: 'ruleCode', editable: true},
        {headerName: 'Mask', field: 'mask', editable: true},
      ])
      const model = ref({
        propId: null,
        message: null,
        messageId: "",
        areaId: null,
        areaMessage: null,
        type: null,
        typeMessage: null,
        reference: null,
        groupId: null,
        groupMessage: null,
        propMode: null,
        unit: null,
        width: null,
        regex: null,
        ruleCode: null,
        mask: null,
        dbType: null
      })

      return {
        areaColumnDefs,
        typeColumnDefs,
        groupColumnDefs,
        msg,
        columnDefs,
        showModal: ref(false),
        formRef,
        model,
        rules: {
          groupMessage: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          areaMessage: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          propId: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          message: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          propMode: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          }, 
          typeMessage: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          dbType: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          }      
        },
        selectOptions: [
          {
            label: "IDENTITY",
            value: 'IDENTITY',
          },
          {
            label: 'NAME',
            value: 'NAME'
          },
          {
            label: 'GENERAL',
            value: 'GENERAL'
          }
        ],           
      }
    },

    data(){
      return {
        gridApi: null
      }
    },

    methods: {
      gridReady(params){
        this.gridApi = params.api
        this.loadProp()
      },

      setMessageId(value){
        this.model.messageId = value
      },

      getFormValue(){
        return {
          mgroup: {
            groupId: this.model.groupId
          },          
          area: {
            areaId: this.model.areaId
          },
          propType: {
            type: this.model.type
          },          
          propId: this.model.propId,         
          message:{
            messageId: this.model.messageId
          },
          propMode: this.model.propMode,
          width: this.model.width,
          regex: this.model.regex,
          dbType: this.model.dbType,
          mask: this.model.mask,
          ruleCode: this.model.ruleCode
        }
      },

      save(){
        this.$refs.formRef.validate(
          (errors) => {
            if (!errors) {
                  post({
                    url: '/api/props',
                    data: this.getFormValue()
                }).then(res=> {
                    this.msg.success('Success!!')
                    this.showModal = false
                    this.load()
                })
            } else {
                this.msg.error('Invalid')
            }
          }
        )
      },

      remove(){
        let selectedData = this.gridApi.getSelectedRows()
        if(selectedData.length > 0) {
          del({
            url: '/api/props/'+selectedData[0].sectionId
          }).then(res=> {
             this.gridApi.applyTransaction({ remove: selectedData });
          })
        }
      },

      getValue(data) { 
            return {
                mgroup: {
                  groupId: data.mgroup.groupId
                },          
                area: {
                  areaId: data.area.areaId
                },
                propType: {
                  type:  data.propType.type
                },          
                propId: data.propId,         
                message:{
                  messageId:  data.message.messageId
                },
                propMode: data.propMode,
                width: data.width,
                regex: data.regex,
                dbType: data.dbType,
                mask: data.mask,
                ruleCode: data.ruleCode
            }
        },

      cellValueChanged(params) {
             post({
                url: '/api/props',
                data: this.getValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
            })
        },

      loadProp(){
         get({
          url: '/api/props',
          data: () => {
            return {
              
            }
          },
        })
        .then((res) => {
            this.gridApi.setRowData(res)
        })
        .catch(console.log)
      },

      setGroupId(groupId) {
        this.model.groupId = groupId
      },

      setType(type) {
        this.model.type = type
      },

      setAreaId(areaId) {
        this.model.areaId = areaId
      }

    }
  })
</script>
