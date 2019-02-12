<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.tetle" class="filter-item" style="width:150px" clearable placeholder="请输入名称" @clear="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="webDownload"/>
      <el-button v-permission="['kuyuplat:account:save']" v-waves class="filter-item" size="small" type="warning " icon="el-icon-plus" @click="add" />
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
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
      <el-table-column align="center" label="名称" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.tetle }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="250px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:account:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:account:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30, 50,100,500,1000]"
        :page-size="listQuery.pageSize"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" class="dialog" label-width="9rem" >
        <el-form-item label="自定义名称:" prop="tetle">
          <el-input :disabled="dialogStatus=='update'" v-model.trim="temp.tetle" clearable />
        </el-form-item>
        <el-form-item label="服务器定向路径:" prop="url">
          <el-select v-model="temp.url" class="filter-item" clearable placeholder="服务器定向路径">
            <el-option v-for="item in urlArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(value, key) in temp.textArr"
          :key="key">
          <el-input v-model.trim="value.key" placeholder="请输入键名（唯一）"/>：
          <el-input v-model.trim="value.value" placeholder="请输入键值"/>
          <el-button icon="el-icon-delete" @click.prevent="remove(value)"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='update'||dialogStatus=='create'" type="success" @click="addOne">新增</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { searchAccount, saveAccount, updateAccount, deleteAccount, getServer } from '@/api/supplier'
// import { toSize } from '@/utils'
import store from '@/store'

export default {
  name: 'Accounts',
  directives: {
    waves
  },
  data() {
    return {
      dialogFormVisible: false,
      list: [],
      urlArr: [],
      total: null,
      listQuery: {
        tetle: '',
        pageNo: 1,
        pageSize: 10
      },
      dialogStatus: '',
      temp: {
        tetle: '',
        text: '',
        textArr: [{
        }]
      },
      rules: {
        tetle: [
          {
            required: true, message: '自定义名称不能为空', trigger: 'blur'
          }
        ]
      },
      textMap: {
        update: '修改',
        create: '添加'
      }
    }
  },
  created() {
    this.getList()
    this.getSelect()
  },
  methods: {
    resetTemp() {
      this.temp = {
        tetle: '',
        operatorType: '',
        text: '',
        textArr: [{

        }]
      }
    },
    getSelect() {
      getServer({ }).then(res => {
        if (res.status === 0) {
          const Arr = []
          res.data.map((v, i) => {
            const value = v.url
            const label = v.name
            Arr.push({ value, label })
          })
          this.urlArr = Arr
        }
      })
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
    add() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      const textArr = []
      for (const [k, v] of Object.entries(JSON.parse(row.text))) {
        textArr.push({ key: k, value: v })
      }
      row.textArr = textArr
      this.temp = {
        id: row.id,
        tetle: row.tetle,
        textArr: textArr,
        url: row.url
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
            saveAccount(this.temp, '.el-dialog__footer')
              .then(res => {
                if (+res.status === 0) {
                  store.dispatch('setAccountsStatus', false)
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
            updateAccount(this.temp, '.el-dialog__footer')
              .then(res => {
                if (+res.status === 0) {
                  store.dispatch('setAccountsStatus', false)
                  this.$notify({
                    title: '结果',
                    message: res.message,
                    duration: 2000,
                    type: 'success'

                  })
                  this.getList('sec')
                  this.dialogFormVisible = false
                }
              })
          }
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该供应商账号, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteAccount({ id }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            store.dispatch('setAccountsStatus', false)
            this.getList('sec')
          }
        })
      }).catch(() => {})
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
      this.listQuery.pageNo = 1
      this.listQuery.tetle = ''
      this.getList()
    },
    getList(type) {
      this.listLoading = true
      searchAccount(this.listQuery, '.table').then(res => {
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
      searchAccount({
        tetle: this.listQuery.tetle,
        pageSize: pageSize,
        pageNo: 1
      }, '.table').then(res => {
        if (+res.status === 0) {
         import('@/vendor/Export2Excel').then(excel => {
           const tHeader = [
             'ID',
             '名称',
             '添加时间'
           ]
           const filterVal = [
             'id',
             'tetle',
             'addtime'
           ]
           const data = this.formatJson(filterVal, res.data.rows)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: `供应商账号信息${new Date().toLocaleDateString()}`
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
          return v[j]
        })
      )
    },
    webDownload() {
      this.downAction()
    }
  }
}
</script>
