/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const developmentRouter = {
  path: '/development',
  component: Layout,
  name: 'development',
  redirect: 'noredirect',
  meta: {
    icon: 'development',
    roles: ['kuyuplat:card:monthBalance', 'kuyuplat:excel:monthBalance']
  },
  hidden: true,
  children: [
    {
      path: 'map',
      component: () => import('@/views/other/map'),
      name: 'map',
      meta: { title: '地图' },
      hidden: true
    },
    {
      path: 'monthlyBalance',
      component: () => import('@/views/developmentEntrance/monthlyBalance'),
      name: 'MonthlyBalance',
      meta: { title: '月套餐月末扣费停机', roles: ['kuyuplat:card:monthBalance', 'kuyuplat:excel:monthBalance'] },
      hidden: true
    }
  ]
}
export default developmentRouter
