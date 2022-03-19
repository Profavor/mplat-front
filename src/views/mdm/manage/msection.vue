<template>
<div class="main-container">
    <n-card style="height:calc(80vh - 15px);" :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Section Manager
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

        @cell-clicked="selectedItem"
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
        title="Section Management"
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
          <n-form-item label="Section ID" path="sectionId">
            <n-input v-model:value="model.sectionId" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
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
  import { messageGetter, messageSetter } from '@/utils'
  import { useMessage } from 'naive-ui'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
  import MessageEditor from '@/components/mdm/input/ag-grid/MessageEditor.vue'
  import MessageRenderer from '@/components/mdm/input/ag-grid/MessageRenderer.vue'
  import NumberEditor from '@/components/mdm/input/ag-grid/NumberEditor.vue'

  export default defineComponent({
    name: 'MdmManageSection',
    components: {
      messageEditor: MessageEditor, 
      messageRenderer: MessageRenderer,
      numberEditor: NumberEditor,
      CloseIcon
    },
    setup() {
      const formRef = ref<null>(null)
      const msg = useMessage()
      const columnDefs = ref([
        {headerName: 'ID', field: 'sectionId'},
        {headerName: 'NAME', valueGetter: messageGetter, valueSetter: messageSetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: true, flex: 1},
        {headerName: 'Display Seq', field: 'dispSeq', editable: true, type: 'numericColumn', cellEditor: 'numberEditor'},
        {headerName: 'USE', width:120, field: 'isEnable', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true},
      ])
      const model = ref({
        sectionId: null,
        message: null,
        messageId: "",
        dispSeq: 0,
        isEnable: null
      })

      return {
        msg,
        columnDefs,
        showModal: ref(false),
        formRef,
        model,
        rules: {
          sectionId: {
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
        gridApi: null
      }
    },

    methods: {
      gridReady(params){
        this.gridApi = params.api
        this.load()
      },

      load(){
         get({
          url: '/api/sections',
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

      selectedItem(data){
        
      },

      setMessageId(value){
        this.model.messageId = value
      },

      getFormValue(){
        return {
          sectionId: this.model.sectionId,
          message:{
            messageId: this.model.messageId
          },
          dispSeq: this.model.dispSeq,
          isEnable: this.model.isEnable
        }
      },

      save(){
        this.$refs.formRef.validate(
          (errors) => {
            if (!errors) {
                  post({
                    url: '/api/sections',
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
            url: '/api/sections/'+selectedData[0].sectionId
          }).then(res=> {
             this.gridApi.applyTransaction({ remove: selectedData });
          })
        }
      },

      getValue(data) {
            return {
                sectionId: data.sectionId,
                isEnable: data.isEnable,
                message: {
                  messageId: data.message.messageId
                },
                dispSeq: data.dispSeq
            }
        },

      cellValueChanged(params) {
             post({
                url: '/api/sections',
                data: this.getValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
            })
        }
    }
  })
</script>
