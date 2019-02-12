<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.operatorType" popper-class="operator_type" class="filter-item " clearable placeholder="请选择运营商类型">
        <el-option v-for="item in operator_type" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <el-input v-model.trim="listQuery.cardNo" class="filter-item" style="width:220px" clearable placeholder="请输入供应商"/> -->
      <el-input v-model.trim="listQuery.name" class="filter-item" style="width:220px" clearable placeholder="请输入名称"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
      <!-- <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="webDownload" /> -->
      <el-button v-waves v-permission="['kuyuplat:pool:getSendMember']" class="filter-item" size="small" type="warning " @click="member">成员</el-button>
      <el-button v-waves v-permission="['kuyuplat:pool:addPool']" class="filter-item" size="small" type="warning " icon="el-icon-plus" @click="create" />
      <!-- <el-button v-waves class="filter-item" size="small" type="info" @click="jump('/card/poolHistory')">历史</el-button> -->
      <el-button v-waves class="filter-item" size="small" type="danger" @click="refreshAll">刷新全部</el-button>
      <el-button v-waves class="filter-item" size="small" type="danger" @click="operationMore('refresh')">勾选刷新</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :fit="true"
      row-key="id"
      element-loading-text="给我一点时间"
      class="table"
      size="mini"
      tooltip-effect="dark"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="池子编码" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <!-- <span style="color:#66b1ff;cursor:pointer" type="text" @click="jump(scope.row.poolNo)">{{ scope.row.poolNo }}</span> -->
          <span style="color:#66b1ff;cursor:pointer" type="text" >{{ scope.row.poolNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operator_id]?`${oidObject[scope.row.operator_id]}--${scope.row.operator_id}`:scope.row.operator_id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="池子名称" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="运营商" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ operatorTypeMap[scope.row.operator_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总量（G）" show-overflow-tooltip min-width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.sumflow| flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已用流量（G）" show-overflow-tooltip min-width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.useflow | flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单卡流量（M）" show-overflow-tooltip min-width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总数" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row | aloneCountFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用率" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row | perFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="刷新时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="250px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:export:refreshProgress']" icon="el-icon-refresh" type="success" size="mini" @click="refresh(scope.row)" />
          <el-button v-permission="['kuyuplat:pool:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="update(scope.row)"/>
          <el-button v-permission="['kuyuplat:pool:update']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50,100,500,1000]" :page-size="listQuery.pageSize" :pager-count="5" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-position="right" label-width="7rem">
        <el-form-item v-if="dialogStatus=='create'" label="iccid" prop="iccid">
          <el-input v-model="temp.iccid" clearable placeholder="请输入池子内ICCID" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="池子名称" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入池子名称" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="供应商批次" prop="operator_id">
          <el-select v-model="temp.operator_id" class="filter-item" filterable clearable placeholder="请选择套餐批次">
            <el-option v-for="item in oidSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="单卡流量(M)" prop="size">
          <el-input v-model.trim.number="temp.size" clearable placeholder="请输入池子单卡流量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogOpenFormVisible" title="流量池发送成员">
      <el-form ref="dataForm" :model="temp" label-position="right" class="dialog">
        <el-form-item v-for="(value, key) in temp.textArr" :key="key">
          <img :src="value.headimgurl" style="width:50px;height:50px;vertical-align: bottom;" class="image">
          <el-input v-model.trim="value.nickname" readonly style="width:125px"/>
          <el-button v-permission="['kuyuplat:pool:delSendMember']" icon="el-icon-delete" type="danger" @click.prevent="remove(value)"/>
        </el-form-item>
        <el-form-item class="addOne">
          <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1"/>
          <el-select
            v-model="openData"
            :remote-method="remoteMethod"
            :loading="loading"
            popper-class="secNickname"
            filterable
            clearable
            remote
            reserve-keyword
            style="position: relative"
            placeholder="请输入昵称"
            @change = "getOpenData">
            <el-option v-for="item in openArr" :key="item.id" :label="item.nickname" :value="item" class="nickname">
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
          <el-button v-permission="['kuyuplat:pool:addSendMember']" type="success" @click="addOne">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { operator_type, operatorTypeMap, operatorArr } from '@/utils/mapArr'
// import { toSize } from '@/utils'
import { addSendMember, getSendMember, delSendMember, getPool, addPool, editPool } from '@/api/pool'
import { payeeOpenids } from '@/api/payee'

export default {
  name: 'PoolDayDetail',
  directives: {
    waves
  },
  filters: {
    perFilter(value) {
      return ((+value.useflow / +value.sumflow) * 100).toFixed(2) + ' %'
    },
    flowFilter(value) {
      return (+value / 1024 / 1024).toFixed(2) + ' GB'
    },
    aloneCountFilter(value) {
      if (value.size) {
        return (+value.sumflow / +value.size / 1024).toFixed(0)
      }
    }
  },
  data() {
    return {
      openData: '',
      openArr: [],
      loading: false,
      pickerOptions: this.processDate(),
      dialogFormVisible: false,
      dialogOpenFormVisible: false,
      operator_type,
      operatorTypeMap,
      list: [],
      total: null,
      oidSelect: [],
      oidObject: {},
      sec: {
        nickname: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      listQuery: {
        operatorType: '',
        pageNo: 1,
        pageSize: 10,
        name: '',
        flush: 0
      },
      rules: {
        iccid: [
          { required: true, message: 'iccid不能为空', trigger: 'blur' }
        ]
      },

      selectArr: [],
      dialogStatus: '',
      temp: {
        textArr: []
      },
      textMap: {
        update: '修改',
        create: '添加',
        poolMember: '流量池发送成员'
      }
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
    operatorArr((oidSelect, operatorTypeArr, oidObject) => {
      this.oidSelect = oidSelect
      this.oidObject = oidObject
    })
  },
  methods: {
    addOne() {
      if (!this.openData) {
        this.$message.error('请先选择要添加微信！')
        return false
      }
      addSendMember({ openid: this.openData.openid }, '.addOne').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (res.status === 0) {
          this.temp.textArr.push({
            'headimgurl': this.openData.headimgurl,
            'nickname': this.openData.nickname,
            'openid': this.openData.openid
          })
        }
      })
    },
    remoteMethod(query) {
      this.sec.nickname = query || this.sec.nickname
      if (this.sec.nickname !== '') {
        this.loading = true
        payeeOpenids(this.sec).then(res => {
          this.loading = false
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
      this.remoteMethod()
    },
    currentChange(val) {
      this.sec.pageNo = val
      this.remoteMethod()
    },
    operationMore(type) {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.selectArr.map((v, i) => {
        this.refresh(v, type)
      })
    },
    refreshAll() {
      getPool({
        pageNo: 1,
        pageSize: this.total,
        flush: 1
      }, '.table').then(res => {
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
    },
    refresh(value, type) {
      getPool({
        flush: 1,
        cardId: value.cardid
      }, '.table').then(res => {
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
    },
    remove(value) {
      this.$confirm('此操作将删除该发送成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSendMember({ openid: value.openid }, '.el-dialog__footer').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            var index = this.temp.textArr.indexOf(value)
            if (index !== -1) {
              this.temp.textArr.splice(index, 1)
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
    member() {
      this.openData = ''
      getSendMember({}, '.filter-container').then(res => {
        if (+res.status === 0) {
          this.temp.textArr = res.data.rows
          this.dialogStatus = 'poolMember'
          this.dialogOpenFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
      })
    },
    create() {
      this.temp = {} // copy obj
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getOpenData(val) {
      this.openArr = []
      this.sec = {
        nickname: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      }
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该流量池, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editPool({ id, status: 2 }, '.table').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            this.getList('sec')
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          let data = {}
          if (this.dialogStatus === 'create') {
            data = {
              iccid: tempData.iccid
            }
            addPool(data, '.el-dialog__footer').then(res => {
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
          } else {
            data = {
              id: tempData.id,
              size: this.temp.size,
              name: this.temp.name,
              operatorId: this.temp.operator_id
            }
            editPool(data, '.el-dialog__footer').then(res => {
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
        }
      })
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    jump(type) {
      this.$router.push(type)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
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
    handleRefresh() {
      this.listQuery = {
        operatorType: '',
        pageNo: 1,
        pageSize: 10,
        name: '',
        flush: 0
      }
      this.getList()
    },
    getList(type, data = this.listQuery) {
      getPool(data, '.table').then(res => {
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
    },
    webDownload() {
      // this.downAction()
    }
  }
}
</script>
<style scoped>
.el-select-dropdown__item{
  height: 64px!important;
}
.operator_type .el-select-dropdown__item{
  height: 34px!important;
}
.secNickname .sec{
  height: 34px!important;
}
</style>

