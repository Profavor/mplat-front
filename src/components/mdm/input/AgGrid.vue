<template>
    <ag-grid-vue 
        :columnDefs="columnDefs"
        :options="options"
    > 
    </ag-grid-vue>
</template>

<script>
import "ag-grid-enterprise/dist/styles/ag-grid.css";
import "ag-grid-enterprise/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'InputAgGrid',
    
    components: {
        AgGridVue
    },

    props: {
        columnDefs: {
            type: Array,
            default: function(){
                return []
            }
        },

        options: {
            type: Object,
            default: function(){
                return {}
            }
        }
    },

    setup(){
        return {
        }
    }
    
})
</script>