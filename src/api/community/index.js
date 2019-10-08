import request from '@/utils/request'

export function getCommunity() {
  return request({
    url: `/api/ai/community/info`,
    method: 'get'
  })
}

export function putCommunity(id, data) {
  return request({
    url: `/api/ai/community/${id}`,
    method: 'put',
    data
  })
}

export function getMlphTree() {
  return request({
    url: `/api/ai/mlph/tree`,
    method: 'get'
  })
}

export function postMlph(data) {
  return request({
    url: `/api/ai/mlph`,
    method: 'post',
    data
  })
}

export function deleteMlph(id) {
  return request({
    url: `/api/ai/mlph/${id}`,
    method: 'delete'
  })
}

export function putMlph(data) {
  return request({
    url: `/api/ai/mlph/${data.id}`,
    method: 'put',
    data
  })
}

export function getMlph(id) {
  return request({
    url: `/api/ai/mlph/${id}`,
    method: 'get'
  })
}

export function getFromInternet() {
  return request({
    url: `/api/ai/mlph/pull`,
    method: 'get'
  })
}