import Vue from 'vue'
import VueRouter from 'vue-router'
import MSite from '../pages/MSite/MSite.vue'
import Order from '../pages/Order/Order.vue'
import Proflie from '../pages/Proflie/Proflie.vue'
import Search from '../pages/Search/Search.vue'

import Shop from '../pages/Shop/Shop.vue'
import ShopGood from '../pages/Shop/ShopGood/ShopGood.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'
import ShopRate from '../pages/Shop/ShopRate/ShopRate.vue'

import Login from '../pages/Login.vue'


//
Vue.use(VueRouter)

export default new VueRouter({
    //
    routes: [
        {
            path:'/msite',
            component:MSite,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/order',
            component:Order,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/proflie',
            component:Proflie,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/search',
            component:Search,
            meta: {
                showFooter: true
            }
        },
        {
            path:'/login',
            component:Login
        },
        {
            path:'/',
            redirect:'/msite'
        },
        {
            path:'/shop',
            component:Shop,
            children:[
                {
                    path:'/shop/good',
                    component:ShopGood,                
                },
                {
                    path:'/shop/info',
                    component:ShopInfo,                
                },
                {
                    path:'/shop/rate',
                    component:ShopRate,                
                },
                {
                    path:'',
                    redirect:'/shop/good'
                },        
            ]
        }
    ]
})
