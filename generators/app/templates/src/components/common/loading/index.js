import Vue from 'vue';

const Loading = Vue.extend(require('./loading.vue'));
let instance;

export default {
  show(isShow = true) {
    if (!instance) {
      instance = new Loading({
        el: document.createElement('div')
      });
    }
    if (instance.isShow) return;
    instance.isShow = true;
    document.body.appendChild(instance.$el);

    Vue.nextTick(() => {
      instance.isShow = true;
    });
  },

  close() {
    if (instance) {
      instance.isShow = false;
    }
  }
};