<template>
  <div class="app-container">
    <p class="warn-content">
      操作指南对于一些第一次进入管理平台的人很有用，你可以熟悉一下平台的功能操作。点击对应的功能按钮，本平台将会指引你操作。<br>
    </p>
    <el-button type="primary" @click.prevent.stop="guide('nouns')">名词解释</el-button>
    <el-button type="primary" @click.prevent.stop="guide('steps')">页面操作</el-button>
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('excelCard')">Excel分卡</el-button>
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('orderPackage')">订购套餐</el-button>
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('package')">修改充值价格</el-button>
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('changeAction')">异卡换套餐</el-button>
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('unbindAction')">批量机卡解绑</el-button>
    <!-- <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('addCustomer')">客服管理</el-button> -->
    <!-- <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('roleSearch')">角色管理</el-button> -->
    <!-- <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('agent')">代理商权限管理</el-button> -->
    <el-button v-permission="['common']" type="primary" @click.prevent.stop="guide('worklistSearch')">工单管理</el-button>
  </div>
</template>

<script>
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { steps } from './defineSteps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      opacity: 0.50,
      doneBtnText: '完成', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      stageBackground: '#ffffff', // Background color for the staged behind highlighted element
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步'
    })
  },
  methods: {
    guide(value) {
      var step = ''
      switch (value) {
        case 'steps':
          step = steps
          this.driver.defineSteps(step)
          this.driver.start()
          break
        case 'excelCard':
          this.$router.push(`/excelCard?guide=true`)
          break
        case 'nouns':
          this.$router.push(`/nouns`)
          break
        case 'orderPackage':
          this.$router.push(`/orderPackage?guide=true`)
          break
        case 'package':
          this.$router.push(`/package?guide=true`)
          break
        case 'changeAction':
          this.$router.push(`/changeAction?guide=true`)
          break
        case 'unbindAction':
          this.$router.push(`/unbindAction?guide=true`)
          break
        case 'addCustomer':
          this.$router.push(`/kefu?guide=true`)
          break
        case 'roleSearch':
          this.$router.push(`/role?guide=true`)
          break
        case 'agent':
          this.$router.push(`/agent?guide=true`)
          break
        case 'worklistSearch':
          this.$router.push(`/excelOrderWork?guide=true`)
          break
        default:
          break
      }
    }
  }
}
</script>
