<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.status" class="filter-item" clearable placeholder="请选择提现状态">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh('getAgent')"/>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>
      <el-table-column align="center" label="id" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理商名称" min-width="180">
        <template slot-scope="scope">
          <span>{{ anameObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现金额（元）" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡" min-width="150">
        <template slot-scope="scope">
          <span>{{ bankCardObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付宝" min-width="150">
        <template slot-scope="scope">
          <span>{{ alipayObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="提现状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'danger':'success'">{{ withdrawStatusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="拒绝理由" min-width="155">
        <template slot-scope="scope">
          <span >{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.approvaltime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" min-width="200">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:commission:approval']" v-if="+scope.row.status===1" type="primary" size="mini" @click="handleUpdate(scope.row)">通过</el-button>
          <el-button v-permission="['kuyuplat:commission:approval']" v-if="+scope.row.status===1" type="danger" size="mini" @click="handleRefuse(scope.row)">拒绝</el-button>
          <el-tag v-if="+scope.row.status!==1" :type="scope.row.status==3?'danger':''">{{ +scope.row.status ===2?'已通过':'已拒绝' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { searchWithdrawals, commissionApproval } from '@/api/withdraw'
import waves from '@/directive/waves' // 水波纹指令
import { withdrawStatusMap, agentArr, withdrawStatus } from '@/utils/mapArr'
import checkPermission from '@/utils/permission' // 权限判断函数
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Withdraw',
  components: { Pagination },

  directives: {
    waves
  },
  filters: {
    filterFun(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    }
  },
  data() {
    return {
      withdrawStatusMap,
      tableKey: 0,
      list: [],
      total: 0,
      status: withdrawStatus,
      agentSelect: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        aid: '',
        status: ''
      },
      bankCardObject: {},
      alipayObject: {},
      anameObject: {},
      type: ''
    }
  },
  created() {
    this.getSelect()
    this.getList()
  },
  methods: {
    checkPermission,
    getSelect() {
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
        this.agentSelect = agentSelect
        this.anameObject = anameObject
        this.bankCardObject = bankCardObject
        this.alipayObject = alipayObject
      })
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        aid: '',
        status: ''
      }
      this.getList()
    },
    handleUpdate(row) {
      this.$confirm('此操作将通过提现, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commissionApproval({
          status: 2,
          id: row.id
        }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            this.getList('getAgent')
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleRefuse(row) {
      this.$prompt('', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入拒绝原因',
        inputErrorMessage: '拒绝理由不能为空',
        inputValidator: function(value) {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }).then(({ value }) => {
        commissionApproval({
          status: 3,
          reason: value,
          id: row.id
        }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            this.getList('getAgent')
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    getList(type) {
      searchWithdrawals(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        if (!type) {
          this.$notify({
            type: res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

