import request from '@/utils/request'
// 25.代理商服务网点添加
export function addNetStand(data) {
  return request({
    url: '/plat/card/v4/netStandAdd',
    method: 'post',
    data
  })
}
// 25.代理商服务网点修改
export function editNetStand(data) {
  return request({
    url: '/plat/card/v4/netStandUpdate',
    method: 'post',
    data
  })
}
// 25.代理商服务网点获取
export function getNetStand(data) {
  return request({
    url: '/plat/card/v4/netStandFind',
    method: 'post',
    data
  })
}
// 25.代理商服务网点删除
export function delNetStand(data) {
  return request({
    url: '/plat/card/v4/netStandDelete',
    method: 'post',
    data
  })
}
