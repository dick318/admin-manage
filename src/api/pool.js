import request from '@/utils/request'
// 获取流量池列表
export function getPool(data, showLoading) {
  return request({
    url: '/plat/card/v4/pool/find',
    method: 'post',
    data,
    showLoading
  })
}
// 修改流量池
export function editPool(data, showLoading) {
  return request({
    url: '/plat/card/v4/pool/update',
    method: 'post',
    data,
    showLoading
  })
}
// 添加流量池
export function addPool(data, showLoading) {
  return request({
    url: '/plat/card/v4/addPool',
    method: 'post',
    data,
    showLoading
  })
}
// 流量池信息推送成员查询
export function getSendMember(data, showLoading) {
  return request({
    url: '/plat/card/v4/getSendMember',
    method: 'post',
    data,
    showLoading
  })
}
// 流量池信息推送成员添加
export function addSendMember(data, showLoading) {
  return request({
    url: '/plat/card/v4/addSendMember',
    method: 'post',
    data,
    showLoading
  })
}
// 流量池信息推送成员删除
export function delSendMember(data, showLoading) {
  return request({
    url: '/plat/card/v4/delSendMember',
    method: 'post',
    data,
    showLoading
  })
}

