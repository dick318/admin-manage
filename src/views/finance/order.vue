<template>
  <div
    :card-no="cardNo"
    :source="source"
    class="app-container calendar-list-container">
    <div v-if="source!='mobile'" class="filter-container">
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />
      <el-input v-show="secMore" v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-show="secMore" v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-show="secMore" v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>
      <el-select v-show="secMore" v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入昵称" />
      <el-select v-show="secMore" v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择订单状态">
        <el-option
          v-for="item in orderStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.type" class="filter-item" filterable clearable placeholder="请选择套餐生效类型">
        <el-option
          v-for="item in packageEffectSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.tradeType" class="filter-item" filterable clearable placeholder="请选择支付类型">
        <el-option
          v-for="item in tradeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.zid" class="filter-item" filterable clearable placeholder="请选择供应商账号">
        <el-option
          v-for="item in zidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="operatorids" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择套餐批次">
        <el-option
          v-for="item in oidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.orderID" clearable class="filter-item" style="width: 200px;" placeholder="请输入订单号" />
      <el-button v-waves v-show="secMore" size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-if="device==='mobile'" size="small" type="warning " class="filter-item" @click="secMore=!secMore">{{ secMore?'隐藏':'查找' }}</el-button>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:export:orderInfo']" v-waves v-show="secMore" size="small" type="warning " class="filter-item" @click="handleDownload">Java导出</el-button>
      <el-button v-permission="['kuyuplat:supplement:batch']" v-waves size="small" type="warning " class="filter-item" @click="batchSupplementMore">补订</el-button>
      <el-button v-waves size="small" type="danger " class="filter-item" @click="refundMore">退款</el-button>
      <el-button v-waves size="small" type="danger " class="filter-item" @click="refundForceMore">强制退款</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row
      class="table"
      column-key="actions"
      @cell-click="toggleSelection"
      @selection-change="select"
      @filter-change="filterChange">
      <el-table-column
        type="selection"
        width="55"/>
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
          <span>{{ aidObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['nickname']" show-overflow-tooltip align="center" label="昵称" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['operatorid']" show-overflow-tooltip align="center" label="套餐批次" min-width="120">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['zid']" show-overflow-tooltip align="center" label="供应商账号" min-width="120">
        <template slot-scope="scope">
          <span>{{ zidObject[+scope.row.zid] }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['iccid']" show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(`?iccid=${scope.row.iccid}`)">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['tel']" show-overflow-tooltip align="center" label="接入号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(`?tel=${scope.row.tel}`)">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['number']" show-overflow-tooltip align="center" label="虚拟号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(`?number=${scope.row.number}`)">{{ scope.row.number }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['orderID']" show-overflow-tooltip align="center" label="订单号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['status']" show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'success':'danger'" @click.native="jumpPackage(scope.row)">{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['type']" show-overflow-tooltip align="center" label="套餐生效类型" min-width="150">
        <template slot-scope="scope">
          <span>{{ packageEffectMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['pname']" show-overflow-tooltip align="center" label="套餐名称" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['tradeType']" show-overflow-tooltip align="center" label="支付类型" min-width="150">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jumpPayList(scope.row)">{{ tradeMap[scope.row.tradeType] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['money']" show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['actions']" :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="400px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:orderStatus:update']" type="primary" size="mini" @click="updateStatus(scope.row)">修改状态</el-button>
          <el-button v-permission="['kuyuplat:supplement:batch']" type="success" size="mini" @click="batchSupplement(scope.row)">补订</el-button>
          <el-button v-permission="['kuyuplat:order:refundApplication']" v-if="scope.row.status==3" type="danger" size="mini" @click="refundApplication(scope.row)">退款</el-button>
          <el-button v-permission="['kuyuplat:order:refundApplicationForce']" v-if="scope.row.status==3" type="danger" size="mini" @click="refundApplicationForce(scope.row)">强制退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="8rem">
        <el-form-item label="请选择退款类型" prop="refundType">
          <el-radio v-model="temp.refundType" label="1" style="width:60px">微信退款</el-radio>
          <el-radio v-model="temp.refundType" label="2" style="width:60px">余额退款</el-radio>
          <el-radio v-model="temp.refundType" label="3" style="width:60px">微信+余额</el-radio>
          <el-radio v-model="temp.refundType" label="4" style="width:200px">代理商微信公众号收费退款</el-radio>
        </el-form-item>
        <el-form-item label="退款金额" prop="money">
          <el-input v-model.trim.number="temp.money" :placeholder="dialogStatus === 'refund'||dialogStatus === 'refundForce'?'退款金额':'批量退款默认全额'" clearable/>
        </el-form-item>
        <el-form-item label="退款备注" prop="remarks">
          <el-input v-model.trim="temp.remarks" clearable placeholder="退款备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus === 'refund'||dialogStatus === 'refundForce'" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateDataMore">{{ $t('table.confirm') }}</el-button>
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
  searchOrders, updateOrderStatus, batchSupplement, refundApplication, refundApplicationForce, exportOrderInfo
} from '@/api/order'
import { statusMap, tradeMap, orderStatusSelect, packageEffectMap, packageEffectSelect,
  operatorArr, accountsArr,
  agentArr, tradeSelect } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'OrderFlow',
  directives: {
    waves
  },
  props: {
    // iccid: {
    //   type: String,
    //   default: ''
    // },
    // tel: {
    //   type: String,
    //   default: ''
    // },
    // number: {
    //   type: String,
    //   default: ''
    // },
    cardNo: {
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
      secMore: true,
      tradeMap,
      statusMap,
      tradeSelect,
      packageEffectMap,
      orderStatusSelect,
      packageEffectSelect,
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: null,
      aidObject: '',
      oidObject: '',
      zidObject: '',
      oidSelect: [],
      zidSelect: [],
      agentSelect: [],
      operatorids: [],
      result: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        tel: this.$route.query.tel,
        iccid: this.$route.query.iccid,
        number: '',
        aid: '',
        nickname: '',
        status: '',
        type: '',
        tradeType: '',
        orderID: this.$route.query.orderID,
        zid: '',
        operatorids: '',
        starttime: '',
        endtime: ''
      },
      selectArr: [],
      dialogFormVisible: false,
      rules: {
        money: [
          { required: true, message: '请输入退款金额', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],
        refundType: [
          { required: true, message: '请选择退款类型', trigger: 'blur' }
        ]
      },
      temp: {
        refundType: '',
        money: '',
        remarks: ''
      },
      dialogStatus: '',
      textMap: {
        refund: '退款',
        refundForce: '强制退款',
        more: '批量退款',
        moreForce: '批量强制退款'
      },
      filtersArr: [
        { text: '订单时间', value: 'addtime' },
        { text: '代理商', value: 'aid' },
        { text: '昵称', value: 'nickname' },
        { text: '套餐批次', value: 'operatorid' },
        { text: '供应商账号', value: 'zid' },
        { text: 'iccid', value: 'iccid' },
        { text: '接入号', value: 'tel' },
        { text: '虚拟号', value: 'number' },
        { text: '订单号', value: 'orderID' },
        { text: '状态', value: 'status' },
        { text: '套餐生效类型', value: 'type' },
        { text: '套餐名称', value: 'pname' },
        { text: '支付类型', value: 'tradeType' },
        { text: '订单金额', value: 'money' },
        { text: '操作', value: 'actions' }
      ],
      showColumn: {
        addtime: true,
        aid: true,
        nickname: true,
        operatorid: true,
        zid: true,
        iccid: true,
        tel: true,
        number: true,
        orderID: true,
        status: true,
        type: true,
        pname: true,
        tradeType: true,
        money: true,
        actions: true
      }
    }
  },
  computed: {
    device() {
      return this.$store.getters.device
    }
  },
  created() {
    if (this.device === 'mobile') {
      this.secMore = false
    }
    this.getSelect()
    if (!this.source) {
      this.getList()
    }
  },
  methods: {
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
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    jump(card) {
      this.$router.push(`/business/flowInfo${card}`)
    },
    jumpPackage(row) {
      this.$router.push(`/business/orderPackage?source=${row.orderID}&card=${row.iccid || row.tel || row.number}`)
    },
    jumpPayList(row) {
      if (row.tradeType === 1 || row.tradeType === 4 || row.tradeType === 5 ||
      row.tradeType === 6 || row.tradeType === 7 || row.tradeType === 9 || row.tradeType === 10 || row.tradeType === 11) {
        this.$router.push(`/finance/payList?orderID=${row.orderID}`)
      }
      if (row.tradeType === 2 || row.tradeType === 8 || row.tradeType === 13) {
        this.$router.push(`/agent/amount?orderID=${row.orderID}`)
      }
      if (row.tradeType === 3 || row.tradeType === 6 || row.tradeType === 6 || row.tradeType === 12) {
        this.$router.push(`/card/rechargeList?iccid=${row.iccid || ''}&tel=${row.tel || ''}&number=${row.number || ''}`)
      }
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
      accountsArr((zidSelect, accountsTypeArr, zidObject) => {
        this.zidSelect = zidSelect
        this.zidObject = zidObject
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    batchSupplementMore() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      const idArr = []
      this.selectArr.map((v, i) => {
        idArr.push(v.orderID)
      })
      this.$confirm('此操作将批量补订, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchSupplement({ orderNo: idArr.join(','), remarks: '批量补订' }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            this.getList()
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    refundForceMore() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      if (this.selectArr.length > 50) {
        this.$message.error('选中数量不能超过50！')
        return false
      }
      this.temp = {
        refundType: '',
        money: '',
        remarks: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'moreForce'
    },
    refundMore() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      if (this.selectArr.length > 50) {
        this.$message.error('选中数量不能超过50！')
        return false
      }
      this.temp = {
        refundType: '',
        money: '',
        remarks: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'more'
    },
    updateDataMore() {
      if (!this.temp.refundType) {
        this.$notify({
          type: 'error',
          message: '请选择退款类型'
        })
        return
      }
      this.$confirm(`此操作将批量申请退款,退款金额为${this.temp.money || '全额'}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.result = []
        let flag
        this.dialogFormVisible = false
        const loading = this.$loading({ target: '.table' })
        this.selectArr.map((v, i) => {
          if (v.status !== 3) {
            this.result.push({ id: v.id, orderID: v.orderID, refundType: this.temp.refundType,
              money: this.temp.money || v.money, remarks: this.temp.remarks, status: '未处理', message: '只允许退款订单成功的订单' })
          }
          (this.dialogStatus === 'more' ? refundApplication : refundApplicationForce)(
            { id: v.id, refundType: this.temp.refundType, money: this.temp.money || v.money, remarks: this.temp.remarks },
            '.el-dialog__footer').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (res.status !== 0) {
              flag = true
            }
            this.result.push({ id: v.id, orderID: v.orderID, refundType: this.temp.refundType,
              money: this.temp.money || v.money, remarks: this.temp.remarks, status: res.status, message: res.message })
          })
          if (i === this.selectArr.length - 1) {
            loading.close()
            this.getList('sec')
            if (this.selectArr.length > 0 && flag) {
              this.$confirm(`是否导出该批量操作的结果?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.down()
              }).catch(() => {})
            }
          }
        })
      }).catch(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    refundApplicationForce(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'refundForce'
      this.temp = Object.assign({}, { id: row.id }) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    refundApplication(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'refund'
      this.temp = Object.assign({}, { id: row.id }) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          (this.dialogStatus === 'refund' ? refundApplication : refundApplicationForce)(this.temp, '.el-dialog__footer').then(res => {
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
    batchSupplement(row) {
      this.$prompt('', '补订套餐', {
        inputPlaceholder: '请输入备注',
        inputValue: '单个补订套餐',
        inputValidator: (value) => {
          if (!value) {
            return false
          }
        },
        inputErrorMessage: '请输入备注'
      }).then(({ value }) => {
        batchSupplement({ orderNo: row.orderID, remarks: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            this.dialogFormVisible = false
          }
        })
      }).catch()
    },
    updateStatus(row) {
      this.$confirm('此操作将该订单修改为订单成功, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateOrderStatus({ id: row.id, status: 3 }, '.el-message-box').then(res => {
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
        type: '',
        tradeType: '',
        orderID: '',
        zid: '',
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
        const data = Object.assign(this.listQuery, {})
        data.trade_type = data.tradeType
        delete data.tradeType
        exportOrderInfo(data, '.filter-container').then(res => {
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
    down() {
       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['id', '订单号', '退款类型', '退款金额', '备注', '结果', '消息']
         const filterVal = [
           'id',
           'orderID',
           'refundType',
           'money',
           'remarks',
           'status',
           'message'
         ]
         const data = this.formatJson(filterVal, this.result)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `循环订单退款结果表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else if (j === 'refundType') {
            return +v[j] === 1 ? '微信退款' : +v[j] === 2 ? '余额退款' : +v[j] === 3 ? '其他(微信+余额)' : '代理商微信公众号收费退款'
          } else {
            return v[j]
          }
        })
      )
    },
    getList(type) {
      if (this.operatorids.length > 0) {
        this.listQuery.operatorids = this.operatorids
        this.listQuery.operatorids = this.listQuery.operatorids.join(',')
      } else {
        this.listQuery.operatorids = ''
      }
      searchOrders(Object.assign(this.listQuery, { cardNo: this.cardNo }), '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        if (!type) {
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

