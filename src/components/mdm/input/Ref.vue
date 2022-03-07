<template>
    <div>

    </div>    
</template>

<script>
import { get } from '@/api/http'
import { makeTreePath } from '@/utils'
  export default {
    name: 'InputRef',

    created: function(){
      this.inputValue = this.value
      if(this.entityKey != null){
        this.initValue(this.entityKey)
      }
    },
    components: {
    },
    props: {
        showCode: {
          type: Boolean,
          default: true
        },
        entityId: {
            type: String,
            default: null
        },
        entity: {
            type: String,
            default: ''
        },
        entityKey: {
          type: String,
          default: null
        },
        value: {
            type: String,
            default: null
        },
        label: {
            type: String,
            default: 'Entity search'
        },
        icon: {
            type: String,
            default: ''
        },
        hint: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Entity Search'
        },
        gridOptions: {
            type: Object,
            default: function() {
              return {
              }
            }
        },

        isDomain: {
          type: Boolean,
          default: false
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
    },
    data () {
      return {
        gridApi: null,
        entityValue: '',
        dialog: false,
        inputValue: '',
        search: '',
        isEditing: false,
        rowSelection: 'single',
        valid: false,
        selected: [],
        messageDialog: false
      }
    },

    mounted(){
      this.$emit('ready', {})
    },
    methods: {
        saveMessage(flag){          
          this.messageDialog = false
          this.getData()
          
        },
        onGridReady(params) {
          this.gridApi = params.api
          this.getData()
        },

        getData() {
          let url = '/api/' + this.entity
          get(url)
            .then(res => {
              if(this.treeData.enable){         
                  makeTreePath(res.data, this.treeData.id, this.treeData.parentId, this.treeData.children)
                  this.gridApi.setRowData(res.data)
                  this.gridApi.expandAll()
              }else{
                this.gridApi.setRowData(res.data)
              }
            }).catch(err => console.log(err))
        },

        enterHandler(){
            this.dialog = true
            this.search = this.inputValue

            this.searchHandler()

        },

        toggleEditable(){
            if(this.isEditing){
                this.saveHandler();
            }else{
                this.isEditing = true
            }
        },

        reset(){
          this.inputValue = ''
          this.entityValue = ''
        },

        getValueById(){
            //require entityId
            return this.entityValue
        },

        pickValue(event){
           this.inputValue = this.showCode ? messageGetterWithId(event, this.entityId) : messageGetter(event)
           this.selected = event.data
           this.dialog = false
           if(this.entityId){
             this.entityValue = eval('event.data.'+ this.entityId)
           }
           this.$emit('getValue', this.selected)
        },

        invalid(){
            this.valid = false
            this.success = false
            this.successMessages = ''
            this.selected = []
        },

        searchHandler(e) {
          if(!!this.$refs.entityGrid){
            this.$refs.entityGrid.gridApi.setQuickFilter(this.search);
          }
        },

        emptyCheckHandler() {
          if(this.inputValue == null || this.inputValue == ''){
             this.$emit('getValue', [])
          }
        },

        initValue(key) {
          this.$axios.get(process.env.SERVER_URL + '/api/' + this.entity + '/' + key).then(res => {
            if(this.entity == 'messages'){
               this.inputValue = this.isCode ?'['+eval('res.data.'+this.entityId)+'] ' + getMessageName(res.data, this.lang) : getMessageName(res.data, this.lang)
            }else{
              if(eval('res.data.'+this.entityId)){
                this.inputValue = this.isCode ?  '['+eval('res.data.'+this.entityId)+'] ' + getMessageName(res.data.message, this.lang) : getMessageName(res.data.message, this.lang)
              }else{
                this.inputValue = getMessageName(res.data.message, this.lang)
              }
            }
            if(this.entityId != null){
              this.entityValue = eval('res.data.'+this.entityId)
            }
            this.$emit('getValue', res.data)
        })
      }
    }
  }
</script>
