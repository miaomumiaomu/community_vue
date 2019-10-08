import moment from "moment";
import { getHistoryTrailList } from "@/api/analysis";

function dataArrange(commit, data, key, isInit) {
  data.keyTime = key;
  data.isWarn = data.labelTypeCode.split(',').includes('8');
  data.isFollow = data.nameLabelList && data.nameLabelList.length > 0;

  // 黑名单处理
  if (data.isWarn) {
    commit('saveBlacklist', data);
  }

  commit('saveAnalysisList', { json: data, isInit });
}

function dateConvert(val) {
  return moment(val, 'YYYYMMDDHHmmss').valueOf() / 1000
}

export default {
  namespaced: true,
  state: {
    blacklist: [], // 黑名单
    blacklistId: [], // 黑名单
    analysisList: [], // 正常数据
    analysisIdList: [], // 正常数据Key
    analysisListTotal: 10 // 数据列表总数
  },
  mutations: {
    saveAnalysisList(state, { json, isInit }) {
      setTimeout(() => {
        let _index = state.analysisIdList.indexOf(json.labelNo);

        if (_index >= 0) {// 人员已存在做去重处理
          // 抛弃数据处理
          if (state.analysisList[_index].cameraId === json.cameraId && dateConvert(json.imageTime) - dateConvert(state.analysisList[_index].imageTime) < 30) {
            return;
          }

          let _newData = json;
          _newData.trailList = state.analysisList[_index].trailList;
          // 往轨迹列表里插入数据
          let _trailList = _newData.trailList;
          _trailList.splice(0, 0, {
            keyTime: json.keyTime,
            imgBgUrl: json.imgBgUrl,
            imageTime: json.imageTime,
            cameraName: json.cameraName
          })

          // 超出清理
          if (_trailList.length > 10) {
            _trailList.splice(10, _trailList.length);
          }

          // 更新数据
          if (_index == 0) {// 该人员在第一条
            // 更新信息
            state.analysisList.splice(_index, 1, _newData);
          } else {// 人员不在第一条，把该人员移动到第一条
            // 先删除
            state.analysisList.splice(_index, 1);
            state.analysisIdList.splice(_index, 1);
            // 后添加
            state.analysisList.splice(0, 0, _newData);
            state.analysisIdList.splice(0, 0, _newData.labelNo);
          }
        } else { // 人员不存在直接添加人员
          json.trailList = [];

          state.analysisIdList.splice(0, 0, json.labelNo);
          state.analysisList.splice(0, 0, json);

          // 如果是页面初始化做默认处理。否则新人员需要结合历史记录处理
          if (isInit) {
            state.analysisList[0].trailList.splice(0, 0, {
              keyTime: json.keyTime,
              imgBgUrl: json.imgBgUrl,
              imageTime: json.imageTime,
              cameraName: json.cameraName
            })
          } else {
            // 查询历史
            getHistoryTrailList({
              top: 10,
              identityNo: json.labelNo
            }).then(res => {
              if (res.status === 200) {
                let newJson = [json].concat(res.data).reverse();
                newJson.map((item, index) => {
                  // 判断当前时间小于最新时间5秒
                  if (index == 0 || json.imageTime - item.imageTime > 5) {
                    state.analysisList[0].trailList.splice(0, 0, {
                      keyTime: item.keyTime || (new Date().getTime() + index),
                      imgBgUrl: item.imgBgUrl,
                      imageTime: item.imageTime,
                      cameraName: item.cameraName
                    })
                  }
                })
              }
            });
          }
        }

        // 超出清理
        if (state.analysisList.length > state.analysisListTotal) {
          state.analysisList.splice(state.analysisListTotal, state.analysisList.length);
          state.analysisIdList.splice(state.analysisListTotal, state.analysisIdList.length);
        }
      }, 1);
    },
    saveBlacklist(state, json) {
      let _index = state.blacklistId.indexOf(json.labelNo);

      if (_index >= 0) {// 人员已存在做去重处理
        if (_index == 0) {// 该人员在第一条
          // 重复提示
          json.elastic = true;
          // 更新信息
          state.blacklist.splice(_index, 1, json);
        } else {// 人员不在第一条，把该人员移动到第一条
          // 先删除
          state.blacklist.splice(_index, 1);
          state.blacklistId.splice(_index, 1);
          // 后添加
          state.blacklist.splice(0, 0, json);
          state.blacklistId.splice(0, 0, json.labelNo);
        }
      } else { // 人员不存在直接添加人员
        state.blacklistId.splice(0, 0, json.labelNo);
        state.blacklist.splice(0, 0, json);
      }

      // 超出清理
      if (state.blacklist.length > 20) {
        state.blacklist.splice(20, state.blacklist.length);
        state.blacklistId.splice(20, state.blacklistId.length);
      }
    }
  },
  actions: {
    async push({ commit }, data) {
      dataArrange(commit, data, new Date().getTime())
    },
    async init({ commit }, list) {
      for (var i = 0; i < list.length; i++) {
        await dataArrange(commit, list[i], (new Date().getTime() + i), true)
      }
    },
    async reset({ state }) {
      state.blacklist = []; // 黑名单
      state.blacklistId = []; // 黑名单Key
      state.analysisList = []; // 正常数据
      state.analysisIdList = []; // 正常数据Key
    }
  }
}
