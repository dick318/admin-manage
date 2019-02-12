import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
/* Router Modules */
import dashboardRouter from './modules/dashboard'
import agentRouter from './modules/agent'
import cardRouter from './modules/card'
import businessRouter from './modules/business'
import financeRouter from './modules/finance'
import otherRouter from './modules/other'
import vpdnRouter from './modules/vpdn'
import batchRouter from './modules/batch'
import mobileRouter from './modules/mobile'
import developmentRouter from './modules/development'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  dashboardRouter,
  mobileRouter,
  agentRouter,
  cardRouter,
  businessRouter,
  financeRouter,
  batchRouter,
  developmentRouter,
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        component: () => import('@/views/mobile/home'),
        name: 'home',
        meta: { title: '首页', roles: ['kuyuplat:analyzer:payinfo', 'kuyuplat:analyzer:cardoper', 'kuyuplat:analyzer:cardstatus', 'kuyuplat:analyzer:actinfo', 'uyuplat:notice:search',
          'kuyuplat:analyzer:actinfo', 'kuyuplat:analyzer:paydayinfo', 'kuyuplat:analyzer:agentinfo', 'kuyuplat:analyzer:wxinfo', 'kuyuplat:analyzer:wxdayinfo'], noCache: true }
      }
    ],
    hidden: true
  },
  {
    path: '/operateList',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/business/operateList'),
        name: 'OperateList',
        meta: { title: 'operateList', roles: ['kuyuplat:work:search'], noCache: true }
      }
    ],
    hidden: true
  },
  {
    path: '/weChat',
    name: 'WeChat',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'weChat',
      icon: 'wechat',
      roles: [
        'kuyuplat:wx:getcfg', 'kuyuplat:menu:list', 'kuyuplat:autoreply:list', 'kuyuplat:fansinfo:list',
        'kuyuplat:excel:sendMessage', 'kuyuplat:weixin:sendMessage', 'kuyuplat:weixin:modelFind'
      ]
    },
    children: [
      {
        path: 'setting',
        component: () => import('@/views/weChat/setting'),
        name: 'WeChatSetting',
        meta: { title: 'weChatSetting', roles: ['kuyuplat:wx:getcfg'] }
      },
      {
        path: 'menu',
        component: () => import('@/views/weChat/menu'),
        name: 'WeChatMenu',
        meta: { title: 'weChatMenu', roles: ['kuyuplat:menu:list'] }
      },
      {
        path: 'keyWord',
        component: () => import('@/views/weChat/keyWord'),
        name: 'WeChatKeyWord',
        meta: { title: 'weChatKeyWord', roles: ['kuyuplat:autoreply:list'] }
      },
      {
        path: 'keyWordDetails',
        component: () => import('@/views/weChat/keyWordDetails'),
        name: 'KeyWordDetails',
        meta: { title: '图文回复', roles: ['kuyuplat:autoreply:list'] },
        hidden: true
      },
      {
        path: 'fans',
        component: () => import('@/views/weChat/fans'),
        name: 'WeChatFans',
        meta: { title: 'weChatFans', roles: ['kuyuplat:fansinfo:list'] }
      },
      {
        path: 'sendWechat',
        component: () => import('@/views/weChat/sendWechat'),
        name: 'SendWechat',
        meta: { title: 'sendWechat', roles: ['kuyuplat:excel:sendMessage', 'kuyuplat:weixin:sendMessage'] }
      },
      {
        path: 'wechatModel',
        component: () => import('@/views/weChat/wechatModel'),
        name: 'WechatModel',
        meta: { title: '微信消息模版', roles: ['kuyuplat:weixin:modelFind'] }
      }
    ]
  },

  {
    path: '/sms',
    component: Layout,
    name: 'sms',
    redirect: 'noredirect',
    meta: {
      title: 'sms',
      icon: 'email',
      roles: ['kuyuplat:sms:list', 'kuyuplat:instruct:list']
    },
    children: [
      {
        path: 'instruct',
        component: () => import('@/views/sms/instruct'),
        name: 'SmsCommand',
        meta: { title: 'smsCommand', roles: ['kuyuplat:sms:list'] }
      },
      {
        path: 'list',
        component: () => import('@/views/sms/list'),
        name: 'SmsManage',
        meta: { title: 'smsManage', roles: ['kuyuplat:instruct:list'] }
      }
    ]
  },
  vpdnRouter,
  {
    path: '/hardware',
    component: Layout,
    redirect: 'noredirect',
    name: 'hardware',
    meta: {
      title: 'hardware',
      icon: 'window-restore',
      roles: [
        'kuyuplat:mifi:list'
      ]
    },
    children: [
      {
        path: 'mifi',
        component: () => import('@/views/hardware/mifi'),
        name: 'HardwareMifi',
        meta: { title: 'hardwareMifi', icon: 'hardware', roles: ['kuyuplat:mifi:list'] }
      }
    ]
  },
  otherRouter,

  // {
  //   path: '/guide',
  //   component: Layout,
  //   name: 'guide',
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'guide',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'question' }
  //     },
  //     {
  //       path: '/nouns',
  //       component: () => import('@/views/guide/nouns'),
  //       name: 'Nouns',
  //       meta: { title: 'nouns' },
  //       hidden: true
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
