<template>
  <div class="app-container">
    <el-row v-if="checkPermission(['kuyuplat:analyzer:wxinfo'])" :gutter="32" >
      <el-col :span="12" >
        <el-card shadow="hover" class="box-card addFans">
          <div>新增粉丝</div>
          <div>{{ newTotal }}</div>
        </el-card>
      </el-col>
      <el-col :span="12" >
        <el-card shadow="hover" class="box-card total">
          <div>粉丝总数</div>
          <div>{{ total }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card v-if="checkPermission(['kuyuplat:analyzer:wxdayinfo'])" style="margin-top:15px;">
      <Line-chart ref="chart" :chart-data="chartData"/>
    </el-card>
  </div>
</template>

<script>
import LineChart from './LineChart'
import { wxInfo, wxDayInfo } from '@/api/data'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  components: {
    LineChart
  },
  directives: {
    waves
  },
  data() {
    return {
      total: 0,
      newTotal: 0,
      chartData: {
        addFans: [],
        xAxisData: [],
        legendData: ['新增粉丝']
      }
    }
  },
  created() {
    this.getWx()
  },
  methods: {
    checkPermission,
    getWx() {
      wxInfo({}).then(res => {
        if (res.status === 0) {
          this.total = res.data.total
          this.newTotal = res.data.newTotal
        }
      })
      wxDayInfo({}).then(res => {
        if (+res.status !== 0) {
          return false
        }
        for (const [key, value] of Object.entries(res.data)) {
          this.chartData.addFans.push(
            { value: value, name: key }
          )
          this.chartData.xAxisData.push(key)
        }
      })
    }
  }
}
</script>
<style scoped>
.box-card div{
    text-align: center;
    margin-top: 10px;
}
.addFans{
    background-color: #67C23A;
    color: #fff;
}
.total{
    background-color: #42b983;
    color: #fff;
}
</style>

