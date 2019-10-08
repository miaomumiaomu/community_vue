<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" v-if="nameList.length">
      <el-form-item label="网卡" prop="name">
        <el-select v-model="form.name" @change="onNameChange">
          <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模式" prop="model">
        <el-radio v-model="form.model" label="static">静态</el-radio>
        <el-radio v-model="form.model" label="dhcp">DHCP</el-radio>
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" readonly />
      </el-form-item>
      <el-form-item label="IPV4地址" prop="ipv4">
        <el-input v-model="form.ipv4" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="子网掩码" prop="mask">
        <el-input v-model="form.mask" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="默认网关" prop="gateway">
        <el-input v-model="form.gateway" :readonly="form.model=='dhcp'" />
      </el-form-item>
      <el-form-item label="首选DNS" prop="firstChoiceDns">
        <el-input v-model="form.firstChoiceDns" />
      </el-form-item>
      <el-form-item label="备用DNS" prop="backupDns">
        <el-input v-model="form.backupDns" />
      </el-form-item>
      <el-form-item label="是否开机自启动" prop="auto">
        <el-switch v-model="form.auto" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-permission="'commonMan:btn_update_network_card'">保 存</el-button>
      </el-form-item>
    </el-form>
    <div class="tip" v-else>未查询到网卡信息</div>
  </div>
</template>
<script>
import { formValidate } from "@/utils";
import { getNetworkCardList, postNetworkCard } from "@/api/networkCard";

export default {
  name: "networkCard",
  data: () => ({
    form: {
      name: null,
      ipv4: null,
      model: "static",
      mac: null,
      mask: null,
      gateway: null,
      firstChoiceDns: null,
      backupDns: null,
      auto: true
    },
    rules: {
      ipv4: { validator: formValidate.ip },
      mask: { validator: formValidate.ip },
      gateway: { validator: formValidate.ip },
      firstChoiceDns: { validator: formValidate.ip },
      backupDns: { validator: formValidate.ip }
    },

    listData: [],
    nameList: [],
    currentIndex: 0
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      getNetworkCardList().then(res => {
        if (res.status == 200) {
          this.listData = res.data;
          this.nameList = this.listData.map(item => item.name);
          this.form = this.listData[this.currentIndex];
        }
      });
    },
    onNameChange(val) {
      this.currentIndex = this.nameList.indexOf(val);
      this.form = this.listData[this.currentIndex];
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;

        this.$confirm(`修改网卡信息将会重启服务器，是否继续？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          postNetworkCard(this.form).then(res => {
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
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  overflow: auto;
  .el-select {
    width: 100%;
  }
  .el-form {
    width: 500px;
    margin: 30px auto;
  }
  .tip {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 30px;
    line-height: 30px;
    margin: -15px 0 0 -300px;
    text-align: center;
    font-size: 16px;
    color: #666;
  }
}
</style>
