<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" class="filter-item" style="width:150px" clearable placeholder="请输入名称" @clear="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="webDownload"/>
      <el-button v-permission="['common']" v-waves class="filter-item" size="small" type="warning " icon="el-icon-plus" @click="add" />
      <el-button v-permission="['common']" v-waves class="filter-item" size="small" type="info" @click="jump('/business/accounts')">帐号</el-button>
      <el-button v-permission="['common']" v-waves class="filter-item" size="small" type="info" @click="jump('/business/rules')">规则</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
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
      <el-table-column align="center" label="名称" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.packageType==0?'danger':''">{{ packageTypeMap[scope.row.packageType]||'未选择' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="250px">
        <template slot-scope="scope">
          <el-button v-permission="['common']" v-loading="loading" type="info" size="mini" @click="rules(scope.row.id)">规则</el-button>
          <el-button v-permission="['common']" v-loading="loading" type="primary" size="mini" icon="el-icon-edit-outline" @click="update(scope.row)"/>
          <el-button v-permission="['common']" v-loading="loading" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :inline="true" label-width="9rem" >
        <el-form-item label="自定义名称:">
          <el-input :disabled="dialogStatus=='update'" v-model.trim="temp.name" clearable />
        </el-form-item>
        <el-form-item label="运营商类型:">
          <el-select v-model="temp.operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
            <el-option v-for="item in operator_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐分类:">
          <el-select v-model="temp.packageType" class="filter-item" clearable placeholder="请选择套餐分类">
            <el-option v-for="item in packageTypeSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(value, key) in temp.textArr"
          :key="key"
        >
          <el-input v-model.trim="value.key" placeholder="请输入键名（唯一）"/>：
          <el-input v-model.trim="value.value" placeholder="请输入键值"/>
          <el-button icon="el-icon-delete" @click.prevent="remove(value)"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="addOne">新增</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { packageTypeMap, operatorTypeMap, operator_type, packageTypeSelect } from '@/utils/mapArr'
import { searchOperators, saveOperator, updateOperator, deleteOperators } from '@/api/supplier'
// import { toSize } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Rules',
  components: { Pagination },

  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return (+value / 1024).toFixed(2) + ' GB'
    }
  },
  data() {
    return {
      pickerOptions: this.processDate(),
      dialogFormVisible: false,
      loading: false,
      operator_type,
      packageTypeMap,
      operatorTypeMap,
      packageTypeSelect,
      list: [],
      total: 0,
      listQuery: {
        name: '',
        pageNo: 1,
        pageSize: 10
      },
      poolMemberList: [],
      dialogStatus: '',
      temp: {
        name: '',
        operatorType: '',
        packageType: '',
        text: '',
        textArr: [{

        }]
      },
      textMap: {
        update: '修改',
        create: '添加',
        poolMember: '流量池发送成员'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: '',
        operatorType: '',
        packageType: '',
        text: '',
        textArr: [{

        }]
      }
    },
    remove(value) {
      var index = this.temp.textArr.indexOf(value)
      if (index !== -1) {
        this.temp.textArr.splice(index, 1)
      }
    },
    addOne() {
      this.temp.textArr.push({})
    },
    operationMore(type) {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.selectArr.map((v, i) => {
        this.refresh(v.id)
      })
    },
    refreshAll() {

    },
    refresh(value) {

    },
    member() {

    },
    add() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(row) {
      const textArr = []
      for (const [k, v] of Object.entries(JSON.parse(row.text))) {
        textArr.push({ key: k, value: v })
      }
      row.textArr = textArr
      this.temp = {
        id: row.id,
        name: row.name,
        operatorType: row.operatorType,
        packageType: row.packageType,
        textArr: textArr
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const str = {}
          this.temp.textArr.map((v, i) => {
            const str1 = v.key
            const str2 = v.value
            str[str1] = str2
          })
          this.temp.text = JSON.stringify(str)
          delete this.temp.textArr
          if (this.dialogStatus === 'create') {
            saveOperator(this.temp, '.el-dialog__footer')
              .then(res => {
                if (+res.status === 0) {
                  this.$notify({
                    title: '结果',
                    message: res.message,
                    duration: 2000,
                    type: 'success'

                  })
                  this.dialogFormVisible = false
                  this.getList('sec')
                }
              })
          }
          if (this.dialogStatus === 'update') {
            updateOperator(this.temp, '.el-dialog__footer')
              .then(res => {
                if (+res.status === 0) {
                  this.$notify({
                    title: '结果',
                    message: res.message,
                    duration: 2000,
                    type: 'success'

                  })
                  this.dialogFormVisible = false
                  this.getList('sec')
                }
              })
          }
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该供应商批次, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteOperators({ id }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList('sec')
          }
        })
      }).catch(() => {})
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

    handleRefresh() {
      this.listQuery.pageNo = 1
      this.listQuery.name = ''
      this.getList()
    },
    getList(type) {
      this.listLoading = true

      searchOperators(this.listQuery, '.table').then(res => {
        this.listLoading = false

        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = res.data.total
        }
      })
    },
    downAction(pageSize) {
      searchOperators({
        name: this.listQuery.name,
        pageSize: pageSize,
        pageNo: 1
      }, '.table').then(res => {
        if (+res.status === 0) {
         import('@/vendor/Export2Excel').then(excel => {
           const tHeader = [
             'ID',
             '名称',
             '套餐类型',
             '添加时间',
             '运营商类型'
           ]
           const filterVal = [
             'id',
             'name',
             'packageType',
             'addtime',
             'operatorType'
           ]
           const data = this.formatJson(filterVal, res.data.rows)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: `供应商批次信息${new Date().toLocaleDateString()}`
           })
         })
        } else {
          this.$notify({
            type: 'error',
            message: '数量过多'
          })
          this.$prompt('', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入导出数量',
            inputErrorMessage: '数量填写不正确',
            inputValue: 10000,
            inputValidator: function(value) {
              if (/(^[1-9]\d*$)/.test(+value)) {
                return true
              } else {
                return false
              }
            }
          }).then(({ value }) => {
            this.downAction(value)
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'packageType') {
            return packageTypeMap[v[j]]
          } else if (j === 'operatorType') {
            return operatorTypeMap[v[j]]
          } else {
            return v[j]
          }
        })
      )
    },
    webDownload() {
      this.downAction()
    }
  }
}
</script>
