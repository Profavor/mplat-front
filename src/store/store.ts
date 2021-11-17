import { RootState, ParentState } from './types'
import { createStore, useStore as baseUserStore, Store } from 'vuex'
import { appModule } from './modules/app'
import { userModule } from './modules/user'
import { InjectionKey } from 'vue'

export default createStore<RootState>({
  state: {
    root: 'this is root',
  },
  modules: {
    user: userModule,
    app: appModule,
  },
})

export const key: InjectionKey<Store<ParentState>> = Symbol()

export function useStore(): Store<ParentState> {
  return baseUserStore(key)
}
