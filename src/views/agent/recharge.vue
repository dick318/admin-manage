<template>
  <div class="app-container">
    <div class="filter-container addAction">
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商" @clear="money=''">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.remarks" class="filter-item" style="width:130px" clearable placeholder="请输入备注"/>
      <el-input v-model.trim="listQuery.amount" type="number" class="filter-item" style="width:130px" clearable placeholder="请输入金额（元）"/>
      <div class="el-select filter-item el-select--medium payType">
        <el-radio v-model="type" label="1" style="margin-left:10px">增加</el-radio>
        <el-radio v-model="type" label="2" style="margin-left:10px">减少</el-radio>
      </div>
      <el-button v-waves v-permission="['kuyuplat:agentAccount:save']" size="small" type="primary" class="filter-item" @click="recharge" >确认</el-button>
    </div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.orderID" class="filter-item" style="width: 220px;" clearable placeholder="请输入订单号"/>
      <el-date-picker
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves size="small" type="warning " class="filter-item" icon="el-icon-download" @click="webDownload"/>
    </div>
    <p v-if="money" class="warn-content" style="margin : 0">
      账户余额:<a>{{ money }}</a>
    </p>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row
      @cellClick="jump">
      <!-- <el-table-column show-overflow-tooltip align="center" label="代理商id" min-width="100">
        <template slot-scope="scope">
          <span>{{ }}</span>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip align="center" label="代理商名称" min-width="160">
        <template slot-scope="scope">
          <span>{{ aidObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(scope.row)">{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="充值时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="备注" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="充值类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'danger':'success'">{{ scope.row.type==1?'充值':'扣费' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动前的余额">
        <template slot-scope="scope">
          <span>{{ scope.row.agoAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动余额">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'danger':'success'">{{ scope.row.type==2?-Math.abs(scope.row.amount):Math.abs(scope.row.amount) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动后的余额">
        <template slot-scope="scope">
          <span>{{ scope.row|filterAfter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作者" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getAgentAccount, agentRecharge } from '@/api/agent'
import { getAgent } from '@/api/agent'
import { agentArr } from '@/utils/mapArr'

export default {
  name: 'AgentAmount',
  directives: {
    waves
  },
  filters: {
    filterFun(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    },
    filterAfter(value) {
      let afterMoney
      if (+value.type === 2) {
        afterMoney = (value.agoAmount - Math.abs(value.amount)).toFixed(2)
      } else {
        afterMoney = (value.agoAmount + Math.abs(value.amount)).toFixed(2)
      }
      return afterMoney
    }
  },
  data() {
    return {
      pickerOptions: this.processDate(),
      agentSelect: [],
      aidObject: [],
      type: '',
      listQuery: {
        aid: this.$route.query.aid ? +this.$route.query.aid : '',
        remarks: '',
        amount: '',
        type: '',
        // starttime: '',
        // endtime: '',
        orderID: this.$route.query.orderID,
        pageNo: 1,
        pageSize: 10
      },
      money: '',
      list: [],
      tableKey: 0,
      total: 0

    }
  },
  created() {
    this.getList()
    agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
      this.agentSelect = agentSelect
      this.aidObject = aidObject
    })
  },
  methods: {
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    getAmountInfo() {
      if (this.listQuery.aid) {
        this.money = '加载中！'
        getAgent({ id: this.listQuery.aid }, '.warn-content').then(res => {
          if (res.status === 0) {
            this.money = res.data.money || 0 + '元'
          } else {
            this.money = 0 + '元'
          }
        })
      }
    },
    jump(row) {
      this.$router.push(`/finance/orderFlow?orderID=${row.orderID}`)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    recharge() {
      if (!this.listQuery.aid) {
        this.$notify({
          type: 'error',
          message: '请选择代理商'
        })
        return false
      }
      if (!this.listQuery.amount) {
        this.$notify({
          type: 'error',
          message: '请输入充值金额'
        })
        return false
      }
      if (!this.type) {
        this.$notify({
          type: 'error',
          message: '请选择操作类型！'
        })
        return false
      }
      agentRecharge({
        aid: this.listQuery.aid,
        type: this.type,
        amount: this.listQuery.amount,
        remarks: this.listQuery.remarks
      }, '.addAction').then(res => {
        if (+res.status === 0) {
          this.getList()
        }

        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery = {
        aid: '',
        remarks: '',
        amount: '',
        type: '',
        orderID: '',
        pageNo: 1,
        pageSize: 10
      }
      this.type = ''
      this.getAmountInfo()
      this.getList('sec')
    },
    webDownload() {
      this.downAction()
    },
    downAction(pageSize) {
      getAgentAccount({
        orderID: this.listQuery.orderID,
        pageSize: pageSize,
        pageNo: 1
      }, '.table').then(res => {
        if (+res.status === 0) {
          const list = res.data.rows
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '订单号',
              '充值时间',
              '充值类型',
              '扣费前余额',
              '套餐扣费',
              '备注'
            ]
            const filterVal = [
              'orderID',
              'addtime',
              'type',
              'agoAmount',
              'amount',
              'remarks'
            ]
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: `余额信息${new Date().toLocaleDateString()}`
            })
            this.$notify({
              type: 'success',
              message: res.message
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
          if (j === 'type') {
            return +v[j] === 1 ? '充值' : '扣费'
          } else if (j === 'amount') {
            return +v['type'] === 1 ? -Math.abs(v[j]) : -Math.abs(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getList(type) {
      getAgentAccount(Object.assign(this.listQuery, { type: this.type }), '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        this.getAmountInfo()
        if (type === 'sec') {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message
          })
        }
      })
    }
  }
}
</script>
