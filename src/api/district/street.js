/**
 * Created by TIMMY on 2018/5/11.
 */
import request from '@/utils/request'
export function query(params) {
  return request({
    url: '/api/ai/jlxxq/list',
    method: 'get',
    params

  })
}
export function create(params) {
  return request({
    url: '/api/ai/jlxxq',
    method: 'post',
    data:params

  })
}
export function patch(params) {
  return request({
    url: `/api/ai/jlxxq/${params.id}`,
    method: 'put',
    data:params

  })
}
export function remove(id) {
  return request({
    url: `/api/ai/jlxxq/${id}`,
    method: 'delete'
  })
}
export function detail(id) {
  return request({
    url: `/api/ai/jlxxq/${id}`,
    method: 'get'
  })
}
export function tree() {
  return request({
    url: '/api/ai/sqjcwh/selectPage?limit=32768&offset=1',
    method: 'get'
  })
}
export function updateFlag(params) {
  return request({
    url: '/api/ai/jlxxq/updateFlag',
    method: 'get',
    params
  })
}

export function getObj(id) {
  return request({
    url: '/api/ai/jlxxq/' + id,
    method: 'get'
  })
}

export function delObj({ ids }) {
  return request({
    url: '/api/ai/jlxxq/batchDelete/',
    method: 'delete',
    data: { ids }
  })
}
