import {nextTick} from 'vue';


export default {
    template: `
      <n-message-provider>
        <InputRef v-model:value="message" placeholder="Input" :columnDefs="sectionColDefs" url="/api/sections" entityId="sectionId" @pickEntityId="setEntityId" />
      </n-message-provider>
    `,
    components: {
        
    },
    data() {
        return {
            entityId: "",
            message: null,
            value: "",
            sectionColDefs: null,
            url: null,
        };
    },
    methods: {
        getValue() {
            return this.value == "" ? this.message : this.value;
        },

        isPopup() {
            return true;
        },

        setEntityId(entityId){
            this.value = JSON.stringify({entityId: entityId, message: this.message})
            console.log(this.value)
        }

    },
    created() {
        this.entityId = this.params.colDef.custom.entityId
        this.sectionColDefs = this.params.colDef.custom.entityColDef
        this.url = this.params.colDef.custom.url
        if(this.params.value.startsWith("{") && this.params.value.endsWith("}")){
            let parse = JSON.parse(this.params.value)
            this.messageId = parse.messageId
            this.message = parse.message
        }else{
            this.message = this.params.value
        }        
    },
};