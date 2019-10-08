import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  tree,
  updateFlag
} from '@/api/district'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 列表
    query({commit}, params){
      return page(params);
    },
    create({commit}, params){
      return addObj(params);
    },
    // 详情
    detail({commit}, id){
      return getObj(id)
    },
    // 删除
    remove({commit}, id){
      return delObj(id)
    },
    // 编辑
    patch({commit}, params){
      return putObj(params)
    },
    // 树形
    tree(){
      return tree()
    },
    // 更新禁用状态
    updateFlag({commit}, params){
      return updateFlag(params)
    }
  }
}

