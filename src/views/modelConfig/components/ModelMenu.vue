<template>
  <el-col :span="5" class="model-menu">
    <div class="title">
      <b>模型菜单</b>
      <el-button size="mini" @click="openForm()" v-permission="'modelMan:btn_add'">新增模型</el-button>
    </div>
    <ul v-if="menuData.length" class="menu">
      <li class="menu-item" v-for="(item,index) in menuData" :key="item.id" :class="{sel: currentRow.id == item.id}" @click="onUpdataMenu(item,index)">
        <div class="box">
          <i class="el-icon-success able" v-if="item.isEnabled==1" />
          <i class="el-icon-error enable" v-if="item.isEnabled==0" />
          <span>{{item.modelName}}</span>
        </div>
        <el-dropdown @command="onCommand($event, item)" class="more">
          <div class="icon">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="upd" v-permission="'modelMan:btn_edit'">编辑</el-dropdown-item>
            <el-dropdown-item command="del" v-permission="'modelMan:btn_delete'">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>

    <!-- 编辑模型弹层 S -->
    <el-dialog :title="form.id?'编辑模型':'新增模型'" class="form-layer" :visible.sync="isFormDialog" width="440px">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="名称" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="modelCode">
          <el-input v-model="form.modelCode" placeholder="请输入编码" :readonly="form.id?true:false" />
        </el-form-item>
        <el-form-item label="维度" prop="modelDimension">
          <el-input v-model="form.modelDimension" placeholder="请输入维度" />
        </el-form-item>
        <el-form-item label="权重" prop="modelWeight">
          <el-input v-model="form.modelWeight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="服务IP" prop="featureIp">
          <el-input v-model="form.featureIp" placeholder="请输入服务IP" />
        </el-form-item>
        <el-form-item label="服务端口" prop="featurePort">
          <el-input v-model="form.featurePort" placeholder="请输入服务端口" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-switch v-model="form.isEnabled" active-value="1" inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
        <el-form-item label="默认搜索IP" prop="defaultSearchIp">
          <el-input v-model="form.defaultSearchIp" placeholder="请输入默认搜索IP" />
        </el-form-item>
        <el-form-item label="默认搜索端口" prop="defaultSearchPort">
          <el-input v-model="form.defaultSearchPort" placeholder="请输入默认搜索端口" />
        </el-form-item>
        <el-form-item label="搜索阈值" prop="searchThreshold">
          <el-input v-model="form.searchThreshold" placeholder="请输入搜索阈值" />
        </el-form-item>
        <el-form-item label="确认阈值" prop="confirmThreshold">
          <el-input v-model="form.confirmThreshold" placeholder="请输入确认阈值" />
        </el-form-item>
        <el-form-item label="分割点阈值" prop="segmentThreshold">
          <el-input v-model="form.segmentThreshold" placeholder="请输入分割点阈值" />
        </el-form-item>
        <el-form-item label="Rank下限" prop="searchMin">
          <el-input v-model="form.searchMin" placeholder="请输入Rank下限" />
        </el-form-item>
        <el-form-item label="Rank上限" prop="searchMax">
          <el-input v-model="form.searchMax" placeholder="请输入Rank上限" />
        </el-form-item>
        <el-form-item label="Rank提权" prop="searchTh" class="m0">
          <el-input v-model="form.searchTh" placeholder="请输入Rank提权" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="onSubmit()">确 定</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑模型弹层 E -->
  </el-col>
</template>
<script>
import { formValidate } from "@/utils";
import {
  getModelMenu,
  postModel,
  deleteModel,
  putModel,
  getModel
} from "@/api/modelConfig/index";

const form = {
  modelName: null,
  modelCode: null,
  modelDimension: null,
  modelWeight: null,
  featureIp: null,
  featurePort: null,
  isEnabled: "1",
  searchThreshold: 0.7,
  confirmThreshold: 0.7,
  segmentThreshold: 0.7,
  searchMin: 0.7,
  searchMax: 0.7,
  searchTh:0.7,
  defaultSearchIp:null,
  defaultSearchPort:null
};

export default {
  data: () => ({
    menuData: [],
    currentRow: null,
    currentIndex: 0,
    enabled: null,
    // 表单弹窗
    isFormDialog: false,
    form: form,
    rules: {
      modelName: { required: true, message: "模型名称不能为空" },
      modelCode: { required: true, message: "模型编码不能为空" },
      modelDimension: { required: true, message: "维度不能为空" },
      modelWeight: [
        { required: true, message: "权重不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "权重范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      featureIp: [
        { required: true, message: "服务IP不能为空" },
        { validator: formValidate.ip }
      ],
      defaultSearchIp:[
        { required: true, message: "默认搜索IP不能为空" },
        { validator: formValidate.ip }
      ],
      defaultSearchPort:{ required: true, message: "默认搜索端口不能为空" },
      featurePort: { required: true, message: "服务端口不能为空" },
      searchThreshold: [
        { required: true, message: "搜索阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "搜索阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      confirmThreshold: [
        { required: true, message: "确认阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "确认阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      segmentThreshold: [
        { required: true, message: "分割点阈值不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "分割点阈值范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchMin: [
        { required: true, message: "Rank下限不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank下限范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchMax: [
        { required: true, message: "Rank上限不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank上限范围为0-1之间",
          validator: formValidate.threshold
        }
      ],
      searchTh:[
        { required: true, message: "Rank提权不能为空" },
        {
          min: 0,
          max: 1.001,
          toFixed: 3,
          tip: "Rank提权范围为0-1之间",
          validator: formValidate.threshold
        }
      ]
    }
  }),
  watch: {
    menuData(val) {
      if (this.menuData) {
        this.currentRow = this.menuData[this.currentIndex];
        this.$emit("change", this.currentRow);
      }
    }
  },
  created() {
    this.menuList();
  },
  methods: {
    menuList() {
      getModelMenu().then(res => {
        if (res.status == 200) {
          this.menuData = res.data;
        }
      });
    },
    onUpdataMenu(row, index) {
      this.currentRow = row;
      this.currentIndex = index;

      this.$emit("change", this.currentRow);
    },
    // 人脸库更多操作
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除模型【${data.modelName}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteModel(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.currentIndex = 0;
              this.menuList();
            }
          });
        });
      }
      if (command == "upd") {
        getModel(data.id).then(res => {
          if (res.status == 200) {
            this.openForm(res.data);
          }
        });
      }
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            // 修改标签库
            putModel(this.form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "修改成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.menuList();
                this.isFormDialog = false;
              }
            });
          } else {
            // 添加标签库
            postModel(this.form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "新增成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.menuList();
                this.isFormDialog = false;
              }
            });
          }
        }
      });
    },
    openForm(newForm) {
      this.form = form;
      this.isFormDialog = true;

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();
        if (newForm) {
          this.form = newForm;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.model-menu {
  background: #fafbfd;
  border-right: 1px solid #e1e1e1;
  .title {
    height: 46px;
    line-height: 46px;
    padding: 0 10px 0 16px;
    font-size: 14px;
    color: #333;
    .el-button {
      float: right;
      margin-top: 10px;
    }
  }
  .menu {
    padding: 0 6px;
    border-top: 1px solid #e1e1e1;
    font-size: 13px;
    color: #333;
  }
  .menu-item {
    position: relative;
    padding: 0 16px 0 10px;
    cursor: pointer;
    &:hover {
      background: #e7eff8;
    }
    &.sel {
      background: #d5e6f9;
    }
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
    .box {
      height: 39px;
      line-height: 38px;
      padding-right: 6px;
      border-bottom: 1px solid #edeff3;
      .able {
        color: #67c23a;
      }
      .enable {
        color: #f30c05;
      }
    }
    span {
      display: inline-block;
      margin-left: 6px;
      vertical-align: top;
    }
    .svg-icon {
      display: inline-block;
      height: 100%;
      vertical-align: top;
      font-size: 16px;
      color: #b5c0cd;
    }
    .total {
      float: right;
      color: #878c8f;
    }
  }
}

.form-layer {
  .el-color-picker {
    vertical-align: top;
  }
  .tip {
    line-height: 100%;
    margin-top: 6px;
    font-size: 12px;
    color: #aaa;
  }
}
</style>


