<template>
    <n-card content-style="padding: 0;">
        <n-tabs
        type="line"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 20px;"

        >
        <n-tab-pane v-for="section in form.msections" :key="section.sectionId" :name="section.message">
          <n-card>
            <n-form ref="formRef">
              <template #header-extra></template>
              <n-collapse default-expanded-names="1" accordion>
                <n-collapse-item  v-for="group in section.mgroups" :key="group.groupId" :title="group.message">
                  <n-form-item v-for="prop in group.props" :key="prop.propId" :label="prop.message" path="prop.value">
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

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
     name: 'FormSection',
    setup() {
      const form = ref({
         "domain":{
            "domainId":"FINANCE"
         },
         "mclass":{
            "classId":"SECTOR",
            "message":"업종"
         },
         "msections":[
            {
               "sectionId":"BASIC",
               "dispSeq":"1",
               "isEnable":"Y",
               "message":"기본정보",
               "mgroups":[
                  {
                     "groupId":"STANDARD",
                     "dispSeq":"1",
                     "isEnable":"Y",
                     "message":"표준 속성",
                     "props":[
                        {
                           "propId":"EVENT_CODE",
                           "areaId":"*",
                           "type":"STRN",
                           "unit":"",
                           "width":"100",
                           "regex":"",
                           "ruleCode":"",
                           "mask":"",
                           "dbType":"VARCHAR(100)",
                           "message":"종목코드",
                           "value":"Test",
                           "reference":"",
                           "propMode":null,
                           "options":{
                              "propMode":null,
                              "isDisabled":"N",
                              "isReadOnly":"N",
                              "isShow":"Y",
                              "dispSeq":"10"
                           }
                        },
                        {
                           "propId":"EVENT_NUMBER",
                           "areaId":"*",
                           "type":"NVAL",
                           "unit":"NO",
                           "width":"100",
                           "regex":"",
                           "ruleCode":"",
                           "mask":"",
                           "dbType":"VARCHAR(100)",
                           "message":"종목번호",
                           "value": 0,
                           "reference":"",
                           "propMode":null,
                           "options":{
                              "propMode":null,
                              "isDisabled":"N",
                              "isReadOnly":"N",
                              "isShow":"Y",
                              "dispSeq":"10"
                           }
                        },
                        {
                           "propId":"ETC_FILE",
                           "areaId":"*",
                           "type":"FILE",
                           "unit":"",
                           "width":"100",
                           "regex":"",
                           "ruleCode":"",
                           "mask":"",
                           "dbType":"VARCHAR(100)",
                           "message":"일반 파일",
                           "reference":"",
                           "propMode":null,
                           "options":{
                              "propMode":null,
                              "isDisabled":"N",
                              "isReadOnly":"N",
                              "isShow":"Y",
                              "dispSeq":"15"
                           }
                        },
                        {
                           "propId":"CODE_REF",
                           "areaId":"*",
                           "type":"CODE",
                           "unit":"",
                           "width":"150",
                           "regex":"",
                           "ruleCode":"",
                           "mask":"",
                           "dbType":"VARCHAR(100)",
                           "message":"코드 테스트",
                           "reference":"LANGAUGE",
                           "value": "KO",
                           "propMode":null,
                           "options":{
                              "propMode":null,
                              "isDisabled":"N",
                              "isReadOnly":"N",
                              "isShow":"Y",
                              "dispSeq":"12"
                           }
                        }
                     ]
                  }
               ]
            }
         ]
      })
      return { form }
   }
})
</script>