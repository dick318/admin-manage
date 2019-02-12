import request from '@/utils/request'

// 搜索代理商
export function getAgents(data, showLoading) {
  return request({
    url: '/plat/agent/v4/getAgents',
    method: 'post',
    data,
    showLoading
  })
}
// 获取单个代理商
export function getAgent(data, showLoading) {
  return request({
    url: '/plat/agent/v4/getAgent',
    method: 'post',
    data,
    showLoading
  })
}
// 搜索代理商
export function searchAgents(data, showLoading) {
  return request({
    url: '/plat/agent/v4/searchAgents',
    method: 'post',
    data,
    showLoading
  })
}

// 获取下级账号接口
export function launchAgent(data, showLoading) {
  return request({
    url: '/plat/agent/v4/launchAgent',
    method: 'post',
    data,
    showLoading
  })
}
// 新增
export function addAgent(data, showLoading) {
  return request({
    url: '/plat/agent/v4/addAgent',
    method: 'post',
    data,
    showLoading
  })
}

// 删除
export function agentDel(data, showLoading) {
  return request({
    url: '/plat/agent/v4/delAgent',
    method: 'post',
    data,
    showLoading
  })
}
// 更新
export function agentUpdate(data, showLoading) {
  return request({
    url: '/plat/agent/v4/updateAgent',
    method: 'post',
    data,
    showLoading
  })
}

// 更新比例
export function updatePer(data, showLoading) {
  return request({
    url: '/plat/agent/v4/updatePer',
    method: 'post',
    data,
    showLoading
  })
}

// 修改代理商密码
export function agentUpdatePassword(data, showLoading) {
  return request({
    url: '/plat/agent/v4/updatePassword',
    method: 'post',
    data,
    showLoading
  })
}

// 获取账户余额变动列表
export function getAgentAccount(data, showLoading) {
  return request({
    url: '/plat/agent/v4/searchAgentAccount',
    method: 'post',
    data,
    showLoading
  })
}

// 充值余额
export function agentRecharge(data, showLoading) {
  return request({
    url: '/plat/agent/v4/addAgentAccount',
    method: 'post',
    data,
    showLoading
  })
}
// 提现状态
export function closeWithdrawal(data, showLoading) {
  return request({
    url: '/plat/agent/v4/closeWithdrawal',
    method: 'post',
    data,
    showLoading
  })
}
