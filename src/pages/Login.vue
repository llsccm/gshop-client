<template>
    <div class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginWay}" @click="changeWay">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="changeWay">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div v-if="loginWay" class="on">
              <section class="login_message">
                <input 
                type="text" 
                maxlength="11" 
                placeholder="手机号" 
                v-model.number.trim="phone">
                <button 
                  :disabled="!correct" 
                  class="get_verification" 
                  :class="{correct}" 
                  @click.prevent="getCode">
                  {{time>0 ? `(${time})`:'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div v-else class="on">
              <section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model.trim="name">
                </section>
                <section class="login_verification">
                  <input :type="pwdType" maxlength="16" placeholder="密码" v-model.trim="pwd">
                  <div class="switch_button" :class="pwdOpen" @click="changeOpen">
                    <div class="switch_circle" :class="classright"></div>
                    <span class="switch_text">显示</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="4" placeholder="验证码" v-model="captcha">
                  <img 
                  class="get_verification" 
                  src="http://localhost:4000/captcha" 
                  alt="captcha" 
                  @click="getCaptcha"
                  ref="captcha"
                  >
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <span @click="goback" class="go_back">
          <i class="iconfont icon-jiantou2"></i>
        </span>
      </div>
      <AlertTip :alertText="alertText" v-show="isAlert" @closeTip="closeTip"></AlertTip>
    </div>
</template>

<script>
import AlertTip from '@/components/AlertTip.vue'
import { reqPwdLogin,reqSendCode,reqSmsLogin } from "../api/index"
export default {
  components:{AlertTip},
  data() {
    return {
      loginWay:true,//短信登录
      phone:'',
      time:0,
      code:'',
      name:'',
      pwdType:'password',
      pwd:'',
      captcha:'',
      classright:{right:false},//显示密码样式
      alertText:'',
      isAlert:false
    }
  },
  computed: {
    correct(){
      let reg_tel = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      return reg_tel.test(this.phone)
    },
    pwdOpen(){
        return this.pwdType === 'password' ? 'off' : 'on'
    }
  },
  methods: {
    goback(){
      this.$router.replace('/proflie')
    },
    changeWay(){
      this.loginWay = !this.loginWay
    },
    //短信登录
    async getCode(){
        if (!this.time) {
            this.time =10
            this.timeId = setInterval(() => {         
                this.time--
                if (this.time<=0) {
                    clearInterval(this.timeId)              
                }
            }, 1000)
            const result = await reqSendCode(this.phone)
            if (result.code===1) {//发送失败关闭定时器
              this.show(result.msg)
              this.time = 0
              clearInterval(this.timeId) 
            }
        }
    },    
    show(alertText){
      this.isAlert = true
      this.alertText = alertText
    },
    closeTip(){
      this.isAlert = false
      this.alertText = ''     
    },
    async login(){
      let result
      if (this.loginWay) {
        //console.log('手机登录')
        const {correct,phone,code} = this
        if(!correct) return this.show('手机号格式错误')
        if(!/^\d{6}$/.test(code)) return this.show('验证码错误1')
        result =await reqSmsLogin(phone, code)
      }else{
        const {name,pwd,captcha} = this
        if(!name) return this.show('请输入账号')
        if(!pwd) return this.show('请输入密码')
        if(!/^\w{4}$/.test(captcha)) return this.show('验证码错误2')
        result =await reqPwdLogin({name,pwd,captcha})
      }
      //
      if (result.code===0) {
          const user = result.data
          this.time = 0
          clearInterval(this.timeId)
          //数据交互
          this.$store.dispatch('recordUser',user)
          //登录成功跳转
          this.$router.replace('/proflie')
      }else{
          this.show(result.msg)
      }
    },
    //账号密码登录
    changeOpen(){
        if (this.pwdType==='password') {
            this.pwdType='text'
            this.classright.right = true
        } else {
            this.pwdType='password'
            this.classright.right = false
        }
    },
    getCaptcha(){
      this.$refs.captcha.src = 'http://localhost:4000/captcha?t=' + Date.now()
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.correct
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 36px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 14px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(34px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>