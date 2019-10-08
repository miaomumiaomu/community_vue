import request from '@/utils/request'

// 获取库模型配置列表
export function getLibraryModelList(params) {
  return request({
    url: `/api/ai/libraryModel/list`,
    method: 'get',
    params
  })
}

// 获取库模型配置
export function getLibraryModel(id) {
  return request({
    url: `/api/ai/libraryModel/${id}`,
    method: 'get'
  })
}
// 修改库模型配置
export function putLibraryModel(data) {
  return request({
    url: `/api/ai/libraryModel/${data.id}`,
    method: 'put',
    data
  })
}

// 获取模型菜单
export function getModelMenu() {
  return request({
    url: `/api/ai/model/selectPage`,
    method: 'get'
  })
}

// 添加模型
export function postModel(data) {
  return request({
    url: '/api/ai/model',
    method: 'post',
    data
  })
}

// 删除模型
export function deleteModel(id) {
  return request({
    url: `/api/ai/model/${id}`,
    method: 'delete'
  })
}

// 修改模型
export function putModel(data) {
  return request({
    url: `/api/ai/model/${data.id}`,
    method: 'put',
    data
  })
}

// 获取模型
export function getModel(id) {
  return request({
    url: `/api/ai/model/${id}`,
    method: 'get'
  })
}