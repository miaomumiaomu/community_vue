/**
 * 轨迹接口
 */
import Mock from 'mockjs'
import request from '@/utils/request'

// 提交以图搜图
export function postImageSearch(params) {
  return request({
    url: '/api/ai/image/search',
    method: 'POST',
    data: params
  })
}

// 获取用户轨迹
export function getUsetTrajectory(params) {
  return request({
    url: '/api/ai/snap/trackList',
    method: 'get',
    params: params
  })
}

// 获取轨迹列表
export function getTrajectoryList(params) {
  return request({
    url: '/api/ai/snap/trackPage',
    method: 'get',
    params: params
  })
}

// 获取轨迹详情
export function getTrajectoryDetails(id) {
  return request({
    url: `/api/ai/snap/trackDetail/${id}`,
    method: 'get'
  })
}

export function getPersonnelList(params) {
  Mock.mock('http://ts.com/trajectory/personnelList', {
    "list|10": [{
      "id|+1": 1000,
      name: "@cname",
      identify: '@string("number", 18)',
      time: "@datetime()",
      type: "@ctitle(3, 3)",
      pic: "@dataImage('100x100')",
      "frequency|20-1000": 1,
      remark: "@ctitle(3, 8)"
    }]
  });
  return request({
    url: 'http://ts.com/trajectory/personnelList',
    method: 'POST',
    data: params
  })
}
