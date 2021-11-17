<template>
  <n-upload 
    v-model:file-list="fileList"
    @update:file-list="handleFileListChange"
    @change="handleUploadChange"
    @remove="handleRemove"
    :action="uploadUrl">
    <n-upload-dragger>
      <div>
        <div style="margin-bottom: 12px;">
            <n-icon size="48" :depth="3">
            <archive-icon />
            </n-icon>
        </div>
        <n-text style="font-size: 16px;">
            Click or drag a file to this area to upload
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0;">
            Strictly prohibit from uploading sensitive information. For example, your
            bank card PIN or your credit card expiry date.
        </n-p>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script>
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'

  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'InputFile',
    
    components: {
        ArchiveIcon
    },

    setup() {
        const fileListRef = ref([])

        return {
            fileList: fileListRef,
            handleUploadChange ({ fileList }) {                
                fileListRef.value = fileList                
            },
            handleRemove ({ file, fileList }) {
                console.log(fileList)
            },
            handleFileListChange (value) {
                console.log(value)
            }
        }
    },

    data() {
        return {
            uploadUrl: '/api/document/createDocument',
        }
    },

    methods: {

    }
})
</script>