<template>
    <n-card content-style="padding: 0;">
        <n-tabs
        type="line"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 20px;"

        >
        <n-tab-pane v-for="section in dataProp.msections" :key="section.sectionId" :name="section.message">
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
              <n-collapse>
                <n-collapse-item  v-for="group in section.mgroups" :key="group.groupId" :title="group.message">
                  <n-form-item v-for="prop in group.props" :key="prop.propId" :label="prop.message" :path="prop.propId" >
                    <n-input v-if="prop.type === 'STRN'" v-model:value="prop.value" :readonly="mode === 'VIEW' || (prop.options.propMode =='IDENTITY' && mode === 'EDIT')" />
                    <n-input-number v-if="prop.type ==='NVAL'" v-model:value="prop.value" clearable :readonly="mode === 'VIEW'" >
                      <template #prefix>{{prop.unit}}</template>
                    </n-input-number>
                    <n-date-picker v-if="prop.type === 'DATE'" v-model:value="prop.value" type="date" clearable :readonly="mode === 'VIEW'" />
                    <InputFile v-if="prop.type === 'FILE'"  :readonly="mode === 'VIEW'" />
                    <InputCode v-if="prop.type === 'CODE'" v-model:value="prop.value" :codeGroupId="prop.reference" :readonly="mode === 'VIEW'" />
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
        },
        mode: {
           type: String,
           default: ''
        }
     },
    setup(props, {emit}) {
       const dataProp = ref(props.columnData)
      
      return { 
         dataProp
       }
    },

    data() {
       return {

       }
    },

   methods: {
      getValue(origin){        
         let originData = []
         if(origin){
            let keys = Object.keys(origin)

            for(let i in keys){
               originData.push({
                  propId: keys[i],
                  value: origin[keys[i]]
               })
            }
         }  

         let data = []            
         for(let i in this.columnData.msections){
               let msections = this.columnData.msections[i]
               for(let j in msections.mgroups){
                  let mgroups = msections.mgroups[j]
                  for(let k in mgroups.props){
                     let props = mgroups.props[k]
                     if(props.value){                           
                           if(this.mode === 'NEW'){
                              data.push({
                                 propId: props.propId,
                                 value: props.value,
                              })
                           }else{
                              let filter = originData.filter(s=> {
                                 return s.propId == props.propId
                              })
                              if(filter.length > 0 && filter[0].value != props.value){
                                 data.push({
                                    propId: props.propId,
                                    value: props.value,
                                 })  
                              }else if(filter.length == 0){
                                 data.push({
                                    propId: props.propId,
                                    value: props.value,
                                 })  
                              }                                                                
                           }                    
                     }else{                        
                        if(this.mode === 'NEW'){
                           data.push({
                              propId: props.propId,
                              value: null
                           })
                        }else{
                           let filter = originData.filter(s=> {
                              return s.propId == props.propId
                           })
                           if(filter.length > 0 && filter[0].value != null){
                              data.push({
                                 propId: props.propId,
                                 value: null,
                              })  
                           }    
                        }
                     }
                  }
               }
            }

          if(this.isMasterCode){
             
              let masterData = {
                  "masterId": this.mode == 'EDIT' ? origin.master_id : null,
                  "domainId": this.mode == 'EDIT' ? origin.domain_id : this.domainId,
                  "classId":  this.mode == 'EDIT' ? origin.class_id : this.classId,
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