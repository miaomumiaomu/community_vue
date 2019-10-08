/**
 * Created by TIMMY on 2018/5/11.
 */
import request from '@/utils/request'
export function query(params) {
  return request({
    url: '/api/ai/jwzrq/list',
    method: 'get',
    params

  })
}
export function create(params) {
  return request({
    url: '/api/ai/jwzrq',
    method: 'post',
    data:params

  })
}
export function patch(params) {
  return request({
    url: `/api/ai/jwzrq/${params.id}`,
    method: 'put',
    data:params

  })
}
export function remove(id) {
  return request({
    url: `/api/ai/jwzrq/${id}`,
    method: 'delete'
  })
}
export function detail(id) {
  return request({
    url: `/api/ai/jwzrq/${id}`,
    method: 'get'
  })
}
export function tree() {
  return request({
    url: '/api/ai/pcs/selectPage?limit=32768&offset=1',
    method: 'get'
  })
}
export function updateFlag(params) {
  return request({
    url: '/api/ai/jwzrq/updateFlag',
    method: 'get',
    params
  })
}
export function getObj(id) {
  return request({
    url: '/api/ai/jwzrq/' + id,
    method: 'get'
  })
}

export function delObj({ ids }) {
  return request({
    url: '/api/ai/jwzrq/batchDelete',
    method: 'delete',
    data: { ids }
  })
}
