import request from '@/utils/request'
// 获取微信配置接口
export function getWxCfg(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getWxCfg',
    method: 'post',
    data,
    showLoading
  })
}
// 2、设置微信配置接口
export function setWxCfg(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/setWxCfg',
    method: 'post',
    data,
    showLoading
  })
}

// 3、一级菜单查询接口
export function getFirstMenus(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getFirstMenus',
    method: 'post',
    data,
    showLoading
  })
}

// 4、菜单列表接口
export function getMenus(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getMenus',
    method: 'post',
    data,
    showLoading
  })
}

// 5、菜单查询接口
export function getMenu(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 6、添加菜单接口
export function addMenu(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/addMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 7、更新菜单接口
export function updateMenu(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/updateMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 8、同步菜单接口
export function syncMenu(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/syncMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 9、删除菜单接口
export function deleteMenu(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/deleteMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 10、添加图文回复接口
export function addAutoReply(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/addAutoReply',
    method: 'post',
    data,
    showLoading
  })
}

// 11、查询图文回复接口
export function getAutoReply(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getAutoReply',
    method: 'post',
    data,
    showLoading
  })
}
// 12、图文回复列表接口
export function getAutoReplyList(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getAutoReplyList',
    method: 'post',
    data,
    showLoading
  })
}
// 13、修改图文回复接口
export function updateAutoReply(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/updateAutoReply',
    method: 'post',
    data,
    showLoading
  })
}
// 14、删除图文回复接口
export function deleteAutoReply(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/deleteAutoReply',
    method: 'post',
    data,
    showLoading
  })
}
// 15、微信粉丝列表接口
export function getFansList(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/getFansList',
    method: 'post',
    data,
    showLoading
  })
}
// 16、微信粉丝备注接口
export function setFansRemark(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/setFansRemark',
    method: 'post',
    data,
    showLoading
  })
}
// 17、微信粉丝信息同步接口
export function syncFans(data, showLoading) {
  return request({
    url: '/plat/wxplat/v4/syncFans',
    method: 'post',
    data,
    showLoading
  })
}

// 微信粉丝导出
export function exportWxFansInfo(data, showLoading) {
  return request({
    url: '/plat/export/v4/exportWxFansInfo',
    method: 'post',
    data,
    showLoading
  })
}

