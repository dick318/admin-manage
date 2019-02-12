import request from '@/utils/request'
// 获取流量详情
export function getAddPackage(data, showLoading) {
  return request({
    url: '/plat/card/v4/getAddPackage',
    method: 'post',
    data,
    showLoading
  })
}
// 清除卡片缓存信息
export function delCache(data, showLoading) {
  return request({
    url: '/plat/card/v4/delCache',
    method: 'post',
    data,
    showLoading
  })
}
// 查询实时状态接口
export function queryCardStatus(data, showLoading) {
  return request({
    url: 'http://api.szcoolfish.com/ctrolservice/wsi/unite',
    // url: 'http://120.79.150.124:8092/wsi/unite',
    method: 'post',
    data,
    showLoading
  })
}
// 查询实时流量接口
export function queryUseflow(data, showLoading) {
  return request({
    url: 'http://api.szcoolfish.com/ctrolservice/wsi/unite',
    // url: 'http://120.79.150.124:8092/wsi/unite',
    method: 'post',
    data,
    showLoading
  })
}
// 号码停复机接口
export function changeCardStatus(data, showLoading) {
  return request({
    url: '/plat/card/v4/changeCardStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 号码强制停复机接口
export function superChangeCardStatus(data, showLoading) {
  return request({
    url: '/plat/card/v4/super/changeCardStatus',
    method: 'post',
    data,
    showLoading
  })
}
// 卡片单独断复网
export function singleCutNet(data, showLoading) {
  return request({
    url: '/plat/card/v4/singleCutNet',
    method: 'post',
    data,
    showLoading
  })
}

// 卡片达量断网
export function offNetAction(data, showLoading) {
  return request({
    url: '/plat/card/v4/offNetAction',
    method: 'post',
    data,
    showLoading
  })
}
