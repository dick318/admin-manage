import request from '@/utils/request'
// 操作记录
export function workRecord(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchWorks',
    method: 'post',
    data,
    showLoading
  })
}
// 刷新操作记录
export function refreshWorks(data, showLoading) {
  return request({
    url: '/plat/export/v4/refreshProgress',
    method: 'get',
    params: data,
    showLoading
  })
}
// 卡片查询
export function getCard(data, showLoading) {
  return request({
    url: '/plat/card/v4/find',
    method: 'post',
    data,
    showLoading
  })
}

// 修改卡片
export function editCard(data, showLoading) {
  return request({
    url: '/plat/card/v4/editCard',
    method: 'post',
    data,
    showLoading
  })
}
// 查询余额变动记录
export function getCardMoney(data, showLoading) {
  return request({
    url: '/plat/card/v4/getCardMoney',
    method: 'post',
    data,
    showLoading
  })
}
// 批量修改余额
export function batchUpdateCardMoney(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchUpdateCardMoney',
    method: 'post',
    data,
    showLoading
  })
}

// 批量激活号码
export function batchActivate(data, showLoading) {
  return request({
    url: '/plat/card/v4/batchActivate',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片激活
export function cardActivate(data, showLoading) {
  return request({
    url: '/plat/card/v4/active',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片流量使用详情查询
export function cardFlowDetail(data, showLoading) {
  return request({
    url: '/plat/card/v4/getFlowdetail',
    method: 'post',
    data,
    showLoading
  })
}
// 57.打怪套餐升级列表查询接口
export function getRule(data, showLoading) {
  return request({
    url: '/plat/card/v4/getRule',
    method: 'post',
    data,
    showLoading
  })
}
// 58.打怪套餐升级修改接口
export function editRule(data, showLoading) {
  return request({
    url: '/plat/card/v4/editRule',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片信息导出
export function exportCardInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportCardInfo',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片财务信息导出
export function exportFinance(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportFinance',
    method: 'post',
    data,
    showLoading
  })
}

// // 号码限速接口 TODO
// export function editNetworkAccess(data, showLoading) {
//   return request({
//     url: 'http://120.77.253.165:20010/excel/card/editNetworkAccess',
//     method: 'post',
//     data,
//     showLoading
//   })
// }

// 4.卡片回收
export function cardBack(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchCardBack',
    method: 'post',
    data,
    showLoading
  })
}

// 卡片批量修改
export function batchUpdate(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchUpdate',
    method: 'post',
    data,
    showLoading
  })
}

// 卡片批量添加
export function batchCardAdd(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchCardAdd',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片批量分配
export function batchCardDivide(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchCardDivide',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片批量删除
export function batchCardDelete(data, showLoading) {
  return request({
    url: '/plat/card/v4/excel/card/batchCardDelete',
    method: 'post',
    data,
    showLoading
  })
}

