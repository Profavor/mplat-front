<template>
<div class="main-container">
    <n-card  :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
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
            <n-button @click="deleteDomain">Delete</n-button>
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
          <n-form-item label="Prop ID" path="propId">
            <n-input v-model:value="model.propId" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
          </n-form-item>          

        </n-form>
        </n-space>
        <template #footer>
          <n-space justify="end">
              <n-button round type="primary">
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

  export default defineComponent({
    name: 'MdmManageProp',
    components: {
      messageEditor: MessageEditor, 
      messageRenderer: MessageRenderer,
      CloseIcon
    },
    setup() {
      const formRef = ref<null>(null)
      const msg = useMessage()
      const columnDefs = ref([
        {headerName: 'ID', field: 'propId'},
        {headerName: 'NAME', valueGetter: messageGetter, valueSetter: messageSetter,
          cellEditor: "messageEditor", cellRenderer: "messageRenderer", editable: true, width: 260},
        {headerName: 'USE', width:120, field: 'isEnable', cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['Y', 'N'], }, editable: true},
      ])
      const model = ref({
        propId: null,
        message: null,
        messageId: "",
        areaId: null,
        type: null,
        reference: null,
        groupId: null,
        unit: null,
        width: null,
        regex: null,
        ruleCode: null,
        mask: null,
        dbType: null
      })

      return {
        msg,
        columnDefs,
        showModal: ref(false),
        formRef,
        model,
        rules: {
          domainId: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Required'
          },
          message: {
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
        this.loadProp()
      },

      setMessageId(value){
        this.model.messageId = value
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

    }
  })
</script>
