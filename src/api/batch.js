import request from '@/utils/request'
// 批量停复机
export function batchChangeCardStatus(data, showLoading) {
  return request({
    url: '/plat/card/v4/batchChangeCardStatus',
    method: 'post',
    data,
    showLoading
  })
}

