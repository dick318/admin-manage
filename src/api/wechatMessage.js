import request from '@/utils/request'
// 微信消息推送
export function sendMessage(data, showLoading) {
  return request({
    url: '/plat/card/v4/sendMessage',
    method: 'post',
    data,
    showLoading
  })
}
// 微信消息模板
export function modelGetAll(data, showLoading) {
  return request({
    url: '/plat/card/v4/model/find',
    method: 'post',
    data,
    showLoading
  })
}
// 微信消息模板编辑（修改）
export function modelEdit(data, showLoading) {
  return request({
    url: '/plat/card/v4/model/update',
    method: 'post',
    data,
    showLoading
  })
}
// 微信消息模板编辑（添加）
export function modelAdd(data, showLoading) {
  return request({
    url: '/plat/card/v4/model/add',
    method: 'post',
    data,
    showLoading
  })
}
// 微信消息模板删除
export function modelDel(data, showLoading) {
  return request({
    url: '/plat/card/v4/model/delete',
    method: 'post',
    data,
    showLoading
  })
}
