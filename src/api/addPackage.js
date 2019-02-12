import request from '@/utils/request'
// 获取订购套餐列表
export function searchAddPackages(data, showLoading) {
  return request({
    url: '/plat/finance/v4/searchAddPackages',
    method: 'post',
    data,
    showLoading
  })
}
