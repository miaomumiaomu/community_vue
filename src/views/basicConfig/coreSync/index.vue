<template>
  <div class="data-sync">
    <el-button type="primary" plain @click="onDataUpload">数据上传到中心</el-button>
    <el-button type="primary" plain @click="onRewriteFaceLabel">重写人脸库缓存</el-button>
    <el-button type="primary" plain @click="onResetFaceLabel">重置人脸库</el-button>

    <el-dialog title="请选择" :visible.sync="isRadioDialog">
      <el-radio v-model="pushType" label=0>全部</el-radio>
      <!-- <el-radio v-model="pushType" label=1>社区</el-radio> -->
      <!-- <el-radio v-model="pushType" label=2>房间</el-radio> -->
      <el-radio v-model="pushType" label=1>实有房屋</el-radio>
      <!-- <el-radio v-model="pushType" label=3>门禁</el-radio> -->
      <el-radio v-model="pushType" label=2>摄像头</el-radio>
      <el-radio v-model="pushType" label=3>门禁设备</el-radio>
      <el-radio v-model="pushType" label=4>实有人口</el-radio>
      <!-- <el-radio v-model="pushType" label=5>人脸库</el-radio> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRadioDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCoreSync,
  getRewriteToRedis,
  getResetFaceLabel
} from "@/api/basicConfig/coreSync";
export default {
  data() {
    return {
      isRadioDialog: false,
      pushType: null
    }
  },
  methods: {
    // 数据上传到中心
    onDataUpload() {
      this.pushType = null;
      this.isRadioDialog = true;
    },
    onSubmit() {
      getCoreSync({ pushType: this.pushType }).then(res => {
        let isSuccess = res.status === 200;

        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "人脸库数据上传成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
      this.isRadioDialog = false;
    },
    // 重写人脸库缓存
    onRewriteFaceLabel() {
      getRewriteToRedis().then(res => {
        let isSuccess = res.status === 200;

        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "重写人脸库缓存成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    },
    // 重置人脸库
    onResetFaceLabel() {
      getResetFaceLabel().then(res => {
        let isSuccess = res.status === 200;
        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "重置人脸库成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    }
  }
};
</script>
<style>
.data-sync {
  padding: 20px;
}
</style>