<template>
    <div>
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
            <n-form-item label="Search" path="keyword">
                <n-input v-model:value="keyword" type="text" placeholder="Basic Input" />
            </n-form-item> 
            <CodegroupGrid :codeGroupId="codeGroupId" @selectedItem="selectedItem" ref="codeGroupGrid" />
            <template #footer> Footer </template>
            </n-card>
        </n-modal>        
    </div>   
</template>

<script>
import { CashOutline as CashIcon } from '@vicons/ionicons5'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'InputCode',
    
    components: {
        CashIcon
    },

    props: {
        value: {
            type: String,
            default: null
        },
        codeGroupId: {
            type: String,
            default: null //Test Code
        }
    },

    setup(props) {
        const selectId = ref('')
        const lang = ref('ko')
        const inputValue = props.value
        const keyword = ref('')
        return {
            selectId,
            inputValue,
            keyword,
            lang,
            showModal: ref(false)
        }
    },

    beforeMount(){
        this.initValue(this.inputValue)
    },  
   
    methods: {        
        selectedItem(event){
           let data = event.data

           this.selectId = data.CODE
           this.inputValue = '['+data.CODE+'] ' + data.NAME
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

        getValue(){
            return this.selectId
        }
    }   
})
</script>