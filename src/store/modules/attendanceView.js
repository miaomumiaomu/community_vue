// 数据整理
function dataArrange(state, commit, data, key) {
  let _labelArr = data.labelTypeCode.split(',');

  data.key = key; // 时间戳，唯一标识
  data.labelArr = _labelArr;
  data.labelTypeNames = data.labelTypeName.split(',').map(val => val.substr(0, 1)).join('\\');
  data.isWarn = _labelArr.includes('8'); // 识别黑名单

  // 添加访客，过滤业主
  if (_labelArr.length != 1 || !_labelArr.includes('1')) {
    commit('saveVisitor', data);
  }

  // 添加实时抓拍，过滤陌生人
  if (_labelArr.length != 1 || !_labelArr.includes('4')) {
    commit('saveRealTime', data);
  }

  // 添加考勤记录
  if (_labelArr.includes('1')) {
    commit('saveAttendance', data);
  }
}

export default {
  namespaced: true,
  state: {
    attendanceData: [],
    attendanceIdData: [],
    realTimeData: [],
    realTimeTotal: 0,
    newestId: [],
    newestKey: null,
    visitorData: [],
  },
  mutations: {
    saveAttendanceIdList(state, arr) {
      state.attendanceIdData = arr;
    },
    saveAttendance(state, json) {
      if (!state.attendanceIdData.includes(json.labelNo)) {
        state.attendanceData.splice(0, 0, json);
        state.attendanceIdData.push(json.labelNo);

        if (state.attendanceData.length > 40) {
          state.attendanceData.splice(40, state.attendanceData.length);
        }
      } else {
        let _index = state.attendanceData.map(item => item.labelNo).indexOf(json.labelNo);
        state.attendanceData.splice(_index, 1);
        state.attendanceData.splice(0, 0, json);
      }
    },
    saveRealTime(state, json) {
      json = JSON.parse(JSON.stringify(json));
      let _index = state.newestId.indexOf(json.labelNo);

      // 黑名单优先
      if (json.isWarn) {
        json.txt = "请注意";
      } else {
        json.txt = json.labelArr.includes('1') ? "签到成功" : "欢迎您的到访！";
      }

      if (_index >= 0) {
        let _row = state.realTimeData[_index];

        state.newestKey = json.key;
        _row.data[0] = Object.assign(json, {
          key: _row.data[0].key,
          newestKey: json.key
        });
      } else {
        let _key = state.realTimeTotal % 3;
        let _row = state.realTimeData[_key];

        if (_row) {
          _row.data.splice(0, 0, json);

          if (_row.length > 15) {
            _row.splice(15, _row.length);
          }
        } else {
          state.realTimeData[_key] = {
            key: _key,
            data: [json]
          };
        }

        state.newestId[_key] = json.labelNo;
        state.newestKey = json.key;

        state.realTimeTotal++;
      }
    },
    saveVisitor(state, json) {
      state.visitorData.splice(0, 0, json);

      if (state.visitorData.length > 100) {
        state.visitorData.splice(100, state.visitorData.length);
      }
    }
  },
  actions: {
    async push({ state, commit }, data) {
      dataArrange(state, commit, data, new Date().getTime())
    },
    async init({ state, commit }, { list, idArr }) {
      for (var i = 0; i < list.length; i++) {
        dataArrange(state, commit, list[i], (new Date().getTime() + i));
      }
      commit('saveAttendanceIdList', idArr);
    }
  }
}
