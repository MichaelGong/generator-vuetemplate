import axios from 'axios';
const apiHost = process.env.NODE_ENV == 'development' ? '//xxxxxx' : (location.protocol + '//xxxxx');

/**
 * api方法声明。
 * type：Get, Post
 * url: 请求的url
 */
const apiUrl = {
    patientInfoList: { // 查询患者列表
        type: 'get',
        url: apiHost + '/patient/patientInfoList',
    } 
}

let apis = {};
let CancelToken = axios.CancelToken;
apis.isCancel = axios.isCancel; // 判断是否是取消
Object.keys(apiUrl).forEach((item) => {
    /**
     * 创建api请求function，返回promise对象
     */
    apis[item] = function apiFunc(data) {
        let obj = apiUrl[item];
        let promise;
        let dataTmp = data;
        promise = axios({
            method: obj.type,
            url: obj.url,
            timeout: 20000,
            data: obj.type === 'get' ? {} : dataTmp,
            params: obj.type === 'get' ? dataTmp : {},
            withCredentials: process.env.NODE_ENV == 'development' ? false : (process.env.test == 'true' ? false : true),
            cancelToken: new CancelToken(function executor(c) {
                apis[item + 'Cancel'] = c;
            })
        }).then(response => {
            let data = response.data;
            return data;
        });
        return promise;
    }
});

// apis中包含基本的请求接口和取消接口，如 apis.test 和 apis.textCancel，
// 同时还包含apis.isCancel判断是否是用户主动取消的请求
export default apis;
