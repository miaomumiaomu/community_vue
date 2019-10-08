import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import user from './modules/user';
import district from './modules/district';
import towns from './modules/towns';
import village from './modules/village';
import street from './modules/street';
import unit from './modules/unit';
import policeman from './modules/policeman';
import policeStation from './modules/policeStation';
import camera from './modules/camera';
import data from './modules/data';
import terminal from './modules/terminal';
import analysis from './modules/analysis';
import realTimeSnapshot from './modules/realTimeSnapshot';
import allSearch from './modules/allSearch';
import carBigData from './modules/carBigData';
import attendanceView from './modules/attendanceView';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    district,
    towns,
    village,
    street,
    unit,
    policeman,
    policeStation,
    camera,
    data,
    terminal,
    analysis,
    realTimeSnapshot,
    allSearch,
    carBigData,
    attendanceView
  },
  getters
});

export default store
