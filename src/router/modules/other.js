/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const otherRouter = {
  path: '/other',
  component: Layout,
  name: 'other',
  redirect: 'noredirect',
  meta: {
    icon: 'cogs',
    title: 'other',
    roles: ['kuyuplat:operatorAccount:search', 'kuyuplat:obtain:find', 'kuyuplat:notice:search', 'kuyuplat:user:search', 'agent.update']
  },
  children: [

    {
      path: 'upstreamSupplier',
      component: () => import('@/views/other/upstreamSupplier'),
      name: 'UpstreamSupplier',
      meta: { title: 'upstreamSupplier', roles: ['kuyuplat:operatorAccount:search'] }
    },
    {
      path: 'generalize',
      component: () => import('@/views/other/generalize'),
      name: 'Generalize',
      meta: { title: 'generalize', roles: ['kuyuplat:obtain:find'] }
    },
    {
      path: 'netStand',
      component: () => import('@/views/other/netStand'),
      name: 'NetStand',
      meta: { title: '营业网点', roles: ['kuyuplat:netStand:find'] }
    },
    {
      path: 'netStandDetails',
      component: () => import('@/views/other/netStandDetails'),
      meta: { title: '营业网点详情', roles: ['kuyuplat:netStand:find'] },
      name: 'NetStandDetails',
      hidden: true
    },
    {
      path: 'generalizeMore',
      component: () => import('@/views/other/generalizeMore'),
      name: 'GeneralizeMore',
      meta: { title: '推广导入', roles: ['kuyuplat:excel:obtainBatchUpdate'] },
      hidden: true
    },
    {
      path: '/noticeList',
      component: () => import('@/views/dashboard/noticeList'),
      name: 'NoticeList',
      meta: { title: 'noticeList', roles: ['kuyuplat:notice:search'] }
    },
    {
      path: '/notice',
      component: () => import('@/views/dashboard/notice'),
      name: 'Notice',
      meta: { title: 'notice', roles: ['kuyuplat:notice:search'] },
      hidden: true
    },
    {
      path: '/noticeDetails',
      component: () => import('@/views/dashboard/noticeDetails'),
      name: 'NoticeDetails',
      meta: { title: '公告编辑', roles: ['kuyuplat:notice:save', 'kuyuplat:notice:update'] },
      hidden: true
    },
    // {
    //   path: 'export',
    //   component: () => import('@/views/setting/index'),
    //   name: 'Export',
    //   meta: { title: 'export', roles: ['common'] }
    // },
    {
      path: 'jurisdiction',
      component: () => import('@/views/role/jurisdiction'),
      name: 'Jurisdiction',
      meta: { title: 'jurisdiction', roles: ['kuyuplat:user:search'] }
    },
    {
      path: 'operateRecords',
      component: () => import('@/views/other/operateRecords'),
      name: 'OperateRecords',
      meta: { title: '敏感记录', roles: ['kuyuplat:operationrecord:list'] }
    },
    {
      path: 'role',
      component: () => import('@/views/role/role'),
      name: 'Role',
      meta: { title: '角色管理', roles: ['kuyuplat:role:search'] },
      hidden: true
    },
    {
      path: 'menu',
      component: () => import('@/views/role/menu'),
      name: 'Menu',
      meta: { title: '菜单管理', roles: ['kuyuplat:authorityMenu:search'] },
      hidden: true
    },
    {
      path: 'batch',
      component: () => import('@/views/batch/list'),
      name: 'BatchList',
      meta: { title: '批量操作', roles: ['kuyuplat:excel:batchChangeCardStatus', 'kuyuplat:card:batchChangeCardStatus', 'kuyuplat:addpackage:search', 'kuyuplat:order:search',
        'kuyuplat:card:changeCardStatus', 'kuyuplat:card:find', 'kuyuplat:card:getAddPackage', 'kuyuplat:weipaylist:search',
        'kuyuplat:orderAccount:search', 'kuyuplat:commissions:search', '.kuyuplat:card:superChangeCardStatus'] }
    },
    {
      path: 'API',
      component: () => import('@/views/other/API'),
      name: 'API',
      meta: { title: 'API' },
      hidden: true
    },
    {
      path: 'developmentEntrance',
      component: () => import('@/views/developmentEntrance/list'),
      name: 'DevelopmentEntrance',
      meta: { title: 'developmentEntrance', roles: ['kuyuplat:excel:monthBalance', 'kuyuplat:card:monthBalance'] }
    }

  ]
}
export default otherRouter
