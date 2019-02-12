import request from '@/utils/request'
// 卡片实名信息查询
export function getCardReal(data, showLoading) {
  return request({
    url: '/plat/card/v4/getCardReal',
    method: 'post',
    data,
    showLoading
  })
}
// 更改状态（批量实名和批量拒绝）
export function editCardReal(data, showLoading) {
  return request({
    url: '/plat/card/v4/editCardReal',
    method: 'post',
    data,
    showLoading
  })
}
// 批量导出实名认证
export function exportCardReal(data, showLoading) {
  return request({
    url: '/plat/card/v4/exportCardReal',
    method: 'post',
    data,
    showLoading
  })
}
// 批量实名认证
export function addCardReal(data, showLoading) {
  return request({
    url: '/plat/card/v4/cardReal/batchAdd',
    method: 'post',
    data,
    showLoading
  })
}
// 实名认证删除
export function delCardReal(data, showLoading) {
  return request({
    url: '/plat/card/v4/cardReal/delCardReal',
    method: 'post',
    data,
    showLoading
  })
}

