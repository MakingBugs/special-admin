import Vue from 'vue'
import App from '@/App'
import store from '@/store/index'
import router from '@/router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

import axios from './config/httpConfig'
import * as globalFilter from './filters/filters'
import '@/icons'
import md5 from 'js-md5'

// import BaiduMap from 'vue-baidu-map'
// Vue.use(BaiduMap, {ak: '1h2SG7dVHEku02WcNfxNXLegWxtKVKOG'});

//打印
import Print from 'vue-print-nb'
Vue.use(Print);

Vue.prototype.$http = axios
Vue.prototype.$md5 = md5;
for (var key in globalFilter) {
    Vue.filter(key, globalFilter[key])
}

Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (!store.state.UserToken) {
        if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
            next()
        } else {
            next({ path: '/login' })
        }
    } else {
        if (!store.state.permission.permissionList) {
            store.dispatch('permission/FETCH_PERMISSION').then(() => {
                next({ path: to.path })
            })
        } else {
            if (to.path !== '/login') {
                next()
            } else {
                next(from.fullPath)
            }
        }
    }
})

router.afterEach((to, from, next) => {
    var routerList = to.matched
    store.commit('setCrumbList', routerList)
    store.commit('currentId', to.meta.id)
    store.commit('permission/SET_CURRENT_MENU', to.name)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    data: function () {
        return {
            OSSURL: 'https://carplus-oss.oss-cn-hangzhou.aliyuncs.com/'
        }
    }, 
    router,
    store,
    render: h => h(App)
})
