<template>
    <n-input v-model:value="inputValue" readonly>
        <template #suffix>
            <n-button @click="showModal = true">
                <template #icon>
                    <n-icon><cash-icon /></n-icon>
                </template>
            </n-button>
        </template>
    </n-input>

    <n-modal v-model:show="showModal">
        <n-card style="width: 1000px;" title="Search Code" :bordered="false" size="huge">
        <template #header-extra> Oops! </template>
        <n-input v-model:value="value" type="text" placeholder="Basic Input" />
        <n-divider />
        <ag-grid-vue style="height: 500px;"
            class="ag-theme-alpine"

            @cell-clicked="getSelectedItem"
            @grid-ready="gridReady"

            :columnDefs="columnDefs"
            :options="options"
        > 
        </ag-grid-vue>
        <template #footer> Footer </template>
        </n-card>
    </n-modal>  
</template>

<script>
import "ag-grid-enterprise/dist/styles/ag-grid.css";
import "ag-grid-enterprise/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { CashOutline as CashIcon } from '@vicons/ionicons5'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'InputEntityRef',
    components: {
        CashIcon, AgGridVue
    },

    props: {
        value: {
            type: String,
            default: null
        },
        columnDefs: {
            type: Array,
            defualt: function(){
                return []
            }
        },
        options: {
            type: Object,
            default: function(){
                return {}
            }
        },
        entityId: {
            type: String,
            defualt: null
        },
    },

    setup(props) {
        const data = ref([{"creator":null,"createdDate":"2021-06-23T12:50:02.000+00:00","updater":null,"updateDate":null,"errorMessage":null,"areaId":"*","message":{"creator":null,"createdDate":"2021-06-23T12:50:02.000+00:00","updater":null,"updateDate":null,"errorMessage":null,"messageId":"AREA_DEFAULT","isEnable":"Y","messageLangs":[{"creator":null,"createdDate":"2021-06-23T12:50:02.000+00:00","updater":null,"updateDate":null,"errorMessage":null,"messageId":"AREA_DEFAULT","lang":"en","message":"*"},{"creator":null,"createdDate":"2021-06-23T12:50:02.000+00:00","updater":null,"updateDate":null,"errorMessage":null,"messageId":"AREA_DEFAULT","lang":"ko","message":"*"}]},"status":"Y"}])

        const lang = ref('ko')
        const inputValue = props.value
        const selectId = ref('')
        return {
            data,
            selectId,
            inputValue,
            lang,
            showModal: ref(false)
        }
    },

    beforeMount(){
        this.initValue(this.inputValue)
    },  
   
    methods: {     
        gridReady(params){
            params.api.setRowData(this.data)
        },

        getSelectedItem(event){  
           let data = event.data

           this.selectId = data[this.entityId]
           this.inputValue = '['+data[this.entityId]+'] ' + this.$common.messageGetter(data.message)
           this.showModal = false
           this.$emit('update:modelValue', this.selectId)
        },

        initValue(code) {        
            const languageData = [{"CODE":"KO","EVENT_CODE":"KO","CREATED_DATE":"2021-08-29T08:12:45.000+00:00","EVENT_NAME":"한국어","TEST_DATE":"2021-08-11T15:00:00.000+00:00","NAME":"한국어"},{"CODE":"TEST","EVENT_CODE":"TEST","CREATED_DATE":"2021-07-31T09:16:28.000+00:00","UPDATE_DATE":"2021-08-03T10:49:46.000+00:00","EVENT_NAME":"테스트223","TEST_DATE":"2021-07-08T15:00:00.000+00:00","NAME":"테스트223"}]
            for(let i in languageData){
                
                if(languageData[i].CODE === code){
                    this.inputValue = '['+languageData[i].CODE+'] ' + languageData[i].NAME                
                }
            }
        },

        getValue() {
            return this.selectId
        }

    }
   
})
</script>