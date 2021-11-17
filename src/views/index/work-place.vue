<template>
  <div class="main-container">
    <n-card title="Todo List" :content-style="{ padding: '10px' }" :header-style="{ padding: '10px' }">
      <div v-if="!isMobileScreen" class="flex margin-top">
        <div class="avatar-wrapper">
          <img :src="avatar" />
        </div>
        <div class="flex flex-col justify-around ml-3.5 flex-1">
          <div class="text-lg">Hello. Do you know build a snow man?</div>
          <div class="text-sm text-gray-500">
            <i class="el-icon-heavy-rain"></i> Today is cold.
          </div>
        </div>
        <div class="flex flex-col justify-around align-end item-action">
          <div class="text-gray">Item</div>
          <div class="text-xl">12</div>
        </div>
        <div class="flex flex-col justify-around align-end item-action">
          <div class="text-gray">Date</div>
          <div class="text-xl">3/20</div>
        </div>
        <div class="flex flex-col justify-around align-end item-action">
          <div class="text-gray">Today</div>
          <div class="text-xl">{{ currentDate }}</div>
        </div>
      </div>
      <div v-else>
        <div class="flex">
          <div class="mt-1 avatar-wrapper">
            <img :src="avatar" />
          </div>
          <div class="flex flex-col justify-around ml-4 flex-sub">
            <div class="text-xl">Good morning，Andy，Do you know build a snow man?</div>
            <div class="text-sm text-gray-500"
              ><i class="el-icon-heavy-rain"></i> Today is cold.</div
            >
          </div>
        </div>
        <div class="flex mt-4">
          <div class="flex flex-col items-center flex-1">
            <div class="text-gray">Count</div>
            <div class="text-xl">12</div>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="text-gray">Todo</div>
            <div class="text-xl">3/20</div>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="text-gray">Today</div>
            <div class="text-xl">{{ currentDate }}</div>
          </div>
        </div>
      </div>
    </n-card>
    <div v-if="!isMobileScreen" class="flex mt-1">
      <div style="flex: 3">
        <n-card header-style="padding: 10px" :content-style="{ padding: '5px' }" title="내 과정">
          <n-grid :x-gap="8" :y-gap="8" :cols="3">
            <n-grid-item v-for="(item, index) of dataItems" :key="index">
              <ProjectItem :item="item" />
            </n-grid-item>
          </n-grid>
        </n-card>
        <n-card
          title="동적 정보"
          header-style="padding: 10px"
          :content-style="{ padding: '5px' }"
          class="mt-1"
        >
          <div v-for="(item, index) of trendsItems" :key="index">
            <TrendsItem :item="item">
              <template #title="{ title }">
                <div v-html="title"></div>
              </template>
            </TrendsItem>
          </div>
        </n-card>
      </div>
      <div style="flex: 2; margin-left: 5px">
        <n-card
          title="빠른 작동"
          :content-style="{ padding: 0 }"
          :header-style="{ padding: '10px' }"
        >
          <n-grid :x-gap="1" :y-gap="1" :cols="3">
            <n-grid-item v-for="(item, index) of fastActions" :key="index">
              <div
                @click="fastActionClick(item)"
                class="flex flex-col items-center justify-center fast-item-wrapper"
              >
                <span
                  :class="[item.icon, 'iconfont']"
                  :style="{ color: item.color, fontSize: '25px' }"
                ></span>
                <span class="mt-1">{{ item.title }}</span>
              </div>
            </n-grid-item>
          </n-grid>
        </n-card>
        <n-card
          title="Todo"
          class="mt-1"
          :content-style="{ padding: '10px' }"
          :header-style="{ padding: '10px' }"
          :footer-style="{ padding: '0px' }"
        >
          <TodoItem v-for="(item, index) of tempWaitingItems" :key="index" :item="item" />
          <div v-if="isShowMore" class="text-center">
            <n-button type="text" @click="toggleMore">
              {{ showWatingMode ? 'More add' : 'More view' }}
              <template #icon>
                <i class="iconfont" :class="[showWatingMode ? 'icon-caret-up' : 'icon-caret-down']">
                </i>
              </template>
            </n-button>
          </div>
        </n-card>
      </div>
    </div>
    <div v-else class="mt-1">
      <n-card
        title="My project"
        :content-style="{ padding: '5px' }"
        :header-style="{ padding: '5px' }"
      >
        <n-grid :x-gap="10" :y-gap="10" :cols="3">
          <n-grid-item v-for="(item, index) of dataItems" :key="index">
            <ProjectItem :item="item" />
          </n-grid-item>
        </n-grid>
      </n-card>
      <n-card
        title="최신 정보"
        :content-style="{ padding: '5px' }"
        :header-style="{ padding: '5px' }"
        class="mt-1"
      >
        <div v-for="(item, index) of trendsItems" :key="index">
          <TrendsItem :item="item">
            <template #title="{ title }">
              <div v-html="title"></div>
            </template>
          </TrendsItem>
        </div>
      </n-card>
      <n-card
        title="빠른 작동"
        :content-style="{ padding: 0 }"
        :header-style="{ padding: '5px' }"
        class="mt-1"
      >
        <n-grid :x-gap="10" :y-gap="10" :cols="3">
          <n-grid-item v-for="(item, index) of fastActions" :key="index">
            <div
              @click="fastActionClick(item)"
              class="flex flex-col items-center justify-center fast-item-wrapper"
            >
              <div
                :class="[item.icon, 'iconfont']"
                :style="{ color: item.color, fontSize: '20px' }"
              ></div>
              <div class="margin-top-xs">{{ item.title }}</div>
            </div>
          </n-grid-item>
        </n-grid>
      </n-card>
      <n-card
        title="Todo"
        class="mt-1"
        :content-style="{ padding: '10px' }"
        :header-style="{ padding: '5px' }"
      >
        <TodoItem v-for="(item, index) of tempWaitingItems" :key="index" :item="item" />
        <div v-if="isShowMore" class="text-center">
          <n-button type="text" @click="toggleMore"
            >{{ showWatingMode ? 'More add' : 'More view' }}
            <i
              class="el-icon-view"
              :class="[showWatingMode ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"
            >
            </i>
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
  import ProjectItem from './components/ProjectItem.vue'
  import TrendsItem from './components/TrendsItem.vue'
  import TodoItem from './components/TodoItem.vue'
  import W_LOGO from '@/assets/the_w.png'
  import X_LOGO from '@/assets/the_x.png'
  import P_LOGO from '@/assets/the_p.png'
  import REACT_PATH from '@/assets/img_react.jpeg'
  import VUE_PATH from '@/assets/img_vue.jpeg'
  import ANGULAR_PATH from '@/assets/img_angular.jpeg'
  import AVATAR_01 from '@/assets/img_avatar_01.jpeg'
  import AVATAR_02 from '@/assets/img_avatar_02.jpeg'
  import AVATAR_DEFAULT from '@/assets/img_avatar_default.png'
  import { computed, defineComponent, onMounted, reactive, ref } from '@vue/runtime-core'
  import { useRouter } from 'vue-router'
  import { useStore } from '@/store/store'
  import { random } from 'lodash'
  import { useLayoutStore } from '@/components'
  const COLORS = ['#67C23A', '#E6A23C', '#F56C6C', '#409EFF']
  const date = new Date()
  export default defineComponent({
    name: 'WorkPlace',
    components: {
      ProjectItem,
      TrendsItem,
      TodoItem,
    },
    setup() {
      const waitingItmes = [
        {
          content: '아침, 점심, 저녁에 체크인 하는 것 잊지 마시고 퇴근하세요 ',
          time: '04-05',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
        {
          content: '관리자에게 문서 인쇄 ',
          time: '04-04',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
        {
          content: '퇴근 후 전원 끄기 ',
          time: '04-03',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
        {
          content: '주말까지 기다려서 동료들과 쇼핑하고, 새 옷을 사고, 새 휴대폰을 사고, 가방을 사고, 온갖 물건을 사고 산다. ',
          time: '04-02',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
        {
          content: '신입사원 입문교육',
          time: '04-01',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
        {
          content: '리더를 위한 항공권, 호텔 숙박 및 기타 문제 준비 ',
          time: '03-31',
          bgColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        },
      ]
      const isShowMore = computed(() => {
        return waitingItmes.length > 4
      })
      const layoutStore = useLayoutStore()
      const isMobileScreen = computed(() => {
        return layoutStore.state.device === 'mobile'
      })
      const store = useStore()
      const avatar = computed(() => store.state.user.avatar)
      const tempWaitingItems = reactive([] as Array<any>)
      const showWatingMode = ref(false)
      const toggleMore = () => {
        showWatingMode.value = !showWatingMode.value
        tempWaitingItems.length = 0
        if (showWatingMode.value) {
          tempWaitingItems.push(...waitingItmes)
        } else {
          tempWaitingItems.push(...waitingItmes.slice(0, 4))
        }
      }
      const router = useRouter()
      const fastActionClick = ({ path = '/' }) => {
        router.push(path)
      }
      onMounted(() => {
        tempWaitingItems.push(
          ...(waitingItmes.length > 4 ? waitingItmes.slice(0, 4) : waitingItmes)
        )
      })
      return {
        isShowMore,
        isMobileScreen,
        tempWaitingItems,
        avatar,
        currentDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        dataItems: [
          {
            title: 'Vue Admin Work',
            imagePath: W_LOGO,
            target: 'http://qingqingxuan.gitee.io/vue-admin-work',
          },
          {
            title: 'Vue Admin Work X',
            imagePath: X_LOGO,
            target: 'http://qingqingxuan.gitee.io/vue-admin-work-x',
          },
          {
            title: 'Vue Admin Work P',
            imagePath: P_LOGO,
            target: 'http://qingqingxuan.gitee.io/vue-admin-work-p',
          },
          {
            title: 'React',
            imagePath: REACT_PATH,
          },
          {
            title: 'Vue',
            imagePath: VUE_PATH,
          },
          {
            title: 'Angular',
            imagePath: ANGULAR_PATH,
          },
        ],
        trendsItems: [
          {
            avatar: AVATAR_01,
            title:
              '<span><span class="text-blue-600">원숭이 왕 </span>게시물을 게시했습니다 <span class="text-blue-600">《나의 일흔두 가지 변화를 봐 》</span></span>',
          },
          {
            avatar: AVATAR_02,
            title:
               '<span><span class="text-blue-600">원숭이 왕 </span>게시물을 게시했습니다 <span class="text-blue-600">《나의 일흔두 가지 변화를 봐 》</span></span>',
          },
          {
            avatar: AVATAR_01,
            title:
               '<span><span class="text-blue-600">원숭이 왕 </span>게시물을 게시했습니다 <span class="text-blue-600">《나의 일흔두 가지 변화를 봐 》</span></span>',
          },
          {
            avatar: AVATAR_02,
            title:
              '<span><span class="text-blue-600">원숭이 왕 </span>게시물을 게시했습니다 <span class="text-blue-600">《나의 일흔두 가지 변화를 봐 》</span></span>',
          },
          {
            avatar: AVATAR_DEFAULT,
            title: '<span><span class="text-blue-600">나는</span> 휴가 신청서를 제출했습니다 ',
          },
        ],
        fastActions: [
          {
            title: 'Dashboard',
            icon: 'icon-dashboard-fill',
            path: '/',
            color: COLORS[random(0, COLORS.length)],
          },
          {
            title: '시스템 관리 ',
            path: '/system/department',
            icon: 'icon-setting-fill',
            color: COLORS[random(0, COLORS.length)],
          },
          {
            title: '테이블 목록',
            path: '/list/table-custom',
            icon: 'icon-detail-fill',
            color: COLORS[random(0, COLORS.length)],
          },
          {
            title: '양식',
            path: '/form/base-form-view',
            icon: 'icon-file-text-fill',
            color: COLORS[random(0, COLORS.length)],
          },
          {
            title: '멀티 메뉴',
            path: '/next/menu2/menu-2-1/menu-2-1-1',
            icon: 'icon-golden-fill',
            color: COLORS[random(0, COLORS.length)],
          },
          {
            title: 'QR CODE',
            path: '/other/qrcode',
            icon: 'icon-appstore-fill',
            color: COLORS[random(0, COLORS.length)],
          },
        ],
        showWatingMode,
        fastActionClick,
        toggleMore,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .avatar-wrapper {
    width: 5rem;
    height: 5rem;
    max-width: 5rem;
    max-height: 5rem;
    min-width: 5rem;
    min-height: 5rem;
    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid yellowgreen;
    }
  }
  .item-action {
    position: relative;
    padding: 0 30px;
  }
  .item-action::after {
    position: absolute;
    top: 20%;
    right: 0;
    height: 60%;
    content: '';
    display: block;
    width: 1px;
    background-color: #e0e0e0;
  }
  div.item-action:last-child::after {
    width: 0;
  }
  .fast-item-wrapper {
    border-right: 1px solid #f7f7f7;
    border-bottom: 1px solid #f7f7f7;
    height: 80px;
  }
  .fast-item-wrapper:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px #ddd;
  }
  .el-link + .el-link {
    margin-bottom: 10px;
  }
</style>
