import request from '@/utils/request'
// 获取验证码
export function getCode() {
  return request({
    url: '/plat/code/v4/getCode',
    method: 'get'
  })
}

// 登录
export function signIn(username, password, captcha) {
  const data = {
    username,
    password,
    captcha
  }
  return request({
    url: '/plat/sign/v4/signIn',
    method: 'post',
    data
  })
}
// 退出
export function signOut() {
  return request({
    url: '/plat/sign/v4/signOut',
    method: 'post'
  })
}
// 获取用户信息
export function getInfo() {
  return request({
    url: '/plat/sign/v4/getInfo',
    method: 'post'
  })
}
// 获取用户权限
export function getPermissions() {
  return request({
    url: '/plat/sign/v4/getPermissions',
    method: 'post'
  })
}
// 获取登录地址接口
export function getUrl() {
  return request({
    url: '/plat/agent/v4/getUrl',
    method: 'post'
  })
}

