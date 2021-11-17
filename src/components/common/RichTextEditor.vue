<template>
  <div id="richTextEditor" :style="{ height: height + 'px' }"> </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from '@vue/runtime-core'
  import Quill from 'quill'
  import 'quill/dist/quill.snow.css'
  export default defineComponent({
    name: 'RichTextEditor',
    props: {
      height: {
        type: [Number, String],
        default: 'auto',
      },
    },
    setup() {
      let quill: Quill | null = null
      const init = () => {
        const options = {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], 
              ['blockquote', 'code-block'],

              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }], 
              [{ indent: '-1' }, { indent: '+1' }], 
              [{ direction: 'rtl' }], 

              [{ size: ['small', false, 'large', 'huge'] }], 
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], 
              [{ align: [] }],

              ['link', 'image'],

              ['clean'], 
            ],
          },
          placeholder: '请输入文章内容…',
          theme: 'snow',
        }
        quill = new Quill(document.getElementById('richTextEditor') as Element, options)
      }
      onMounted(init)
      const getHtmlContent = () => {
        return (document.getElementById('richTextEditor')?.firstChild as any).innerHTML
      }
      const getJsonContent = () => {
        return JSON.stringify(quill?.getContents())
      }
      return {
        getHtmlContent,
        getJsonContent,
      }
    },
  })
</script>
