<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:weixin:modelAdd']" v-waves class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="addKeyWord" />
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
      <el-table-column align="center" label="名称" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细内容" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="链接地址" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:weixin:modelUpdate']" type="primary" size="mini" icon="el-icon-edit-outline" @click="update(scope.row)"/>
          <el-button v-permission="['kuyuplat:weixin:modelDelete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-position="right" class="dialog" label-width="9rem">
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="temp.name"/>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input v-model.trim="temp.title"/>
        </el-form-item>
        <el-form-item label="简介:" prop="info">
          <el-input v-model.trim="temp.info" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:200px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写内容！" type="textarea" />
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model.trim="temp.text" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:200px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写内容！" type="textarea" />
        </el-form-item>
        <el-form-item label="链接地址:">
          <el-input v-model.trim="temp.url"/>
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
import { modelGetAll, modelEdit, modelAdd, modelDel } from '@/api/wechatMessage'

export default {
  name: 'WechatModel',
  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      temp: {

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
        name: [
          {
            required: true,
            message: '模板名称不能为空',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }
        ],
        info: [
          {
            required: true,
            message: '内容简介不能为空',
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
        name: '',
        title: '',
        info: '',
        text: '',
        url: ''
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
          modelAdd(this.temp, '.el-dialog__footer')
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
          modelEdit(tempData, '.el-dialog__footer').then(res => {
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
    handleDelete(id) {
      this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modelDel({ id }, '.el-message-box').then((res) => {
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
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    getList(type) {
      modelGetAll(this.listQuery, '.table').then(res => {
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
