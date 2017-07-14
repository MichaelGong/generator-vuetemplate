import apis from './api';
import Vue from 'vue';
const APPID = '';
export const LOGIN_URL = `//plogin.m.jd.com/user/login.action?appid=${APPID}&returnurl=`;
/**
 * 判断是否登录，登录后执行回电
 * @export
 * @param {any} cb 
 * @param {any} notCb 
 */
export function isLogin() {
    let timeStampCha = new Date().getTime() - (window.loginTimeStamp||0);
    if (typeof window.isLoginFlag === 'undefined' || (timeStampCha >= 1000*60*5)) { // 5分钟之内才有效，超过5分钟重新请求
        return apis.isLogin().then(data => {
            console.log(data);
            if (data && data.data && data.data.code == 3) {
                window.isLoginFlag = false;
                return Promise.reject(data.data);
            } else {
                Vue.$pin = Vue.prototype.$pin = window.$pin = data.msg || (data.data && data.data.msg) || '';
                window.loginTimeStamp = new Date().getTime();
                window.isLoginFlag = true;
                return Promise.resolve(json.data);                
            }
        });
    } else {
        if (window.isLoginFlag) {
            return Promise.resolve(json.data);    
        } else {
            return Promise.reject(json.data);
        }
    }
}

// 去登陆 ,returnurl不传就是 首页
export function goLogin(returnurl) {
    window.location.href = LOGIN_URL + encodeURIComponent(returnurl || ('https://'+location.host));
}
