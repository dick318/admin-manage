import request from '@/utils/request'

// 换卡快递导出
export function exportExpressNO(data, showLoading) {
  return request({
    url: '/plat/card/v4/card/replace/excel/updateExpressInfo',
    method: 'post',
    data,
    showLoading
  })
}

// 换卡快递单号单个导入
export function addExpressNO(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/replace/exportInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 获取换卡申请记录接口
export function searchCardReplace(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchCardReplace',
    method: 'post',
    data,
    showLoading
  })
}
// 删除换卡申请记录接口
export function deleteCardReplace(data, showLoading) {
  return request({
    url: '/plat/business/v4/deleteCardReplace',
    method: 'post',
    data,
    showLoading
  })
}
// 添加换卡申请记录接口
export function savaCardReplace(data, showLoading) {
  return request({
    url: '/plat/business/v4/savaCardReplace',
    method: 'post',
    data,
    showLoading
  })
}

