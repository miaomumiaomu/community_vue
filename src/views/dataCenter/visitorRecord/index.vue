<template>
  <div class="app-container">
    <!-- 表单筛选 -->
    <el-form class="form" ref="listForm" :model="listQuery" :inline="true" @keyup.enter.native="onSubmit">
      <span>访客姓名</span>
      <el-form-item prop="name">
        <el-input size="mini" v-model="listQuery.name" />
      </el-form-item>
      <span>访客证件</span>
      <el-form-item prop="identityNo">
        <el-input size="mini" v-model="listQuery.identityNo" />
      </el-form-item>
      <span>被访人姓名</span>
      <el-form-item prop="respondentsName">
        <el-input size="mini" v-model="listQuery.respondentsName" />
      </el-form-item>
      <span>被访人证件</span>
      <el-form-item prop="respondentsIdentityNo">
        <el-input size="mini" v-model="listQuery.respondentsIdentityNo" />
      </el-form-item>
      <span>时间</span>
      <el-form-item prop="timeStart">
        <el-date-picker size="mini" v-model="pickerValue[0]" type="datetime" @change="onStartTimeChange" placeholder="请选择开始时间" :picker-options="singlePickerOptions()" />
      </el-form-item>
      <el-form-item prop="timeEnd">
        <el-date-picker size="mini" v-model="pickerValue[1]" type="datetime" @change="onEndTimeChange" placeholder="请选择结束时间" :picker-options="singlePickerOptions(pickerValue[0])" />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="onResetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        访客记录
        <em>{{listTableData.total?listTableData.total:0}}</em>
      </div>
    </div>

    <!-- 表格 S -->
    <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row @selection-change="onListChange">
      <el-table-column align="center" width="70" label="照片">
        <template slot-scope="scope">
          <img-show class="pic" width="48px" height="48px" text="暂无头像" :img-src="scope.row.snapUrl" />
        </template>
      </el-table-column>
      <el-table-column width="180" prop="name" label="姓名/证件">
        <template slot-scope="scope">
          <div class="identity txt">
            <label>{{scope.row.name}}</label>
            <p>{{scope.row.identityNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accessName" label="门禁设备" />
      <el-table-column prop="pass_time" label="到访时间" />
      <el-table-column prop="respondentsName" label="被访人姓名" />
      <el-table-column prop="respondentsIdentityNo" label="被访人证件" />
      <el-table-column fixed="right" min-width="130" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="onLookPicture(scope.row)" v-permission="'snapMan:btn_snap_bg'">背景</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.offset" :page-sizes="[50,100,300]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total"></el-pagination>

    <!-- 图片弹窗 -->
    <el-dialog title="背景大图" :visible.sync="isBgDialog">
      <img :src="rowBgImg" class="w100">
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { singlePickerOptions } from "@/utils";

import { page } from "@/api/dataCenter/visitorRecord/index";

export default {
  name: "visitorRecord",
  data: () => ({
    moment: moment,
    singlePickerOptions: singlePickerOptions,

    isBgDialog: false, // 控制背景图显示
    rowBgImg: null,

    listQuery: {
      name: '',
      identityNo: '',
      respondentsName: '',
      timeStart: moment()
        .subtract(1, "d")
        .format("YYYY-MM-DD HH:mm:ss"),
      timeEnd: "",
      offset: 1,
      limit: 50
    },
    listIds: [],
    listTableData: {},
    listTableLoading: false,
    pickerValue: [moment().subtract(1, "d")._d, ""]
  }),
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.onSubmit();
    },
    // 日期选择器变更
    onStartTimeChange(date) {
      this.listQuery.timeStart = date
        ? moment(date).format("YYYY-MM-DD HH:mm:ss")
        : "";
    },
    onEndTimeChange(date) {
      this.listQuery.timeEnd = date
        ? moment(date).format("YYYY-MM-DD HH:mm:ss")
        : "";
    },
    onSubmit() {
      this.listTableLoading = true;

      page(this.listQuery)
        .then(res => {
          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    onResetForm() {
      this.listIds = [];
      this.$refs.listForm.resetFields();
      this.pickerValue = [moment().subtract(5, "m")._d, ""];
      this.$refs.pictureSearch.reset();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    // 分页更新
    onListLimit(val) {
      this.listQuery.limit = val;
      this.onSubmit();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.offset = val;
      this.onSubmit();
    },
    // 查看大图
    onLookPicture(data) {
      this.rowBgImg = data.bgUrl;
      this.isBgDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .w100 {
    width: 100%;
  }
  .form {
    background: #fafbfd;
    font-size: 0;
    padding-bottom: 4px;
    span {
      display: inline-block;
      position: relative;
      top: 2px;
      padding-left: 10px;
      text-align: right;
      font-size: 13px;
      color: #3f4041;
      vertical-align: middle;
    }
    .el-form-item {
      margin: 4px 0 0 6px;
      font-size: 0;
      vertical-align: middle;
    }
    .picture-search {
      width: 160px;
    }
    .el-select {
      width: 100px;
    }
    .el-input {
      width: 180px;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
.label-list {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 2px;
  .top-label {
    position: relative;
    float: left;
    line-height: 18px;
    margin-left: -6px;
    padding-right: 6px;
    overflow: hidden;
    font-size: 12px;
    span {
      display: block;
      padding: 0 2px 0 8px;
    }
    .icon {
      position: absolute;
      top: -9px;
      right: 0;
      width: 0;
      height: 0;
      float: left;
      border-left: 6px solid #fff;
      border-top: 9px solid transparent;
      border-bottom: 18px solid transparent;
      content: "";
    }
  }
  .top-flag {
    position: relative;
    float: right;
    font-size: 13px;
    color: #fff;
    padding: 4px;
  }
}
.el-table {
  .identity {
    line-height: 140%;
    label {
      font-size: 14px;
    }
    p {
      color: #9da5af;
    }
  }
  .pic {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 4px;
  }
  .label-box {
    padding: 4px 0 0;
  }
  .label-item {
    display: inline-block;
    height: 22px;
    line-height: 18px;
    padding: 0 3px;
    margin: 0 4px 4px;
    text-align: center;
    border: 2px #fff solid;
    border-radius: 99px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 12px;
    color: #fff;
  }
  .el-button {
    margin: 2px 0;
  }
}
.card-list {
  height: calc(100vh - 255px);
  overflow: auto;
  .el-button {
    margin-left: 0;
  }
  .pic {
    position: relative;
    display: block;
    width: 160px;
    height: 160px;
    overflow: hidden;
    img {
      display: block;
      width: 160px;
      height: 160px;
    }
  }
  .mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    line-height: 18px;
    padding: 0 4px;
    font-size: 12px;
    color: #fff;
    span {
      float: right;
      font-size: 14px;
      font-weight: bold;
      color: #ffc600;
    }
  }
  .item {
    float: left;
    margin: 10px 0 0 10px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
    &.sel {
      border-color: #0fa0ff;
    }
    b {
      font-size: 14px;
      color: #333;
    }
    label {
      font-size: 12px;
      color: #9da5af;
    }
    .box {
      width: 160px;
      padding: 6px;
    }
    .txt {
      display: flex;
      width: 100%;
      height: 18px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .svg-icon {
      display: inline-block;
      height: 100%;
      margin-right: 4px;
      vertical-align: top;
      color: #b5c0cd;
    }
    .btns {
      margin-top: 4px;
    }
    .el-button {
      padding: 0 10px;
    }
    .el-checkbox {
      float: right;
      margin-left: 4px;
      pointer-events: none;
    }
  }
}
.el-select /deep/ {
  .el-select__tags {
    min-width: 90px;
    max-height: 24px;
    overflow: hidden;
    margin-top: 4px;
    white-space: nowrap;
  }
}
</style>
