<template>
<div class="main-container">
    <n-card  :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Prop-type Manager
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
      
      <InputAgGrid style="height: 500px; padding-top: 10px;"
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
        title="Prop-type Management"
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
          <n-form-item label="Type" path="type">
            <n-input v-model:value="model.type" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
          </n-form-item>
          <n-form-item label="Description" path="description">
            <n-input v-model:value="model.description" placeholder="Input" />
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
  import MessageEditor from '@/components/mdm/input/ag-grid/MessageEditor.js'
  import MessageRenderer from '@/components/mdm/input/ag-grid/MessageRenderer.js'
  import RefEditor from '@/components/mdm/input/ag-grid/RefEditor.js'
  import RefRenderer from '@/components/mdm/input/ag-grid/RefRenderer.js'
  import NumberEditor from '@/components/mdm/input/ag-grid/NumberEditor.js'

  export default defineComponent({
    name: 'MdmManageProptype',
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

      const columnDefs = ref([        
        {headerName: 'Type', field: 'type'},        
        {headerName: 'NAME', valueGetter: messageGetter, valueSetter: messageSetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: true},       
        {headerName: 'Description', field: 'description', editable: true, flex: 1},     
      ])

      const model = ref({
        type: null,
        message: null,
        messageId: "",
        description: ""
      })

      return {
        msg,
        columnDefs,
        showModal: ref(false),
        formRef,
        model,
        rules: {
          type: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          message: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },     
          description: {
            required: true, 
            trigger: ['blur', 'input'],
            message: 'Required'
          },
        },      
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
          url: '/api/propTypes',
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
          type: this.model.type,         
          message:{
            messageId: this.model.messageId
          },
          description: this.model.description 
        }
      },

      save(){
        this.$refs.formRef.validate(
          (errors) => {
            if (!errors) {
                  post({
                    url: '/api/propTypes',
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
            url: '/api/propTypes/'+selectedData[0].type
          }).then(res=> {
             this.gridApi.applyTransaction({ remove: selectedData });
          })
        }
      },

      getValue(data) {
            return {
                type: data.type,
                message: {
                  messageId: data.message.messageId
                },
                description: data.description
            }
        },

      cellValueChanged(params) {
             post({
                url: '/api/propTypes',
                data: this.getValue(params.data)
            }).then(res=> {
                this.msg.success('Success!!')
                this.showMessageModal = false
            })
        }
    }
  })
</script>
