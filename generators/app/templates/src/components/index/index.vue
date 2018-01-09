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
}
</style>
<template>
<section class="index">
    首页 {{projectName}}
    <div>
        <div class="btn" @click="goTest">查看公用组件api</div>
    </div>
</section>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
export default {
    name: 'index',
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
        goTest() {
            this.$router.push({ name: 'test'});
        }
    },
    created(){
 
    }
}
</script>