import request from '@/utils/request'

// 获取订单列表
export function searchOrders(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchOrders',
    method: 'post',
    data,
    showLoading
  })
}
// 订单信息导出
export function exportOrderInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportOrderInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 47.获取余额信息接口
export function searchOrderAccounts(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchOrderAccounts',
    method: 'post',
    data,
    showLoading
  })
}
// 48.修改订单状态接口
export function updateOrderStatus(data, showLoading) {
  return request({
    url: '/plat/finance/v4/updateOrderStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 49.修改余额充值状态接口
export function updateOrderAccountStatus(data, showLoading) {
  return request({
    url: '/plat/finance/v4/updateOrderAccountStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 余额充值记录导出
export function exportRechargeInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportRechargeInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 补订(或批量补订)接口
export function batchSupplement(data, showLoading) {
  return request({
    url: '/plat/finance/v4/batchSupplement',
    method: 'post',
    data,
    showLoading
  })
}
// 退订申请接口
export function refundApplication(data, showLoading) {
  return request({
    // url: 'http://120.79.150.124:20066/order/v3/refundApplication',
    url: '/plat/finance/v4/refundApplication',
    method: 'post',
    data,
    showLoading
  })
}
// 退订申请接口
export function refundApplicationForce(data, showLoading) {
  return request({
    url: '/plat/finance/v4/refundApplicationForce',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片余额退款申请接口
export function orderAccountRefund(data, showLoading) {
  return request({
    url: '/plat/finance/v4/orderAccountRefund',
    method: 'post',
    data,
    showLoading
  })
}

