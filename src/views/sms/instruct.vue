<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.tetle" style="width: 200px;" clearable class="filter-item" placeholder="请输入名称" @clear="handleRefresh" />
      <el-input v-model.trim="listQuery.content" style="width: 200px;" clearable class="filter-item" placeholder="请输入指令内容" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:instruct:add']" v-waves class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="addKeyWord" />
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
      <el-table-column align="center" label="代理商" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.aid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.tetle }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="指令内容" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:instruct:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="update(scope.row)"/>
          <el-button v-permission="['kuyuplat:instruct:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-position="right" class="dialog" label-width="9rem">
        <el-form-item label="标题:" prop="tetle">
          <el-input v-model.trim="temp.tetle"/>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model.trim="temp.content" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:200px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写内容！" type="textarea" />
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
import waves from '@/directive/waves' // 水波纹指令
import { instructList, instructUpdate, instructAdd, instructDelete } from '@/api/sms'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SmsCommand',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        tetle: '',
        content: ''
      },
      temp: {
        content: '',
        tetle: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      list: [],
      tableKey: 0,
      total: 0,
      rules: {
        content: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        tetle: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        content: '',
        tetle: ''
      }
    },
    addKeyWord() {
      this.resetTemp()
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
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          instructAdd(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.getList()
                this.dialogFormVisible = false
              }
            })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          instructUpdate(tempData, '.el-dialog__footer').then(res => {
            if (+res.status === 0) {
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              this.getList()
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        instructDelete({ id }, '.el-message-box').then((res) => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList()
          }
        })
      }).catch(() => {})
    },

    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        tetle: '',
        content: ''
      }
      this.getList('sec')
    },
    getList(type) {
      instructList(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
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
