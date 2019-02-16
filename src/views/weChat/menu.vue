<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:menu:add']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate"/>
      <el-button v-permission="['kuyuplat:menu:sync']" class="filter-item" size="small" type="primary" @click="handleSync">同步</el-button>
    </div>
    <tree-table :data="list" :columns="columns" :expand-all="expandAll" :toggle-expanded="toggleExpanded" class="table" border>
      <el-table-column show-overflow-tooltip align="center" label="菜单顺序">
        <template slot-scope="scope">
          <span>{{ scope.row.orderid }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="关联关键词(点击类型)" >
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="添加时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="120">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:menu:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:menu:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </tree-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="9rem">
        <el-form-item label="父级菜单">
          <el-select v-model="temp.pid" class="filter-item" clearable placeholder="请选择父级菜单">
            <el-option v-for="item in pidArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称:" prop="name">
          <el-input v-model.trim="temp.name"/>
        </el-form-item>
        <el-form-item label="关键字:">
          <el-input v-model.trim="temp.key"/>
        </el-form-item>
        <el-form-item label="链接地址:" prop="url">
          <el-input v-model.trim="temp.url"/>
        </el-form-item>
        <el-form-item label="是否授权:" prop="status">
          <el-radio v-model="temp.status" :label="1" style="margin-left:10px;width:9;">是</el-radio>
          <el-radio v-model="temp.status" :label="0" style="margin-left:10px;width:90px;">否</el-radio>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model.trim="temp.orderid"/>
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
import treeTable from '@/components/TreeTable'
import { getFirstMenus, getMenus, addMenu, updateMenu, deleteMenu, syncMenu } from '@/api/wechat'
import waves from '@/directive/waves' // 水波纹指令
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'WeChatMenu',
  components: { treeTable, Pagination },
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      columns: [
        {
          text: '主菜单名称',
          value: 'name',
          width: 200
        }
      ],
      pidArr: [],
      list: [],
      total: 0,
      expandAll: false,
      checkedKeys: [],
      expandedKeys: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      temp: {
        id: undefined,
        pid: '',
        name: '',
        key: '',
        url: '',
        city: '',
        status: '',
        orderid: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      rules: {
        name: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            message: '链接地址不能为空',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择是否授权',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getPidArr()
  },
  methods: {
    getPidArr() {
      getFirstMenus({ }).then(res => {
        if (res.status === 0) {
          this.pidArr = [].concat(res.data)
        }
      })
    },
    handleSync() {
      this.$confirm('此操作将同步菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncMenu({ }, '.table').then(res => {
            if (+res.status === 0) {
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    toggleExpanded(value) {
      value._expanded = !value._expanded
    },
    // 这里处理没有children结构的数据
    getTreeData(list, dataArr) {
      dataArr.map((pNode, i) => {
        const childObj = pNode.children || []
        list.map((cNode, j) => {
          if (pNode.id === cNode.pid) {
            childObj.push(cNode)
          }
        })
        pNode.children = childObj
        if (childObj.length > 0) {
          this.getTreeData(list, childObj)
        }
      })
      return dataArr
    },
    handleRefresh() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        pid: '',
        name: '',
        key: '',
        url: '',
        city: '',
        status: '',
        orderid: ''
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
          addMenu(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.getList('sec')
                this.getPidArr()
                this.dialogFormVisible = false
              }
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          updateMenu({
            id: tempData.id,
            url: tempData.url,
            status: tempData.status,
            pid: tempData.pid,
            name: tempData.name,
            key: tempData.key,
            orderid: tempData.orderid
          }, '.el-dialog__footer').then(res => {
            if (+res.status === 0) {
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
      })
    },

    handleDelete(row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMenu({
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
    getList(type) {
      getMenus({ }, '.table').then(res => {
        if (+res.status !== 0) {
          return false
        }
        if (res.data.length > 0) {
          const parentArr = res.data.filter(l => +l.pid === 0)
          this.list = this.getTreeData(res.data, parentArr)
          this.expandAll = true
        }
        this.total = res.data.length || 0
        if (!type) {
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
