/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const dashboardRouter = {
  path: '/',
  redirect: 'dashboard',
  component: Layout,
  meta: { title: 'dashboard', icon: 'home', roles: ['kuyuplat:analyzer:payinfo', 'kuyuplat:analyzer:cardoper', 'kuyuplat:analyzer:cardstatus', 'kuyuplat:analyzer:actinfo', 'uyuplat:notice:search',
    'kuyuplat:analyzer:actinfo', 'kuyuplat:analyzer:paydayinfo', 'kuyuplat:analyzer:agentinfo', 'kuyuplat:analyzer:wxinfo', 'kuyuplat:analyzer:wxdayinfo', 'kuyuplat:notice:search'] },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: { title: 'dashboard' }
    }
  ]
}

export default dashboardRouter
