<template>
  <div class="login-container">
    <div class="login-logo">
      <div class="box">
        <img v-if="basicInfo.loginLogo" :src="basicInfo.loginLogo + '?r=' + new Date().getTime()">
        <div class="name">{{basicInfo.loginAppName}}</div>
        <div class="place" v-if="place">
          <svg-icon icon-class="locale" />{{place}}
        </div>
      </div>
    </div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <el-form-item prop="username">
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" :placeholder="$t('login.username')">
          <svg-icon slot="prepend" icon-class="user" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" :placeholder="$t('login.password')">
          <svg-icon slot="prepend" icon-class="key" />
        </el-input>
        <!-- <svg-icon icon-class="eye" class="show-pwd" @click="showPwd" /> -->
      </el-form-item>
      <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
    </el-form>
    <div class="copyright">
      {{basicInfo.loginAppVersionCn}}
      <p>{{basicInfo.loginAppVersionEn}}</p>
    </div>
  </div>
</template>

<script>
import { getTopOrg, getBasicInfo } from "@/api/login";

export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 || value.length > 20) {
        callback(new Error("密码长度为6-20位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "账户不能为空" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符" }
        ],
        password: [
          { required: true, message: "密码不能为空" },
          { min: 6, max: 20, message: "密码长度为6-20位" }
        ]
      },
      passwordType: "password",
      loading: false,
      basicInfo: {},
      place: ""
    };
  },
  created() {
    // 设置关闭警报提醒
    this.$store.dispatch("SetAlarmSwitch", false);
    getBasicInfo().then(res => {
      this.basicInfo = res.data;
    });
    getTopOrg().then(res => {
      this.place = res.data.name;
    });
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              this.loading = false;

              // location.href = '/'
              this.$router.push({
                path: "/"
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.login-container {
  background: no-repeat center center url(~@/assets/bg.jpg);
  background-size: cover;
  @include relative;
  .login-logo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    background: no-repeat center center url(~@/assets/login/bg.png);
    width: 420px;
    transform: translateX(-100%);
    .box {
      position: absolute;
      left: 0;
      width: 100%;
      padding: 0 30px 20px 55px;
      @include ct;
    }
    img {
      display: block;
      width: 420px;
      margin-left: -55px;
    }
    .name {
      text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
      font-size: 34px;
      font-weight: bold;
      color: #fff;
    }
    .place {
      line-height: 26px;
      font-size: 16px;
      color: #ffc600;
    }
    .svg-icon {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      margin-right: 4px;
      vertical-align: top;
      font-size: 18px;
    }
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 306px;
    padding: 0 0 0 88px;
    border-left: 1px solid #65a2d4;
    transform: translate(0, -50%);
    /deep/ {
      .el-form-item__content {
        line-height: 30px;
      }
    }
    .el-input {
      /deep/ {
        .el-input-group__prepend {
          height: 30px;
          line-height: 28px;
          padding: 0 10px;
        }
        input {
          height: 30px;
          line-height: 30px;
          font-size: 13px;
        }
      }
    }
    .svg-icon {
      position: relative;
      top: 2px;
      font-size: 18px;
    }
    .show-pwd {
      position: absolute;
      top: 0;
      right: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #666;
      user-select: none;
      cursor: pointer;
    }
    .el-button {
      background: #0abf08;
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      border-color: #0abf08;
      letter-spacing: 4px;
      font-size: 14px;
      &:hover {
        background: #13d011;
        border-color: #13d011;
      }
    }
  }
  .copyright {
    position: absolute;
    right: 0;
    bottom: 40px;
    left: 0;
    text-align: center;
    font-size: 13px;
    color: #fff;
    p {
      line-height: 30px;
      margin: 0;
      font-size: 12px;
      color: #8cb4d6;
    }
  }
}
</style>
