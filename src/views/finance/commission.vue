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
      <el-input v-model.trim="listQuery.iccid" clearable style="width: 200px;" class="filter-item" placeholder="请输入iccid号"/>
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商" @change="changeAname">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="operatorids" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择套餐批次">
        <el-option
          v-for="item in oidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.remarks" class="filter-item" style="width: 200px;" clearable placeholder="请输入备注"/>
      <el-input v-model.trim="listQuery.orderID" class="filter-item" style="width: 200px;" clearable placeholder="请输入订单号"/>
      <el-input v-model.trim="listQuery.money" class="filter-item" style="width: 200px;" clearable placeholder="请输入佣金"/>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:export:commissionInfo']" v-waves class="filter-item" size="small" type="warning " @click="handleDownload">Java导出</el-button>
      <el-button v-permission="['kuyuplat:commission:save']" v-waves size="small" type="success" class="filter-item" @click="handleAdd">添加记录 </el-button>

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

      <el-table-column show-overflow-tooltip align="center" label="id" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span >{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span >{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="佣金(元)">
        <template slot-scope="scope">
          <el-tag :type="scope.row.money | moneyType"> {{ scope.row.money }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="订单时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="代理商" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐批次" min-width="180">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid] }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:commission:update']" type="danger" size="mini" @click="updateCommission(scope.row)">手动重算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="添加佣金记录">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item label="请选择代理商" prop="aid">
          <el-select v-model="temp.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
            <el-option
              v-for="item in agentSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择变动类型" prop="status">
          <el-radio v-model="temp.status" label="1" style="margin-left:10px;width:90px">添加</el-radio>
          <el-radio v-model="temp.status" label="2" style="margin-left:10px;width:90px">减少</el-radio>
        </el-form-item>
        <el-form-item label="变动佣金" prop="money">
          <el-input v-model.trim.number="temp.money" clearable placeholder="变动佣金"/>
        </el-form-item>
        <el-form-item label="变动原因">
          <el-input v-model.trim="temp.remarks" clearable placeholder="变动原因"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
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
  searchAgentCommissions, saveAgentCommission, updateCommission, exportCommissionInfo
} from '@/api/commission'
import { agentArr, tradeMap, operatorArr } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Commission',
  directives: {
    waves
  },
  filters: {
    tradeTypeFilter(trade_type) {
      return tradeMap[trade_type]
    },
    moneyType(money) {
      if (money && money !== '0.00' && +money > 0) {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      operatorids: [],
      oidSelect: [],
      oidObject: '',
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      agentSelect: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        iccid: '',
        aid: +this.$route.query.aid || '',
        remarks: '',
        orderID: '',
        money: '',
        operatorids: '',
        starttime: null,
        endtime: null
      },
      dialogFormVisible: false,
      rules: {
        aid: [
          {
            required: true,
            message: '代理商不能为空',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '佣金记录状态不能为空',
            trigger: 'blur'
          }
        ],
        money: [
          {
            required: true,
            message: '变动不能为空',
            trigger: 'blur'
          }, { type: 'number', message: '必须为数值' }
        ]
      },
      temp: {
        aid: '',
        status: '',
        money: '',
        remarks: ''
      }
    }
  },
  created() {
    this.getSelect()
    this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        aid: '',
        status: '',
        money: '',
        remarks: ''
      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          saveAgentCommission(this.temp, '.el-dialog__footer').then(res => {
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
    updateCommission(row) {
      this.$prompt('', '手动重算', {
        inputPattern: /^(\-|\+)?\d+(\.\d+)?$/,
        inputPlaceholder: '请输入要返佣的金额',
        inputErrorMessage: '请输入正确的数值'
      }).then(({ value }) => {
        updateCommission({ id: row.id, money: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            row.money = value
            this.dialogFormVisible = false
            for (const v of this.list) {
              if (v.id === row.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, row)
                break
              }
            }
          }
        })
      }).catch()
    },
    jump(card) {
      this.$router.push(`/business/flowInfo?card=${card}`)
    },
    jumpOrder(order) {
      this.$router.push(`/finance/orderFlow?orderID=${order}`)
    },
    changeAname(value) {
      this.listQuery.aid = value
      this.getSelect()
      this.getList()
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    getSelect() {
      agentArr((agentSelect) => {
        this.agentSelect = agentSelect
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        starttime: null,
        endtime: null,
        remarks: '',
        money: '',
        operatorids: '',
        aid: '',
        iccid: '',
        orderID: ''
      }
      this.operatorids = []
      this.getSelect()
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
      this.$confirm('此操作将导出数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportCommissionInfo(this.listQuery, '.filter-container').then(res => {
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
    // webDownload() {
    //   this.downAction()
    // },
    // downAction(pageSize) {
    //   searchAgentCommissions(this.listQuery, '.table').then(res => {
    //     if (+res.status === 0) {
    //       const list = res.data.rows
    //       import('@/vendor/Export2Excel').then(excel => {
    //         const tHeader = [
    //           'iccid',
    //           '订单号',
    //           '佣金(元)',
    //           '订单时间',
    //           '代理商',
    //           '支付类型'
    //         ]
    //         const filterVal = [
    //           'iccid',
    //           'orderID',
    //           'money',
    //           'addtime',
    //           'name',
    //           'trade_type'
    //         ]
    //         const data = this.formatJson(filterVal, list)
    //         excel.export_json_to_excel({
    //           header: tHeader,
    //           data,
    //           filename: `佣金信息${new Date().toLocaleDateString()}`
    //         })
    //         this.$message({
    //           type: 'success',
    //           message: res.message
    //         })
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '数量过多'
    //       })
    //       this.$prompt('', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         inputPlaceholder: '请输入导出数量',
    //         inputErrorMessage: '数量填写不正确',
    //         inputValue: 10000,
    //         inputValidator: function(value) {
    //           if (/(^[1-9]\d*$)/.test(+value)) {
    //             return true
    //           } else {
    //             return false
    //           }
    //         }
    //       }).then(({ value }) => {
    //         this.downAction(value)
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消'
    //         })
    //       })
    //     }
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       if (j === 'trade_type') {
    //         return tradeMap[v[j]]
    //       } else {
    //         return v[j]
    //       }
    //     })
    //   )
    // },
    getList() {
      if (this.operatorids.length > 0) {
        this.listQuery.operatorids = this.operatorids
        this.listQuery.operatorids = this.listQuery.operatorids.join(',')
      } else {
        this.listQuery.operatorids = ''
      }
      searchAgentCommissions(this.listQuery, '.table').then(res => {
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

