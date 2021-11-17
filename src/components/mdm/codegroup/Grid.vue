<template>
    <ag-grid-vue style="height: 500px;"
        class="ag-theme-alpine"
        ref="codeGroups"

        @cell-clicked="getCodeGroupSelectedItem"
        @grid-ready="gridReady"

        :columnDefs="columnDefs"
        :options="options"
    > 
    </ag-grid-vue>
</template>

<script>
import "ag-grid-enterprise/dist/styles/ag-grid.css";
import "ag-grid-enterprise/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

import * as moment from 'moment'

import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'CodegroupGrid',
    components: {
      AgGridVue
    },

  props: {
      codeGroupId: {
          type: String,
          default: null
      }
  },

  setup(props){
      const languageForm = ref({"codeGroup":{"codeGroupId":"LANGAUGE"},"msections":[{"sectionId":"BASIC","dispSeq":"1","isEnable":"Y","message":"기본정보","mgroups":[{"groupId":"STANDARD","dispSeq":"1","isEnable":"Y","message":"표준 속성","props":[{"propId":"EVENT_CODE","areaId":"*","type":"STRN","unit":"","width":"100","regex":"","ruleCode":"","mask":"","dbType":"VARCHAR(100)","message":"종목코드","reference":null,"propMode":"IDENTITY","options":{"propMode":"IDENTITY","isDisabled":"N","isReadOnly":"N","isShow":"Y","dispSeq":"1"}},{"propId":"TEST_DATE","areaId":"*","type":"DATE","unit":"","width":"130","regex":"","ruleCode":"","mask":"","dbType":"DATETIME","message":"날짜","reference":null,"propMode":"GENERAL","options":{"propMode":"GENERAL","isDisabled":"N","isReadOnly":"N","isShow":"Y","dispSeq":"3"}},{"propId":"EVENT_NAME","areaId":"*","type":"STRN","unit":"","width":"150","regex":"","ruleCode":"","mask":"","dbType":"VARCHAR(200)","message":"종목명","reference":null,"propMode":"NAME","options":{"propMode":"NAME","isDisabled":"N","isReadOnly":"N","isShow":"Y","dispSeq":"2"}}]}]}]})
      const languageData = ref([{"CODE":"KO","EVENT_CODE":"KO","CREATED_DATE":"2021-08-29T08:12:45.000+00:00","EVENT_NAME":"한국어","TEST_DATE":"2021-08-11T15:00:00.000+00:00","NAME":"한국어"},{"CODE":"TEST","EVENT_CODE":"TEST","CREATED_DATE":"2021-07-31T09:16:28.000+00:00","UPDATE_DATE":"2021-08-03T10:49:46.000+00:00","EVENT_NAME":"테스트223","TEST_DATE":"2021-07-08T15:00:00.000+00:00","NAME":"테스트223"}])
      return {
          languageForm,
          languageData
      }
  },

  data: () =>({
    api: null,
    columnDefs: [
    ],
    data: [],
    options: {
      rowSelection: 'single',
      pagination: false,
      sideBar: false,
      defaultColDef: {
        sortable: true
      },
    },
  }),

  created() {

  },


  mounted() {

  },

  methods: {
    gridReady(params){
        this.api = params.api
        this.convertPropData(this.languageForm)
        params.api.setRowData(this.languageData)

    },
    setColumnDef() {
      this.$axios.get('/api/codeGroups/form/'+codeGroupId+'?lang='+this.lang)
          .then(res=> {
            this.convertPropData(res.data)

            this.$axios.get('/api/codeGroups/data/'+codeGroupId).then(res=> {
              this.$refs.codeGroups.setData(res.data)
            })
          })
    },

    convertPropData(data) {
      this.columnDefs = []
      for(let i in data.msections) {
        let groups = data.msections[i].mgroups
        for(let j in groups) {
          let group = {}
          group.headerName = groups[j].message
          group.children = []
          let props = groups[j].props
          for(let k in props) {
            if(props[k].options.isShow == 'Y'){
              if(props[k].type == 'DATE'){
                group.children.push({headerName: props[k].message, width: props[k].width, field: props[k].propId, valueFormatter: function(params){                 
                    if(params.value){
                      let date = new Date(params.value)
                      return moment(date).format('YYYY-MM-DD')
                    }
                  }})
              }else{
                group.children.push({headerName: props[k].message, width: props[k].width, field: props[k].propId})
              }
            }
          }
          this.columnDefs.push(group)
        }
      }
    },

    getCodeGroupSelectedItem(e) {
      let data = {
        codeGroupId: this.codeGroupId,
        data: e.data
      }
      this.$emit('selectedItem', data)
    }
  }
})
</script>
