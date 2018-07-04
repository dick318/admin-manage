import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.path === '/login') {
    next()
    NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  } else {
    if (getToken()) { // determine if there has token
      /* has token*/
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          let roles
          if (res.data.id === res.data.uid) {
            roles = ['admin']
          } else {
            const oneArr = []; const oneNoArr = []; const twoNoArr = []; const twoArr = []; const thrArr = []; const noArr = []
            let nodes = JSON.parse(res.data.text)
            for (var b in nodes) {
              if (!nodes[b]['checked']) {
                oneNoArr.push(nodes[b]['id'])
                for (var a in nodes[b]['children']) {
                  if (!nodes[b]['children'][a]['checked']) {
                    twoNoArr.push(nodes[b]['children'][a]['id'])
                    for (var c in nodes[b]['children'][a]['children']) {
                      if (!nodes[b]['children'][a]['children'][c]['checked']) {
                        noArr.push(nodes[b]['children'][a]['children'][c]['id'])
                      }
                    }
                  }
                }
              } else {
                oneArr.push(nodes[b]['id'])
                for (var e in nodes[b]['children']) {
                  if (!nodes[b]['children'][e]['checked']) {
                    twoNoArr.push(nodes[b]['children'][e]['id'])
                    for (var f in nodes[b]['children'][e]['children']) {
                      if (!nodes[b]['children'][e]['children'][f]['checked']) {
                        noArr.push(nodes[b]['children'][e]['children'][f]['id'])
                      }
                    }
                  } else {
                    twoArr.push(nodes[b]['children'][e]['id'])
                    for (var g in nodes[b]['children'][e]['children']) {
                      if (!nodes[b]['children'][e]['children'][g]['checked']) {
                        noArr.push(nodes[b]['children'][e]['children'][g]['id'])
                      } else {
                        thrArr.push(nodes[b]['children'][e]['children'][g]['id'])
                      }
                    }
                  }
                }
              }
            }
            nodes = { has: oneArr.concat(twoArr), no: noArr }
            roles = nodes.has
          }
          // const roles = res.data.data.text// note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/login') // 否则全部重定向到登录页
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
