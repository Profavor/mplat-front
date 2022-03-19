<template>
    <n-card content-style="padding: 0;">
        <n-tabs
        type="line"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 20px;"

        >
        <n-tab-pane v-for="section in columnData.msections" :key="section.sectionId" :name="section.message">
          <n-card>
            <n-form ref="formRef"
               label-placement="left"
               require-mark-placement="right-hanging"
               label-width="auto"
               :style="{
                  maxWidth: '1240px'
               }"
            >
              <template #header-extra></template>
              <n-collapse default-expanded-names="1" accordion>
                <n-collapse-item  v-for="group in section.mgroups" :key="group.groupId" :title="group.message">
                  <n-form-item v-for="prop in group.props" :key="prop.propId" :label="prop.message" :path="prop.value">     
                    <n-input v-if="prop.type === 'STRN'" v-model:value="prop.value"  />
                    <n-input-number v-if="prop.type ==='NVAL'" v-model:value="prop.value" clearable >
                      <template #prefix>{{prop.unit}}</template>
                    </n-input-number>
                    <n-date-picker v-if="prop.type === 'DATE'" v-model:value="prop.value" type="date" clearable />
                    <InputFile v-if="prop.type === 'FILE'" />
                    <InputCode v-if="prop.type === 'CODE'" v-model:value="prop.value" :codeGroupId="prop.reference" />
                  </n-form-item>               
                </n-collapse-item>
              </n-collapse>
              <template #footer> #footer </template>
              <template #action> #action </template>
            </n-form>
          </n-card>
        </n-tab-pane>
        </n-tabs>
  </n-card>
</template>

<script>
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
     name: 'FormSection',
     
     props: {
        domainId: {
           type: String,
           default: ""
        },
        classId: {
           type: String,
           default: ""
        },
        columnData: {
           type: Object,
           default: function(){
              return {}
           }
        },
        masterId: {
           type: String,
           default: null
        },
        codeGroupId: {
           type: String,
           default: null
        },
        isMasterCode: {
           type: Boolean,
           default: true
        }
     },
    setup(props, {emit}) {
      
      return {  }
    },

    data() {
       return {

       }
    },

   methods: {
      getValue(){
         let data = []            
         for(let i in this.columnData.msections){
               let msections = this.columnData.msections[i]
               for(let j in msections.mgroups){
                  let mgroups = msections.mgroups[j]
                  for(let k in mgroups.props){
                     let props = mgroups.props[k]
                     if(props.value){
                           data.push({
                              propId: props.propId,
                              value: props.value,
                           })
                     }else{
                        data.push({
                           propId: props.propId,
                           value: null
                        })
                     }
                  }
               }
            }

          if(this.isMasterCode){
              let masterData = {
                  "masterId": this.masterId,
                  "domainId": this.domainId,
                  "classId": this.classId,
                  "data": data
              }
              return masterData   
            } else { 
               let codeGroupData = {
                  codeGroupId: this.codeGroupId,  
                  data: data
              }
              return codeGroupData   
            }
      },
      validation() {
         let flag = true
         for(let i in this.$refs.formRef){
            this.$refs.formRef[i].validate(
               (errors) => {
                  if (errors) {
                     flag = false
                  }
               }
            )
         }
         return flag
      },
      init(){

      }
   }
})
</script>