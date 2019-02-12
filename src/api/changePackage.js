import request from '@/utils/request'
// 获取异卡换套餐记录
export function searchCardChange(data, showLoading) {
  return request({
    url: '/plat/business/v4/searchCardChange',
    method: 'post',
    data,
    showLoading
  })
}
// 异卡换套餐,更换卡片,新卡换旧卡.
export function cardChange(data, showLoading) {
  return request({
    url: '/plat/business/v4/cardChange',
    method: 'post',
    data,
    showLoading
  })
}

