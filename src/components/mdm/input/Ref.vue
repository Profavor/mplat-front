<template>
     <n-input v-model:value="value" placeholder="Click search button." readonly v-if="disabled" />
     <n-input-group v-if="!disabled">    
        <n-input v-model:value="value" placeholder="Click search button." readonly />
        <n-button type="primary" ghost @click="showModal = true"> 
            Search            
        </n-button>
         <n-modal 
            v-model:show="showModal"
            >
                <n-card
                title="Ref Management"
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
                        :options="gridOptions"
                        @grid-ready="gridReady"
                        @cell-clicked="pickMessage" 
                        ref="agGrid"
                        rowSelection="single"
                        pagination
                    />
                </n-space>        
                <template #footer>
                    <n-space justify="end">        
                        <n-button round type="primary" @click="searchText = ''; showModal = false">
                            Select
                        </n-button>
                    </n-space>
                </template>
            </n-card>

            </n-modal>
    </n-input-group>   
</template>

<script>
import { get } from '@/api/http'
import { makeTreePath, messageGetter } from '@/utils'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { CloseOutline as CloseIcon } from '@vicons/ionicons5'

  export default {
    name: 'InputRef',

    setup(props, {emit}){
      const message = computed({ 
          get: () => props.value, 
          set: (value) => emit('update:value', value) 
      }) 

      const showModal = ref(false)
      return {
        showModal,
        message
      }
    },
    components: {
      CloseIcon
    },
    props: {
        url: {
          type: String,
          default: ""
        },

        value: {
          type: String,
          default: ""
        },

        entityId: {
          type: String,
          default: ""
        },

        columnDefs: {
          type: Array,
          default: function() {
            return [
            ]
          }
        },
             
        gridOptions: {
            type: Object,
            default: function() {
              return {
              }
            }
        },

        treeData: {
          type: Object,
          default: function() {
            return {
              "enable": false,
              "id": "",
              "parentId": "",
              "children": ""
            }
          }
        },

        disabled: {
          type: Boolean,
          default: false
        }
    },
    data () {
      return {
        gridApi: null,
        searchText: ""
      }
    },

    methods: {
        gridReady(params) {
          this.gridApi = params.api
          this.getData()
        },

        getData() {
          get({
            url: this.url
            })
            .then(res => {
              if(this.treeData.enable){ 
                  let data = makeTreePath(res, this.treeData.id, this.treeData.parentId, this.treeData.children)
                  this.gridApi.setRowData(data)
                  this.gridApi.expandAll()
              }else{
                this.gridApi.setRowData(res)
              }
            }).catch(err => console.log(err))
        },        

        pickMessage(params) {
            let entityValue = eval('params.data.'+ this.entityId)
            this.message = messageGetter(params)
            this.$emit('pickEntityId', entityValue)            
        },

        searchHandler(){
            this.gridApi.setQuickFilter(this.searchText);
            this.gridApi.deselectAll();
        },
    }
  }
</script>
