/**
 * Created by TIMMY on 2018/5/11.
 */
import request from '@/utils/request'
export function query(params) {
  return request({
    url: '/api/ai/mlph/display',
    method: 'get',
    params

  })
}
export function create(params) {
  return request({
    url: '/api/ai/mlph',
    method: 'post',
    data:params

  })
}
export function patch(params) {
  return request({
    url: `/api/ai/mlph/${params.id}`,
    method: 'put',
    data:params

  })
}
export function remove(id) {
  return request({
    url: `/api/ai/mlph/${id}`,
    method: 'delete'
  })
}
export function detail(id) {
  return request({
    url: `/api/ai/mlph/${id}`,
    method: 'get'
  })
}
export function tree() {
  return request({
    url: '/api/ai/mlph/tree ',
    method: 'get'
  })
}
export function updateFlag(params) {
  return request({
    url: '/api/ai/mlph/updateFlag',
    method: 'get',
    params
  })
}
export function police(params) {
  return request({
    url: '/api/ai/jwzrq/selectPage',
    method: 'get',
    params
  })
}

export function getObj(id) {
  return request({
    url: '/api/ai/mlph/' + id,
    method: 'get'
  })
}
/**
 * Created by TIMMY on 2018/5/14.
 */
