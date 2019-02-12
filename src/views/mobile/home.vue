<template>
  <div class="app-container">
    <el-row v-if="checkPermission(['kuyuplat:order:search','kuyuplat:card:find'])" :gutter="16">
      <el-col v-if="checkPermission(['kuyuplat:card:find'])" :span="12">
        <el-card class="el-card" @click.native="jump('/mobile/detail')">
          卡片信息查询
        </el-card>
      </el-col>
      <el-col v-if="checkPermission(['kuyuplat:order:search'])" :span="12">
        <el-card class="el-card" @click.native="jump('/finance/orderFlow')">
          充值订单查询
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="checkPermission(['kuyuplat:card:getCardReal','kuyuplat:obtain:find'])" :gutter="16" style="margin-top:16px;">
      <el-col v-if="checkPermission(['kuyuplat:card:getCardReal'])" :span="12">
        <el-card class="el-card" @click.native="jump('/card/autonym')">
          实名认证管理
        </el-card>
      </el-col>
      <el-col v-if="checkPermission(['kuyuplat:obtain:find'])" :span="12">
        <el-card class="el-card" @click.native="jump('/other/generalize')">
          推广活动管理
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="checkPermission(['kuyuplat:card:change','kuyuplat:worklist:search'])" :gutter="16" style="margin-top:16px;">
      <el-col v-if="checkPermission(['kuyuplat:card:change'])" :span="12">
        <el-card class="el-card" @click.native="jump('/business/changePackage')">
          换卡转套餐管理
        </el-card>
      </el-col>
      <el-col v-if="checkPermission(['kuyuplat:worklist:search'])" :span="12">
        <el-card class="el-card" @click.native="jump('/business/workOrder')">
          工单管理
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Home',
  methods: {
    checkPermission,
    jump(type) {
      this.$router.push(type)
    }
  }
}
</script>
<style scoped>
.el-card{
  letter-spacing: 2px;
  padding: 5px;
  text-align: center;
  line-height: 20px;
}
</style>

