import request from '@/utils/request'

// 用户角色分配接口
export function distributeUserRole(data, showLoading) {
  return request({
    url: '/plat/permission/v4/distributeUserRole',
    method: 'post',
    data,
    showLoading
  })
}
// 菜单查询接口
export function searchMenus(data, showLoading) {
  return request({
    url: '/plat/permission/v4/searchMenus',
    method: 'post',
    data,
    showLoading
  })
}
// 菜单查询添加
export function addMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/addMenu',
    method: 'post',
    data,
    showLoading
  })
}
// 菜单查询删除
export function delMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/delMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 菜单查询修改
export function updateMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/updateMenu',
    method: 'post',
    data,
    showLoading
  })
}
// 角色添加接口
export function addRole(data, showLoading) {
  return request({
    url: '/plat/permission/v4/addRole',
    method: 'post',
    data,
    showLoading
  })
}
// 角色查询接口
export function showRoles(data, showLoading) {
  return request({
    url: '/plat/permission/v4/showRoles',
    method: 'post',
    data,
    showLoading
  })
}

// 角色删除接口
export function delRole(data, showLoading) {
  return request({
    url: '/plat/permission/v4/delRole',
    method: 'post',
    data,
    showLoading
  })
}
// 角色修改接口
export function updateRole(data, showLoading) {
  return request({
    url: '/plat/permission/v4/updateRole',
    method: 'post',
    data,
    showLoading
  })
}

// 角色菜单查询接口
export function searchRoleMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/searchRoleMenu',
    method: 'post',
    data,
    showLoading
  })
}
// 角色菜单分配接口
export function distributeRoleMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/distributeRoleMenu',
    method: 'post',
    data,
    showLoading
  })
}
// 用户角色查询接口
export function searchUserRole(data, showLoading) {
  return request({
    url: '/plat/permission/v4/searchUserRole',
    method: 'post',
    data,
    showLoading
  })
}
// 用户显示接口
export function searchUsers(data, showLoading) {
  return request({
    url: '/plat/other/v4/searchUsers',
    method: 'post',
    data,
    showLoading
  })
}
// 修改用户接口
export function updateUser(data, showLoading) {
  return request({
    url: '/plat/other/v4/updateUser',
    method: 'post',
    data,
    showLoading
  })
}
// 修改用户密码接口
export function updatePassword(data, showLoading) {
  return request({
    url: '/plat/other/v4/updatePassword',
    method: 'post',
    data,
    showLoading
  })
}
// 删除用户接口
export function deleteUser(data, showLoading) {
  return request({
    url: '/plat/other/v4/deleteUser',
    method: 'post',
    data,
    showLoading
  })
}
// 添加用户接口
export function saveUser(data, showLoading) {
  return request({
    url: '/plat/other/v4/saveUser',
    method: 'post',
    data,
    showLoading
  })
}

// 用户菜单查询接口
export function searchUserMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/searchUserMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 用户菜单分配接口
export function distributeUserMenu(data, showLoading) {
  return request({
    url: '/plat/permission/v4/distributeUserMenu',
    method: 'post',
    data,
    showLoading
  })
}

// 获取敏感操作记录接口
export function searchRecords(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchRecords',
    method: 'post',
    data,
    showLoading
  })
}

