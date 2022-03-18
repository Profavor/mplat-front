import {nextTick} from 'vue';


export default {
    template: `
      <n-message-provider>
        <InputRef v-model:value="message" placeholder="Input" :columnDefs="entityColDef" :url="url" :entityId="entityId" @pickEntityId="setEntityId" />
      </n-message-provider>
    `,
    components: {
        
    },
    data() {
        return {
            entityId: "",
            message: null,
            value: "",
            entityColDef: null,
            url: null,
        };
    },
    methods: {
        getValue() {
            return this.value == "" ? this.message : this.value;
        },

        isPopup() {
            return false;
        },

        setEntityId(entityId){
            this.value = JSON.stringify({entityId: entityId, message: this.message})
            console.log(this.value)
        }

    },
    created() {
        this.entityId = this.params.colDef.toColDef.entityId
        this.entityColDef = this.params.colDef.toColDef.entityColDef
        this.url = this.params.colDef.toColDef.url
        if(this.params.value.startsWith("{") && this.params.value.endsWith("}")){
            let parse = JSON.parse(this.params.value)
            this.messageId = parse.messageId
            this.message = parse.message
        }else{
            this.message = this.params.value
        }        
    },
};