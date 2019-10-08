import request from '@/utils/request'

// 获取布控任务列表
export function getMonitorTaskList(params) {
  return request({
    url: `/api/ai/monitor/list`,
    method: 'get',
    params
  })
}

// 获取布控任务列表
export function getMonitorTaskSelect() {
  return request({
    url: `/api/ai/monitor/selectPage`,
    method: 'get'
  })
}

// 添加布控任务
export function postMonitorTask(data) {
  return request({
    url: `/api/ai/monitor/save`,
    method: 'post',
    data
  })
}

// 编辑布控任务
export function putMonitorTask(data) {
  return request({
    url: `/api/ai/monitor/update`,
    method: 'put',
    data
  })
}

// 获取布控任务
export function getMonitorTask(id) {
  return request({
    url: `/api/ai/monitor/detail/${id}`,
    method: 'get'
  })
}

// 获取负责人树
export function getResponsibleTree() {
  return request({
    url: `/api/admin/user/departUserTree`,
    method: 'get'
  })
}

// 获取负责人树
export function getOverview() {
  return request({
    url: `/api/ai/monitor/overview`,
    method: 'get'
  })
}