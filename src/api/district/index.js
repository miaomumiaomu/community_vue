import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/ai/xzq/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/ai/xzq',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/ai/xzq/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/ai/xzq/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/ai/xzq/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function tree() {
  return request({
    url: '/api/ai/xzq/tree',
    method: 'get'
  })
}

export function updateFlag(params) {
  return request({
    url: '/api/ai/xzq/updateFlag',
    method: 'get',
    params
  })
}
