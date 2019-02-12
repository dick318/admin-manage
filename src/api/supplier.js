import request from '@/utils/request'
// 获取供应商批次信息接口
export function searchOperators(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchOperators',
    method: 'post',
    data,
    showLoading
  })
}
// 删除供应商批次接口
export function deleteOperators(data, showLoading) {
  return request({
    url: '/plat/business/v4/deleteOperators',
    method: 'post',
    data,
    showLoading
  })
}
// 修改供应商批次接口
export function updateOperator(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateOperator',
    method: 'post',
    data,
    showLoading
  })
}
// 添加供应商批次接口
export function saveOperator(data, showLoading) {
  return request({
    url: '/plat/business/v4/saveOperator',
    method: 'post',
    data,
    showLoading
  })
}
// 设置供应商批次规则接口 TODO:
export function updateRule(data, showLoading) {
  return request({
    url: 'http://120.79.150.124:10015/operator/v3/updateRule',
    method: 'post',
    data,
    showLoading
  })
}
// 查询供应商账号接口
export function searchAccount(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 修改供应商账号信息接口
export function updateAccount(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 删除供应商账号信息接口
export function deleteAccount(data, showLoading) {
  return request({
    url: '/plat/business/v4/deleteAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 添加供应商账号信息接口
export function saveAccount(data, showLoading) {
  return request({
    url: '/plat/business/v4/saveAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 获取供应商账号名称接口
export function getAccounts(data, showLoading) {
  return request({
    url: '/plat/business/v4/getAccounts',
    method: 'post',
    data,
    showLoading
  })
}
// 获取所有供应商接口的url接口
export function getServer(data, showLoading) {
  return request({
    url: '/plat/business/v4/getServer',
    method: 'post',
    data,
    showLoading
  })
}
