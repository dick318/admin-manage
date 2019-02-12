/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const cardRouter = {
  path: '/card',
  component: Layout,
  name: 'card',
  redirect: 'noredirect',
  meta: { title: 'card', icon: 'card',
    roles: ['kuyuplat:card:find', 'kuyuplat:card:getCardReal', 'kuyuplat:pool:find', 'kuyuplat:card:getCardMoney']
  },
  children: [
    {
      path: 'manage',
      name: 'CardManage',
      component: () => import('@/views/card/index'),
      meta: { title: 'cardManage', roles: ['kuyuplat:card:find'] }
    },
    {
      path: 'cardDetail',
      name: 'CardDetail',
      component: () => import('@/views/card/cardDetail'),
      meta: { title: '卡片详情', roles: ['kuyuplat:card:find'] },
      hidden: true
    },
    {
      path: 'detail',
      name: 'Detail',
      component: () => import('@/views/card/Detail'),
      meta: { title: '卡片资料',
        roles: [
          'kuyuplat:card:find', 'kuyuplat:card:getCardMoney', 'kuyuplat:card:imeiReRecordFind', 'kuyuplat:card:getAddPackage',
          'kuyuplat:addpackage:search', 'kuyuplat:cardSimstate:find', 'kuyuplat:order:search'
        ] },
      hidden: true
    },
    {
      path: 'autonym',
      component: () => import('@/views/card/autonym'),
      name: 'AutonymCard',
      meta: { title: 'autonymCard', roles: ['kuyuplat:card:getCardReal'] }
    },

    {
      path: 'AutonymMore',
      component: () => import('@/views/card/autonymMore'),
      meta: { title: '批量实名认证', roles: ['kuyuplat:cardReal:batchAddCardReal'] },
      name: 'AutonymMore',
      hidden: true
    },
    {
      path: 'autonymDetails',
      component: () => import('@/views/card/autonymDetails'),
      meta: { title: '实名认证详情', roles: ['kuyuplat:card:getCardReal'] },
      name: 'AutonymDetails',
      hidden: true
    },
    {
      path: 'autonymExport',
      component: () => import('@/views/card/autonymExport'),
      meta: { title: '实名认证导出', roles: ['kuyuplat:excel:exportCardReal', 'kuyuplat:cardReal:exportCardReal'] },
      name: 'AutonymExport',
      hidden: true
    },

    {
      path: 'poolDayDetail',
      component: () => import('@/views/card/poolDayDetail'),
      name: 'PoolDayDetail',
      meta: { title: 'poolDayDetail', roles: ['kuyuplat:pool:find'] }
    },
    // {
    //   path: 'poolHistory',
    //   component: () => import('@/views/card/poolHistory'),
    //   name: 'PoolHistory',
    //   meta: { title: '流量池历史', roles: ['common'] },
    //   hidden: true
    // },
    {
      path: 'add',
      component: () => import('@/views/card/add'),
      meta: { title: '导入卡片', roles: ['kuyuplat:excel:batchCardAdd'] },
      name: 'AddCard',
      hidden: true
    },
    {
      path: 'singleCutNet',
      component: () => import('@/views/card/singleCutNet'),
      meta: { title: '批量断复网', roles: ['kuyuplat:excel:batchSingleCutNet'] },
      name: 'SingleCutNet',
      hidden: true
    },
    {
      path: 'rechargeList',
      component: () => import('@/views/card/rechargeList'),
      meta: { title: '卡片余额记录', roles: ['kuyuplat:card:getCardMoney'] },
      name: 'RechargeList'
    },
    {
      path: 'divide',
      component: () => import('@/views/card/divide'),
      meta: { title: '分卡', roles: ['kuyuplat:excel:batchCardDivide'] },
      name: 'DivideCard',
      hidden: true
    },
    {
      path: 'recharge',
      name: 'RechargeCard',
      component: () => import('@/views/card/recharge'),
      meta: { title: '卡片充值', roles: ['kuyuplat:excel:batchUpdateCardMoney'] },
      hidden: true
    },
    {
      path: 'edit',
      name: 'EditCard',
      component: () => import('@/views/card/edit'),
      meta: { title: '卡片修改', roles: ['kuyuplat:excel:cardBatchUpdate'] },
      hidden: true
    },
    {
      path: 'speed',
      name: 'SpeedCard',
      component: () => import('@/views/card/speed'),
      meta: { title: '卡片限速', roles: ['kuyuplat:excel:editNetworkAccess'] },
      hidden: true
    },
    {
      path: 'delete',
      name: 'DeleteCard',
      component: () => import('@/views/card/delete'),
      meta: { title: '卡片删除', roles: ['kuyuplat:excel:batchCardDelete'] },
      hidden: true
    },
    {
      path: 'back',
      name: 'BackCard',
      component: () => import('@/views/card/back'),
      meta: { title: '卡片回收', roles: ['kuyuplat:excel:batchCardBack'] },
      hidden: true
    },
    {
      path: 'active',
      name: 'ActiveCard',
      component: () => import('@/views/card/active'),
      meta: { title: '卡片激活', roles: ['kuyuplat:excel:batchActivate', 'kuyuplat:card:batchActivate'] },
      hidden: true
    },
    {
      path: 'activeCtcc',
      name: 'ActiveCtcc',
      component: () => import('@/views/card/activeCtcc'),
      meta: { title: '电信卡激活', roles: ['kuyuplat:card:active'] },
      hidden: true
    },
    {
      path: 'change',
      name: 'ChangeCardAction',
      component: () => import('@/views/card/change'),
      meta: { title: '换卡', roles: ['kuyuplat:excel:cardChange'] },
      hidden: true
    },
    {
      path: 'flowDetail',
      name: 'FlowDetail',
      component: () => import('@/views/card/FlowDetail'),
      meta: { title: '流量明细', roles: ['kuyuplat:flowdetail:find'] },
      hidden: true
    }
  ]
}

export default cardRouter
