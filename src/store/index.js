import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbar: { message: '', color: 'indigo', show: false },
  },
  mutations: {
    SNACKBAR_UPDATE(state, payload) {
      state.snackbar = { show: true, ...payload };
    },
  },
  actions: {
  },
  getters: {
    snackbarState(state) { return state.snackbar; },
  },
  modules: {
  },
});
