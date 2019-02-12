<template>
  <div class="app-container calendar-list-container">
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
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.orderFee }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="退款单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.refundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="退款金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.refundFee }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="支付平台退款单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.payplatRefundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作者" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'warning'">{{ payListMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="支付渠道" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payType==1?'success':''">{{ scope.row.payType==1?'微信':scope.row.payType==2?'支付宝':scope.row.payType }}</el-tag>
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
import {
  refundList
} from '@/api/payList'
import { payListMap } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'PayListRefund',
  directives: {
    waves
  },
  data() {
    return {
      payListMap,
      tableKey: 0,
      list: [],
      total: null,
      dialogFormVisible: false,
      temp: {
        orderNo: '',
        refundFee: '',
        remarks: ''
      },
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderNo: this.$route.query.orderNo
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        orderType: '',
        orderNo: '',
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
    getList() {
      refundList(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    }
  }
}
</script>
