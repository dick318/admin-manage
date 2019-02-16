<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:autoreply:add']" v-waves class="filter-item" size="small" type="primary" @click="addKeyWord">添加文本回复</el-button>
      <el-button v-permission="['kuyuplat:autoreply:add']" v-waves class="filter-item" size="small" type="success" @click="jump('/weChat/keyWordDetails')">添加图文回复</el-button>
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
      <el-table-column align="center" label="关键词" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==0?'':'success'">{{ scope.row.type==0?'图文':'文本' }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="width:50px" class="image">
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序号" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.showFront }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="300px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:autoreply:update']" v-if="scope.row.type==1" type="primary" size="mini" icon="el-icon-edit-outline" @click="update(scope.row)"/>
          <el-button v-permission="['kuyuplat:autoreply:update']" v-else type="primary" size="mini" icon="el-icon-edit-outline" @click="jump(`keyWordDetails?id=${scope.row.id}`)"/>
          <el-button v-permission="['kuyuplat:autoreply:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-position="right" label-width="9rem">
        <el-form-item label="关键字:" prop="keyword">
          <el-input v-model.trim="temp.keyword"/>
        </el-form-item>
        <el-form-item label="标题:">
          <el-input v-model.trim="temp.title"/>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model.trim="temp.content" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:200px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写内容！" type="textarea" />
        </el-form-item>
        <el-form-item label="链接地址:">
          <el-input v-model.trim="temp.url"/>
        </el-form-item>
        <el-form-item label="是否授权:">
          <el-radio v-model="temp.status" :label="1" style="margin-left:10px;width:90px;">是</el-radio>
          <el-radio v-model="temp.status" :label="2" style="margin-left:10px;width:90px;">否</el-radio>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model.trim="temp.orderid"/>
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model.trim="temp.info"/>
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
import { getAutoReplyList, addAutoReply, updateAutoReply, deleteAutoReply } from '@/api/wechat'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'WeChatKeyWord',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        type: '',
        txt: ''
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
        keyword: [
          {
            required: true,
            message: '关键字不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '内容不能为空',
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
        url: '',
        status: '',
        keyword: '',
        type: 1,
        title: '',
        content: '',
        info: '',
        orderid: ''
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
    jump(type) {
      this.$router.push(type)
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
          addAutoReply(this.temp, '.el-dialog__footer')
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
          updateAutoReply(tempData, '.el-dialog__footer').then(res => {
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
      this.$confirm('此操作将删除该关键词, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAutoReply({ id }, '.el-message-box').then((res) => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList()
          }
        })
      })
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
      getAutoReplyList(this.listQuery, '.table').then(res => {
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
