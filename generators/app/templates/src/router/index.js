import Vue from 'vue';
import VueRouter from 'vue-router';
import { setTitle } from '../util';

Vue.use(VueRouter);
// 首页
const index = r => require.ensure([], () => r(require('../components/index')), 'index');
// test
const test = r => require.ensure([], () => r(require('../components/test')),'test')

const router = new VueRouter({
    routes: [{
        path: '/',
        name: 'index',
        meta: {
            title: '首页'
        },
        component: index,
    },{
        path: '/test',
        name: 'test',
        meta: {
            title: 'test'
        },
        component: test,
    },{
        path: '*', //其他页面
        redirect: '/'
    }],
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});

router.beforeEach((to, from, next) => {
    setTitle(to.matched[to.matched.length - 1].meta.title||'');
    next();
});

export default router;