<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入名称" @clear="handleRefresh" />
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
      <el-select v-model="listQuery.type" class="filter-item" filterable placeholder="请选择角色类型" @change="changeType">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:role:save']" class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleCreate"/>
      <!-- <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"></el-button> -->
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

      <el-table-column show-overflow-tooltip align="center" label="角色名称" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="英文名" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.enname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="角色类型" min-width="140">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==1?'success':''">{{ scope.row.type==1?'代理商平台角色':scope.row.type==2?'总平台角色':scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="创建者" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="300">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:role:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:roleMenu:distribute']" type="primary" size="mini" @click="handleRole(scope.row)">权限</el-button>
          <el-button v-permission="['kuyuplat:role:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>

      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="6rem">
        <el-form-item v-if ="dialogStatus=='updateRole'" label="权限" prop="menu">
          <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字进行过滤"/>
          <el-tree
            ref="tree"
            :data="menu"
            :default-checked-keys="checkedKeys"
            :default-expanded-keys="expandedKeys"
            :filter-node-method="filterNode"
            class="menu"
            show-checkbox
            highlight-current
            node-key="id"/>
        </el-form-item>
        <el-form-item v-if ="dialogStatus!='updateRole'" label="名称" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item v-if ="dialogStatus!='updateRole'" label="英文名称" prop="enname">
          <el-input v-model.trim="temp.enname" clearable placeholder="请输入英文名称"/>
        </el-form-item>
        <el-form-item v-if ="dialogStatus!='updateRole'" label="角色类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" filterable placeholder="请选择角色类型">
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if ="dialogStatus!='updateRole'" label="备注信息" prop="remarks">
          <el-input v-model.trim="temp.remarks" clearable />
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
  distributeRoleMenu,
  searchRoleMenu,
  addRole,
  delRole,
  updateRole,
  showRoles
} from '@/api/role'
import { toTreeData } from '@/utils/tree'
import waves from '@/directive/waves' // 水波纹指令
import store from '@/store'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Role',
  components: { Pagination },
  directives: {
    waves
  },
  data() {
    return {
      filterText: '',
      tableKey: 0,
      list: [],
      total: 0,
      menu: [],
      pickerOptions: this.processDate(),
      expandedKeys: [],
      checkedKeys: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        starttime: null,
        endtime: null,
        type: 1,
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        enname: '',
        type: '',
        remarks: ''
      },
      typeArr: [
        {
          value: 1,
          label: '代理商平台角色'
        },
        {
          value: 2,
          label: '总平台角色'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        updateRole: '修改权限'
      },
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '角色不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    dialogFormVisible(val) {
      if (!val) {
        this.filterText = ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeType() {
      this.getList()
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        starttime: null,
        endtime: null,
        type: 1,
        name: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        enname: '',
        type: this.listQuery.type,
        remarks: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleRole(row) {
      this.dialogStatus = 'updateRole'
      this.dialogFormVisible = true
      this.checkedKeys = []
      this.menu = []
      this.expandedKeys = []
      this.temp = Object.assign({}, row) // copy obj
      searchRoleMenu({ roleId: row.id }).then(res => {
        if (res.status === 0) {
          const oneArr = []
          const twoArr = []
          for (var b in res.data) {
            if (res.data[b]['checked'] === 'true') {
              oneArr.push(res.data[b]['id'])
            }
            if (+res.data[b]['parentId'] === 0 && res.data[b]['checked'] === 'false ') {
              twoArr.push(res.data[b]['id'])
            }
          }
          this.menu = toTreeData(res.data)
          this.checkedKeys = this.checkedKeys.concat(oneArr)
          this.expandedKeys = this.expandedKeys.concat(twoArr)
        }
      })
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
          addRole(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                store.dispatch('setRoleSelect', false)
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
          if (this.dialogStatus === 'updateRole') {
            distributeRoleMenu({ roleId: tempData.id, menuId: this.$refs.tree.getCheckedKeys().join(',') }, '.el-dialog__footer').then(res => {
              if (+res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
              }
              this.dialogFormVisible = false
            })
            return
          }
          updateRole({
            id: tempData.id,
            name: tempData.name,
            enname: tempData.enname,
            roleType: tempData.roleType,
            remarks: tempData.remarks
          }, '.el-dialog__footer').then(res => {
            if (+res.status === 0) {
              store.dispatch('setRoleSelect', false)
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRole({
            id: row.id
          }, '.el-message-box').then(res => {
            if (+res.status === 0) {
              store.dispatch('setRoleSelect', false)
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
      showRoles(this.listQuery, '.table').then(res => {
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
