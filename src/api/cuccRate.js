import request from '@/utils/request'

// 联通资费计划提交
export function ratePlanCommit(data, showLoading) {
  return request({
    url: '/plat/card/v4/ratePlanCommit',
    method: 'post',
    data,
    showLoading
  })
}
// 联通资费计划导出
export function ratePlanExport(data, showLoading) {
  return request({
    url: '/plat/card/v4/ratePlan/export',
    method: 'post',
    data,
    showLoading
  })
}
// // 联通资费计划更改
// export function cuccRatePlan(data, showLoading) {
//   return request({
//     url: '/plat/card/v4/ratePlan/export',
//     method: 'post',
//     data,
//     showLoading
//   })
// }
