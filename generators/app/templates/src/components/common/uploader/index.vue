/*
 * @Author: gonghao 
 * @Date: 2017-06-20 10:12:15 
 * @Last Modified by: gonghao
 * @Last Modified time: 2017-06-26 17:42:46
 * @DESC:  上传组件
 */

<style lang="scss" scoped>
.uploder-container {
    width: 100%;
    height: 100%;
    position: relative;
    .uploder-container-input {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 99;
    }
}
</style>
<template>
<div class="uploder-container">
    <slot></slot>
    <input ref="input" type="file" accept="image/*" class="uploder-container-input" multiple >
</div>
</template>
<script>
import compress from './image';
import deepCopy from 'lodash.clonedeep';
import objectAssign from 'object-assign';
export default {
    name: 'uploader',
    props: {
        options: { // 其他参数
            type: Object,
            default: function() {
                return {}
            }
        },
        start: { // 当非自动上传的时候，如果此值传true，开始上传文件 (auto为false时)
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            fileList: [], // 存放待上传的文件列表
            fileID: 0, // 文件id
            _options: {}
        }
    },
    methods: {
        // 初始化参数
        initOptions() {
            let options = objectAssign({
                url: '', // url
                auto: true, //是否自动上传，默认自动上传
                compress: true, // 是否压缩，默认压缩
                type: 'file', // 类型
                fileVal: 'file', // 
                xhrFields: {}, //
                onBeforeQueued: this.noop, // 在选中之后，处理之前
                onQueued: this.noop, // 在处理之后，上传之前
                onBeforeSend: this.noop, // 上传之前

                onSuccess: this.noop, // 每一张成功
                onProgress: this.noop, // 进度
                onError: this.noop, // 错误
                onFinish: this.noop // 上传完成
            }, this.options);
            if(options.compress !== false){
                options.compress = objectAssign({
                    width: 1200,
                    height: 1200,
                    quality: 0.7
                }, options.compress);
            }
            this._options = options;
        },
        // 初始化各种回调
        init() {
            console.log(this._options);
            let self = this;
            this.$uploader = this.$refs.input; // input dom
            // 用户选择了图片
            this.$uploader.addEventListener('change', this.fileChangeHandler);
        },
        // 文件变动触发的函数
        fileChangeHandler(evt) {
            let self = this;            
            const files = evt.target.files;
            if (files.length === 0) { //没有文件
                return;
            }
            this.fileLength = files.length;
            // 不是压缩 且 选择的是file形式上传
            if(this._options.compress === false && this._options.type == 'file'){
                // 以原文件方式上传
                // 遍历所有上传的文件
                for(let i = 0; i < files.length; i++) {
                    let file = files[i];
                    file.id = this.createRandom();
                    // 文件被选择之后，上传处理之前
                    if(this.onBeforeQueued(file, files) === false) return;
                    this.setUploadFile(file, files);
                }
            }else{
                // base64上传 和 压缩上传
                for(let i = 0; i < files.length; i++) {
                    let file = files[i];
                    file.id = this.createRandom();

                    if(this.onBeforeQueued(file, files) === false) return;
                    
                    compress(file, self._options, (blob) => {
                        // console.log(blob);
                        if(blob) self.setUploadFile(blob, files);
                    });
                }
            }
            evt.target.value = '';
        },
        // 设置上传
        setUploadFile(file, files) {
            // console.log(file);
            try {
                const URL = window.URL || window.webkitURL || window.mozURL;
                file.url = URL.createObjectURL(file);
            } catch(error) {

            }
            file.status = 'ready';
            file.upload = () => {
                this.upload(objectAssign({
                    $uploader: this.$uploader,
                    file: file
                }, this._options));
            };
            file.stop = function(){
                this.xhr.abort();
            };
            this.fileList.push(file); // 往待上传的文件列表中添加文件
            this.onQueued(file, files);
            // console.log(this.fileList);
            if(this._options.auto) file.upload();
        },
        
        // 上传
        upload(options) {
            let self = this;
            const {url, file, fileVal, xhrFields, params} = options;
            const {name, type, lastModifiedDate} = file;
            const data = objectAssign({
                name: name,
                type: type,
                size: options.type == 'file' ? file.size : file.base64.length,
                lastModifiedDate: lastModifiedDate
            }, params);
            const headers = {};

            if(this.onBeforeSend(file, data, headers) === false) return;

            file.status = 'progress';

            this.onProgress(file, 0);

            const formData = new FormData();
            const xhr = new XMLHttpRequest();

            file.xhr = xhr;

            // 设置参数
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            if(options.type == 'file'){
                formData.append(fileVal, file, name);
            }else{
                formData.append(fileVal, file.base64);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        try {
                            // 只支持json
                            const ret = JSON.parse(xhr.responseText);
                            self.onSuccess(file, ret);
                        } catch (err) {
                            self.onError(file, err);
                        }
                    } else {
                        self.onError(file, new Error('XMLHttpRequest response status is ' + xhr.status));
                    }
                }
            };
            xhr.upload.addEventListener('progress', function (evt) {
                if(evt.total == 0) return;
                const percent = Math.round(evt.loaded / evt.total * 100);
                self.onProgress(file, percent);
            }, false);

            // xhr.withCredentials = true;
            xhr.open('POST', url);
            Object.keys(xhrFields).forEach((key) => {
                xhr[key] = xhrFields[key];
            });
            // 设置头部信息
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.send(formData);
        },
        // 手动出发上传操作
        startUpload() {
            this.fileList.forEach(file => {
                file.upload();
            });
        },
        // 根据id删除图片，不上传，idArr是数组，如[1213,123122]
        delFileById(idArr) {
            this.fileList.forEach((item, index)=> {
                let id = item.id;
                idArr.forEach(subItem => {
                    if (subItem === id) {
                        this.fileList.splice(index, 1);
                    }
                });
            });
        },
        // 生命周期系列
        // 文件被选择之后，处理之前
        onBeforeQueued(file, files) {
            let cb = this._options.onBeforeQueued;
            if (cb) {
                let isGoon = cb(file, files);
                if(isGoon === false) {
                    return false;
                }
            }
        },
        // 将图片加入到队列中去
        onQueued(file) {
            let cb = this._options.onQueued;            
            if (cb) {
                let isGoon = cb(file);
                if(isGoon === false) {
                    return false;
                }
            }
        },
        // 上传之前
        onBeforeSend(file, data, headers) {
            let cb = this._options.onBeforeSend;            
            if (cb) {
                let isGoon = cb(file, data, headers);
                if(isGoon === false) {
                    return false;
                }
            }
        },
        // 上传成功（每一张图）
        onSuccess(file, response) {
            let cb = this._options.onSuccess;            
            if (cb) {
                let isGoon = cb(file, response);
                file.status = 'success';
                this.fileLength--;
                // 上传成功，从fileList中删除
                this.fileList.forEach((item, index)=> {
                    if (item.id == file.id) {
                        this.fileList.splice(index, 1);
                    }
                });
                // console.log('onSuccess:===================:', this.fileList);
                // 上传完毕了
                if (this.fileLength <= 0) {
                    this.onFinish(file);
                }
                if(isGoon === false) {
                    return false;
                }
            }
        },
        // 上传完成
        onFinish(file) {
            let cb = this._options.onFinish;            
            if (cb) {
                let isGoon = cb(file);
                file.status = 'finish';
                if(isGoon === false) {
                    return false;
                }
            }
        },
        // 进度
        onProgress(file, percent) {
            let cb = this._options.onProgress;            
            if (cb) {
                let isGoon = cb(file, percent);
                file.status = 'progress';
                if(isGoon === false) {
                    return false;
                }
            }
        },
        onError(file, err) {
            let cb = this._options.onError;            
            if (cb) {
                let isGoon = cb(file, err);
                file.status = 'fail';
                if(isGoon === false) {
                    return false;
                }
            }
        },
        noop() {},
        createRandom() {
            return parseInt(Math.random() * 10e8) + new Date().getTime();
        }
    },
    mounted() {
        this.fileList = []; // 存放待上传的文件列表
        this.$nextTick(function() {
            this.initOptions();
            this.init();
        });
    },
    watch: {
        start(val) {
            if (val) {
                this.startUpload();
                this.$emit('update:start', false);
            }
        }
    }
}
</script>