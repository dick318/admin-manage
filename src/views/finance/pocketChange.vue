<template>
  <div class="app-container">
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
      <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入收款人姓名" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.nickname" style="width: 200px;" clearable class="filter-item" placeholder="请输入昵称" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.orderNo" style="width: 200px;" clearable class="filter-item" placeholder="请输入付款单号" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.operator" style="width: 200px;" clearable class="filter-item" placeholder="请输入经办人" @clear="handleFilter" />
      <el-select v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择打款状态">
        <el-option
          v-for="item in payeeStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.remark" style="width: 200px;" clearable class="filter-item" placeholder="请输入备注" @clear="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:billing:transfers']" class="filter-item" size="small" type="primary" @click="handleAdd">打款</el-button>
      <el-button v-permission="['kuyuplat:payee:list']" class="filter-item" size="small" type="primary" @click="handleJump">常用收款人</el-button>
    </div>
    <el-table
      :data="list"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经办人" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款人名称" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款人昵称" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信openid" show-overflow-tooltip min-width="230" >
        <template slot-scope="scope">
          <span>{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款单号" show-overflow-tooltip min-width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="打款金额" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="打款时间" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===2?'':'danger'"> {{ payeeStatusMap[scope.row.status] }}</el-tag>
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
    <el-dialog :visible.sync="dialogFormVisible" title="打款">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-width="7rem" label-position="right" class="dialog">
        <el-form-item label="常用收款人:">
          <el-select
            v-model="nameData"
            :remote-method="remoteMethod"
            :loading="loading"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入姓名"
            @change = "getNameData">
            <el-option v-for="item in nameArr" :key="item.id" :label="item.name" :value="item.id" class="nickname">
              <span style="width:120px;display:inline-block">姓名：{{ item.name }}</span>
              <span>昵称：{{ item.nickname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="粉丝昵称:" class="openData">
          <el-select
            v-model="openData"
            :remote-method="remoteOpenMethod"
            :loading="loadingOpen"
            :disabled="nameAbled"
            popper-class="openid"
            filterable
            allow-create
            clearable
            remote
            reserve-keyword
            placeholder="请输入昵称"
            @change = "getOpenData">
            <el-option v-for="item in openArr" :key="item.id" :label="item.nickname" :value="item.id" class="nickname">
              <div class="select2-result-repository clearfix">
                <div class="select2-result-repository__avatar">
                  <img :src="item.headimgurl" style="width:50px;vertical-align: bottom;" class="image">
                </div>
                <div class="select2-result-repository__meta">
                  <div class="select2-result-repository__title">{{ item.nickname }}</div>
                  <div class="select2-result-repository__statistics">{{ item.openid }}</div>
                </div>
              </div>
            </el-option>
            <el-option :disabled="true" value="sec" class="sec">
              <el-pagination
                :current-page="sec.pageNo"
                :page-size="sec.pageSize"
                :total="sec.total"
                background
                layout="jumper, prev, next, total"
                @size-change="sizeChange"
                @current-change="currentChange" />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="openid:" prop="openid">
          <el-input :disabled="openAbled" v-model.trim="temp.openid" style="width: 200px;" clearable class="filter-item" placeholder="请输入收款人openid"/>
        </el-form-item>
        <el-form-item label="收款人姓名:" prop="name">
          <el-input :disabled="nameAbled" v-model.trim="temp.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入收款人姓名"/>
        </el-form-item>
        <el-form-item label="金额(元):" prop="money">
          <el-input v-model.trim="temp.money" style="width: 200px;" clearable class="filter-item" placeholder="请输入金额"/>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model.trim="temp.password" style="width: 200px;" clearable class="filter-item" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model.trim="temp.remark" style="width: 200px;" clearable class="filter-item" placeholder="请输入备注"/>
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
import { payeeList, billingTransfers, billingHistory, payeeOpenids } from '@/api/payee'
import { payeeStatusMap, payeeStatusSelect } from '@/utils/mapArr'

export default {
  name: 'PocketChange',
  directives: {
    waves
  },
  data() {
    return {
      payeeStatusMap,
      payeeStatusSelect,
      pickerOptions: this.processDate(),
      listQuery: {
        starttime: null,
        endtime: null,
        nickname: '',
        status: '',
        orderNo: '',
        operator: '',
        remark: '',
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      sec: {
        nickname: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      nameData: '',
      openData: '',
      loading: false,
      loadingOpen: false,
      nameArr: [],
      firstNameArr: [],
      openArr: [],
      dialogFormVisible: false,
      openAbled: false,
      nameAbled: false,
      saveTemp: {
        nameData: '',
        openData: ''
      },
      temp: {
        name: '',
        nickname: '',
        openid: '',
        money: '',
        password: '',
        remark: ''
      },
      rules: {
        openid: [
          {
            required: true, message: '收款人openid不能为空！', trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '收款人姓名不能为空！', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '打款金额不能为空！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '打款密码不能为空！', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '打款备注不能为空！', trigger: 'blur' }
        ]
      },
      list: [],
      tableKey: 0,
      total: 0
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.sec = {
          nickname: '',
          total: 0,
          pageNo: 1,
          pageSize: 10
        }
      }
    }
  },
  created() {
    this.getList()
    payeeList({ pageNo: 1, pageSize: 10 }).then(res => {
      if (res.status === 0) {
        this.nameArr = res.data.rows
        this.firstNameArr = res.data.rows
      }
    })
  },
  methods: {
    getNameData(val) {
      if (val) {
        this.saveTemp.nameData = this.nameArr.find((n) => {
          return n.id === +val
        })
        this.nameAbled = true
        payeeOpenids({ nickname: this.saveTemp.nameData.nickname }, '.openData').then(res => {
          if (res.status === 0) {
            this.openAbled = true
            this.openArr = res.data.rows
            this.openData = this.openArr.find((n) => {
              return n.id === +val
            })
          }
        })
        this.temp.name = this.saveTemp.nameData.name
        this.temp.nickname = this.saveTemp.nameData.nickname
        this.temp.openid = this.saveTemp.nameData.openid
      } else {
        this.temp.name = ''
        this.temp.nickname = ''
        this.temp.openid = ''
        this.openData = ''
        this.nameData = ''
        this.saveTemp = {
          openData: '',
          nameData: ''
        }
        this.openAbled = false
        this.nameAbled = false
        this.openArr = []
        this.nameArr = this.firstNameArr
      }
    },
    getOpenData(val) {
      if (val) {
        this.saveTemp.openData = this.openArr.find((n) => {
          return n.id === +val
        })
        if (!this.saveTemp.openData && !this.saveTemp.nameData) {
          this.temp.nickname = val
          this.temp.openid = ''
          return
        }
        this.openAbled = true
        if (!this.saveTemp.nameData) {
          this.temp.nickname = this.saveTemp.openData.nickname
          this.temp.openid = this.saveTemp.openData.openid
        }
      } else {
        this.openAbled = false
        if (!this.saveTemp.nameData) {
          this.temp.nickname = ''
          this.temp.openid = ''
          this.saveTemp.openData = ''
          this.openData = ''
        }
        this.sec = {
          nickname: '',
          total: 0,
          pageNo: 1,
          pageSize: 10
        }
        this.openArr = []
      }
    },
    remoteOpenMethod(query) {
      this.sec.nickname = query || this.sec.nickname
      if (this.sec.nickname !== '') {
        this.loadingOpen = true
        payeeOpenids(this.sec).then(res => {
          this.loadingOpen = false
          if (res.status === 0) {
            this.sec.total = res.data.total
            this.openArr = res.data.rows
          }
        })
      } else {
        this.openArr = []
        this.loading = false
      }
    },
    sizeChange(val) {
      this.sec.pageSize = val
      this.remoteOpenMethod()
    },
    currentChange(val) {
      this.sec.pageNo = val
      this.remoteOpenMethod()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        payeeList({ name: query }).then(res => {
          if (res.data.total > 50 && res.status === 0) {
            this.$message.error('请缩小范围！')
            this.nameArr = []
            this.loading = false
            return false
          } else {
            this.nameArr = res.data.rows
            this.loading = false
          }
        })
      } else {
        this.nameArr = []
        this.loading = false
      }
    },
    handleJump() {
      this.$router.push('/finance/ordinaryPayee')
    },
    resetTemp() {
      this.temp = {
        name: '',
        nickname: '',
        openid: '',
        money: '',
        password: '',
        remark: ''
      }
      this.saveTemp = {
        nameData: '',
        openData: ''
      }
      this.nameData = ''
      this.openData = ''
      this.openAbled = false
      this.nameAbled = false
      this.nameArr = this.firstNameArr
      this.openArr = []
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
          billingTransfers(this.temp, '.el-dialog__footer').then(res => {
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
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    handleDownload() {

    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery = {
        starttime: null,
        endtime: null,
        nickname: '',
        status: '',
        orderNo: '',
        operator: '',
        remark: '',
        name: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList('sec')
    },
    getList(type) {
      billingHistory(this.listQuery, '.table').then(res => {
        if (res.status === 0) {
          this.list = res.data.rows
          this.total = res.data.total
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
<style scoped>
.openid .el-select-dropdown__item{
  height: 64px!important;
}
.openid .sec{
  height: 34px!important;
}
</style>

