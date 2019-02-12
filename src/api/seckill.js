import request from '@/utils/request'
// 秒杀活动添加
export function addSeckill(data, showLoading) {
  return request({
    url: '/plat/card/v4/seckill/add',
    method: 'post',
    data,
    showLoading
  })
}
// 秒杀活动修改
export function editSeckill(data, showLoading) {
  return request({
    url: '/plat/card/v4/seckill/update',
    method: 'post',
    data,
    showLoading
  })
}
// 秒杀活动获取
export function getSeckill(data, showLoading) {
  return request({
    url: '/plat/card/v4/seckill/find',
    method: 'post',
    data,
    showLoading
  })
}
// 秒杀活动名称获取
export function getSeckillNames(data, showLoading) {
  return request({
    url: '/plat/card/v4/seckill/findNames',
    method: 'post',
    data,
    showLoading
  })
}
// 秒杀活动删除
export function delSeckill(data, showLoading) {
  return request({
    url: '/plat/card/v4/seckill/delete',
    method: 'post',
    data,
    showLoading
  })
}
// 影视购物卡信息查询
export function cardTvFind(data, showLoading) {
  return request({
    url: '/plat/card/v4/cardTv/find',
    method: 'post',
    data,
    showLoading
  })
}
