<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker
        v-model="month"
        value-format="yyyy-MM"
        type="month"
        class="filter-item"
        placeholder="选择日期"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="webDownload"/>
    </div>
    <el-card>
      <div class="chart-container">
        <chart
          :x-data="xData"
          :legend-data="legendData"
          :series-data0="seriesData0"
          :series-data1="seriesData1"
          :series-data2="seriesData2"
          height="100%"
          width="100%"/>
      </div>
    </el-card>
    <el-card style="margin-top:15px;">
      <el-table
        ref="multipleTable"
        :data="list.slice((listQuery.pageNo-1)*listQuery.pageSize,listQuery.pageNo*listQuery.pageSize)"
        :fit ="true"
        row-key="id"
        element-loading-text="给我一点时间"
        size="mini"
        class="multipleTable"
        tooltip-effect="dark"
        highlight-current-row>
        <el-table-column align="center" label="卡号" show-overflow-tooltip min-width="180">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.msisdns }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="流量开始使用时间" show-overflow-tooltip min-width="180">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.starttime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="流量使用结束时间" show-overflow-tooltip min-width="180">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.endtime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="接口流量" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.apiflow| flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="期间使用流量" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.partflow| flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总流量" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.sumflow| flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已用量" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span type="text">{{ scope.row.useflow | flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用率" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span type="text">{{ scope.row| perFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    </el-card>

  </div>

</template>

<script>
import Chart from '@/components/Charts/mixChart'
import { cardFlowDetail } from '@/api/card'
import waves from '@/directive/waves' // 水波纹指令
import { toSize } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'FlowDetail',
  components: { Chart, Pagination },
  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return toSize(+value * 1024)
    },
    perFilter(value) {
      return +value.useflow === 0 ? '0%' : +value.sumflow === 0 ? '100%' : +((+value.useflow / +value.sumflow) * 100).toFixed(2) + '%'
    }
  },
  data() {
    return {
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      xData: [],
      legendData: ['总流量', '已用流量', '使用率'],
      seriesData0: [],
      seriesData1: [],
      seriesData2: [],
      cardId: this.$route.query.id,
      msisdns: this.$route.query.card,
      month: this.getMonth()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getMonth() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      return year.toString() + '-' + month.toString()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.xData = []
      this.seriesData0 = []
      this.seriesData1 = []
      this.seriesData2 = []
      this.list = []
      this.total = 0
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
    },
    handleRefresh() {
      this.getList()
    },
    getList() {
      cardFlowDetail({ cardId: this.cardId, month: this.month, msisdns: this.msisdns }, '.multipleTable').then(
        res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            var dataJson = res.data.rows
            var sumArr = []
            var useArr = []
            var perArr = []
            var xdata = []
            dataJson.map((data, i) => {
              this.list.push(Object.assign(data, { msisdns: this.msisdns }))
              sumArr.push(+(+data.sumflow / 1024).toFixed(2))
              useArr.push(+(+data.useflow / 1024).toFixed(2))
              perArr.push(+((+data.useflow / +data.sumflow) * 100).toFixed(2))
              xdata.push(data.endtime)
            })
            this.total = dataJson.length
            this.xData = [].concat(xdata)
            this.seriesData0 = [].concat(sumArr)
            this.seriesData1 = [].concat(useArr)
            this.seriesData2 = [].concat(perArr)
          }
        }
      )
    },
    webDownload() {
      this.downAction()
    },
    downAction() {
      cardFlowDetail({ cardId: this.cardId, month: this.month, msisdns: this.listQuery.msisdns }, '.multipleTable').then(res => {
        if (+res.status === 0) {
          const list = res.data.rows
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              'iccid',
              '流量开始使用时间',
              '流量使用结束时间',
              '接口流量',
              '期间使用流量',
              '总量',
              '已用流量',
              '使用率'
            ]
            const filterVal = [
              'iccid',
              'starttime',
              'endtime',
              'apiflow',
              'partflow',
              'sumflow',
              'useflow',
              'per'
            ]
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: `流量详细信息${new Date().toLocaleDateString()}`
            })
            this.$notify({
              type: 'success',
              message: res.message,
              duration: 2000
            })
          })
        } else {
          this.$notify({
            type: 'error',
            message: '数量过多'
          })
          this.$prompt('', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入导出数量',
            inputErrorMessage: '数量填写不正确',
            inputValue: 10000,
            inputValidator: function(value) {
              if (/(^[1-9]\d*$)/.test(+value)) {
                return true
              } else {
                return false
              }
            }
          }).then(({ value }) => {
            this.downAction(value)
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'iccid') {
            return this.msisdns
          } else if (j === 'apiflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'partflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'useflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'sumflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'per') {
            return +((+v['useflow'] / +v['sumflow']) * 100).toFixed(2)
          } else {
            return v[j]
          }
        })
      )
    } }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

