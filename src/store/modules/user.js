import { signIn, signOut, getInfo, getPermissions, getUrl } from '@/api/login'
import headImg from '@/assets/headImg.gif'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    uid: '',
    did: '',
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    url: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_DID: (state, did) => {
      state.did = did
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_URL: (state, url) => {
      state.url = url
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      const captcha = userInfo.captcha.trim()
      return new Promise((resolve, reject) => {
        signIn(username, password, captcha).then(response => {
          if (+response.status === 0) {
            const data = response
            commit('SET_TOKEN', data.data)
            setToken(data.data)
            resolve()
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo({}).then(res => {
          if (res.status === 0) {
            commit('SET_DID', res.data.id)
            commit('SET_UID', res.data.uid)
            commit('SET_NAME', res.data.uname)
            commit('SET_AVATAR', headImg || res.data.logo)
            getUrl({}).then(res => {
              if (res.status === 0) {
                commit('SET_URL', res.data || `${document.location.protocol}//${window.location.host}/go`)
              }
            })
            getPermissions().then(res => {
              if (+res.status === 0) {
                const oneArr = res.data || []
                commit('SET_ROLES', oneArr)
                resolve(res)
              } else {
                reject(res)
              }
            }).catch(() => {
              this.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
          }
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        signOut().then((res) => {
          if (res.status === 0) {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    setRoles({ commit }, role) {
      commit('SET_ROLES', { role })
    },
    setStoreToken({ commit }, state) {
      setToken(state)
      commit('SET_TOKEN', state)
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [''])
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }) {
      return new Promise(resolve => {
        getPermissions().then(response => {
          const res = response.data
          if (+res.status === 0) {
            const oneArr = res.data || []
            commit('SET_ROLES', oneArr)
            dispatch('GenerateRoutes', res) // 动态修改权限后 重绘侧边菜单
            resolve()
          }
        })
      })
    }
  }
}

export default user
