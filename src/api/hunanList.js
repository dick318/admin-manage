import request from '@/utils/request'
// 手动执行湖南移动监控
export function hunanStart(data, showLoading) {
  return request({
    url: '/plat/card/v4/hunan/start',
    method: 'post',
    data,
    showLoading
  })
}
// // 导出湖南停机的Excel
// export function exportStop(data, showLoading) {
//   return request({
//     url: 'http://120.77.253.165:20010/excel/card/export/stop',
//     method: 'post',
//     data
//   })
// }
// 湖南监控操作记录查询
export function getHunan(data, showLoading) {
  return request({
    url: '/plat/card/v4/getHunan',
    method: 'post',
    data,
    showLoading
  })
}

