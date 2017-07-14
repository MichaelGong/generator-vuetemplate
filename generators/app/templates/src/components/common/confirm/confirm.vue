<style lang="scss">
@import "../../../assets/css/mix.scss";

.confirm-pop {
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    transition: all .2s;
    z-index: 500;
    .abs-full {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .confirm-pop-bg {
        background: rgba(56,57,63,0.70);
        transition: all .2s;
        opacity: 1;    
    }
    .confirm-pop-container {
        
    }
    .confirm-pop-main {
        width: px2rem(540);
        background: #fff;
        border-radius: px2rem(20);
        overflow: hidden;
        margin-bottom: px2rem(60);
        transition: all .2s;        
        .confirm-pop-header {
            padding: px2rem(40);
        }
        .confirm-pop-title {
            font-size: 16px;
            color: #3D3F52;
            text-align: center;
            font-weight: 600;
            line-height: 1;
        }
        .confirm-pop-content {
            font-size: 14px;
            color: #3D3F52;
            line-height: 1.5;
            text-align: center;
            margin-top: px2rem(16);
        }
        .confirm-pop-footer {
            position: relative;
            width: 100%;
            height: px2rem(88);
            line-height: px2rem(88);
            @include one-top(#E3E5E9);
            .confirm-pop-btn {
                position: relative;
                flex: 1;
                text-align: center;
                font-size: 16px;
                height: 100%;
                color: #3D3F52;
                font-weight: 600;
                &.blue {
                    color: #2A83E1;
                }
                &.confirm-pop-btn-border {
                    @include one-left(#E3E5E9);
                }
            }
        }
    }
}
.confirm-ani-enter {
    .confirm-pop-main {
        opacity: 0;
        transform: scale(0.7);
    }
    .confirm-pop-bg {
        opacity: 0;
    }
}
.confirm-ani-leave-active {
    .confirm-pop-main {
        opacity: 0;
        transform: scale(0.8);
    }
    .confirm-pop-bg {
        opacity: 0;
    }
}
</style>
<template>
<transition name="confirm-ani">
    <section class="confirm-pop" v-show="isShow">
        <div class="confirm-pop-bg abs-full"></div>
        <div class="confirm-pop-container abs-full flex flex-h-c flex-v-c">
            <div class="confirm-pop-main">
                <div class="confirm-pop-header">
                    <div class="confirm-pop-title" v-if="title">{{title}}</div>
                    <div class="confirm-pop-content" :class="[ contentClass ]" v-html="content"></div>
                </div>
                <div class="confirm-pop-footer flex flex-v-c">
                    <div class="confirm-pop-btn"
                        v-if="!singleBtn"
                        :class="[ cancelClass ]"
                        @click="btnActionHandle('cancel')"
                    >{{cancelText}}</div>
                    <div class="confirm-pop-btn blue" 
                        :class="[{'confirm-pop-btn-border': !singleBtn}, cancelClass]"
                        @click="btnActionHandle('confirm')"
                    >{{confirmText}}</div>                
                </div>
            </div>
        </div>
    </section>
</transition>

</template>
<script>
export default {
    name: 'confirm',
    props: {
        isShow: {
            type: Boolean,
        },
        title: { // 标题
            type: String
        },
        content: { // 提示内容，会以html形式插入
            type: String
        },
        contentClass: { // 提示内容添加的class
            type: String,
            default: ''
        },
        cancelText: { // 取消文字， 默认：‘取消’
            type: String,
            default: '取消'
        },
        cancelFunc: { // 取消回调
            type: Function
        },
        cancelClass: { // 取消按钮需要添加的clsss
            type: String,
            default: ''
        },
        confirmText: { // 确定文字，默认：‘确认’
            type: String,
            default: '确认'
        },
        confirmFunc: { // 确认回调
            type: Function
        },
        confirmClass: { // 确定按钮需要添加的clsss
            type: String,
            default: ''
        },
        singleBtn: { // 是否只展示一个按钮，如果只展示一个按钮对应的应该是 confirmText 和 confirmFunc
            type: Boolean,
            default: false
        }
    },
    methods: {
        btnActionHandle(type) {
            this.hideCallback();
            if (type == 'confirm'){
                this.confirmFunc && this.confirmFunc();
            } else {
                this.cancelFunc && this.cancelFunc();
            }
        }
    }
}
</script>