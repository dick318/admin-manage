<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入收款人姓名" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.nickname" style="width: 200px;" clearable class="filter-item" placeholder="请输入昵称" @clear="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:payee:add']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleAdd"/>
    </div>
    <el-table
      :data="list"
      :fit ="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信openid" show-overflow-tooltip min-width="230" >
        <template slot-scope="scope">
          <span>{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip min-width="130" >
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="120">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:payee:update']" type="primary" icon="el-icon-edit-outline" size="mini" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:payee:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
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
    <el-dialog :visible.sync="dialogFormVisible" title="常用收款人">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-width="7rem" label-position="right" class="dialog">
        <el-form-item label="粉丝昵称:" class="openData" prop="id">
          <el-select
            v-model="temp.id"
            :remote-method="remoteOpenMethod"
            :loading="loadingOpen"
            popper-class="openid"
            filterable
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
        <el-form-item label="收款人姓名:" prop="name">
          <el-input v-model.trim="temp.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入收款人姓名"/>
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
import { payeeList, payeeAdd, payeeOpenids, payeeUpdate, payeeDelete } from '@/api/payee'

export default {
  name: 'OrdinaryPayee',
  directives: {
    waves
  },
  data() {
    return {
      pickerOptions: this.processDate(),
      listQuery: {
        nickname: '',
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      loadingOpen: false,
      openArr: [],
      dialogFormVisible: false,
      sec: {
        nickname: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      temp: {
        name: '',
        id: ''
      },
      rules: {
        name: [
          { required: true, message: '收款人姓名不能为空！', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请选择粉丝！', trigger: 'blur' }
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
  },
  methods: {
    getOpenData(val) {
      if (!val) {
        this.temp.id = ''
        this.openArr = []
        this.sec = {
          nickname: '',
          total: 0,
          pageNo: 1,
          pageSize: 10
        }
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
    handleUpdate(row) {
      this.$prompt('', '姓名', {
        inputPlaceholder: '请输入修改的姓名',
        inputValue: row.name,
        inputValidator: (value) => {
          if (!value) {
            return false
          }
        },
        inputErrorMessage: '请输入修改的姓名'
      }).then(({ value }) => {
        payeeUpdate({ id: row.id, name: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            row.name = value
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
    handleDelete(row) {
      this.$confirm('此操作将删除该常用收款人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payeeDelete({ id: row.id }, '.table').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            for (const v of this.list) {
              if (+v.id === +row.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1)
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
    handleJump() {
      this.$router.push('/finance/ordinaryPayee')
    },
    resetTemp() {
      this.temp = {
        name: '',
        id: ''
      }
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
          payeeAdd(this.temp, '.el-dialog__footer').then(res => {
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
      payeeList(this.listQuery, '.table').then(res => {
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

