/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const mobileRouter = {
  path: '/mobile',
  component: Layout,
  meta: { title: '移动端', icon: 'mobile', roles: ['mobile:admin'] },
  children: [
    {
      path: 'home',
      component: () => import('@/views/mobile/home'),
      name: 'Home',
      meta: { title: '首页', roles: ['kuyuplat:order:search', 'kuyuplat:card:find', 'kuyuplat:card:getCardReal', 'kuyuplat:obtain:find', 'kuyuplat:card:change'] }
    },
    {
      path: 'detail',
      name: 'mobileDetail',
      component: () => import('@/views/mobile/detail'),
      meta: { title: '卡片信息查询', roles: ['kuyuplat:card:find', 'kuyuplat:card:getAddPackage', 'kuyuplat:addpackage:search', 'kuyuplat:order:search', 'kuyuplat:cardSimstate:find', 'kuyuplat:card:getCardMoney'] }
    }
  ]
}

export default mobileRouter
