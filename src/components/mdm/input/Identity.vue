<template>
    <n-input-group>   
        <n-input v-model:value="value" placeholder="Click search button." :readonly="autoSwitch" />
        <n-switch :round="false" v-model:value="autoSwitch">
            <template #checked>
                Auto
            </template>
            <template #unchecked>
                Menual
            </template>
        </n-switch>
    </n-input-group>
</template>

<script>
import { ref, computed } from 'vue'

export default {
    name: 'InputIdentity',

    props: {
        value: {
            type: String,
            default: 'AUTO'
        }
    },

    setup(props, { emit }){
       

        const identity = computed({ 
            get: () => props.value, 
            set: (value) => emit('update:value', value) 
        })

        const autoSwitch = ref(false)

        return {
            identity,
            autoSwitch
        }
    },
    
    watch: {
        value(val){
             this.identity =  val
        },
        autoSwitch(val){
            if(val){
                this.identity = 'AUTO'
            }else{
                this.identity = ''
            }
        }
    },

    mounted() {
        this.autoSwitch = true
    }
}
</script>