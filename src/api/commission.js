import request from '@/utils/request'

// 50.获取佣金记录接口
export function searchAgentCommissions(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchAgentCommissions',
    method: 'post',
    data,
    showLoading
  })
}
// 添加佣金记录接口
export function saveAgentCommission(data, showLoading) {
  return request({
    url: '/plat/finance/v4/saveAgentCommission',
    method: 'post',
    data,
    showLoading
  })
}
// 佣金记录导出
export function exportCommissionInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportCommissionInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 手动重算佣金接口
export function updateCommission(data, showLoading) {
  return request({
    url: '/plat/finance/v4/updateCommission',
    method: 'post',
    data,
    showLoading
  })
}

