import request from '@/utils/request'
// 推广订单信息
export function getObtain(data, showLoading) {
  return request({
    url: '/plat/card/v4/obtain/find',
    method: 'post',
    data,
    showLoading
  })
}
// 推广快递发货信息单个导入
export function obtainUpdate(data, showLoading) {
  return request({
    url: '/plat/card/v4/obtain/update',
    method: 'post',
    data,
    showLoading
  })
}
// 推广快递发货信息批量导入
export function obtainBatchUpdate(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/obtain/batchUpdate',
    method: 'post',
    data,
    showLoading
  })
}
// 推广信息导出
export function batchExport(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/obtain/batchExport',
    method: 'post',
    data,
    showLoading
  })
}

