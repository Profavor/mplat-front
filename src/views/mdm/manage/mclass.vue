<template>
<div class="main-container">
    <n-card  :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
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
            <n-button @click="showModal = true">Add</n-button>
            <n-button @click="deleteData">Delete</n-button>
          </n-space>
        </template>
      </n-page-header>  
      <InputAgGrid style="height: 500px; padding-top: 10px;"
        class="ag-theme-alpine"

        @cell-clicked="selectedItem"
        @grid-ready="gridReady"
        @cell-value-changed="cellValueChanged"

        rowSelection="single"
        :columnDefs="classGridOption.columnDefs" :options="classGridOption.options"
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
            <InputRef v-model:value="domainId" placeholder="Input" url="/api/domains" entityId="domainId" :disabled="true" />
          </n-form-item>
          <n-form-item label="Class ID" path="classId">
            <n-input v-model:value="model.classId" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Message" path="message">
            <InputMessage v-model:value="model.message" @pickMessageId="setMessageId" />
          </n-form-item>
          <n-form-item label="Parent Class" path="parentId">
            <InputRef v-model:value="model.parentMessage" placeholder="Input" :columnDefs="classGridOption.columnDefs" :gridOptions="classGridOption.options" :url="'/api/classes/'+domainId" entityId="classId" :treeData="classTreeData"  @pickEntityId="setParentId"/>
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
</div>
</template>

<script>  
  import { get, post, del } from '@/api/http'
  import { defineComponent, ref, onMounted } from 'vue'
  import { messageGetter, makeTreePath } from '@/utils'
  import { useMessage } from 'naive-ui'
  import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
  import MessageEditor from '@/components/mdm/input/ag-grid/MessageEditor.js'
  import MessageRenderer from '@/components/mdm/input/ag-grid/MessageRenderer.js'
  import { useStore } from '@/store/store'

  export default defineComponent({
    name: 'MdmManageClass',
    components: {
      messageEditor: MessageEditor, 
      messageRenderer: MessageRenderer,
      CloseIcon
    },
    setup() {
      const store = useStore()
      store.dispatch('domain/setDomainList')

      const formRef = ref<null>(null)
      const msg = useMessage()

      const model = ref({
        classId: null,
        message: null,
        messageId: "",
        parentId: "",
        isEnable: null
      })

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
              sidebar: false,
              rowSelection: 'single',
              treeData: true,
              getDataPath: function(data) {
                  console.log(data)
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
        classTreeData, classGridOption,
        state: store?.state,
        msg,
        showModal: ref(false),
        formRef,
        model,
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

    computed: {
        domainId() {
            return this.state.domain.domainId
        }
    },

    watch: {
        domainId: function(domainId) {
            this.loadData(domainId)   
        }
    },

    methods: {
      gridReady(params){
        this.gridApi = params.api
        this.loadData(this.state.domain.domainId)       
      },

      loadData(domainId){  
          if(domainId != ''){
              get({
                url: '/api/classes/' + this.state.domain.domainId,
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
          }
      },

      selectedItem(data){
        
      },

      setMessageId(value){
        this.model.messageId = value
      },

      getFormValue(){
        return {
          domainId: this.domainId,
          classId: this.model.classId,
          parentId: this.model.parentId,
          parentMessage: '',
          messageId: this.model.messageId,
          isEnable: this.model.isEnable
        }
      },

      saveData(){
        this.$refs.formRef.validate(
          (errors) => {
            if (!errors) {
                console.log(this.getFormValue())
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
            url: '/api/classes/'+this.state.domain.domainId + '/'+selectedData[0].classId
          }).then(res=> {
             this.gridApi.applyTransaction({ remove: selectedData });
          })
        }
      },

      getValue(data) {
            return {
                domainId: this.state.domain.domainId,
                classId: data.classId,
                isEnable: data.isEnable,
                message: {
                  messageId: data.message.messageId
                }
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
      setParentId(parentId){
          this.model.parentId = parentId
      }
    }
  })
</script>
