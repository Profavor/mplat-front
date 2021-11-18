<template>
<div class="main-container">
    <n-card  :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <n-page-header subtitle="A podcast to improve designs">
        <template #title>
          <n-gradient-text
            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
          >
            Domain Manager
          </n-gradient-text>
        </template>
        <template #avatar>
          <n-avatar
            src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
          />
        </template>
        <template #extra>
          <n-space>
            <n-button @click="handleConfirm">Add</n-button>
            <n-button>Edit</n-button>
            <n-button>Delete</n-button>
          </n-space>
        </template>
      </n-page-header>  
      
      <InputAgGrid style="height: 500px; padding-top: 10px;"
        class="ag-theme-alpine"

        @cell-clicked="selectedItem"
        @grid-ready="gridReady"

        :columnDefs="columnDefs"
        :options="options"
    /> 
    </n-card>
</div>
</template>

<script lang="ts">  
  import { defineComponent, ref, onMounted } from 'vue'
  import { useMessage, useDialog } from 'naive-ui'

  export default defineComponent({
    name: 'MdmManageDomain',
    setup() {
      const columnDefs = ref([
        {headerName: 'ID', field: 'domainId'},
        {headerName: 'NAME', field: 'message'},
        {headerName: 'STATUS', field: 'status'}
      ])

      const dialog = useDialog()
      const message = useMessage()

      return {
        columnDefs,

        handleConfirm () {
        dialog.warning({
          title: 'Confirm',
          content: 'Are you sure?',
          positiveText: 'Sure',
          negativeText: 'Not Sure',
          onPositiveClick: () => {
            message.success('Sure')
          },
          onNegativeClick: () => {
            message.error('Not Sure')
          }
        })
      },
      } 
    },
    methods: {
      gridReady(params: any){
        params.api.setRowData([])
      },

      selectedItem(data: Object){
        console.log(data)
      }
    }
  })
</script>
