import request from '@/utils/request'
// 获取公告记录
export function searchNotice(data, showLoading) {
  return request({
    url: '/plat/other/v4/searchNotice',
    method: 'post',
    data,
    showLoading
  })
}
// 添加公告记录
export function saveNotice(data, showLoading) {
  return request({
    url: '/plat/other/v4/saveNotice',
    method: 'post',
    data,
    showLoading
  })
}
// 修改公告记录
export function updateNotice(data, showLoading) {
  return request({
    url: '/plat/other/v4/updateNotice',
    method: 'post',
    data,
    showLoading
  })
}
// 删除公告记录
export function deleteNotice(data, showLoading) {
  return request({
    url: '/plat/other/v4/deleteNotice',
    method: 'post',
    data,
    showLoading
  })
}
// 查询指定平台本月和次月充值次数以及总金额信息。
export function payinfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/payinfo',
    method: 'post',
    data,
    showLoading
  })
}
// 查询卡片各运营商数量以及卡片总量。
export function cardOperator(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/cardOperator',
    method: 'post',
    data,
    showLoading
  })
}
// 查询卡片状态数据。
export function cardStatus(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/cardStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 查询卡片月激活信息。
export function actMonthInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/actMonthInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 查询支付记录月统计信息。
export function payMonthInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/payMonthInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 查询支付记录日统计信息。
export function payDayInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/payDayInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 代理商统计信息查询。
export function agentInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/agentInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 查询微信粉丝总数、昨日新增数。
export function wxInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/wxInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 微信粉丝日新增数统计。
export function wxDayInfo(data, showLoading) {
  return request({
    url: '/plat/analyzer/v4/wxDayInfo',
    method: 'post',
    data,
    showLoading
  })
}
