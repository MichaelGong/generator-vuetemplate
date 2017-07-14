<style lang="scss" scoped>
@import "../../assets/css/mix.scss";
.index {    
    height: 100%;
    min-height: 100%;
    padding: 5px;
    .btn {
        padding: 8px 10px;
        font-size: 14px;
        display: inline-block;
        background-color: #2ecc71;
        color:#fff;
        border-radius: 3px;
        position: relative;
        margin-top: 10px;
    }
    .z-2000 {
        z-index: 2000;
    }
}
</style>
<template>
<section class="index">
    test
    <div>
        <div class="btn" @click="toggleLoading(1)">点击展示loading</div>
        <div class="btn z-2000" @click="toggleLoading(0)">点击关闭loading</div>
    </div>
    <div>
        <div class="btn" @click="toggleToast">点击展示toast</div>
    </div>
    <div>
        <div class="btn" @click="toggleConfirm">展示弹出框</div>   
    </div>
    <div>
        <div class="btn" @click="toggleClosetConfirm">展示点击空白区域消失的弹出框</div>
    </div>
</section>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
export default {
    name: 'test',
    data() {
        return {
            chooseState: "index",
            bannerList: [],
            departments:[]
        };
    },
    computed:{

    },
    components:{
                
    },
    methods: {
        toggleLoading(type) {
            if (type == 1) {
                this.$loading.show();
            } else {
                this.$loading.close();
            }
        },
        toggleConfirm() {
            this.$confirm.show({
                title: '啊哈哈', // 弹出框title，不传默认没有title
                content: '<div style="color:red">呵呵呵</div>', // 弹出框需要展示的文字内容，支持html和 字符串
                contentClass: 'cc', // content需要添加class，默认空
                cancelText: '你猜', // 取消按钮的文字,默认：取消
                cancelClass: 'cancelClass', // 取消按钮的class，默认空
                cancelFunc: function() { // 取消按钮的回调，可不传
                    alert('取消回调')
                },
                confirmText: '你再猜', // 确定按钮的文字，默认：确定，默认空
                confirmClass: 'confirmClass', // 确定按钮需要添加的class，默认空
                confirmFunc: function() { // 确定按钮的回调
                    alert('确认回调')                    
                },
                singleBtn: false // 默认false（展示两个按钮），是否只展示一个按钮，如果此值为true，只展示一个按钮，该按钮对应确定按钮指定的功能
            });
        },
        toggleToast() {
            // api 参数同：http://mint-ui.github.io/docs/#/zh-cn2/toast
            this.$toast('toast信息展示');
        },
        toggleClosetConfirm() {
            this.$closetConfirm.show({
                title: '标题（文字）',
                titleClass: '标题需要添加的class',
                subTitle: '子标题（html或文字）',
                subTitleClass: '子标题需要添加的class',
                content: '要显示的主体内容（html或文字）',
                contentClass: '主体内容需要添加的class',
                confirmFunc: function() {
                    console.log('空白区域回调');
                }
            });
        }
    },
    created(){
 
    }
}
</script>