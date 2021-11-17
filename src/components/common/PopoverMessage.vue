<template>
  <n-card
    :content-style="{ padding: '0px' }"
    :footer-style="{ padding: '0px' }"
    :bordered="false"
    :segmented="true"
  >
    <div v-if="messages.length > 0">
      <div
        class="flex items-center max-w-sm p-1 mx-auto space-x-2 rounded-xl"
        v-for="(item, index) of messages"
        :key="index"
      >
        <div class="flex-shrink-0">
          <n-icon size="40" color="#f00">
            <NotificationsCircle />
          </n-icon>
        </div>
        <div>
          <div class="text-sm font-medium">{{ item.title }}</div>
          <n-ellipsis :line-clamp="1" class="text-gray-500">{{ item.desc }}</n-ellipsis>
        </div>
      </div>
    </div>
    <n-empty v-else description="Empty news" class="pt-20 pb-20" />
    <template #footer>
      <div class="flex justify-evenly">
        <n-button type="text" @click="onClearMessage">비우기</n-button>
        <n-button type="text">More</n-button>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts">
  import { defineComponent, shallowReactive } from 'vue'
  import { NotificationsCircle } from '@vicons/ionicons5'
  export default defineComponent({
    name: 'PopoverMessage',
    components: { NotificationsCircle },
    emits: ['clear'],
    setup(props, { emit }) {
      const messages = shallowReactive([
        {
          title: 'Message',
          desc: '모이자 프로모션 안내입니다.',
        }
      ])
      function onClearMessage() {
        messages.length = 0
        emit('clear')
      }
      return {
        onClearMessage,
        messages,
      }
    },
  })
</script>
