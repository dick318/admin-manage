<template>
  <div class="app-container">
    <el-tabs v-model="active" type="border-card">
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:find'])" :lazy="true" label="卡片详情" name="cardDetail">
        <cardDetail ref="cardDetail" source ="backstage"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:getCardMoney'])" :lazy="true" label="余额详情" name="rechargeList">
        <rechargeList
          ref="rechargeList"
          source ="backstage"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:imeiReRecordFind'])" :lazy="true" label="解绑详情" name="unbind">
        <unbind
          ref="unbind"
          source ="backstage"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:getAddPackage'])" :lazy="true" label="流量详情" name="getInfo">
        <getInfo
          ref="getInfo"
          source ="backstage"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:addpackage:search'])" :lazy="true" label="套餐订购记录" name="orderPackage">
        <orderPackage
          ref="orderPackage"
          source ="backstage"
        />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:cardSimstate:find'])" :lazy="true" label="变更记录（停复机）" name="stopReset">
        <stopReset
          ref="stopReset"
          source ="backstage"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:order:search'])" :lazy="true" label="订单详情" name="order">
        <order
          ref="order"
          source ="backstage"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import rechargeList from './rechargeList'
import cardDetail from './cardDetail'
import unbind from '../business/unbind'
import getInfo from '../business/getInfo'
import orderPackage from '../business/orderPackage'
import stopReset from '../business/stopReset'
import order from '../finance/order'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Detail',
  components: {
    rechargeList,
    cardDetail,
    unbind,
    getInfo,
    orderPackage,
    stopReset,
    order
  },
  data() {
    return {
      active: 'cardDetail',
      cardId: this.$route.query.cardId,
      iccid: this.$route.query.iccid,
      tel: this.$route.query.tel,
      number: this.$route.query.number,
      loading: {
        rechargeList: '',
        cardDetail: '',
        getInfo: '',
        orderPackage: '',
        stopReset: '',
        order: '',
        unbind: ''
      }
    }
  },
  watch: {
    active(val) {
      this.$nextTick(() => {
        this.activeChange(val)
      })
    }
  },
  mounted() {
    this.activeChange(this.active)
  },
  methods: {
    checkPermission,
    activeChange(val) {
      switch (val) {
        case 'cardDetail':
          if (this.loading.cardDetail !== true) {
            this.$refs.cardDetail.handleFilter()
          }
          this.loading.cardDetail = true
          break
        case 'getInfo':
          if (this.loading.getInfo !== true) {
            this.$refs.getInfo.handleFilter()
          }
          this.loading.getInfo = true
          break
        case 'orderPackage':
          if (this.loading.orderPackage !== true) {
            this.$refs.orderPackage.handleFilter()
          }
          this.loading.orderPackage = true
          break
        case 'order':
          if (this.loading.order !== true) {
            this.$refs.order.handleFilter()
          }
          this.loading.order = true
          break
        case 'stopReset':
          if (this.loading.stopReset !== true) {
            this.$refs.stopReset.handleFilter()
          }
          this.loading.stopReset = true
          break
        case 'rechargeList':
          if (this.loading.rechargeList !== true) {
            this.$refs.rechargeList.handleFilter()
          }
          this.loading.rechargeList = true
          break
        case 'unbind':
          if (this.loading.unbind !== true) {
            this.$refs.unbind.handleFilter()
          }
          this.loading.unbind = true
          break
        default:
          break
      }
    }
  }
}
</script>
