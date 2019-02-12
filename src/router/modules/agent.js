/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const agentRouter = {
  path: '/agent',
  component: Layout,
  name: 'agent',
  redirect: 'noredirect',
  meta: { title: 'agent', roles: ['kuyuplat:agent:search', 'kuyuplat:agentAccount:search', 'kuyuplat:packagePrice:show', 'kuyuplat:agent:per'], icon: 'sitemap' },
  children: [
    {
      path: 'manage',
      component: () => import('@/views/agent/index'),
      name: 'AgentManage',
      meta: {
        title: 'agentManage',
        roles: ['kuyuplat:agent:search']
      }
    },
    {
      path: 'amount',
      component: () => import('@/views/agent/recharge'),
      name: 'AgentAmount',
      meta: {
        title: 'agentAmount',
        roles: ['kuyuplat:agentAccount:search']
      }
    },
    {
      path: 'package',
      component: () => import('@/views/agent/package'),
      name: 'AgentPackage',
      meta: { title: 'agentPackage', roles: ['kuyuplat:packagePrice:show'] }
    },
    {
      path: 'per',
      component: () => import('@/views/agent/per'),
      meta: { title: 'agentper', roles: ['kuyuplat:agent:per'] },
      name: 'AgentPer'
    }
  ]
}

export default agentRouter
