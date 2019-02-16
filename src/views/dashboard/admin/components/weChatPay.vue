<template>
  <div class="app-container">
    <div class="filter-container">

      <el-date-picker
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
        @change="ChangeTime"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
        @change="ChangeTime"
      />
      <el-select v-model="listQuery.timeFlat" class="filter-item" clearable placeholder="请选择时间区段" @change="ChangeTimeFlat">
        <el-option
          v-for="item in timeFlatSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves size="small" type="primary" class="filter-item " icon="el-icon-search" @click="handleFilter"/>
    </div>
    <el-row :gutter="32">
      <el-col :span="8" @click.native="active('totalMoney')">
        <el-card :class="classTotalMoney" shadow="hover" class="box-card">
          <div>销售总金额</div>
          <div>{{ totalMoney }}</div>
          <div>{{ startTime }}~{{ endTime }}</div>
        </el-card>
      </el-col>
      <el-col :span="8" @click.native="active('payCount')">
        <el-card :class="classPayCount" shadow="hover" class="box-card">
          <div>销售总笔数</div>
          <div>{{ payCount }}</div>
          <div>{{ startTime }}~{{ endTime }}</div>
        </el-card>
      </el-col>
      <el-col :span="8" @click.native="active('avgMoney')">
        <el-card :class="classAvgMoney" shadow="hover" class="box-card">
          <div>人均金额</div>
          <div>{{ avgMoney }}</div>
          <div>{{ startTime }}~{{ endTime }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top:15px;">
      <Line-chart ref="chart" :chart-data="chartData"/>
    </el-card>
    <el-card style="margin-top:15px;">
      <el-table
        :data="list.slice((pagination.page-1)*pagination.limit,pagination.page*pagination.limit)"
        class="table"
        element-loading-text="给我一点时间"
        style="width: 100%;padding-top: 15px;">
        <el-table-column show-overflow-tooltip label="日期" align="center" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="销售金额（元）" align="center">
          <template slot-scope="scope">
            {{ scope.row.totalMoney }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="销售笔数（笔）" align="center">
          <template slot-scope="scope">
            {{ scope.row.payCount }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="人均金额（元）" align="center">
          <template slot-scope="scope">
            {{ scope.row.avgMoney }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="pagination.limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </el-card>

  </div>
</template>

<script>
import LineChart from './LineChart'
import { payDayInfo } from '@/api/data'
import waves from '@/directive/waves' // 水波纹指令

export default {
  components: {
    LineChart
  },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: 0,
      pagination: {
        page: 1,
        limit: 10
      },
      pickerOptions: this.processDate(),
      timeFlatSelect: [
        {
          value: '1',
          label: '最近3天'
        },
        {
          value: '2',
          label: '最近一周'
        },
        {
          value: '3',
          label: '最近一月'
        }
      ],
      listQuery: {
        starttime: '',
        endtime: '',
        timeFlat: ''
      },
      classTotalMoney: '',
      classPayCount: '',
      classAvgMoney: '',
      type: 'totalMoney',
      totalMoney: '',
      payCount: '',
      avgMoney: '',
      startTime: '',
      endTime: '',
      chartData: {
        payCount: [],
        totalMoney: [],
        avgMoney: [],
        xAxisData: [],
        legendData: ['销售总金额', '销售总笔数', '人均金额']
      },
      temp: {
        payCount: [],
        totalMoney: [],
        avgMoney: []
      }
    }
  },
  created() {
    this.getPayDayInfo()
    this.classTotalMoney = 'active'
  },
  methods: {
    ChangeTimeFlat(value) {
      if (value) {
        this.listQuery.starttime = ''
        this.listQuery.endtime = ''
      }
    },
    ChangeTime(value) {
      if (value) {
        this.listQuery.timeFlat = ''
      }
    },
    resetTemp() {
      this.chartData = {
        payCount: [],
        totalMoney: [],
        avgMoney: [],
        xAxisData: [],
        legendData: ['销售总金额', '销售总笔数', '人均金额']
      }
      this.list = []
      this.pagination = {
        page: 1,
        limit: 10
      }
    },
    handleSizeChange(val) {
      this.pagination.limit = val
    },
    handleCurrentChange(val) {
      this.pagination.page = val
    },
    handleFilter() {
      this.resetTemp()
      this.getPayDayInfo(this.listQuery)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    active(type) {
      if (type === 'totalMoney') {
        this.classTotalMoney = 'active'
        this.classPayCount = ''
        this.classAvgMoney = ''
        this.chartData.totalMoney = this.temp.totalMoney
        this.chartData.avgMoney = []
        this.chartData.payCount = []
      }
      if (type === 'payCount') {
        this.classTotalMoney = ''
        this.classPayCount = 'active'
        this.classAvgMoney = ''
        this.chartData.payCount = this.temp.payCount
        this.chartData.avgMoney = []
        this.chartData.totalMoney = []
      }
      if (type === 'avgMoney') {
        this.classTotalMoney = ''
        this.classPayCount = ''
        this.classAvgMoney = 'active'
        this.chartData.avgMoney = this.temp.avgMoney
        this.chartData.totalMoney = []
        this.chartData.payCount = []
      }
      this.type = type
    },
    getPayDayInfo(data = {}, type = this.type) {
      payDayInfo(data).then(res => {
        if (res.status !== 0) {
          return
        }
        let totalMoney = 0
        let payCount = 0
        let avgMoney = 0
        const length = res.data.length
        this.temp.avgMoney = []
        this.temp.totalMoney = []
        this.temp.payCount = []
        for (const value of Object.values(res.data)) {
          totalMoney += value.totalMoney
          payCount += value.payCount
          avgMoney += value.avgMoney
          this.temp.avgMoney.push(
            { value: value.avgMoney, name: value.time }
          )
          this.temp.totalMoney.push(
            { value: value.totalMoney, name: value.time }
          )
          this.temp.payCount.push(
            { value: value.payCount, name: value.time }
          )
          if (type === 'totalMoney') {
            this.chartData.totalMoney = this.temp.totalMoney
          }
          if (type === 'payCount') {
            this.chartData.payCount = this.temp.payCount
          }
          if (type === 'avgMoney') {
            this.chartData.avgMoney = this.temp.avgMoney
          }
          this.chartData.xAxisData.push(value.time)
        }
        this.startTime = res.data[0].time
        this.endTime = res.data[length - 1].time
        this.totalMoney = totalMoney.toFixed(2)
        this.payCount = payCount.toFixed(2)
        this.list = res.data.reverse()
        this.total = res.data.length
        this.avgMoney = (avgMoney / this.total).toFixed(2)
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
.active{
    background-color: #42b983;
    color: #fff;
}
</style>

