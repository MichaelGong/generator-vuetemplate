<style lang="scss">
@import "../../../assets/css/mix.scss";

.closetconfirm-pop {
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    transition: all .2s;
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
        position: relative;
        z-index: 20;
        padding: px2rem(40); 
        max-height: 70%;
        overflow-y: auto;
        .confirm-pop-title {
            font-size: 16px;
            color: #3D3F52;
            text-align: center;
            font-weight: 600;
            line-height: 1;
        }
        .confirm-pop-subTitle {
            font-size: 12px;
            color: #999BAA;
            text-align: center;
            margin: px2rem(20) 0;
        }
        .confirm-pop-content {
            font-size: 12px;
            color: #3D3F52;
            line-height: 1.6;
            text-align: left;
            margin-top: px2rem(16);
        }
    }
}

</style>
<template>
<transition name="confirm-ani">
    <section class="closetconfirm-pop" v-show="isShow">
        <div class="confirm-pop-container abs-full flex flex-h-c flex-v-c">
            <div class="confirm-pop-bg abs-full" @click="close"></div>
            <div class="confirm-pop-main">
                <div class="confirm-pop-title" :class="[ titleClass ]" v-if="title">{{title}}</div>
                <div class="confirm-pop-subTitle" :class="[ subTitleClass ]" v-if="subTitle" v-html="subTitle"></div>                    
                <div class="confirm-pop-content" :class="[ contentClass ]" v-html="content"></div>
            </div>
        </div>
    </section>
</transition>

</template>
<script>
export default {
    name: 'closetConfirm',
    props: {
        isShow: {
            type: Boolean,
        },
        title: { // 标题
            type: String
        },
        titleClass: { // 标题的class
            type: String
        },
        subTitle: { // 副标题
            type: String
        },
        subTitleClass: { // 副标题添加的class
            type: String,
            default: ''
        },
        content: { // 提示内容，会以html形式插入
            type: String
        },
        contentClass: { // 提示内容添加的class
            type: String,
            default: ''
        },
        confirmFunc: { // 确认回调
            type: Function
        }
    },
    methods: {
        // 关闭
        close() {
            this.hideCallback();
            this.confirmFunc && this.confirmFunc();
        }
    }
}
</script>