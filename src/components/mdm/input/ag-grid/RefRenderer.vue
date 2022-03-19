<template>
    <div>{{message}}</div>
</template>

<script>
export default {
    data() {
        return {
            messageId: '',
            message: ''
        };
    },
    methods: {
    },
    created() {
        if(this.params.value.startsWith("{") && this.params.value.endsWith("}")){
            let parse = JSON.parse(this.params.value)
            this.messageId = parse.messageId
            this.message = parse.message
        }else{
            this.message = this.params.value
        }   
    }
};
</script>
