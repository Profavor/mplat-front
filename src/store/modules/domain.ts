
import { Module } from 'vuex'
import { DomainState, RootState } from '../types'
import { get } from '@/api/http'
import store from '../store'

export const domainModule: Module<DomainState, RootState> = {
  namespaced: true,
  state: {
    domainId: "",
    domainName: "",
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
    setDomainName( { commit }, domainName){
      commit('CHANGE_DOMAIN_NAME', domainName)
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
    CHANGE_DOMAIN_NAME(state, domainName) {
      state.domainName = domainName
    },
    SET_DOMAIN_LIST(state, domainList) {
      if(state.domainList.length == 0){
        state.domainList = domainList
      }     
      if(state.domainId == ""){
        state.domainId = domainList[0].domainId
        for(let i in domainList[0].message.messageLangs){
          if(domainList[0].message.messageLangs[i].lang === store.state.user.lang){
            state.domainName = domainList[0].message.messageLangs[i].message
          }
        }    
      }
    },
  },
}
