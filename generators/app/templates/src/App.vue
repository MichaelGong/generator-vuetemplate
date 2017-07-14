<style lang="scss" scoped>
.router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .1s;
}
.router-fade-enter, .router-fade-leave-active {
    opacity: 0;
}
</style>
<template>
    <div id="app">
        <keep-alive>
            <router-view class="routerContainer"></router-view>
        </keep-alive>
    </div>
</template>
<script>

export default {
    name: 'app',
    data() {
        return {
            enterActive: 'ani left2right for-ani-route',
            leaveActive: 'ani right2out',
        }
    },
    computed:{
        
    },
    methods: {

    }
}
</script>
