import request from '@/utils/request'
// 获取卡片异常操作记录接口
export function searchCardActionException(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchCardActionException',
    method: 'post',
    data,
    showLoading
  })
}
// 导出卡片异常操作记录接口
export function exportCardAction(data, showLoading) {
  return request({
    url: 'plat/export/v4/exportCardAction',
    method: 'post',
    data,
    showLoading
  })
}

// 获取停复机记录
export function getCardSimstate(data, showLoading) {
  return request({
    url: '/plat/card/v4/cardSimstate',
    method: 'post',
    data,
    showLoading
  })
}
