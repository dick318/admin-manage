<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="type" class="filter-item" filterable placeholder="请选择角色类型" @change="changeType">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-permission="['kuyuplat:authorityMenu:save']" class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleCreate"/>
    </div>
    <tree-table :data="treeDataSource" :expand-all="expandAll" :permission="true" :toggle-expanded="toggleExpanded" class="table" border>
      <el-table-column show-overflow-tooltip align="center" label="创建者">
        <template slot-scope="scope">
          <span >{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="权限标识" min-width="160">
        <template slot-scope="scope">
          <span >{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注">
        <template slot-scope="scope">
          <span >{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button icon="el-icon-plus" size="small" type="primary" @click="handleCreate(scope.row)"/>
          <el-button v-permission="['kuyuplat:authorityMenu:update']" icon="el-icon-edit-outline" size="small" type="primary" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:authorityMenu:delete']" icon="el-icon-delete" size="small" type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item v-if="dialogStatus=='create'" label="父级菜单" prop="parentId">
          <el-select v-model="temp.parentId" class="filter-item parentId" clearable placeholder="请选择父级菜单">
            <el-option
              v-for="item in parentIdArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="主菜单名称" prop="name">
          <el-input v-model.trim="temp.name" clearable />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model.trim="temp.permission" clearable />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model.trim="temp.remarks" clearable />
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" filterable placeholder="请选择角色类型">
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchMenus, addMenu, delMenu, updateMenu
} from '@/api/role'
import treeTable from '@/components/TreeTable'

export default {
  name: 'Menu',
  components: { treeTable },
  data() {
    return {
      expandAll: false,
      list: [],
      type: 1,
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
      textMap: {
        create: '添加',
        update: '修改'
      },
      dialogStatus: '',
      parentIdArr: [],
      temp: {
        parentId: 0,
        name: '',
        permission: '',
        remarks: '',
        isShow: 0,
        type: this.type
      },
      rules: {
        name: [
          { required: true, message: '请输入主菜单名称！', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父级菜单不能为空！', trigger: 'blur' }
        ]
      },
      treeDataSource: [],
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeType() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        parentId: '',
        name: '',
        permission: '',
        remarks: '',
        isShow: 0,
        type: this.type,
        createBy: 50
      }
    },
    toggleExpanded(value) {
      value._expanded = !value._expanded
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.parentId = row.id || 0
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      searchMenus({ parentId: row.parentId || 0, type: this.type }, '.parentId').then(res => {
        if (res.status === 0) {
          this.parentIdArr = res.data
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
          if (this.dialogStatus === 'create') {
            addMenu(tempData, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.dialogFormVisible = false
                this.getList('sec')
              }
            })
          }
          if (this.dialogStatus === 'update') {
            updateMenu({
              parentId: tempData.parentId,
              name: tempData.name,
              permission: tempData.permission,
              remarks: tempData.remarks,
              isShow: 0,
              id: tempData.id
            }, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.dialogFormVisible = false
                this.getList('sec')
              }
            })
          }
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu({
          id: row.id,
          updateBy: 50
        }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
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
    TreeData() {
      // 取父节点
      const parentArr = this.list.filter(l => +l.parentId === 0)
      this.treeDataSource = this.getTreeData(this.list, parentArr)
    },
    // 这里处理没有children结构的数据
    getTreeData(list, dataArr) {
      dataArr.map((pNode, i) => {
        const childObj = []
        list.map((cNode, j) => {
          if (+pNode.id === +cNode.parentId) {
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getList(type) {
      searchMenus({ type: this.type }, '.table').then(res => {
        if (type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (res.status === 0) {
          this.list = res.data
          this.TreeData()
        }
      })
    }
  }
}
</script>
