<template>
  <div class="app-container">
    <el-tabs v-model="active" type="border-card">
      <el-tab-pane :lazy="true" label="总后台" name="backstage">
        <el-button v-permission="['kuyuplat:excel:monthBalance','kuyuplat:card:monthBalance']" class="el-button" size="mini" type="primary" @click="jump('/development/monthlyBalance')">月套餐月末扣费停机</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jump('/development/map')">地图</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jump('/other/API')">API文档</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://tw.szcoolfish.com/coolfish/admin_test/#/login')">测试地址</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://tw.szcoolfish.com/coolfish/admin/#/mobile/home')">移动端</el-button>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="代理商" name="agent">
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://tw.szcoolfish.com/go/#/')">线上地址</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/agent_pay/#/login')">代理商移动端</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wc.kuyichong.com/coolfish/dist/#/login?redirect=%2F')">测试地址</el-button>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="移动端前端" name="client">
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/tpl/main/dist/index.html#/bindCard?id=50')">线上地址</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/tpl/main/dist/index2.html#/bindCard?id=50')">预发布</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/prod/index.html#/bindCard?id=50')">测试地址</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/pay/?id=50#/')">秒杀活动</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/seckill/#/')">秒杀活动测试</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/tpl/main/dist/index3.html#/')">秒杀活动预发布</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/pay/?#/netStand')">营业网点</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/seckill/#/addWork?id=50')">工单提交</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://wx.szcoolfish.com/coolfish/h5/')">年度H5</el-button>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="小程序" name="mini">
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://tw.szcoolfish.com/coolfish/litemall/dist/#/login')">线上地址</el-button>
        <el-button class="el-button" size="mini" type="primary" @click="jumpOther('http://tw.szcoolfish.com/coolfish/liteMallTest/#/login')">测试地址</el-button>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
export default {
  name: 'DevelopmentEntrance',
  data() {
    return {
      active: 'backstage'
    }
  },
  methods: {
    jump(type) {
      this.$router.push(type)
    },
    jumpOther(type) {
      window.open(type, '_blank')
    }
  }
}
</script>
<style scoped>
.el-button{
  margin-top:10px;
}
</style>

