/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const businessRouter = {
  path: '/business',
  component: Layout,
  redirect: 'noredirect',
  meta: {
    title: 'business',
    icon: 'bank',
    role: ['kuyuplat:operator:search', 'kuyuplat:card:imeiReRecordFind', 'kuyuplat:package:search', 'kuyuplat:worklist:search',
      'kuyuplat:addpackage:search', 'kuyuplat:excel:ratePlanCommit', 'kuyuplat:cardTv:cardTvFind',
      'kuyuplat:ratePlan:export', 'kuyuplat:card:getAddPackage', 'kuyuplat:cardSimstate:find', 'kuyuplat:hunan:find',
      'kuyuplat:cardReplace:search', 'kuyuplat:cardChange:search', 'kuyuplat:worklist:search']
  },
  children: [
    {
      path: 'supplier',
      component: () => import('@/views/business/supplier'),
      name: 'Supplier',
      meta: { title: 'supplier', roles: ['kuyuplat:operator:search'] }
    },
    // {
    //   path: 'rules',
    //   component: () => import('@/views/business/rules'),
    //   name: 'Rules',
    //   meta: { title: '规则管理', roles: ['common'] },
    //   hidden: true
    // },
    {
      path: 'accounts',
      component: () => import('@/views/business/accounts'),
      name: 'Accounts',
      meta: { title: '账号管理', roles: ['kuyuplat:account:search'] },
      hidden: true
    },
    {
      path: 'package',
      component: () => import('@/views/business/package'),
      name: 'Package',
      meta: { title: 'package', roles: ['kuyuplat:package:search'] }
    },
    {
      path: 'CardPackage',
      component: () => import('@/views/business/cardPackage'),
      name: 'CardPackage',
      meta: { title: '套餐价格', roles: ['kuyuplat:packagePrice:search'] },
      hidden: true
    },
    {
      path: 'addPackageMore',
      component: () => import('@/views/business/addPackageMore'),
      name: 'AddPackageMore',
      meta: { title: '批量添加套餐', roles: ['kuyuplat:packageBatch:save'] },
      hidden: true
    },
    {
      path: 'updatePackageMore',
      component: () => import('@/views/business/updatePackageMore'),
      name: 'UpdatePackageMore',
      meta: { title: '批量修改套餐', roles: ['kuyuplat:packageBatch:update'] },
      hidden: true
    },
    {
      path: 'flowInfo',
      component: () => import('@/views/business/getInfo'),
      meta: { title: 'flowInfo', roles: ['kuyuplat:card:getAddPackage'] },
      name: 'FlowInfo'
    },
    {
      path: 'orderPackage',
      component: () => import('@/views/business/orderPackage'),
      name: 'OrderPackage',
      meta: { title: 'orderPackage', roles: ['kuyuplat:addpackage:search'] }
    },
    {
      path: 'orderPackageMore',
      component: () => import('@/views/business/orderMore'),
      meta: { title: 'orderPackageMore', roles: ['kuyuplat:platform:order'] },
      name: 'OrderPackageMore',
      hidden: true
    },
    {
      path: 'stopReset',
      component: () => import('@/views/business/stopReset'),
      name: 'StopReset',
      meta: { title: 'stopReset', roles: ['kuyuplat:cardSimstate:find'] }
    },
    {
      path: 'stopAbnormal',
      component: () => import('@/views/business/stopAbnormal'),
      name: 'StopAbnormal',
      meta: { title: '卡片异常停机', roles: ['kuyuplat:cardActionException:search'] },
      hidden: true
    },
    {
      path: 'changeCard',
      component: () => import('@/views/business/changeCard'),
      name: 'ChangeCard',
      meta: { title: 'changeCard', roles: ['kuyuplat:cardReplace:search'] }
    },
    {
      path: 'changeCardMore',
      component: () => import('@/views/business/changeCardMore'),
      name: 'ChangeCardMore',
      meta: { title: '换卡批量操作', roles: ['kuyuplat:excel:excelUpdateExpressInfo'] },
      hidden: true
    },
    {
      path: 'changePackage',
      component: () => import('@/views/business/changePackage'),
      name: 'ChangePackage',
      meta: { title: 'changePackage', roles: ['kuyuplat:cardChange:search'] }
    },
    {
      path: 'changePackageAction',
      component: () => import('@/views/business/changePackageAction'),
      meta: { title: 'changePackageAction', roles: ['kuyuplat:card:change'] },
      name: 'ChangePackageAction',
      hidden: true
    },
    {
      path: 'unbind',
      component: () => import('@/views/business/unbind'),
      name: 'Unbind',
      meta: { title: 'unbind', roles: ['kuyuplat:card:imeiReRecordFind'] }
    },
    {
      path: 'unbindAction',
      component: () => import('@/views/business/unbindAction'),
      meta: { title: 'unbindAction', roles: ['kuyuplat:card:imeiReRecord'] },
      name: 'UnbindAction',
      hidden: true
    },
    {
      path: 'workOrder',
      component: () => import('@/views/business/orderWork'),
      name: 'WorkOrder',
      meta: { title: 'workOrder', roles: ['kuyuplat:worklist:search'] }
    },
    {
      path: 'orderWorkProblems',
      component: () => import('@/views/business/orderWorkProblems'),
      meta: { title: '工单问题列表', roles: ['kuyuplat:problem:list'] },
      name: 'OrderWorkProblems',
      hidden: true
    },
    {
      path: 'active',
      component: () => import('@/views/business/active'),
      meta: { title: 'active', roles: ['kuyuplat:seckill:find'] },
      name: 'Active'
    },
    {
      path: 'activeDetails',
      component: () => import('@/views/business/activeDetails'),
      meta: { title: '活动详情', roles: ['kuyuplat:seckill:find'] },
      name: 'ActiveDetails',
      hidden: true
    },
    {
      path: 'cuccRatePlan',
      component: () => import('@/views/business/cuccRatePlan'),
      meta: { title: '联通资费计划', roles: ['kuyuplat:ratePlan:commit', 'kuyuplat:ratePlan:export', 'kuyuplat:excel:ratePlanCommit'] },
      name: 'CuccRatePlan'
    },
    {
      path: 'hunanList',
      component: () => import('@/views/business/hunanList'),
      meta: { title: 'hunanList', roles: ['kuyuplat:hunan:find'] },
      name: 'HunanList'
    },
    {
      path: 'cardTv',
      component: () => import('@/views/business/cardTv'),
      meta: { title: '影视卡管理', roles: ['kuyuplat:cardTv:cardTvFind'] },
      name: 'CardTv'
    },
    {
      path: 'cardTvAdd',
      component: () => import('@/views/business/cardTvAdd'),
      meta: { title: '影视卡导入', roles: ['kuyuplat:excel:cardTvBatchAdd'] },
      name: 'CardTvAdd',
      hidden: true
    }
  ]
}

export default businessRouter
