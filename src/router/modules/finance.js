/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const financeRouter = {
  path: '/finance',
  component: Layout,
  name: 'finance',
  redirect: 'noredirect',
  meta: {
    title: 'finance',
    icon: 'balance-scale',
    roles: ['kuyuplat:order:search', 'kuyuplat:orderAccount:search', 'kuyuplat:commissions:search', 'kuyuplat:withdrawals:search', 'kuyuplat:weipaylist:search', 'kuyuplat:refundApplication:search']
  },
  children: [
    {
      path: 'orderFlow',
      component: () => import('@/views/finance/order'),
      name: 'OrderFlow',
      meta: { title: 'orderFlow', roles: ['kuyuplat:order:search'] }
    },
    {
      path: 'amountOrder',
      component: () => import('@/views/finance/amountOrder'),
      name: 'AmountOrder',
      meta: { title: 'amountOrder', roles: ['kuyuplat:orderAccount:search'] }
    },
    {
      path: 'commission',
      component: () => import('@/views/finance/commission'),
      name: 'Commission',
      meta: { title: 'commission', roles: ['kuyuplat:commissions:search'] }
    },
    {
      path: 'withdraw',
      component: () => import('@/views/finance/withdraw'),
      name: 'Withdraw',
      meta: { title: 'withdraw', roles: ['kuyuplat:withdrawals:search'] }
    },
    {
      path: 'pocketChange',
      component: () => import('@/views/finance/pocketChange'),
      name: 'PocketChange',
      meta: { title: '企业付款', roles: ['kuyuplat:billing:history'] }
    },
    {
      path: 'ordinaryPayee',
      component: () => import('@/views/finance/ordinaryPayee'),
      name: 'OrdinaryPayee',
      meta: { title: '常用收款人', roles: ['kuyuplat:payee:list'] },
      hidden: true
    },
    {
      path: 'payList',
      component: () => import('@/views/finance/payList'),
      name: 'PayList',
      meta: { title: 'payList', roles: ['kuyuplat:weipaylist:search'] }
    },
    {
      path: 'weipayRefund',
      component: () => import('@/views/finance/weipayRefund'),
      name: 'WeipayRefund',
      meta: { title: '批量退款', roles: ['kuyuplat:wx:excelRefund'] },
      hidden: true
    },
    {
      path: 'payListRefund',
      component: () => import('@/views/finance/payListRefund'),
      name: 'PayListRefund',
      meta: { title: '支付退款记录', roles: ['kuyuplat:wx:refundList'] },
      hidden: true
    },
    {
      path: 'refund',
      component: () => import('@/views/finance/refund'),
      name: 'Refund',
      meta: { title: '退款查询', roles: ['kuyuplat:refundApplication:search'] }
    }
  ]
}
export default financeRouter
