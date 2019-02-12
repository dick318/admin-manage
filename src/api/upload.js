import request from '@/utils/request'
// 文件上传接口
export function mifiList(data, showLoading) {
  return request({
    url: '/plat/mifi/v4/list',
    method: 'post',
    data,
    showLoading
  })
}
