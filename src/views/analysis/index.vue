<template>
  <div class="analysis-main">
    <router-link to="/" class="logo"><img v-if="logo" :src="logo + '?r=' + new Date().getTime()"></router-link>

    <div class="full-screen" @click="screenfull.toggle()"></div>

    <!-- 左侧图表展示 S -->
    <div class="left-show">
      <div class="left-chart pie-chart">
        <div class="title" @click="test(1)">人员类型分布</div>
        <pie-chart :data="pieChartData" />
      </div>
      <div class="left-chart line-chart">
        <div class="title" @click="test(0)">近一周采集统计</div>
        <line-chart :data="lineChartData" />
      </div>
      <div class="left-chart bar-chart">
        <div class="title" @click="test(2)">近一周预警统计</div>
        <bar-chart :data="barChartData" />
      </div>
    </div>
    <!-- 左侧图表展示 E -->

    <!-- 右侧数据展示 S -->
    <div class="right-show">
      <div class="box" ref="rightShow">
        <!-- 黑名单模板 S -->
        <transition name="blacklist">
          <div class="blacklist" :class="{'elastic': blacklistUpdate}" v-if="blacklist" :ket="blacklist.keyTime">
            <div class="tip">黑名单预警</div>
            <div class="title" v-html="moment(blacklist.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日 HH:mm:ss')"></div>
            <div class="comparison">
              <div class="pic">
                <img :src="blacklist.faceImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">抓拍图片</div>
              </div>
              <cirque-chart width="110px" :data="blacklist.similarity" />
              <div class="pic">
                <img :src="blacklist.labelImageUrl?blacklist.labelImageUrl:blacklist.labelImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">底库照片</div>
              </div>
            </div>
            <div class="info">
              <ul>
                <li class="ellipsis name">
                  <span>姓　　名：</span>{{blacklist.labelName}}
                  <em>{{blacklist.labelTypeName}}</em>
                </li>
                <li class="clear"></li>
                <li>
                  <span>身份证号：</span>{{blacklist.labelNo}}
                </li>
                <li class="clear"></li>
                <li class="ellipsis">
                  <span>捕获地址：</span>{{blacklist.cameraName}}
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <!-- 黑名单模板 E -->

        <!-- 尾随模板 S -->
        <transition name="follow">
          <div class="follow" :class="{'elastic': followUpdate}" v-if="follow" :ket="follow.keyTime">
            <div class="tip">尾随预警</div>
            <div class="title" v-html="moment(follow.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日 HH:mm:ss')"></div>
            <div class="info">
              <div class="portrait">
                <img :src="follow.labelImageUrl?follow.labelImageUrl:follow.labelImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">底库图片</div>
              </div>
              <ul>
                <li class="ellipsis name">
                  <span>姓　名：</span>{{follow.labelName}}
                  <em>尾随</em>
                </li>
                <li class="clear"></li>
                <li>
                  <span>相似度：</span>{{follow.similarity}}%
                </li>
                <li class="clear"></li>
                <li class="ellipsis">
                  <span>地　址：</span>{{follow.cameraName}}
                </li>
                <li class="clear"></li>
                <li>
                  <span>时　间：</span>{{moment(follow.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}
                </li>
              </ul>
            </div>

            <div class="img-list">
              <p>被尾随人员：{{follow.nameLabelList.length}}</p>
              <!-- swiper -->
              <swiper ref="swiper" :options="swiperOption">
                <swiper-slide v-for="(item,index) in follow.nameLabelList" :key="index">
                  <div class="pic" :class="{p1:!follow.isWarn && item.labelNums.indexOf('1') < 0, p2:follow.isWarn}">
                    <div class="top-label">
                      <span>{{item.labelNames.split(',').map(val => val.substr(0, 1)).join('\\')}}</span>
                    </div>
                    <img :src="item.identityImg" error-num="3" @error="onImgError($event, 3)">
                    <div class="mask">{{item.name}}</div>
                  </div>
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
        </transition>
        <!-- 尾随模板 E -->

        <!-- 通用模板 S -->
        <transition-group tag="div" class="ov-hi" name="list-drop">
          <div class="normal" :class="{'elastic': item.elastic}" @animationend="animationEnd(item)" v-for="item in analysisList" :key="item.labelNo">
            <div class="info">
              <div class="pic">
                <img :src="item.labelImageUrl?item.labelImageUrl:item.labelImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">底库图片</div>
              </div>
              <ul>
                <li class="name">
                  <span>姓　名：</span>
                  <label class="ellipsis">{{item.labelName}}</label>
                  <em>{{item.labelTypeName.split(',').map(val => val.substr(0, 1)).join('\\')}}</em>
                </li>
                <li class="clear"></li>
                <li v-if="testShow == 3">
                  <span>身份证号：</span>{{item.labelNo}}
                </li>
                <li class="clear"></li>
                <li>
                  <span>相似度：</span>{{item.similarity}}%
                </li>
                <li class="clear"></li>
                <li class="ellipsis">
                  <span>地　址：</span>{{item.cameraName}}
                </li>
                <li class="clear"></li>
                <li>
                  <span>时　间：</span>{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}
                </li>
              </ul>
            </div>
          </div>
        </transition-group>
        <!-- 通用模板 E -->

        <!-- 空数据模板 S -->
        <div class="null" v-for="index in 10" :key="index">
          暂无数据
        </div>
        <!-- 空数据模板 E -->
      </div>
    </div>
    <!-- 右侧数据展示 E -->

    <!-- 中间区域展示 S -->
    <div class="camera-region" ref="cameraRegion">
      <div class="show" ref="regionShow">
        <img :src="bgImg" class="bg">
        <div class="camera" :style="{'left': parseInt(cameraItem.mapPositionArr[0])+'px', 'top': parseInt(cameraItem.mapPositionArr[1])+'px'}" :class="{'warn':cameraTypeList[cameraItem.id]}" v-for="cameraItem in initCameraData" :key="cameraItem.id">
          <el-tooltip placement="bottom" :open-delay="200">
            <div class="icon"></div>
            <div slot="content">
              {{cameraItem.cameraName}}
            </div>
          </el-tooltip>
          <transition-group tag="ul" name="list-rise">
            <li :class="{'warn-item': item.isWarn, 'vanish': (cameraList[cameraItem.id].length>1 && index!==cameraList[cameraItem.id].length-1), 'hide': (cameraList[cameraItem.id].length>2 && index+2<cameraList[cameraItem.id].length)}" v-for="(item,index) in cameraList[cameraItem.id]" :key="item.id">
              <img :src="item.url" class="pic" error-num="3" @error="onImgError($event, 3)">
              <div class="t1">抓拍时间</div>
              <div class="t2">{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')}}</div>
            </li>
          </transition-group>
        </div>
      </div>
    </div>
    <!-- 中间区域展示 E -->

    <!-- 实时抓拍 S -->
    <div class="real-time-snapshot">
      <div class="title">实时抓拍</div>
      <div class="list">
        <div class="tip" v-if="!imgList.length">暂无数据</div>
        <transition-group name="list" class="box" tag="div">
          <el-tooltip placement="top" :open-delay="200" v-for="item in imgList" :key="item.id" effect="light">
            <div :class="{warn:!item.isFollow && item.isWarn, p1:(!item.isWarn && item.labelType.indexOf('1') < 0) || item.isFollow}" class="pic">
              <div class="top-label">
                <span>{{item.isFollow?'尾随':item.labelName}}</span>
              </div>
              <img :src="item.url" error-num="3" @error="onImgError($event, 3)">
              <div class="mask">{{item.cameraName}}</div>
            </div>
            <div slot="content">
              {{item.cameraName}}
            </div>
          </el-tooltip>
        </transition-group>
      </div>
    </div>
    <!-- 实时抓拍 E -->

    <!-- 总数统计 S -->
    <div class="statistics" ref="statistics">
      <div class="item i1">
        <div class="title">今日总人数</div>
        <iCountUp class="txt" ref="statisticsCount1" :startVal="0" :endVal="statistics.labelTotal" :decimals="0" :duration="2" :options="countUpOptions" />
      </div>
      <div class="item i2">
        <div class="title">人脸采集</div>
        <iCountUp class="txt" ref="statisticsCount2" :startVal="0" :endVal="statistics.snapTotal" :decimals="0" :duration="2" :options="countUpOptions" />
      </div>
      <div class="item i3">
        <div class="title">预警人次<span @click="onOpenLayer()">详情</span></div>
        <iCountUp class="txt" ref="statisticsCount3" :startVal="0" :endVal="statistics.blackTotal" :decimals="0" :duration="2" :options="countUpOptions" />
      </div>
    </div>
    <!-- 总数统计 E -->

    <!-- 黑名单列表 S -->
    <div class="blacklist-layer" :class="{show: blacklistLayerShow, hide: !blacklistLayerShow}" v-if="isInit">
      <div class="mask" @click="blacklistLayerShow = false"></div>
      <div class="box">
        <div class="title">
          <i class="el-icon-d-arrow-right"></i>黑名单
          <div class="total">
            <span>{{moreBlacklist.length}}</span>/人
          </div>
        </div>
        <transition-group name="blacklist" class="list" tag="div">
          <div class="item" :class="{'elastic': item.elastic}" @animationend="animationEnd(item)" v-for="item in moreBlacklist" :key="item.labelNo">
            <div class="comparison">
              <div class="pic">
                <img :src="item.faceImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">抓拍图片</div>
              </div>
              <cirque-chart width="100px" :data="item.similarity" />
              <div class="pic">
                <img :src="item.labelImageUrl?item.labelImageUrl:item.labelImage" error-num="3" @error="onImgError($event, 3)">
                <div class="mask">底库照片</div>
              </div>
            </div>
            <div class="info">
              <ul>
                <li class="w100">
                  <span>姓　　名：{{item.labelName}}</span>
                  <em>【{{item.labelTypeName}}】</em>
                </li>
                <li class="w100">
                  <span>身份证号：</span>{{item.labelNo}}
                </li>
                <li class="w100">
                  <span>地点：{{item.cameraName}}</span>
                </li>
                <li class="w100">时间：{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}</li>
              </ul>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <!-- 黑名单列表 E -->

    <!-- 语音提示 -->
    <audio :src="audioUrl" class="audio" ref="audio"></audio>
  </div>
</template>
<script>
import moment from "moment";
import { mapState } from "vuex";
import { debounce } from "@/utils";
import { getToken } from "@/utils/auth";

import screenfull from "screenfull";
import iCountUp from "vue-countup-v2";

import { query } from "@/api/camera";
import { getAnalysisHistoryList } from "@/api/analysis";
import { getCommunity } from "@/api/community";
import { getBasicInfo } from "@/api/login";

import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "analysis",
  data() {
    return {
      bgImg: null,
      testShow: 0,

      isInit: false,
      blacklistLayerShow: false,

      ip:
        process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      moment: moment,
      screenfull: screenfull,
      isDestroy: false,
      webSocket: null,
      followUpdate: false,
      blacklistUpdate: false,
      statistics: {
        labelTotal: 0,
        snapTotal: 0,
        blackTotal: 0
      },
      initCameraData: [],
      swiperList: [],

      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 5,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },

      pieChartData: [],
      lineChartData: [],
      barChartData: [],

      audioUrl: null,
      logo: null
    };
  },
  computed: {
    ...mapState({
      imgList: state => state.analysis.imgList, // 图片列表
      cameraList: state => state.analysis.cameraList, // 摄像头数据
      cameraIdList: state => state.analysis.cameraIdList, // 摄像头位置列表
      cameraTypeList: state => state.analysis.cameraTypeList, // 摄像头状态
      follow: state => state.analysis.follow, // 尾随
      blacklist: state => state.analysis.blacklist, // 黑名单
      moreBlacklist: state => state.analysis.moreBlacklist, // 黑名单列表
      analysisList: state => state.analysis.analysisList // 分析数据
    })
  },
  watch: {
    "blacklist.keyTime": function(val) {
      !!val && this.audioPlay(`http://${this.ip}/images/voice/black.mp3`);

      this.blacklistUpdate = false;
      this.$nextTick(() => {
        this.blacklistUpdate = true;
      });
    },
    "follow.keyTime": function(val) {
      !!val && this.audioPlay(`http://${this.ip}/images/voice/after.mp3`);

      this.followUpdate = false;
      this.$nextTick(() => {
        this.followUpdate = true;
      });
    },
    swiperList(val) {
      this.$nextTick(() => {
        this.$refs.swiper.swiper.slideTo(val.length, 1000, false);
      });
    },
    statistics: {
      handler: function(val, oldVal) {
        this.$nextTick(() => {
          this.$refs.statisticsCount1.update(val.labelTotal);
          this.$refs.statisticsCount2.update(val.snapTotal);
          this.$refs.statisticsCount3.update(val.blackTotal);
        });
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initCamera();
  },
  mounted() {
    this.statisticsZoom();
    this.regionZoom();
    this.rightZoom();
    this.resizeHanlder = debounce(() => {
      this.statisticsZoom();
      this.regionZoom();
      this.rightZoom();
    }, 100);
    window.addEventListener("resize", this.resizeHanlder);
  },
  beforeDestroy() {
    this.isDestroy = true;

    this.webSocket && this.webSocket.close();
  },
  components: {
    iCountUp,
    swiper,
    swiperSlide,
    "pie-chart": () => import("./components/PieChart"),
    "line-chart": () => import("./components/LineChart"),
    "bar-chart": () => import("./components/BarChart"),
    "cirque-chart": () => import("./components/CirqueChart")
  },
  methods: {
    test(val) {
      if (this.testShow == val) {
        this.testShow++;
      } else {
        this.testShow = 0;
      }
    },
    onImgError(ev) {
      let errorNum = parseInt(ev.target.getAttribute("error-num"));
      if (errorNum > 0) {
        setTimeout(() => {
          ev.target.setAttribute("error-num", errorNum - 1);
          ev.target.src = ev.target.src;
        }, 500);
      }
    },
    onOpenLayer() {
      this.isInit = true;
      this.blacklistLayerShow = true;
    },
    audioPlay(url) {
      this.audioUrl = url;
      this.$nextTick(() => {
        let _audio = this.$refs.audio;
        if (_audio.readyState == 4) {
          _audio.pause();
          _audio.play();
        } else {
          _audio.addEventListener("canplaythrough", () => {
            _audio.pause();
            _audio.play();
          });
        }
      });
    },
    animationEnd(item) {
      item.elastic = false;
    },
    // 区域缩放控制
    statisticsZoom() {
      let _zoom = Math.min(
        (this.$el.clientHeight * 0.1) / this.$refs.statistics.clientHeight,
        this.$el.clientWidth / 1920
      );
      this.$refs.statistics.style.transform = `scale(${_zoom})`;
    },
    // 区域缩放控制
    regionZoom() {
      let _zoom = Math.min(
        this.$refs.cameraRegion.clientHeight /
          this.$refs.regionShow.clientHeight,
        this.$refs.cameraRegion.clientWidth / this.$refs.regionShow.clientWidth
      );
      this.$refs.regionShow.style.transform = `scale(${_zoom})`;
    },
    // 右侧缩放控制
    rightZoom() {
      let _zoom = (this.$el.clientWidth * 0.203125) / 390;
      this.$refs.rightShow.style.transform = `scale(${_zoom})`;
    },
    initCamera() {
      getCommunity().then(res => {
        this.bgImg = res.data.realMapUrl;
      });
      getBasicInfo().then(res => {
        this.logo = res.data.bigDataLogo;
      });
      query({
        offset: 1,
        limit: 100
      }).then(res => {
        let _data = res.data.rows;

        let _arr = [];
        let _idArr = [];
        _data.map(item => {
          if (item.mapPosition) {
            item.mapPositionArr = item.mapPosition.split(",");
            if (item.mapPositionArr.length === 2) {
              _arr.push(item);
              _idArr.push(item.id);
            }
          }
        });
        this.initCameraData = _arr;
        this.$store.dispatch("analysis/setCamera", _idArr).then(() => {
          getAnalysisHistoryList()
            .then(res => {
              if (res.status == 200) {
                this.$store.dispatch(
                  "analysis/saveBlacklist",
                  res.data.blackList.reverse()
                );
                this.$store.dispatch(
                  "analysis/init",
                  res.data.allList.reverse()
                );
              }
            })
            .finally(err => {
              this.initWebSocket();
            });
        });
      });
    },
    initWebSocket() {
      this.webSocket = new WebSocket(
        `${location.protocol.includes('https') ? "wss" : "ws"}://${this.ip}/websocket/push/${getToken()}`
      );
      //打开事件
      this.webSocket.onopen = () => {
        console.log("webSocket 已打开");
      };
      //获得消息事件
      this.webSocket.onmessage = msg => {
        try {
          let _data = JSON.parse(msg.data);

          if (typeof _data === "object" && _data.code == 0) {
            location.reload();
          }
          if (typeof _data === "object" && _data.code == 2) {
            this.$store.dispatch("analysis/push", JSON.parse(_data.message));
          }
          if (typeof _data === "object" && _data.code == 3) {
            let _json = JSON.parse(_data.message);
            this.statistics = _json.snapInfo; // 统计更新
            this.pieChartData = _json.dayLabel; // 人员类型分布更新
            this.lineChartData = _json.daySnap; // 近一周流量统计更新
            this.barChartData = _json.dayBlack; // 近一周报警记录更新
          }
        } catch (err) {}
      };
      //关闭事件
      this.webSocket.onclose = () => {
        console.log("Socket已关闭");
        if (!this.isDestroy) {
          this.webSocket = null;
          setTimeout(() => {
            this.initWebSocket();
          }, 1000);
        }
      };
      //发生了错误事件
      this.webSocket.onerror = () => {
        console.log("Socket发生了错误");
      };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/analysis.scss";
</style>