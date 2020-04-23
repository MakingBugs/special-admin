import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login/login'
import NotFound from '@/pages/errorPage/404'
import Forbidden from '@/pages/errorPage/403'
import Layout from '@/pages/layout/index'
import Home from '@/pages/home/index'
import Scheduling from '@/pages/order/schedule/scheduling'
import BuildOrder from '@/pages/order/build-order'
import operationLog from '@/pages/operation/operationLog'
Vue.use(Router)

/* 初始路由 */
export default new Router({
    routes: [
        {
            path: '/login',
            component: Login
        },       
    ]
})
export const DynamicRoutes = [
    {
        path: '/',
        component: Layout,
        name: 'home',
        redirect: 'home',
        meta: {
            requiresAuth: true,
            name: '首页'
        },
        children: [
            {
                path: 'home',
                component: Home,
                name: 'home',
                meta: {
                    name: '首页',
                    icon: 'tree'
                }
            }
        ]
    },
    // {
    //     path: '/',
    //     component: Layout,
    //     name: 'home',
    //     alwaysShow: true,
    //     meta: {
    //         requiresAuth: true,
    //         name: '公司管理'
    //     },
    //     children: [
    //         {
    //             path: '/home',
    //             component: Home,
    //             name: '/company/station',
    //             meta: {
    //                 name: '据点管理',
    //                 icon: 'tree'
    //             }
    //         }
    //     ]
    // },
    {
        path: '/order/schedule',
        component: Layout,
        name:'scheduling',
        children: [
            {
                path: 'scheduling',
                name: '/order/schedule',
                component: Scheduling,
                meta: {
                    name: '司机派班',
                }
            }
        ]
    },{
        path: '/order',
        component: Layout,
        name:'/order/list',
        meta: {name: '订单管理'},
        children: [{
            path: '/order/build-order/:id?',
            name: '/order/list',
            component: BuildOrder,
            meta: {name: '下单'}
        }]
    },{
        path: '/strategy/dynamicDiscount',
        component: Layout,
        meta: {name: '策略管理'},
        children: [{
            path: '/operation/operationLog/:id?',
            name: 'dynamicDiscount',
            component: operationLog,
            meta: {name: '操作日志'},
        }]
    }, 
    {
        path: '/403',
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
]
