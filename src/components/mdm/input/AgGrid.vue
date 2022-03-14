<template>
    <ag-grid-vue 
        :columnDefs="columnDefs"
        :gridOptions="options"
    > 
    </ag-grid-vue>
</template>

<script>
import "ag-grid-enterprise/dist/styles/ag-grid.css";
import "ag-grid-enterprise/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import {LicenseManager} from 'ag-grid-enterprise'

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
                return {
                    sideBar: false,
                    defaultColDef: {
                        filter: true,
                        sortable: true
                    }
                }
            }
        }
    },

    setup(props){
        LicenseManager.setLicenseKey(import.meta.env.VITE_KEY)
        return {
        }
    },
})
</script>