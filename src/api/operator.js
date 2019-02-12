import request from '@/utils/request'
// 获取套餐批次
export function getOperatorIds(data, showLoading) {
  return request({
    url: '/plat/business/v4/getOperators',
    method: 'post',
    data,
    showLoading
  })
}
// 获取供应商账号
export function searchOperatorAccount(data, showLoading) {
  return request({
    url: '/plat/other/v4/searchOperatorAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 添加供应商账号
export function saveOperatorAccount(data, showLoading) {
  return request({
    url: '/plat/other/v4/saveOperatorAccount',
    method: 'post',
    data,
    showLoading
  })
}

