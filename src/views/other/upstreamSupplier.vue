<template>
  <div class="app-container  calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.operatorType" class="filter-item" clearable placeholder="请选择运营商类型" @change="handleFilter">
        <el-option
          v-for="item in operator_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.operatorName" class="filter-item" clearable placeholder="请选择运营商名称类型" @change="handleFilter">
        <el-option
          v-for="item in operatorNameSelect"
          :key="item.i"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves v-permission="['kuyuplat:operatorAccount:save']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate"/>
      <el-button
        v-waves
        size="small"
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      />
      <el-button
        v-waves
        size="small"
        type="success"
        class="filter-item"
        icon="el-icon-refresh"
        @click="handleRefresh"
      />
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      :data="list.slice((listQuery.pageNo-1)*listQuery.pageSize,listQuery.pageNo*listQuery.pageSize)"
      :key="tableKey"
      :fit="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="供应商类型">
        <template slot-scope="scope">
          <span>{{ operatorTypeMap[scope.row.operatorType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="运营商名称">
        <template slot-scope="scope">
          <span>{{ scope.row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="统一名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="ec账号">
        <template slot-scope="scope">
          <span>{{ scope.row.ecAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="ec密码">
        <template slot-scope="scope">
          <span>{{ scope.row.ecPassword }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="ec登陆网址"
        min-width="150">
        <template slot-scope="scope">
          <a :href="scope.row.ecLogin" style="color:#66b1ff;cursor:pointer" target="_blank" >{{ scope.row.ecLogin }}</a>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="二次授权账号">
        <template slot-scope="scope">
          <span>{{ scope.row.secondAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="二次授权密码">
        <template slot-scope="scope">
          <span>{{ scope.row.secondPassword }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="密码">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="登陆网址"
        min-width="150">
        <template slot-scope="scope">
          <a :href="scope.row.login" style="color:#66b1ff;cursor:pointer" target="_blank" >{{ scope.row.login }}</a>
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
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="添加">
      <el-form ref="dataForm" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item label="供应商类型">
          <el-select v-model="temp.operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
            <el-option
              v-for="item in operator_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商名称">
          <el-input v-model.trim="temp.operatorName" clearable />
        </el-form-item>
        <el-form-item label="统一名称">
          <el-input v-model.trim="temp.name" clearable />
        </el-form-item>
        <el-form-item label="ec账号">
          <el-input v-model.trim="temp.ecAccount" clearable />
        </el-form-item>
        <el-form-item label="ec密码">
          <el-input v-model.trim="temp.ecPassword" clearable />
        </el-form-item>
        <el-form-item label="ec登陆网址">
          <el-input v-model.trim="temp.ecLogin" clearable />
        </el-form-item>
        <el-form-item label="二次授权账号">
          <el-input v-model.trim="temp.secondAccount" clearable />
        </el-form-item>
        <el-form-item label="二次授权密码">
          <el-input v-model.trim="temp.secondPassword" clearable />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model.trim="temp.account" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model.trim="temp.password" clearable />
        </el-form-item>
        <el-form-item label="登陆网址">
          <el-input v-model.trim="temp.login" clearable />
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
import { saveOperatorAccount, searchOperatorAccount } from '@/api/operator'
import {
  operator_type, operatorTypeMap
} from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'UpstreamSupplier',
  directives: {
    waves
  },
  data() {
    return {
      operator_type,
      operatorTypeMap,
      operatorNameSelect: [],
      tableKey: 0,
      list: [],
      sourceList: [],
      total: null,
      dialogFormVisible: false,
      listQuery: {
        operatorType: '',
        operatorName: '',
        pageNo: 1,
        pageSize: 10
      },
      temp: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCreate() {
      this.temp = {}
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          saveOperatorAccount(
            tempData,
            '.el-dialog__footer'
          ).then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (res.status === 0) {
              this.getList()
              this.dialogFormVisible = false
            }
          })
        }
      })
    },

    handleRefresh() {
      this.listQuery = {
        operatorType: '',
        operatorName: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },
    handleFilter() {
      this.list = []
      this.listQuery.pageNo = 1
      this.sourceList.map((v, i) => {
        if (this.listQuery.operatorName) {
          if (this.listQuery.operatorType) {
            if (v.operatorName === this.listQuery.operatorName && v.operatorType === this.listQuery.operatorType) {
              this.list.push(v)
            }
          } else {
            if (v.operatorName === this.listQuery.operatorName) {
              this.list.push(v)
            }
          }
        } else {
          if (this.listQuery.operatorType) {
            if (v.operatorType === this.listQuery.operatorType) {
              this.list.push(v)
            }
          } else {
            this.list.push(v)
          }
        }
      })
      this.total = this.list.length
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
    },
    getList(type) {
      searchOperatorAccount(this.listQuery, '.table').then(res => {
        if (res.status === 0) {
          this.operatorNameSelect = []
          res.data.map((v, i) => {
            if (v.operatorName) {
              this.operatorNameSelect.push({
                id: i,
                value: v.operatorName,
                label: v.operatorName
              })
            }
          })
          this.sourceList = res.data
          this.list = res.data
          this.total = res.data.length
        }
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
