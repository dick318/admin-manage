<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="card"
        class="filter-item"
        style="width:220px"
        clearable
        placeholder="请输入卡号"
      />
      <el-button
        class="filter-item"
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      />
    </div>
    <el-tabs v-model="active" type="border-card" class="tabs">
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:find'])" :lazy="true" label="卡片详情" name="cardDetail">
        <cardDetail ref="cardDetail" :msisdn="card" source ="mobile"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:getAddPackage'])" :lazy="true" label="流量套餐详情" name="getInfo">
        <getInfo ref="getInfo" :msisdn="card" source ="mobile"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:addpackage:search'])" :lazy="true" label="订购详情" name="orderPackage">
        <orderPackage ref="orderPackage" :card="card" source ="mobile"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:order:search'])" :lazy="true" label="订单详情" name="order">
        <order ref="order" :card-no="card" source ="mobile"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:cardSimstate:find'])" :lazy="true" label="停复机详情" name="stopReset">
        <stopReset ref="stopReset" :msisdn="card" source ="mobile"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:card:getCardMoney'])" :lazy="true" label="账单详情" name="rechargeList">
        <rechargeList ref="rechargeList" :msisdn="card" source ="mobile"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import rechargeList from '../card/rechargeList'
import cardDetail from '../card/cardDetail'
import getInfo from '../business/getInfo'
import orderPackage from '../business/orderPackage'
import stopReset from '../business/stopReset'
import order from '../finance/order'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'MobileDetail',
  components: {
    rechargeList,
    cardDetail,
    getInfo,
    orderPackage,
    stopReset,
    order
  },
  data() {
    return {
      active: 'cardDetail',
      card: '',
      loading: {
        rechargeList: '',
        cardDetail: '',
        getInfo: '',
        orderPackage: '',
        stopReset: '',
        order: ''
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
  methods: {
    checkPermission,
    activeChange(val) {
      switch (val) {
        case 'cardDetail':
          if (!this.card) {
            return false
          }
          if (this.loading.cardDetail !== true) {
            this.$refs.cardDetail.handleFilter()
          }
          this.loading.cardDetail = true
          break
        case 'getInfo':
          if (!this.card) {
            return false
          }
          if (this.loading.getInfo !== true) {
            this.$refs.getInfo.handleFilter()
          }
          this.loading.getInfo = true
          break
        case 'orderPackage':
          if (!this.card) {
            return false
          }
          if (this.loading.orderPackage !== true) {
            this.$refs.orderPackage.handleFilter()
          }
          this.loading.orderPackage = true
          break
        case 'order':
          if (!this.card) {
            return false
          }
          if (this.loading.order !== true) {
            this.$refs.order.handleFilter()
          }
          this.loading.order = true
          break
        case 'stopReset':
          if (!this.card) {
            return false
          }
          if (this.loading.stopReset !== true) {
            this.$refs.stopReset.handleFilter()
          }
          this.loading.stopReset = true
          break
        case 'rechargeList':
          if (!this.card) {
            return false
          }
          if (this.loading.rechargeList !== true) {
            this.$refs.rechargeList.handleFilter()
          }
          this.loading.rechargeList = true
          break
        default:
          break
      }
    },
    handleFilter() {
      if (this.card) {
        this.loading = {
          rechargeList: '',
          cardDetail: '',
          getInfo: '',
          orderPackage: '',
          stopReset: '',
          order: ''
        }
        this.activeChange(this.active)
      } else {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作！'
        })
      }
    }
  }
}
</script>
<style scoped>
.tabs>>>.el-tabs__item {
  width: 50%;
  text-align: center!important;
}
.tabs>>>.el-tabs__nav {
  white-space: inherit!important;
}
.tabs>>>.el-tabs__item.is-active{
  background-color: #409EFF!important;
  color: #fff!important;
  border-radius: 5px;
}
.tabs>>>.el-tabs__content,.tabs>>>.app-container{
  padding: 5px!important;
}
</style>

