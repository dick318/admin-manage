import axios from 'axios'
import qs from 'qs'
// import { Message } from 'element-ui'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let needLoadingRequestCount = 0
const loadingArray = []
let loading
// create an axios instance
axios.defaults.withCredentials = true
const service = axios.create({
  crossDomain: true,
  withCredentials: true,
  baseURL: process.env.BASE_API,
  // timeout: 20000, // request timeout
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': '*/*' }
})
// request interceptor
service.interceptors.request.use(config => {
  if (config.showLoading) {
    showLoading(config.showLoading, config.url)
  }
  // Do something before request is sent
  if (config.data) {
    config.data = Object.assign({ uid: store.getters.uid, did: store.getters.did }, config.data)
    config.data = qs.stringify(config.data)
  }
  if (getToken()) {
    config.headers['Authorization'] = `Bearer ${getToken()}` // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const url = response.request.responseURL
    const res = response.data
    if (response.config.showLoading) {
      tryHideLoading(url)
    }
    if (+res.status !== 0) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (+res.errorCode === 50008 || +res.errorCode === 50012 || +res.errorCode === 50014) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm(res.message, {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
    }
    return res
  },
  error => {
    if (error.config.showLoading) {
      tryHideLoading(error.config.url)
    }
    console.log('err' + error) // for debug
    Message({
      message: '请求超时',
      type: 'error',
      duration: '1000'
    })
    return Promise.reject(error)
  })

function showLoading(Selector, url) {
  startLoading(Selector, url)
  needLoadingRequestCount++
}

function tryHideLoading(url) {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  tryCloseLoading(url)
}

function startLoading(Selector, url) {
  loading = Loading.service({
    target: document.querySelector(Selector)
  })
  loadingArray.push({ url, loading })
}
const tryCloseLoading = (url) => {
  for (const item of loadingArray) {
    if (!item.url.indexOf('plat') === -1) {
      if (item.url.split('plat')[1] === url.split('plat')[1].split('?')[0]) {
        const index = loadingArray.indexOf(item)
        item.loading.close()
        loadingArray.splice(index, 1)
      }
    } else {
      const index = loadingArray.indexOf(item)
      item.loading.close()
      loadingArray.splice(index, 1)
    }
  }
}
export default service
