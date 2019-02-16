import request from '@/utils/request'
// 1、MIFI列表查询
export function mifiList(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/list',
    method: 'post',
    data,
    showLoading
  })
}
// 2、MIFI上网功能开关
export function mifiSwitch(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/switch',
    method: 'post',
    data,
    showLoading
  })
}
// 3、MIFI上网流量设置
export function mifiSetspeed(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/setspeed',
    method: 'post',
    data,
    showLoading
  })
}
// 4、设置联网设备最大数
export function mifiSetmax(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/setmax',
    method: 'post',
    data,
    showLoading
  })
}
// 5、域名访问功能黑名单
export function mifiWebaccess(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/webaccess',
    method: 'post',
    data,
    showLoading
  })
}
// 6、流量查询
export function mifiQuerydata(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/querydata',
    method: 'get',
    params: data,
    showLoading
  })
}
// 8、设备删除
export function mifiDel(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/del',
    method: 'post',
    data,
    showLoading
  })
}
