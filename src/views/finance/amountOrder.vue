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
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入昵称"/>
      <el-select v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择订单状态">
        <el-option
          v-for="item in orderStatusSelect"
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
      <el-input v-model.trim="listQuery.orderID" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单号"/>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:export:rechargeInfo']" v-waves class="filter-item" size="small" type="warning " @click="handleDownload">Java导出</el-button>
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
      column-key="actions"
      highlight-current-row
      @filter-change="filterChange">
      <el-table-column :filters="filtersArr" show-overflow-tooltip align="center" label="ID" prop="actions">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['addtime']" show-overflow-tooltip align="center" label="订单时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['aid']" show-overflow-tooltip align="center" label="代理商" min-width="180">
        <template slot-scope="scope">
          <span>{{ aidObject[scope.row.aid]||scope.row.aname }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['nickname']" show-overflow-tooltip align="center" label="昵称" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['operatorid']" show-overflow-tooltip align="center" label="套餐批次" min-width="120">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid]||scope.row.oname }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['iccid']" show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump({iccid:scope.row.iccid})">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['tel']" show-overflow-tooltip align="center" label="接入号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump({tel:scope.row.tel})">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['number']" show-overflow-tooltip align="center" label="虚拟号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump({number:scope.row.number})">{{ scope.row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['orderID']" show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['status']" show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'success':'danger'">{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['money']" show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['actions']" :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <!--  -->
          <el-button v-permission="['kuyuplat:orderAccountStatus:update']" type="primary" size="mini" @click="updateStatus(scope.row)">修改状态</el-button>
          <el-button v-permission="['kuyuplat:orderAccount:refund']" v-if="scope.row.status==3" type="danger" size="mini" @click="refundApplication(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="退款">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="8rem">
        <el-form-item label="退款金额" prop="money">
          <el-input v-model.trim.number="temp.money" placeholder="退款金额" clearable/>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import {
  searchOrderAccounts, updateOrderAccountStatus, exportRechargeInfo, orderAccountRefund
} from '@/api/order'
import { statusMap, orderStatusSelect, operatorArr,
  agentArr } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AmountOrder',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      statusMap,
      orderStatusSelect,
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: 0,
      aidObject: '',
      oidObject: '',
      oidSelect: [],
      agentSelect: [],
      operatorids: [],
      dialogFormVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        iccid: '',
        tel: '',
        number: '',
        aid: '',
        nickname: '',
        status: '',
        orderID: this.$route.query.orderID,
        operatorids: '',
        starttime: '',
        endtime: ''
      },
      rules: {
        money: [
          { required: true, message: '请输入退款金额', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],
        remarks: [
          { required: true, message: '请输入退款备注', trigger: 'blur' }
        ]
      },
      temp: {
        money: '',
        remarks: ''
      },
      filtersArr: [
        { text: '订单时间', value: 'addtime' },
        { text: '代理商', value: 'aid' },
        { text: '昵称', value: 'nickname' },
        { text: '套餐批次', value: 'operatorid' },
        { text: 'iccid', value: 'iccid' },
        { text: '接入号', value: 'tel' },
        { text: '虚拟号', value: 'number' },
        { text: '订单号', value: 'orderID' },
        { text: '状态', value: 'status' },
        { text: '订单金额', value: 'money' },
        { text: '操作', value: 'actions' }
      ],
      showColumn: {
        addtime: true,
        aid: true,
        nickname: true,
        operatorid: true,
        iccid: true,
        tel: true,
        number: true,
        orderID: true,
        status: true,
        money: true,
        actions: true
      }
    }
  },
  created() {
    this.getSelect()
    this.getList()
  },
  methods: {
    refundApplication(row) {
      this.dialogFormVisible = true
      this.temp = Object.assign({}, { id: row.id, money: row.money }) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          orderAccountRefund(this.temp, '.el-dialog__footer').then(res => {
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
    filterChange(value) {
      let Arr = []
      Object.values(value).map((v, i) => {
        Arr = Arr.concat(v)
      })
      Object.keys(this.showColumn).map((v, i) => {
        if (Arr.length === 0) {
          this.showColumn[v] = true
        } else {
          if (!Arr.includes(v)) {
            this.showColumn[v] = false
          } else {
            this.showColumn[v] = true
          }
        }
      })
    },
    jump({ iccid = '', tel = '', number = '' }) {
      this.$router.push(`/card/rechargeList?iccid=${iccid}&tel=${tel}&number=${number}`)
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
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
        this.agentSelect = agentSelect
        this.aidObject = aidObject
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    updateStatus(row) {
      this.$confirm('此操作将该订单修改为订单成功, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateOrderAccountStatus({ id: row.id, status: 3 }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            row.status = 3
            for (const v of this.list) {
              if (+v.id === +row.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, row)
                break
              }
            }
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        iccid: '',
        tel: '',
        number: '',
        aid: '',
        nickname: '',
        status: '',
        orderID: '',
        operatorids: '',
        starttime: '',
        endtime: ''
      }
      this.operatorids = []
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    handleDownload() {
      this.$confirm('此操作将导出数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.operatorids.length > 0) {
          this.listQuery.operatorids = this.operatorids
          this.listQuery.operatorids = this.listQuery.operatorids.join(',')
        } else {
          this.listQuery.operatorids = ''
        }
        exportRechargeInfo(this.listQuery, '.filter-container').then(res => {
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
      if (this.operatorids.length > 0) {
        this.listQuery.operatorids = this.operatorids
        this.listQuery.operatorids = this.listQuery.operatorids.join(',')
      } else {
        this.listQuery.operatorids = ''
      }
      searchOrderAccounts(this.listQuery, '.table').then(res => {
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
