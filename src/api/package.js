import request from '@/utils/request'

// 添加套餐
export function saveFlowPackage(data, showLoading) {
  return request({
    url: '/plat/business/v4/saveFlowPackage',
    method: 'post',
    data,
    showLoading
  })
}
// 修改套餐
export function updateFlowPackage(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateFlowPackage',
    method: 'post',
    data,
    showLoading
  })
}
// 修改套餐上下架接口
export function updateStatus(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 修改套餐平台上下架接口
export function updateHide(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateHide',
    method: 'post',
    data,
    showLoading
  })
}
// 删除套餐
export function deleteFlowPackage(data, showLoading) {
  return request({
    url: '/plat/business/v4/deleteFlowPackage',
    method: 'post',
    data,
    showLoading
  })
}
// 获取分配套餐
export function showAllowPackages(data, showLoading) {
  return request({
    url: '/plat/agent/v4/showAllowPackages',
    method: 'post',
    data,
    showLoading
  })
}

// 分配套餐
export function distributionPackages(data, showLoading) {
  return request({
    url: '/plat/agent/v4/distributionPackages',
    method: 'post',
    data,
    showLoading
  })
}
// 分配套餐预警
export function remindParentPrice(data, showLoading) {
  return request({
    url: '/plat/agent/v4/remindParentPrice',
    method: 'post',
    data,
    showLoading
  })
}

// 删除分配套餐
export function delePackages(data, showLoading) {
  return request({
    url: '/plat/agent/v4/delePackages',
    method: 'post',
    data,
    showLoading
  })
}

// 获取套餐名称接口
export function getFlowPackages(data, showLoading) {
  return request({
    url: '/plat/business/v4/getFlowPackages',
    method: 'post',
    data,
    showLoading
  })
}
// 导出套餐接口
export function exportFlowPackages(data, showLoading) {
  return request({
    url: '/plat/business/v4/exportFlowPackages',
    method: 'post',
    data,
    showLoading
  })
}

// 获取套餐价格接口
export function searchFlowPackages(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchFlowPackages',
    method: 'post',
    data,
    showLoading
  })
}
// 获取套餐价格接口
export function searchAddFlowPackages(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchFlowPackages',
    method: 'post',
    data,
    showLoading
  })
}
// 后台订购接口
export function platformOrder(data, showLoading) {
  return request({
    url: '/plat/finance/v4/platformOrder',
    method: 'post',
    data,
    showLoading
  })
}
// 订购记录导出
export function exportPackageInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportPackageInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 退订接口
export function unsubscribe(data, showLoading) {
  return request({
    url: '/plat/finance/v4/unsubscribe',
    method: 'post',
    data,
    showLoading
  })
}
// 退订接口
export function unsubscribeForce(data, showLoading) {
  return request({
    url: '/plat/finance/v4/unsubscribeForce',
    method: 'post',
    data,
    showLoading
  })
}

