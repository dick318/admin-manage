import request from '@/utils/request'
// 机卡解绑动作
export function imeiReRecord(data, showLoading) {
  return request({
    url: '/plat/card/v4/imeiReRecord',
    method: 'post',
    data,
    showLoading
  })
}
// 机卡解绑记录
export function findImeiReRecord(data, showLoading) {
  return request({
    url: '/plat/card/v4/imeiReRecord/find',
    method: 'post',
    data,
    showLoading
  })
}
