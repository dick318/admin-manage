<template>
  <div :style="bgImg" class="login-container">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="right">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <!-- <lang-select class="set-language"/> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model.trim="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model.trim="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="captcha">
        <span class="svg-container">
          <svg-icon icon-class="captcha" />
        </span>
        <el-input v-model.trim="loginForm.captcha" name="captcha" auto-complete="off" placeholder="验证码" @keyup.enter.native="handleLogin" />
        <span class="show-captcha" @click="changeCapt">
          <img :src="captcha.url" class="image">
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

      <!-- <div class="tips">
        <span>{{ $t('login.username') }} : admin</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button> -->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
// import LangSelect from '@/components/LangSelect'
// import SocialSign from './socialsignin'
import { getCode } from '@/api/login'
import Cookies from 'js-cookie'
import logo from '@/assets/logo.jpg'
export default {
  name: 'Login',
  // components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (value.length !== 4) {
        callback(new Error('验证码长度错误'))
      } else {
        callback()
      }
    }
    return {
      bgImg: {
        'background-image': `url(${logo})`
      },
      loginForm: {
        username: Cookies.get('username') || localStorage.getItem('username') || '',
        password: Cookies.get('password') || localStorage.getItem('password') || '',
        captcha: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validateCaptcha }
        ]
      },
      captcha: {
        base: '',
        url: '',
        refresh: ''
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.getCaptcha()
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    changeCapt() {
      this.getCaptcha()
    },
    getCaptcha() {
      getCode().then(res => {
        if (+res.status !== 0) {
          return false
        }
        const _this = this
        _this.captcha.url = res.data.img
        Cookies.set('token', res.data.JSESSIONID)
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              Cookies.set('username', this.loginForm.username)
              Cookies.set('password', this.loginForm.password)
              localStorage.setItem('username', this.loginForm.username)
              localStorage.setItem('password', this.loginForm.password)
              if (this.$store.getters.device === 'mobile') {
                this.$router.push({ path: '/mobile/home' })
              } else {
                this.$router.push({ path: '/' })
              }
            })
            .catch(res => {
              this.loginForm.captcha = ''
              this.changeCapt()
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 70%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 0.46rem 0.5rem 0.46rem 0.5rem;
      color: $light_gray;
      height: 100%;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.0666rem;
    color: #454545;
    padding-right:1rem;
    padding-left:1rem;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x:center;
  background-position-y:center;
  background-size: cover;
  background-attachment: fixed;
  .login-form {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    width: 22em;
    // padding: 0.4666rem 0.4666rem 0.2rem 0.4666rem;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 0.13333rem;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 0.5333rem auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 0.0666rem;
      right: 0px;
    }
  }
  .show-pwd ,.show-captcha {
    position: absolute;
    right: 0.1333rem;
    top: 0.09333rem;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .show-pwd{
    right: 0.75rem;
    top: 0.625rem;
  }
  .thirdparty-button {
    position: absolute;
    right: .4666rem;
    bottom: .37333rem;
  }
}
</style>
