import request from '@/utils/request'
// 获取工单
export function searchWorklist(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchWorklist',
    method: 'post',
    data,
    showLoading
  })
}
// 单个工单处理接口
export function workHandle(data, showLoading) {
  return request({
    url: '/plat/business/v4/workHandle',
    method: 'post',
    data,
    showLoading
  })
}
// 工单记录导出接口
export function exportWorkOrder(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportWorkOrder',
    method: 'post',
    data,
    showLoading
  })
}
// 获取工单常见问题列表接口
export function searchProblems(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchProblems',
    method: 'post',
    data,
    showLoading
  })
}
// 添加工单常见问题接口
export function addProblem(data, showLoading) {
  return request({
    url: '/plat/business/v4/addProblem',
    method: 'post',
    data,
    showLoading
  })
}
// 修改工单常见问题接口
export function updateProblem(data, showLoading) {
  return request({
    url: '/plat/business/v4/updateProblem',
    method: 'post',
    data,
    showLoading
  })
}
// 删除工单常见问题接口
export function deleteProblem(data, showLoading) {
  return request({
    url: '/plat/business/v4/deleteProblem',
    method: 'post',
    data,
    showLoading
  })
}

