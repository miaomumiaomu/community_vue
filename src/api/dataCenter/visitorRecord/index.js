import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/ai/accessRecord/list',
    method: 'get',
    params: query
  })
}