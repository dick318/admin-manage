<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.username" style="width: 200px;" clearable class="filter-item" placeholder="请输入用户名" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-permission="['kuyuplat:radcheck:save']" class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleCreate"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:radcheck:batchSave']" class="filter-item" size="small" type="success" @click="jump"> 批量添加</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" :key="tableKey" row-key="id" element-loading-text="给我一点时间" size="mini" class="table" highlight-current-row>
      <!-- header-cell-class-name ='header-cell-class-name'
     row-class-name='row-class-name' cell-class-name='cell-class-name' -->
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="帐号" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="查询密码类型" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.attribute }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作符" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.op }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="值" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:radcheck:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:radcheck:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>

      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :inline="true" label-position="right" label-width="7rem">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="temp.username" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="查询密码类型" prop="attribute">
          <el-input v-model.trim="temp.attribute" clearable placeholder="请输入查询密码类型" />
        </el-form-item>
        <el-form-item label="操作符" prop="op">
          <el-input v-model.trim="temp.op" clearable placeholder="请输入操作符" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model.trim="temp.value" clearable placeholder="请输入值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchRadcheck,
  updateRadcheck,
  saveRadcheck,
  deleteRadcheck
} from '@/api/vpdn'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'Jurisdiction',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: null,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        username: ''
      },
      temp: {
        id: undefined,
        username: '',
        attribute: '',
        op: '',
        value: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    jump() {
      this.$router.push('/vpdn/add')
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        username: ''
      }
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
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        attribute: '',
        op: '',
        value: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          saveRadcheck(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.getList()
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, {
        id: row.id,
        username: row.username,
        attribute: row.attribute,
        phone: row.phone,
        op: row.op,
        value: row.value
      }) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'update') {
            updateRadcheck(tempData, '.el-dialog__footer').then(res => {
              if (+res.status === 0) {
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.temp)
                    break
                  }
                }
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
              }
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRadcheck({
            id: row.id
          }, '.el-message-box').then(res => {
            if (+res.status === 0) {
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
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
    getList() {
      searchRadcheck(this.listQuery, '.table').then(res => {
        if (+res.status !== 0) {
          return false
        }
        this.list = res.data.rows || []
        this.total = res.data.total || 0
      })
    }
  }
}
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}

.icon-star {
  margin-right: 2px;
}

.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
