<template>
  <div class="attendance-view">
    <!-- 头部 S -->
    <div class="head">
      <router-link to="/" class="logo">{{title}}</router-link>
    </div>
    <!-- 头部 S -->

    <!-- 倒计时 S -->
    <div class="countdown" ref="countdown">
      <p class="t1">{{currentDate[1]}}</p>
      <p class="t2"><b>{{currentDate[0]}}</b> {{currentDate[2]}}</p>
    </div>
    <!-- 倒计时 E -->

    <!-- 左侧访客 S -->
    <div class="left-box">
      <div class="title" ref="leftTitle">
        今日访客
        <!-- <span>0</span> -->
      </div>
      <div class="box">
        <div class="list">
          <div class="list-box" ref="leftList">
            <transition-group tag="div" name="left-list">
              <div class="item" :class="{i1:item.labelArr.includes('4'), i2:item.isWarn, sel:index==0 && bgShow[0]}" v-for="(item,index) in visitorData" :key="item.key">
                <div class="bg"></div>
                <div class="pic"><img :src="item.labelImageUrl?item.labelImageUrl:item.labelImage"></div>
                <div class="name"><em>{{item.labelTypeNames}}</em>{{item.labelName}}</div>
                <div class="time">{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}</div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧访客 E -->

    <!-- 主模块 S -->
    <div class="main-box">
      <div class="title">人脸实时采集</div>
      <div class="box">
        <div class="zoom" ref="mainBox">
          <div class="column" v-for="column in realTimeData" :key="column.key">
            <transition-group tag="div" name="main-list">
              <div class="item" :class="{i1:item.labelArr.includes('32'), i2:item.isWarn, elastic:(newestKey==item.newestKey && elasticAnimation) || newestKey == item.key, sel:(newestKey==item.newestKey || newestKey==item.key) && bgShow[1]}" @animationend="animationEnd" v-for="item in column.data" :key="item.key">
                <em>{{item.labelTypeNames}}</em>
                <div class="pic"><img :src="item.labelImageUrl?item.labelImageUrl:item.labelImage"></div>
                <ul>
                  <li class="name">{{item.labelName}}</li>
                  <li class="time">{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}</li>
                  <li class="status">{{item.txt}}</li>
                </ul>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 主模块 E -->

    <!-- 右侧考勤 S -->
    <div class="right-box">
      <div class="title" ref="rightTitle">
        今日考勤
        <span><label>{{attendanceIdData.length}}</label>/{{attendanceCount}}</span>
      </div>
      <div class="box">
        <div class="list">
          <div class="list-box" ref="rightList">
            <transition-group tag="div" name="right-list">
              <div class="item" :class="{warn:item.isWarn, sel:index==0 && bgShow[2]}" v-for="(item,index) in attendanceData" :key="item.key">
                <div class="bg"></div>
                <div class="pic"><img :src="item.labelImageUrl?item.labelImageUrl:item.labelImage"></div>
                <div class="name">{{item.labelName}}</div>
                <div class="time">{{moment(item.imageTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}}</div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧考勤 E -->

    <!-- 页脚 S -->
    <div class="footer" ref="footer">{{version}}</div>
    <!-- 页脚 E -->
  </div>
</template>
<script>
import { debounce } from "@/utils";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";

import { getHistoryList } from "@/api/attendanceView";
import { getBasicInfo } from "@/api/login";

export default {
  name: "attendanceView",
  data() {
    return {
      ip: process.env.NODE_ENV === "development" ? process.env.IP : location.host,
      timer: null,
      currentDate: [],
      isDestroy: false,
      webSocket: null,
      title: null,
      version: null,

      bgShow: [],
      bgTimer: [],

      listData: [],
      mainData: [],
      attendanceCount: 0,
      elasticAnimation: false,
    }
  },
  computed: {
    ...mapState({
      attendanceData: state => state.attendanceView.attendanceData,
      attendanceIdData: state => state.attendanceView.attendanceIdData,
      realTimeData: state => state.attendanceView.realTimeData,
      realTimeTotal: state => state.attendanceView.realTimeTotal,
      newestKey: state => state.attendanceView.newestKey,
      visitorData: state => state.attendanceView.visitorData,
    })
  },
  watch: {
    visitorData: {
      handler() {
        this.bgControl(0);
      },
      immediate: true,
      deep: true
    },
    newestKey: {
      handler() {
        this.elasticAnimation = true;
        this.bgControl(1);
      },
      immediate: true,
      deep: true
    },
    attendanceData: {
      handler() {
        this.bgControl(2);
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.dateTimer();
    this.init();
  },
  beforeDestroy() {
    this.isDestroy = true;

    this.webSocket && this.webSocket.close();
  },
  mounted() {
    this.resizeHanlder = debounce(() => {
      this.commonZoom();
    }, 100);
    window.addEventListener("resize", this.resizeHanlder);
    this.resizeHanlder();
  },
  methods: {
    test() {
      this.$store.dispatch("attendanceView/push", {
        cameraCode: "198",
        cameraId: 3,
        cameraName: "大门进",
        faceImage: "/images/snap/20190320/340681198308088088/32a025868a684e5f8f7a44fb6682e501_0.jpg",
        imageTime: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        imgBgUrl: "/images/facebg/20190320/3/20190320145437_1350.jpg",
        imgTimeFormat: "1970-01-01 08:00:00",
        labelAge: "36",
        labelImage: "",
        labelImageUrl: "/images/label/340681198308088088/4713.jpg",
        labelName: "纪艺能",
        labelNo: "340681198308088088",
        labelTypeCode: "1,8",
        labelTypeName: "业主库,黑名单",
        similarity: "99.74",
      });
    },
    bgControl(index) {
      this.bgTimer[index] && clearTimeout(this.bgTimer[index]);
      this.$set(this.bgShow, index, true);
      this.$set(this.bgTimer, index,
        setTimeout(() => {
          this.$set(this.bgShow, index, false);
        }, 3000)
      );
    },
    animationEnd() {
      this.elasticAnimation = false;
    },
    init() {
      getBasicInfo().then(res => {
        this.title = res.data.checkAppName;
        this.version = res.data.loginAppVersionCn;
      });
      getHistoryList({ top: 60 }).then(res => {
        if (res.status == 200) {
          let _newArr = res.data.allList.concat(res.data.blackList);
          _newArr.sort((a, b) => {
            return this.moment(a.imageTime, 'YYYY-MM-DD hh:mm:ss').valueOf() - this.moment(b.imageTime, 'YYYY-MM-DD hh:mm:ss').valueOf();
          });
          this.$store.dispatch("attendanceView/init", {
            list: _newArr,
            idArr: res.data.whiteList
          });
          this.attendanceCount = res.data.whiteCnt;
        }
      }).finally(err => {
        this.initWebSocket();
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
            this.$store.dispatch("attendanceView/push", JSON.parse(_data.message));
          }
          // if (typeof _data === "object" && _data.code == 3) {
          //   let _json = JSON.parse(_data.message);
          //   this.statistics = _json.snapInfo; // 统计更新
          //   this.pieChartData = _json.dayLabel; // 人员类型分布更新
          //   this.lineChartData = _json.daySnap; // 近一周流量统计更新
          //   this.barChartData = _json.dayBlack; // 近一周报警记录更新
          // }
        } catch (err) { }
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
    },
    dateTimer() {
      this.currentDate = [this.moment().format("YYYY.MM.DD"), this.moment().format("hh:mm:ss"), this.moment().format("dddd")];
      this.timer = setTimeout(this.dateTimer, 1000);
    },
    commonZoom() {
      let _zoom = 1 / 1920 * this.$el.clientWidth;
      this.$refs.countdown.style.transform = `scale(${_zoom})`;
      this.$refs.leftTitle.style.transform = `scale(${_zoom})`;
      this.$refs.leftList.style.transform = `scale(${_zoom})`;
      this.$refs.mainBox.style.transform = `scale(${_zoom})`;
      this.$refs.rightTitle.style.transform = `scale(${_zoom})`;
      this.$refs.rightList.style.transform = `scale(${_zoom})`;
      this.$refs.footer.style.transform = `scale(${_zoom})`;
    },
  },
}
</script>
<style lang="scss" scoped>
@import "~@/styles/attendanceView.scss";
</style>