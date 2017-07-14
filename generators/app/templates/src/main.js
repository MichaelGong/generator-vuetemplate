import Vue from 'vue';
import store from './store';
import router from './router';
import App from './App';
import { Toast } from 'mint-ui';
import Loading from './components/common/loading/';
import Confirm from './components/common/confirm/';
import ClosetConfirm from './components/common/closetConfirm';
import { storage } from './util';
import { isLogin, checkIsAuth } from './util/login';
import './assets/css/common.scss';
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}

//Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //注册过滤器
// 注册toast loading
Vue.$toast = Vue.prototype.$toast = Toast;
Vue.$loading = Vue.prototype.$loading = Loading;
Vue.$confirm = Vue.prototype.$confirm = Confirm;
Vue.$closetConfirm = Vue.prototype.$closetConfirm = ClosetConfirm;

Vue.config.productionTip = false;

var attachFastClick = require('fastclick');
attachFastClick.attach(document.body);

Vue.$pin = Vue.prototype.$pin = window.$pin = storage.getCookie('pt_pin') || storage.getCookie('pwdt_id') || (process.env.NODE_ENV == 'development' ? 'chenwanli' : ''); // pin

// 请求判断登录接口
// isLogin().then(() => {
//     // 已经登录，业务逻辑
// }).catch(err => {

// });
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router,
    store
});
