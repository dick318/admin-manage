import request from '@/utils/request'

// 查询openid接口
export function payeeOpenids(data, showLoading) {
  return request({
    url: '/plat/finance/v4/payee/openids',
    method: 'post',
    data,
    showLoading
  })
}

// 增加收款人接口
export function payeeAdd(data, showLoading) {
  return request({
    url: '/plat/finance/v4/payee/add',
    method: 'post',
    data,
    showLoading
  })
}
// 收款人列表接口
export function payeeList(data, showLoading) {
  return request({
    url: '/plat/finance/v4/payee/list',
    method: 'post',
    data,
    showLoading
  })
}
// 收款人更新接口
export function payeeUpdate(data, showLoading) {
  return request({
    url: '/plat/finance/v4/payee/update',
    method: 'post',
    data,
    showLoading
  })
}
// 收款人删除接口
export function payeeDelete(data, showLoading) {
  return request({
    url: '/plat/finance/v4/payee/delete',
    method: 'post',
    data,
    showLoading
  })
}
// 企业号付款接口
export function billingTransfers(data, showLoading) {
  return request({
    url: 'http://wx.szcoolfish.com/plat/billing/v1/transfers',
    method: 'post',
    data,
    showLoading
  })
}
// 付款记录接口
export function billingHistory(data, showLoading) {
  return request({
    url: '/plat/finance/v4/billing/history',
    method: 'post',
    data,
    showLoading
  })
}
