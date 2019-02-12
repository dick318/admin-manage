import request from '@/utils/request'
// 月套餐月末扣费停机
export function monthlyBalance(data, showLoading) {
  return request({
    url: '/plat/card/v4/monthBalance',
    method: 'post',
    data,
    showLoading
  })
}

