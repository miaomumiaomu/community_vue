/**
 * Created by TIMMY on 2018/5/11.
 */
import request from '@/utils/request'
export function query(params) {
  return request({
    url: '/api/ai/sqjcwh/list',
    method: 'get',
    params

  })
}
export function create(params) {
  return request({
    url: '/api/ai/sqjcwh',
    method: 'post',
    data:params

  })
}
export function patch(params) {
  return request({
    url: `/api/ai/sqjcwh/${params.id}`,
    method: 'put',
    data:params

  })
}
export function remove(id) {
  return request({
    url: `/api/ai/sqjcwh/${id}`,
    method: 'delete'
  })
}
export function detail(id) {
  return request({
    url: `/api/ai/sqjcwh/${id}`,
    method: 'get'
  })
}
export function fetchList() {
  return request({
    url: '/api/ai/xzjd/selectPage?limit=32768&offset=1',
    method: 'get'
  })
}
export function updateFlag(params) {
  return request({
    url: '/api/ai/sqjcwh/updateFlag',
    method: 'get',
    params
  })
}

export function getObj(id) {
  return request({
    url: '/api/ai/sqjcwh/' + id,
    method: 'get'
  })
}

export function delObj({ ids }) {
  return request({
    url: '/api/ai/sqjcwh/batchDelete/',
    method: 'delete',
    data: { ids }
  })
}
