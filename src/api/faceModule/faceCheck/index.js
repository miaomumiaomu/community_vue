import request from '@/utils/request'

export function postFaceCheck(data) {
  return request({
    url: '/api/ai/image/faceAlign',
    method: 'POST',
    data
  })
}