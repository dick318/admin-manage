import request from '@/utils/request'
// 1、短信列表查询
export function smsList(data, showLoading) {
  return request({
    url: '/plat/sms/v4/list',
    method: 'post',
    data,
    showLoading
  })
}
// 1、短信列表发送
export function smsSend(data, showLoading) {
  return request({
    url: '/plat/sms/v4/send',
    method: 'post',
    data,
    showLoading
  })
}
// 添加短信指令
export function instructAdd(data, showLoading) {
  return request({
    url: '/plat/instruct/v4/add',
    method: 'post',
    data,
    showLoading
  })
}
// 删除短信指令;
export function instructDelete(data, showLoading) {
  return request({
    url: '/plat/instruct/v4/delete',
    method: 'post',
    data,
    showLoading
  })
}
// 更新短信指令
export function instructUpdate(data, showLoading) {
  return request({
    url: '/plat/instruct/v4/update',
    method: 'post',
    data,
    showLoading
  })
}
// 短信指令列表
export function instructList(data, showLoading) {
  return request({
    url: '/plat/instruct/v4/list',
    method: 'post',
    data,
    showLoading
  })
}
