import { getUrl } from '@/api/role'
import headImg from '@/assets/headImg.gif'

const login = {
  state: {
    favicon: '',
    background: '',
    headimgurl: '',
    title: '',
    url: ''
  },

  mutations: {
    SET_FAVICON: (state, favicon) => {
      state.favicon = favicon
    },
    SET_BACKGROUND: (state, background) => {
      state.background = background
    },
    SET_HEADIMGURL: (state, headimgurl) => {
      state.headimgurl = headimgurl
    },
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_URL: (state, url) => {
      state.url = url
    }
  },

  actions: {
    // 获取信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUrl().then(res => {
          if (+res.status === 0) {
            commit('SET_FAVICON', res.data.favicon || 'http://tw.szcoolfish.com/coolfish/tpl/static/img/favicon.ico')
            commit('SET_BACKGROUND', res.data.background || 'http://tw.szcoolfish.com/coolfish/tpl/static/img/background_kuyu.jpg')
            commit('SET_HEADIMGURL', res.data.headimgurl || headImg)
            commit('SET_TITLE', res.data.title || '系统登陆')
            commit('SET_URL', res.data.url || `${document.location.protocol}//${window.location.host}/go`)
            resolve(res)
          } else {
            commit('SET_FAVICON', 'http://tw.szcoolfish.com/coolfish/tpl/static/img/favicon.ico')
            commit('SET_BACKGROUND', 'http://tw.szcoolfish.com/coolfish/tpl/static/img/background_kuyu.jpg')
            commit('SET_HEADIMGURL', headImg)
            commit('SET_TITLE', '系统登陆')
            commit('SET_URL', `${document.location.protocol}//${window.location.host}/go`)
            resolve(res)
          }
        }).catch(() => {
          commit('SET_FAVICON', 'http://tw.szcoolfish.com/coolfish/tpl/static/img/favicon.ico')
          commit('SET_BACKGROUND', 'http://tw.szcoolfish.com/coolfish/tpl/static/img/background_kuyu.jpg')
          commit('SET_HEADIMGURL', headImg)
          commit('SET_TITLE', '系统登陆')
          commit('SET_URL', `${document.location.protocol}//${window.location.host}/go`)
        })
      })
    }
  }
}

export default login
