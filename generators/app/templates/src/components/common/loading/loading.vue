<style lang="scss">
@import "../../../assets/css/mix.scss";

#diyLoading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 1800;
    .loading-inner {
        width: px2remN(50);
        height: px2remN(50);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-image: url(../../../assets/img/jd_loading.gif);
        background-size: px2remN(50);
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1500;
    }
    .loading-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0);
        z-index: 1400;
    }
}
</style>
<template>
    <div id="diyLoading" v-show="isShow">
        <div class="loading-bg"></div>
        <div class="loading-inner"></div>
    </div>
</template>
<script>
    export default {
        name: 'Loading',
        props: ['isShow']
    }    
</script>