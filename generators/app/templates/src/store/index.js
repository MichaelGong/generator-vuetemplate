import Vue from 'vue';
import Vuex from 'vuex';

import indexModule from './indexModule';

Vue.use(Vuex);

const vueInstance = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        text: '信息'
    },
    actions: {
        // 设置text的action
        textAction({ commit }, data) {
            commit('textMutation', '基本信息');
        },
    },
    mutations: {
        // 设置text的mutation
        ['textMutation'](state, msg){
            state.text = msg;
        }
    },
    modules: {
        indexModule,
    }
});

export default vueInstance;
