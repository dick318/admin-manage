/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const batchRouter = {
  path: '/batch',
  component: Layout,
  name: 'batch',
  redirect: 'noredirect',
  meta: {
    icon: 'cogs',
    title: 'other',
    roles: ['kuyuplat:excel:batchChangeCardStatus', 'kuyuplat:card:batchChangeCardStatus', 'kuyuplat:addpackage:search', 'kuyuplat:order:search',
      'kuyuplat:card:changeCardStatus', 'kuyuplat:card:find', 'kuyuplat:card:getAddPackage', 'kuyuplat:weipaylist:search',
      'kuyuplat:orderAccount:search', 'kuyuplat:commissions:search', '.kuyuplat:card:superChangeCardStatus']
  },
  hidden: true,
  children: [
    {
      path: 'changeStatus',
      component: () => import('@/views/batch/changeCardStatus'),
      name: 'ChangeStatus',
      meta: { title: '批量停复机', roles: ['kuyuplat:excel:batchChangeCardStatus', 'kuyuplat:card:batchChangeCardStatus'] },
      hidden: true
    },
    {
      path: 'changeStatusAlone',
      component: () => import('@/views/batch/changeCardStatusAlone'),
      name: 'ChangeStatusAlone',
      meta: { title: '循环停复机', roles: ['kuyuplat:card:changeCardStatus'] },
      hidden: true
    },
    {
      path: 'changeCardPackage',
      component: () => import('@/views/batch/ChangeCardPackage'),
      name: 'ChangeCardPackage',
      meta: { title: '批量改购', roles: ['kuyuplat:platform:order', 'kuyuplat:platform:unsubscribe'] },
      hidden: true
    },
    {
      path: 'getInfoMore',
      component: () => import('@/views/batch/getInfoMore'),
      name: 'GetInfoMore',
      meta: { title: '批量流量', roles: ['kuyuplat:card:getAddPackage'] },
      hidden: true
    },
    {
      path: 'getCardInfoMore',
      component: () => import('@/views/batch/getCardInfoMore'),
      name: 'GetCardInfoMore',
      meta: { title: '卡片信息批量', roles: ['kuyuplat:card:find'] },
      hidden: true
    },
    {
      path: 'payListMore',
      component: () => import('@/views/batch/payListMore'),
      name: 'PayListMore',
      meta: { title: '支付记录查询', roles: ['kuyuplat:weipaylist:search'] },
      hidden: true
    },
    {
      path: 'refundMore',
      component: () => import('@/views/batch/refundMore'),
      name: 'RefundMore',
      meta: { title: '退款资格', roles: ['kuyuplat:order:search', 'kuyuplat:addpackage:search', 'kuyuplat:card:getAddPackage'] },
      hidden: true
    },
    {
      path: 'amountOrderMore',
      component: () => import('@/views/batch/amountOrderMore'),
      name: 'AmountOrderMore',
      meta: { title: '余额订单查询', roles: ['kuyuplat:orderAccount:search'] },
      hidden: true
    },
    {
      path: 'orderMore',
      component: () => import('@/views/batch/orderMore'),
      name: 'OrderMore',
      meta: { title: '套餐订单查询', roles: ['kuyuplat:order:search'] },
      hidden: true
    },
    {
      path: 'commissionMore',
      component: () => import('@/views/batch/commissionMore'),
      name: 'CommissionMore',
      meta: { title: '佣金批量查询', roles: ['kuyuplat:commissions:search'] },
      hidden: true
    },
    {
      path: 'operationChangeStatus',
      component: () => import('@/views/batch/operationChangeStatus'),
      name: 'OperationChangeStatus',
      meta: { title: '运营停复机', roles: ['kuyuplat:card:superChangeCardStatus'] },
      hidden: true
    }
  ]
}
export default batchRouter
