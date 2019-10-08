import request from '@/utils/request'

export function getSystemConfig(data) {
  return request({
    url: 'api/ai/sysConfig/getInfo',
    method: 'get',
  })
}

export function postSystemConfig(data) {
  return request({
    url: 'api/ai/sysConfig/update',
    method: 'post',
    data
  })
}