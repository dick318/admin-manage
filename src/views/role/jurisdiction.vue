<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" filterable clearable placeholder="请选择账户类型" @change="handleFilter">
        <el-option
          v-for="item in accountstypeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="listQuery.uname" style="width: 200px;" clearable class="filter-item" placeholder="请输入名称" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-permission="['kuyuplat:user:save']" class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleCreate"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:userMenu:search']" class="filter-item" size="small" type="success" @click="jumpMenu">权限菜单</el-button>
      <el-button v-permission="['kuyuplat:role:search']" class="filter-item" size="small" type="success" @click="jumpRole">角色管理</el-button>
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

      <el-table-column show-overflow-tooltip align="center" label="帐号" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="名称" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="账户类型" min-width="120">
        <template slot-scope="scope">
          <span>{{ accountstypeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="手机" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="300">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:user:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:userPassword:update']" type="primary" size="mini" @click="handlePassword(scope.row)">密码</el-button>
          <el-button v-permission="['kuyuplat:userMenu:distribute']" type="primary" size="mini" @click="handleMenu(scope.row)">权限</el-button>
          <el-button v-permission="['kuyuplat:userRole:distribute']" type="primary" size="mini" @click="handleRole(scope.row)">角色</el-button>
          <el-button v-permission="['kuyuplat:user:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>

      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="5rem">
        <el-form-item v-if ="dialogStatus=='update'||dialogStatus=='create'" label="名称" prop="uname">
          <el-input v-model.trim="temp.uname" clearable />
        </el-form-item>
        <el-form-item v-if ="dialogStatus=='update'||dialogStatus=='create'" label="账户类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" filterable placeholder="请选择账户类型">
            <el-option
              v-for="item in accountstypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='updateRole'||dialogStatus=='create'" label="角色" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" clearable placeholder="请选择角色">
            <el-option v-for="item in roleSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if ="dialogStatus=='update'||dialogStatus=='create'" label="登陆账号" prop="username">
          <el-input v-model.trim="temp.username" clearable placeholder="请输入登陆账号" />
        </el-form-item>
        <el-form-item v-if ="dialogStatus=='password'||dialogStatus=='create'" label="密码" prop="password">
          <el-input v-model.trim="temp.password" clearable placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if ="dialogStatus=='update'||dialogStatus=='create'" label="手机号码" prop="phone">
          <el-input v-model.trim="temp.phone" clearable placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='menu'" label="权限" prop="menu">
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
            show-checkbox
            highlight-current
            node-key="id"/>
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
  saveUser,
  deleteUser,
  updateUser,
  distributeUserMenu,
  searchUserMenu,
  searchUsers,
  updatePassword,
  searchUserRole,
  distributeUserRole
} from '@/api/role'
import { toTreeData } from '@/utils/tree'
import { roleArr, accountstypeMap, accountstypeSelect } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'Jurisdiction',
  directives: {
    waves
  },
  data() {
    return {
      filterText: '',
      accountstypeMap,
      accountstypeSelect,
      tableKey: 0,
      list: [],
      total: null,
      menu: [],
      roleSelect: [],
      expandedKeys: [],
      checkedKeys: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        type: '',
        uname: ''
      },
      temp: {
        id: undefined,
        uname: '',
        type: '',
        roleId: '',
        username: '',
        password: '',
        phone: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        menu: '权限',
        updateRole: '角色',
        password: '密码'
      },
      rules: {
        uname: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择账户类型',
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: '角色不能为空',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入登陆账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
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
    roleArr(2, res => {
      this.roleSelect = res
    })
    this.getList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    jumpMenu() {
      this.$router.push('/other/menu')
    },
    jumpRole() {
      this.$router.push('/other/role')
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        type: '',
        uname: ''
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
        uname: '',
        username: '',
        password: '',
        phone: '',
        type: '',
        roleId: ''
      }
    },
    handleRole(row) {
      searchUserRole({ userId: row.id }).then(res => {
        if (res.status !== 0) {
          return
        }
        this.temp.roleId = ''
        if (res.data.length > 0) {
          res.data.map((v, i) => {
            if (v.checked === 'true') {
              this.temp.roleId = v.id
            }
          })
        }
        this.temp.id = row.id // copy obj
        this.dialogStatus = 'updateRole'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }).catch(
        () => {
          this.temp.roleId = ''
          this.temp.id = row.id // copy obj
          this.dialogStatus = 'updateRole'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      )
    },
    handleMenu(row) {
      this.checkedKeys = []
      this.menu = []
      this.expandedKeys = []
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'menu'
      this.dialogFormVisible = true
      searchUserMenu({ userId: row.id }).then(res => {
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
          saveUser(this.temp, '.el-dialog__footer')
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
        uname: row.uname,
        username: row.username,
        password: row.password,
        phone: row.phone,
        roleId: row.roleId,
        type: row.type
      }) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlePassword(row) {
      this.temp.id = row.id
      this.dialogStatus = 'password'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'menu') {
            distributeUserMenu({ userId: tempData.id, menuId: this.$refs.tree.getCheckedKeys().join(',') }, '.el-dialog__footer').then(res => {
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
          }
          if (this.dialogStatus === 'updateRole') {
            distributeUserRole({
              roleId: tempData.roleId,
              userId: tempData.id
            }, '.el-dialog__footer').then(res => {
              if (res.status === 0) {
                this.getList('sec')
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
          if (this.dialogStatus === 'password') {
            updatePassword({ id: tempData.id, password: tempData.password }, '.el-dialog__footer').then(res => {
              if (+res.status === 0) {
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
          if (this.dialogStatus === 'update') {
            updateUser(tempData, '.el-dialog__footer').then(res => {
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
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser({
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
    // downAction(pageSize) {
    //   const loading = this.$loading({
    //     lock: true
    //   })
    //   showRoles({
    //     name: this.listQuery.name,
    //     pageSize: pageSize,
    //     pageNo: 1
    //   }).then(res => {
    //
    //     if (+res.status === 0) {
    //      import('@/vendor/Export2Excel').then(excel => {
    //        const tHeader = [
    //          'ID',
    //          '名称',
    //          '登录账号',
    //          '省份',
    //          '城市',
    //          '电话',
    //          '添加时间'
    //        ]
    //        const filterVal = [
    //          'id',
    //          'name',
    //          'username',
    //          'province',
    //          'city',
    //          'phone',
    //          'addtime'
    //        ]
    //        const data = this.formatJson(filterVal, this.list)
    //        excel.export_json_to_excel({
    //          header: tHeader,
    //          data,
    //          filename: `客服信息${new Date().toLocaleDateString()}`
    //        })
    //
    //      })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '数量过多'
    //       })
    //       this.$prompt('', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         inputPlaceholder: '请输入导出数量',
    //         inputErrorMessage: '数量填写不正确',
    //         inputValue: 10000,
    //         inputValidator: function(value) {
    //           if (/(^[1-9]\d*$)/.test(+value)) {
    //             return true
    //           } else {
    //             return false
    //           }
    //         }
    //       }).then(({ value }) => {
    //         this.downAction(value)
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消'
    //         })
    //       })
    //     }
    //   })
    // },
    // handleDownload() {
    //   this.downAction()
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       return v[j]
    //     })
    //   )
    // },
    getList() {
      searchUsers(this.listQuery, '.table').then(res => {
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
