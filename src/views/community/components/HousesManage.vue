<template>
  <el-row class="houses-manage">
    <el-col :span="6" class="menu-tree">
      <div class="title">
        <b>实有房屋</b>
        <div>
          <el-button size="mini" @click="fetchInternet">网络拉取</el-button>
          <el-button size="mini" @click="onAddItem('0', 0)" v-permission="'mlphMan:btn_add'">新增</el-button>
        </div>
      </div>
      <div class="tree-box">
        <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" clearable></el-input>

        <el-tree ref="menuTree" class="tree" :data="menuData" :filter-node-method="filterNode"
        node-key="id" highlight-current :expand-on-click-node="false">
          <div class="menu-item" slot-scope="{ node, data }" @click="onMenuClick(data)">
            {{ node.label }}
            <el-dropdown @command="onCommand($event, data)" class="more">
              <div class="icon">
                <svg-icon icon-class="more" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add" v-if="data.type != 4" v-permission="'mlphMan:btn_add'">添加</el-dropdown-item>
                <el-dropdown-item command="upd" v-permission="'mlphMan:btn_edit'">编辑</el-dropdown-item>
                <el-dropdown-item command="del" v-permission="'mlphMan:btn_delete'">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
    </el-col>
    <el-col :span="18">
      <el-tabs type="border-card" v-model="tabsActive">
        <el-tab-pane label="人员信息" name="labelManage">
          <label-manage ref="labelManage" :data="tabsData" />
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <el-dialog :title="formTitle" class="form-layer" :visible.sync="isFormDialog" width="688px">
      <el-form ref="form" :model="form" label-width="120px" v-if="currentRow">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" :disabled="form.type == 0 || form.type == 1">
                <el-option label="街路巷" value="0" disabled></el-option>
                <el-option label="门（楼）牌号" value="1" disabled></el-option>
                <el-option label="楼号" value="2" :disabled="currentRow.type >= 2"></el-option>
                <el-option label="单元" value="3" :disabled="currentRow.type >= 3"></el-option>
                <el-option label="房间" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="全称" prop="fullName">
          <el-input v-model="form.fullName" />
        </el-form-item>
        <el-form-item label="地址编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="中心系统标识符" prop="outId">
          <el-input v-model="form.outId" disabled/>
        </el-form-item>
        <el-form-item label="公安地址标识符" prop="guid">
          <el-input v-model="form.guid" disabled/>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="经度" prop="lng">
              <el-input v-model="form.lng" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="form.lat" />
            </el-form-item>
          </el-col>
        </el-row>
    
        <template v-if="form.type == 4">

        <el-row>
          <el-col :span="12">
            <el-form-item label="房屋面积" prop="area">
              <el-input v-model="form.area" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房屋类别" prop="houseType">
              <dict-select dict-name="house_type" v-model="form.houseType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房屋用途" prop="purposeType">
              <dict-select dict-name="purpose_type" v-model="form.purposeType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用形式" prop="usageType">
              <dict-select dict-name="usage_type" v-model="form.usageType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产权性质" prop="propertyType">
              <dict-select dict-name="property_type" v-model="form.propertyType" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="业主姓名" prop="ownerName">
              <el-input v-model="form.ownerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主身份证号" prop="ownerIdentityNo">
              <el-input v-model="form.ownerIdentityNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主联系电话" prop="ownerTel">
              <el-input v-model="form.ownerTel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否注销" prop="canceled">
              <dict-select dict-name="del_state" v-model="form.canceled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注销原因" prop="cancelReason">
              <el-input v-model="form.cancelReason" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注销时间" prop="cancelTime">
              <el-date-picker v-model="form.cancelTime" style="width: 200px" type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择注销时间" :picker-options="singlePickerOptions()" />
            </el-form-item>
          </el-col>
        </el-row>

        </template>

        <div class="moreInfo" v-if="form.crtTime || form.updTime">
          <p v-if="form.crtTime">
            <span>创建人：{{form.crtName}}</span>创建时间：{{moment(form.crtTime, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")}}</p>
          <p v-if="form.updTime">
            <span>修改人：{{form.updName}}</span>修改时间：{{moment(form.updTime, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss")}}</p>
        </div>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>
<script>
import {
  getMlphTree,
  postMlph,
  deleteMlph,
  putMlph,
  getMlph,
  getFromInternet
} from "@/api/community";
import { singlePickerOptions } from "@/utils";
export default {
  components: {
    LabelManage: () => import("./LabelManage")
  },
  data: () => ({
    filterText: "",
    menuData: null,
    currentRow: null,
    // treeExpandedKeys: [],

    tabsActive: "labelManage",
    tabsData: {},

    isFormDialog: false,
    formTitle: "",
    form: {
      id: null,
      type: null,
      parentId: 0
    },

    singlePickerOptions: singlePickerOptions
  }),
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  methods: {
    init() {
      this.currentRow = null;
      this.isFormDialog = false;
      getMlphTree().then(res => {
        this.menuData = res.data;
      });
    },
    onMenuClick(row) {
      this.tabsData = row;
      this.tabsActive = "labelManage";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 更多操作
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除【${data.label}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteMlph(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.init();
              this.currentRow = null;
            }
          });
        });
      }
      if (command == "upd") {
        this.currentRow = data;

        this.$nextTick(() => {
          getMlph(data.id).then(res => {
            if (res.status == 200) {
              this.form = res.data;
              this.formTitle = "编辑";
              this.isFormDialog = true;
            }
          });
        });
      }
      if (command == "add") {
        this.onAddItem(parseInt(data.type) + 1 + "", data.id);
        this.formTitle = "添加";
        this.isFormDialog = true;
      }
    },
    fetchInternet() {
      getFromInternet().then(res => {
        this.$notify({
          title: "提示",
          message: "数据拉取中,请稍后刷新该界面查看",
          type: "success",
          duration: 3000
        });
      });
    },
    onAddItem(type, pId) {
      this.currentRow = {
        type: type
      };

      this.$nextTick(() => {
        this.form = {
          id: null,
          type: type,
          parentId: pId,
          canceled: "0"
        };
      });

      this.formTitle = "新增";
      this.isFormDialog = true;
    },
    onSubmit() {
      if (this.form.id) {
        putMlph(this.form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.init();
          }
        });
      } else {
        postMlph(this.form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.init();
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.houses-manage {
  height: 100%;
  & > .el-col {
    height: 100%;
  }
  .menu-tree {
    background: #fafbfd;
    border-right: 1px solid #e1e1e1;
    overflow: auto;
    .title {
      height: 46px;
      line-height: 46px;
      padding: 0 10px 0 16px;
      font-size: 14px;
      color: #333;
      display: flex;
      justify-content: space-between;
    }
    .tree-box {
      height: calc(100% - 46px);
      padding: 0 6px;
      border-top: 1px solid #e1e1e1;
      .el-input {
        margin: 10px 0;
      }
    }
    .tree {
      background: transparent;
      overflow: auto;
      font-size: 13px;
      color: #333;
      .menu-item {
        position: relative;
        flex: 1;
        height: 100%;
        .more {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          .icon {
            display: inline-block;
            height: 100%;
          }
        }
      }
      /deep/ {
        .el-tree-node.is-current {
          & > .el-tree-node__content {
            background-color: #d5e6f9;
          }
        }
        .el-tree-node__content {
          display: flex;
          &:hover {
            background-color: #e7eff8;
          }
          .el-tree-node__expand-icon {
            margin-top: 0;
          }
        }
      }
    }
  }

  .el-form {
    .m0 {
      margin: 0;
    }
    .el-select {
      width: 100%;
    }
  }

  .moreInfo {
    line-height: 160%;
    margin-top: 10px;
    text-align: center;
    font-size: 13px;
    color: #999;
    span {
      padding-right: 30px;
    }
  }

  /* 标签切换 */
  .el-tabs {
    position: relative;
    height: 100%;
    border: 0;
    box-shadow: none;
    /deep/ {
      .el-tabs__item {
        height: 48px;
        line-height: 47px;
      }
      .el-tabs__content {
        height: calc(100% - 48px);
      }
    }
  }
}
</style>