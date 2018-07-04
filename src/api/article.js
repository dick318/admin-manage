import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '?r=sms/agent/get-all',
    method: 'post',
    data
  })
}

export function fetchArticle() {
  return request({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '?r=sms/agent/add',
    method: 'post',
    data
  })
}

export function delAgent(data) {
  return request({
    url: '?r=sms/agent/delete',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '?r=sms/agent/update',
    method: 'post',
    data
  })
}
