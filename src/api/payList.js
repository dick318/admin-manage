import request from '@/utils/request'

// 获取支付记录接口
export function searchWeipayList(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchWeipayList',
    method: 'post',
    data,
    showLoading
  })
}
// 支付记录导出接口
export function exportWeipayList(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportWeipayList',
    method: 'post',
    data,
    showLoading
  })
}

// 微信退款(单个)接口
export function weipayRefund(data, showLoading) {
  return request({
    url: '/plat/finance/v4/weipayRefund',
    method: 'post',
    data,
    showLoading
  })
}

// 批量微信退款(excel)接口
export function weipayBatchRefund(data, showLoading) {
  return request({
    url: '/plat/finance/v4/weipayBatchRefund',
    method: 'post',
    data,
    showLoading
  })
}

// 支付记录退款详情接口
export function refundList(data, showLoading) {
  return request({
    url: '/plat/finance/v4/refundList',
    method: 'post',
    data,
    showLoading
  })
}

