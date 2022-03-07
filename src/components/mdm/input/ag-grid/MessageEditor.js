import {nextTick} from 'vue';


export default {
    template: `
      <n-message-provider>
        <InputMessage v-model:value="message" @pickMessageId="setMessageId" />
      </n-message-provider>
    `,
    components: {
        
    },
    data() {
        return {
            messageId: "",
            message: null,
            value: ""
        };
    },
    methods: {
        getValue() {
            return this.value == "" ? this.message : this.value;
        },

        isPopup() {
            return true;
        },

        setMessageId(messageId){
            this.messageId = messageId
            this.value = JSON.stringify({messageId: messageId, message: this.message})
        }

    },
    created() {
        if(this.params.value.startsWith("{") && this.params.value.endsWith("}")){
            let parse = JSON.parse(this.params.value)
            this.messageId = parse.messageId
            this.message = parse.message
        }else{
            this.message = this.params.value
        }        
    },
};