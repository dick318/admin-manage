import request from '@/utils/request'
// 资费列表查询
export function searchRadacct(data, showLoading) {
  return request({
    url: '/plat/lns/v4/searchRadacct',
    method: 'post',
    data,
    showLoading
  })
}
// 授权信息列表查询
export function searchRadpostauth(data, showLoading) {
  return request({
    url: '/plat/lns/v4/searchRadpostauth',
    method: 'post',
    data,
    showLoading
  })
}
// 用户列表查询
export function searchRadcheck(data, showLoading) {
  return request({
    url: '/plat/lns/v4/searchRadcheck',
    method: 'post',
    data,
    showLoading
  })
}
// 修改用户信息
export function updateRadcheck(data, showLoading) {
  return request({
    url: '/plat/lns/v4/updateRadcheck',
    method: 'post',
    data,
    showLoading
  })
}
// 添加用户信息
export function saveRadcheck(data, showLoading) {
  return request({
    url: '/plat/lns/v4/saveRadcheck',
    method: 'post',
    data,
    showLoading
  })
}
// 删除用户信息
export function deleteRadcheck(data, showLoading) {
  return request({
    url: '/plat/lns/v4/deleteRadcheck',
    method: 'post',
    data,
    showLoading
  })
}
