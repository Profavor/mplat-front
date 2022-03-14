export default {
    template: `
        <n-input-number v-model:value="value" clearable />
    `,
    components: {
        
    },
    data() {
        return {
            value: 0
        };
    },
    methods: {
        getValue() {
            return this.value
        },

        isPopup() {
            return false;
        }
    },
    created() {
        this.value = this.params.value       
    },
};