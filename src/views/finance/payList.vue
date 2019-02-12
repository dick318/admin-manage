<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
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
      <el-input v-model.trim="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入昵称"/>
      <!-- <el-select v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择订单状态">
        <el-option
          v-for="item in orderStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select> -->
      <el-select v-model="listQuery.orderType" class="filter-item" filterable clearable placeholder="请选择订单类型">
        <el-option
          v-for="item in orderTypeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.orderID" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单号"/>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:export:weipayList']" size="small" type="warning " class="filter-item" @click="handleDownload">Java导出</el-button>
      <el-button v-waves v-permission="['kuyuplat:wx:excelRefund']" size="small" type="warning " class="filter-item" @click="jump()">批量退款</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row>
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="昵称" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'warning'">{{ payListMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="订单类型" min-width="150">
        <template slot-scope="scope">
          <span>{{ orderTypeMap[scope.row.orderType] }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="支付渠道" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payType==1?'success':''">{{ scope.row.payType==1?'微信':scope.row.payType==2?'支付宝':scope.row.payType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:wx:refundList']" type="primary" size="mini" @click="jump(`/finance/payListRefund?orderNo=${scope.row.orderID}`)">记录</el-button>
          <el-button v-permission="['kuyuplat:wx:refund']" type="danger" size="mini" @click="approvalRefund(scope.row)">退款</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="微信退款">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="8rem">
        <el-form-item label="退款金额" prop="refundFee">
          <el-input v-model.trim.number="temp.refundFee" placeholder="默认退款全额" clearable/>
        </el-form-item>
        <el-form-item label="退款备注" prop="remarks">
          <el-input v-model.trim="temp.remarks" clearable placeholder="退款备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchWeipayList, exportWeipayList, weipayRefund
} from '@/api/payList'
import { payListMap, orderTypeSelect, orderTypeMap, orderStatusSelect } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'PayList',
  directives: {
    waves
  },
  data() {
    return {
      orderTypeSelect,
      orderTypeMap,
      payListMap,
      orderStatusSelect,
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: null,
      dialogFormVisible: false,
      rules: {
        refundFee: [
          { required: true, message: '请输入退款金额', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],
        remarks: [
          { required: true, message: '请输入退款备注', trigger: 'blur' }
        ]
      },
      temp: {
        orderNo: '',
        refundFee: '',
        remarks: ''
      },
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderType: '',
        orderID: this.$route.query.orderID,
        nickname: '',
        starttime: '',
        endtime: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    jump(type) {
      this.$router.push(type)
    },
    approvalRefund(row) {
      this.dialogFormVisible = true
      this.temp = Object.assign({}, { orderNo: row.orderID, refundFee: row.amount }) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          weipayRefund(this.temp, '.el-dialog__footer').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (res.status === 0) {
              this.dialogFormVisible = false
              this.getList('sec')
            }
          })
        }
      })
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        orderType: '',
        orderID: '',
        nickname: '',
        starttime: '',
        endtime: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleDownload() {
      this.$confirm('此操作将导出支付记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportWeipayList(this.listQuery, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getList() {
      searchWeipayList(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message
        })
      })
    }
  }
}
</script>
<style scoped>
.warn-content {
  display: flex;
  margin-top: 0;
}
.warn-content span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
