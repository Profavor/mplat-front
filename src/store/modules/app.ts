import packageJson from '../../../package.json'
import { Module } from 'vuex'
import { AppState, RootState } from '../types'

export const appModule: Module<AppState, RootState> = {
  namespaced: true,
  state: {
    version: packageJson.version,
    appName: packageJson.name,
    progress: 0
  },
  getters: {
    getVersion(state): string {
      return state.version
    },
    getAppName(state): string {
      return state.appName
    },
    getProgress(state): number {
      return state.progress
    }
  },
  actions: {
    changeVersion({ commit }, newVersion) {
      commit('CHANGE_VERSION', newVersion)
    },
    setProgress({ commit }, newProgress) {
      commit('SET_PROGRESS', newProgress)
    }
  },
  mutations: {
    CHANGE_VERSION(state, newVersion) {
      state.version = newVersion
    },
    SET_PROGRESS(state, newProgress) {
      state.progress = newProgress
    }
  },
}
