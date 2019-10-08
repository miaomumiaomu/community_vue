<template>
  <div class="app-container">
    <div class="content">
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="登录页 - 平台名称" prop="loginAppName">
        <el-input v-model="form.loginAppName" />
      </el-form-item>
      <el-form-item label="登录页 - 小区名称" prop="loginProjectName">
        <el-input v-model="form.loginProjectName" />
      </el-form-item>
      <el-form-item label="登录页 - 中文版权信息" prop="loginAppVersionCn">
        <el-input v-model="form.loginAppVersionCn" />
      </el-form-item>
      <el-form-item label="登录页 - 英文版权信息" prop="loginAppVersionEn">
        <el-input v-model="form.loginAppVersionEn" />
      </el-form-item>
      <el-form-item label="考勤视窗标题" prop="checkAppName">
        <el-input v-model="form.checkAppName" />
      </el-form-item>
      <el-form-item label="登录页 - logo图片" prop="loginLogoImg">
        <el-upload class="upload" data-form="loginLogoImg" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onLoginUpload">
          <img v-if="form.loginLogo && !form.loginLogoImg" :src="form.loginLogo" class="upload-show">
          <img v-if="form.loginLogoImg" :src="'data:image/png;base64,'+form.loginLogoImg" class="upload-show">
          <el-button v-if="!form.loginLogo && !form.loginLogoImg">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="loginLogo" class="m0" />
      <el-form-item label="后台 - 侧边栏logo图片" prop="homeLogoImg">
        <el-upload class="upload" data-form="homeLogoImg" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onHomeUpload">
          <img v-if="form.homeLogo && !form.homeLogoImg" :src="form.homeLogo" class="upload-show">
          <img v-if="form.homeLogoImg" :src="'data:image/png;base64,' + form.homeLogoImg" class="upload-show">
          <el-button v-if="!form.homeLogo && !form.homeLogoImg">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="homeLogo" class="m0" />
      <el-form-item label="大数据视窗 - 标题图片" prop="bigDataLogoImg">
        <el-upload class="upload" data-form="bigDataLogoImg" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onBigDataUpload">
          <img v-if="form.bigDataLogo && !form.bigDataLogoImg" :src="form.bigDataLogo" class="upload-show">
          <img v-if="form.bigDataLogoImg" :src="'data:image/png;base64,' + form.bigDataLogoImg" class="upload-show">
          <el-button v-if="!form.bigDataLogo && !form.bigDataLogoImg">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="bigDataLogo" class="m0" />
      <el-form-item label="实时监控 - 标题图片" prop="realtimeLogoImg">
        <el-upload class="upload" data-form="realtimeLogoImg" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onRealTimeUpload">
          <img v-if="form.realtimeLogo && !form.realtimeLogoImg" :src="form.realtimeLogo" class="upload-show">
          <img v-if="form.realtimeLogoImg" :src="'data:image/png;base64,' + form.realtimeLogoImg" class="upload-show">
          <el-button v-if="!form.realtimeLogo && !form.realtimeLogoImg">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="realtimeLogo" class="m0" />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保 存</el-button>
      </el-form-item>
    </el-form></div>
  </div>
</template>
<script>
import { getSystemConfig, postSystemConfig } from "@/api/systemConfig";

export default {
  name: "systemConfig",
  data() {
    return {
      form: {
        loginAppName: null,
        loginProjectName: null,
        loginAppVersionCn: null,
        loginAppVersionEn: null,
        checkAppName: null,
        loginLogo: null,
        homeLogo: null,
        bigDataLogo: null,
        realtimeLogo: null
      }
    };
  },

  methods: {
    init() {
      getSystemConfig().then(res => {
        if (res.status == 200) {
          this.form = res.data;
        }
      });
    },
    onSubmit() {
      postSystemConfig(this.form).then(res => {
        let isSuccess = res.status === 200;
        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "保存成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
        isSuccess && this.init();
      });
    },

    pictureUpload(file, name, imgType, width, height) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.addEventListener("load", () => {
        var image = new Image();
        image.addEventListener("load", () => {
          if (image.width == width && image.height == height) {
            this.form[imgType] = reader.result.substr(
              reader.result.indexOf(",") + 1
            );
          } else {
            this.$notify({
              title: "提示",
              message: `${name}图片尺寸必须为${width}X${height}`,
              type: "warning",
              duration: 2000
            });
          }
        });
        image.src = reader.result;
      });
    },
    // logo图片更新
    onLoginUpload(file) {
      this.pictureUpload(file, "登录页-logo", "loginLogoImg", "421", "80");
    },
    onHomeUpload(file) {
      this.pictureUpload(file, "后台-侧边栏logo", "homeLogoImg", "136", "26");
    },
    onBigDataUpload(file) {
      this.pictureUpload(
        file,
        "大数据视窗-标题",
        "bigDataLogoImg",
        "1920",
        "108"
      );
    },
    onRealTimeUpload(file) {
      this.pictureUpload(file, "实时监控-标题", "realtimeLogoImg", "440", "90");
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  border-radius: 0px;
  position: relative;
  height: 100%;
  .content {
    height: calc(100vh - 150px);
    overflow: scroll;
  }
  .el-form {
    margin: 30px auto;
    width: 850px;
    .el-input {
      width: 500px;
    }
    .upload-show {
      display: inline-block;
      height: 36px;
      border-radius: 4px;
      border: 1px #dcdfe6 solid;
      vertical-align: top;
    }
  }
}
</style>
