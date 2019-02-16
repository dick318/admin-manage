<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.oldcard" class="filter-item" style="width:220px" clearable placeholder="请输入原卡号"/>
      <el-input v-model.trim="listQuery.newcard" class="filter-item" style="width:220px" clearable placeholder="请输入现ICCID"/>
      <el-input v-model.trim="listQuery.uname" class="filter-item" style="width:220px" clearable placeholder="请输入姓名"/>
      <el-select v-model="listQuery.agent" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.label"/>
      </el-select>
      <el-input v-model.trim="listQuery.orderID" class="filter-item" style="width:220px" clearable placeholder="请输入订单号"/>
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
      <el-input v-model.trim="listQuery.phone" class="filter-item" style="width:220px" clearable placeholder="请输入手机号码"/>
      <el-select v-model="listQuery.isTure" class="filter-item" clearable placeholder="是否操作" @clear="handleFilter">
        <el-option v-for="item in whether" :key="item.value" :label="item.label=='是'?'已操作':'未操作'" :value="item.value" />
      </el-select>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-permission="['kuyuplat:cardreplace:save']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate"/>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:excel:cardReplaceInfo']" class="filter-item" size="small" type="warning " @click="handleDownload">Java导出</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:updateExpressInfo']" class="filter-item" size="small" type="warning " @click="operationMore">拒绝</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:excelUpdateExpressInfo']" class="filter-item" size="small" type="success " @click="jump('/business/changeCardMore')">批量处理</el-button>
      <el-button v-waves v-permission="['kuyuplat:cardChange:search']" class="filter-item" size="small" type="success " @click="jump('/business/changePackage')">异卡换套餐</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column align="center" label="原卡号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.oldcard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="现ICCID" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.newcard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商帐号" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operators }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理商" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.agent }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省份" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.address|filterProvince }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.address|filterCity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区县" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.address|filterArea }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细地址" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.address|filterAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.base }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.isTrue }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原因" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单号" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物流单号" min-width="170" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.tracking }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="换卡支付" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.ispay!=2?'':'danger'">{{ scope.row.ispay|filterIspay }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="220px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:excel:updateExpressInfo']" v-if="scope.row.ispay!=2" type="primary" size="mini" @click="operationPass(scope.row.id)">发货</el-button>
          <el-button v-permission="['kuyuplat:excel:updateExpressInfo']" v-if="scope.row.ispay!=2" type="warning" size="mini" @click="operationRefuse(scope.row.id)">拒绝</el-button>
          <el-button v-permission="['kuyuplat:cardReplace:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="添加换卡">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="9rem">
        <el-form-item label="旧卡号" prop="oldcard">
          <el-input v-model.trim="temp.oldcard" clearable placeholder="请输入旧卡号"/>
        </el-form-item>
        <el-form-item label="套餐名" prop="packageName">
          <el-input v-model.trim="temp.packageName" clearable placeholder="请输入套餐名"/>
        </el-form-item>
        <el-form-item label="姓名" prop="uname">
          <el-input v-model.trim="temp.uname" clearable placeholder="请输入卡号"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.trim="temp.phone" clearable placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="省市区" prop="area">
          <el-cascader :options="options" v-model="selectedOptions" size="large" @change="handleChange" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.trim="temp.address" clearable placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="temp.base" clearable placeholder="请输入备注"/>
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
import waves from '@/directive/waves' // 水波纹指令
import { addExpressNO, exportExpressNO, searchCardReplace, deleteCardReplace, savaCardReplace } from '@/api/changeCard'
import { agentArr, whether } from '@/utils/mapArr'
import {
  regionData,
  CodeToText
} from 'element-china-area-data'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ChangeCard',
  components: { Pagination },

  directives: {
    waves
  },
  filters: {
    filterProvince(address) {
      return address ? address.split(',')[0] : ''
    },
    filterCity(address) {
      return address ? address.split(',')[1] : ''
    },
    filterArea(address) {
      return address ? address.split(',')[2] : ''
    },
    filterAddress(address) {
      return address ? address.split(',')[3] : ''
    },
    filterIspay(ispay) {
      let payText
      if (ispay === 1) {
        payText = '免运费'
      }
      if (ispay === 2) {
        payText = '未支付'
      }
      if (ispay === 3) {
        payText = '支付成功'
      }
      return payText
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value && (!(/^1\d{10}$/).test(value))) {
        callback(new Error('号码不符合规范'))
      } else {
        callback()
      }
    }
    return {
      whether,
      list: [],
      agentSelect: [],
      total: 0,
      tableKey: 0,
      listQuery: {
        oldcard: '',
        newcard: '',
        uname: '',
        agent: '',
        starttime: '',
        endtime: '',
        phone: '',
        isTure: '',
        orderID: '',
        pageNo: 1,
        pageSize: 10
      },
      pickerOptions: this.processDate(),
      loading: true,
      selectArr: [],
      options: regionData,
      selectedOptions: [],
      temp: {
        oldcard: '',
        packageName: '',
        uname: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        base: ''
      },
      rules: {
        oldcard: [
          { required: true, message: '请输入旧卡号', trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: '请输入套餐名', trigger: 'blur' }
        ],
        uname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      reason: '您好！请联系卖家换卡，谢谢！'
    }
  },
  created() {
    this.getList()
    agentArr((agentSelect) => {
      this.agentSelect = agentSelect
    })
  },
  methods: {
    handleChange(value) {
      this.temp.province = CodeToText[value[0]]
      this.temp.city = CodeToText[value[1]]
      this.temp.area = CodeToText[value[2]]
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        oldcard: '',
        packageName: '',
        uname: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        base: ''
      }
      this.selectedOptions = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.address = `${this.temp.province},${this.temp.city},${this.temp.area},${this.temp.address},`
          savaCardReplace(tempData, '.el-dialog__footer').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (+res.status === 0) {
              this.getList('sec')
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    operationMore(type) {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.$prompt('', '你确定要批量拒绝吗', {
        inputValue: this.reason
      }).then(({ value }) => {
        const loading = this.$loading({ target: '.table' })
        this.reason = value
        this.selectArr.map((v, i) => {
          this.handleRefuse(v.id, () => {
            if (i === this.selectArr.length - 1) {
              this.getList('sec')
              loading.close()
            }
          })
        })
      }).catch({})
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该换卡记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCardReplace({
            id: row.id
          }, '.el-message-box').then(res => {
            if (+res.status === 0) {
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              this.getList('sec')
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    operationRefuse(id) {
      this.$prompt('', '你确定要拒绝吗？', {
        inputValue: this.reason
      }).then(({ value }) => {
        this.reason = value
        addExpressNO({ id: id, reason: this.reason, isTure: 3 }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList('sec')
          }
        })
      }).catch({})
    },
    operationPass(id) {
      this.$prompt('', '你确定发货吗', {
        inputPlaceholder: '请输入物流单号',
        inputValidator: (value) => {
          if (!value) {
            return false
          }
        },
        inputErrorMessage: '物流单号不能为空'
      }).then(({ value }) => {
        addExpressNO({ id: id, tracking: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList('sec')
          }
        })
      }).catch()
    },
    handleRefuse(id, callback) {
      addExpressNO({ id: id, reason: this.reason, isTure: 3 }).then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        callback()
      })
    },
    jump(type) {
      this.$router.push(type)
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    getList(type) {
      searchCardReplace(this.listQuery, '.table').then(res => {
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status !== 0) {
          return false
        }
        this.list = res.data.rows
        this.total = +res.data.total
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleRefresh() {
      this.listQuery = {
        oldcard: '',
        newcard: '',
        uname: '',
        agent: '',
        starttime: '',
        endtime: '',
        phone: '',
        isTure: '',
        orderID: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },

    handleDownload() {
      exportExpressNO({
        isTure: this.listQuery.isTure,
        starttime: this.listQuery.starttime,
        endtime: this.listQuery.endtime
      }, '.table').then(res => {
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
<style >
.cardStatus {
  display: flex;
  margin-top: 0;
}
.cardStatus span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}
</style>
