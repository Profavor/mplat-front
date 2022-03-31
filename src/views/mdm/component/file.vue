<template>
    <n-config-provider :hljs="hljs">
    <n-space vertical :size="16">
        <n-code :code="`
        <InputFile />
function sleep (ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
        `"
        language="javascript"
      />
        <InputFile documentId="TEST_DOCUMENT" />

    
    </n-space>
    </n-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)
export default defineComponent({
    name: 'MdmComponentFile',

    setup(){
        return {
            hljs: hljs
        }
    }
})
</script>