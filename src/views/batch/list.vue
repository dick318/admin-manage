<template>
  <div class="app-container">
    <el-button v-permission="['kuyuplat:card:batchChangeCardStatus','kuyuplat:excel:batchChangeCardStatus']" class="el-button" size="mini" type="primary" @click="jump('/batch/changeStatus')">批量停复机</el-button>
    <el-button v-permission="['kuyuplat:card:changeCardStatus']" class="el-button" size="mini" type="primary" @click="jump('/batch/changeStatusAlone')">循环停复机</el-button>
    <el-button v-permission="['kuyuplat:card:getAddPackage']" class="el-button" size="mini" type="primary" @click="jump('/batch/getInfoMore')">流量</el-button>
    <el-button v-permission="['kuyuplat:card:find']" class="el-button" size="mini" type="primary" @click="jump('/batch/getCardInfoMore')">卡片信息</el-button>
    <el-button v-permission="['kuyuplat:weipaylist:search']" class="el-button" size="mini" type="primary" @click="jump('/batch/payListMore')">支付记录查询</el-button>
    <el-button v-if="checkPermission(['kuyuplat:order:search'])&&checkPermission(['kuyuplat:addpackage:search'])&&checkPermission(['kuyuplat:card:getAddPackage'])" class="el-button" size="mini" type="primary" @click="jump('/batch/refundMore')">退款资格</el-button>
    <el-button v-permission="['kuyuplat:orderAccount:search']" class="el-button" size="mini" type="primary" @click="jump('/batch/amountOrderMore')">余额订单查询</el-button>
    <el-button v-permission="['kuyuplat:order:search']" class="el-button" size="mini" type="primary" @click="jump('/batch/orderMore')">套餐订单查询</el-button>
    <el-button v-permission="['kuyuplat:commissions:search']" class="el-button" size="mini" type="primary" @click="jump('/batch/CommissionMore')">佣金批量查询</el-button>
    <el-button v-permission="['kuyuplat:card:superChangeCardStatus']" class="el-button" size="mini" type="primary" @click="jump('/batch/operationChangeStatus')">运营停复机</el-button>
    <el-button v-permission="['kuyuplat:card:active']" class="el-button" size="mini" type="primary" @click="jump('/card/activeCtcc')">运营批量激活</el-button>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'BatchList',
  data() {
    return {
    }
  },
  methods: {
    checkPermission,
    jump(type) {
      this.$router.push(type)
    }
  }
}
</script>
<style scoped>
.el-button{
  margin-top:10px;
}
</style>
