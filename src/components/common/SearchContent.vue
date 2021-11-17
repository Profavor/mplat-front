<template>
  <teleport to="body">
    <div v-show="show" class="search-content-container" @click.self="onClose">
      <div class="w-4/5 search-content-wrapper sm:w-1/2">
        <n-input-group>
          <n-input v-model:value="content" placeholder="Search" />
          <n-button type="primary" @click="onSearch">Search</n-button>
        </n-input-group>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  export default defineComponent({
    name: 'SearchContent',
    setup() {
      const show = ref(false)
      const content = ref('')
      function onClose() {
        show.value = false
        content.value = ''
      }
      function onShow() {
        show.value = true
      }
      function onSearch() {
        if (!content.value) {
          return
        }
        show.value = false
        window.open('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=' + content.value)
      }
      return {
        show,
        content,
        onClose,
        onShow,
        onSearch,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .search-content-container {
    display: flex;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    .search-content-wrapper {
      padding: 20px;
      padding-bottom: 50px;
      margin-top: 20vh;
      height: fit-content;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    }
  }
</style>
