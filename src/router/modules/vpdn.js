/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const vpdnRouter = {
  path: '/vpdn',
  component: Layout,
  meta: { title: 'LNS管理', icon: 'vpn', roles: ['kuyuplat:radcheck:search', 'kuyuplat:radpostauth:search', 'kuyuplat:radacct:search'] },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/vpdn/user'),
      meta: { title: '用户列表', roles: ['kuyuplat:radcheck:search'] }
    },
    {
      path: 'authorization',
      name: 'Authorization',
      component: () => import('@/views/vpdn/authorization'),
      meta: { title: '授权信息列表', roles: ['kuyuplat:radpostauth:search'] }
    },
    {
      path: 'expenses',
      component: () => import('@/views/vpdn/expenses'),
      name: 'Expenses',
      meta: { title: '资费列表', roles: ['kuyuplat:radacct:search'] }
    },
    {
      path: 'add',
      component: () => import('@/views/vpdn/add'),
      meta: { title: '导入用户', roles: ['kuyuplat:radcheck:batchSave'] },
      name: 'AddUser',
      hidden: true
    }
  ]
}

export default vpdnRouter
