<template>
  <div id="tableHeaderContainer" class="relative">
    <n-card
      :title="title"
      :content-style="{ padding: '0px' }"
      header-style="font-size: 16px; padding: 10px 15px; border-radius: 0"
    >
      <template #header-extra>
        <n-space>
          <slot name="table-config"></slot>
          <n-tooltip class="ml-2 mr-2" trigger="hover" v-if="showFilter">
            <template #trigger>
              <n-button type="warning" size="small" @click="showSearchContent = !showSearchContent">
                <template #icon>
                  <n-icon>
                    <FilterIcon />
                  </n-icon>
                </template>
                필터 조건
              </n-button>
            </template>
            필터 확장
          </n-tooltip>
          <slot name="top-right"></slot>
        </n-space>
      </template>
    </n-card>
  </div>
  <n-drawer
    v-model:show="showSearchContent"
    placement="top"
    :to="target"
    :height="searchContentHeight"
  >
    <n-drawer-content
      body-content-style="overflow: hidden"
      title="검색 조건"
      closable
      header-style="font-size: 16px; padding: 15px"
    >
      <template #default>
        <slot name="search-content"></slot>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <n-space>
            <n-button type="warning" size="small" @click="doResetSearch">Reset</n-button>
            <n-button type="primary" size="small" @click="doSearch">Search</n-button>
          </n-space>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue'
  import { FunnelOutline as FilterIcon } from '@vicons/ionicons5'

  export default defineComponent({
    name: 'TableHeader',
    components: { FilterIcon },
    props: {
      title: {
        type: String,
        default: '기본 동작',
      },
      showFilter: {
        type: Boolean,
        default: true,
      },
      searchContentHeight: {
        type: String,
        default: '300px',
      },
    },
    emits: ['search', 'reset-search'],
    setup(props, { emit }) {
      const showSearchContent = ref(false)
      const target = ref<HTMLElement | null>(null)
      onMounted(() => {
        nextTick(() => {
          target.value = document.getElementById('tableHeaderContainer')
        })
      })
      function doSearch() {
        showSearchContent.value = false
        emit('search')
      }
      function doResetSearch() {
        emit('reset-search')
      }
      return {
        showSearchContent,
        target,
        doSearch,
        doResetSearch,
      }
    },
  })
</script>
