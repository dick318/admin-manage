import request from '@/utils/request'

// 获取佣金提现记录接口
export function searchWithdrawals(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchWithdrawals',
    method: 'post',
    data,
    showLoading
  })
}
// 佣金审批接口
export function commissionApproval(data, showLoading) {
  return request({
    url: '/plat/finance/v4/commissionApproval',
    method: 'post',
    data,
    showLoading
  })
}

