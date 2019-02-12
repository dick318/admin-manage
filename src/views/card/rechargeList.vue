<template>
  <div
    :msisdn="msisdn"
    :source="source"
    class="app-container"
  >
    <div v-if="source!='mobile'" class="filter-container">
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>
      <el-input v-model.trim="remarks" class="filter-item" style="width:130px" clearable placeholder="请输入备注"/>
      <el-input v-model.trim="amount" type="number" class="filter-item" style="width:130px" clearable placeholder="金额（元）"/>
      <el-button v-permission="['kuyuplat:card:editCard']" v-waves size="small" type="primary" class="filter-item" @click="recharge" >充值</el-button>
      <el-button v-permission="['kuyuplat:card:editCard']" v-waves size="small" type="primary" class="filter-item" @click="jumpPackage" >订购查询</el-button>
      <!-- <el-date-picker
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
      /> -->
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
    </div>
    <p class="warn-content" style="margin : 0">
      卡片余额:<a>{{ money }}</a>
    </p>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>

      <el-table-column show-overflow-tooltip align="center" label="id">
        <template slot-scope="scope">
          <span >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="ICCID" width="160">
        <template slot-scope="scope">
          <span >{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="充值时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作者" width="160">
        <template slot-scope="scope">
          <span >{{ scope.row.dname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(scope.row)">{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="备注">
        <template slot-scope="scope">
          <span >{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="充值类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'danger':'success'">{{ scope.row.type==1?'充值':'扣费' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动前的余额">
        <template slot-scope="scope">
          <span>{{ scope.row.oldmoney }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动余额">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'danger':'success'">{{ scope.row.type==2?-Math.abs(scope.row.money):Math.abs(scope.row.money) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="变动后的余额">
        <template slot-scope="scope">
          <span>{{ scope.row|filterAfter }}</span>
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
import { getCardMoney, getCard, editCard } from '@/api/card'

export default {
  name: 'RechargeList',
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
        afterMoney = (value.oldmoney - Math.abs(value.money)).toFixed(2)
      } else {
        afterMoney = (value.oldmoney + Math.abs(value.money)).toFixed(2)
      }
      return afterMoney
    }
  },
  props: {
    msisdn: {
      type: String,
      default: ''
    },
    cardId: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pickerOptions: this.processDate(),
      remarks: '',
      amount: '',
      money: '',
      listQuery: {
        cardId: this.$route.query.cardId,
        msisdn: '',
        iccid: this.$route.query.iccid,
        tel: this.$route.query.tel,
        number: this.$route.query.number,
        pageNo: 1,
        pageSize: 10
      },
      list: [],
      tableKey: 0,
      total: 0

    }
  },
  created() {
    if (!this.source) {
      this.getList()
    }
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
      getCard(this.listQuery, '.warn-content').then(res => {
        if (res.status !== 0 || res.data.rows.length > 1) {
          return
        }
        this.money = (res.data.rows[0].amount ? res.data.rows[0].amount : 0.00) + '元'
      })
    },
    jump(row) {
      this.$router.push(`/finance/payList?orderID=${row.source}`)
    },
    jumpPackage() {
      this.$router.push(`/business/orderPackage?iccid=${this.listQuery.iccid}&tel=${this.listQuery.tel}`)
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
      if (!this.listQuery.iccid && !this.listQuery.tel && !this.listQuery.number && !this.listQuery.cardId && !this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      if (!this.amount) {
        this.$notify({
          type: 'error',
          message: '请输入变动金额'
        })
        return false
      }
      if (!this.remarks) {
        this.$notify({
          type: 'error',
          message: '请输入备注'
        })
        return false
      }

      editCard({ iccid: this.listQuery.iccid, cardId: this.listQuery.cardId, tel: this.listQuery.tel, msisdn: this.msisdn, number: this.listQuery.number, amount: this.amount, remarks: this.remarks }, '.filter-container').then(res => {
        if (+res.status === 0) {
          this.getList()
          this.getAmountInfo()
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
        cardId: '',
        iccid: '',
        tel: '',
        number: '',
        msisdn: '',
        pageNo: 1,
        pageSize: 10
      }
      this.remarks = ''
      this.amount = ''
      this.money = ''
      this.getList()
    },
    getList(type) {
      if (this.listQuery.iccid || this.listQuery.tel || this.listQuery.number || this.listQuery.cardId || this.msisdn) {
        this.getAmountInfo()
      }
      getCardMoney(Object.assign(this.listQuery, { msisdn: this.msisdn }), '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        if (type === 'sec') {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
