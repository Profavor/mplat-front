
import { Module } from 'vuex'
import { DomainState, RootState } from '../types'
import { get } from '@/api/http'
import { getMessageName } from '@/utils'

export const domainModule: Module<DomainState, RootState> = {
  namespaced: true,
  state: {
    domainId: "",
    domainList: []
  },
  getters: {
    getDomainId(state): string {
      return state.domainId
    }
  },
  actions: {
    setDomainId({ commit }, domainId) {
      commit('CHANGE_DOMAIN_ID', domainId)
    },
    setDomainList({ commit }) {
      get({ url: '/api/domains' }).then(res=> {
        commit('SET_DOMAIN_LIST', res)
      })      
    }
  },
  mutations: {
    CHANGE_DOMAIN_ID(state, domainId) {
      state.domainId = domainId
    },
    SET_DOMAIN_LIST(state, domainList) {
      if(state.domainList.length == 0){
        state.domainList = domainList
      }     
      if(state.domainId == ""){
        state.domainId = domainList[0].domainId
      }
    },
  },
}
