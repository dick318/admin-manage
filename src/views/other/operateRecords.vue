<template>
  <div class="app-container calendar-list-container">
    <el-input v-model.trim="listQuery.uname" style="width: 200px;" clearable class="filter-item" placeholder="请输入操作者" @clear="handleRefresh" />
    <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="操作类型" @clear="handleFilter">
      <el-option v-for="item in operationSelect" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="listQuery.operateName" class="filter-item" clearable placeholder="操作名称" @clear="handleFilter">
      <el-option v-for="item in operateNameSelect" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
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
    <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
    <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row>

      <el-table-column show-overflow-tooltip align="center" label="ID" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作者" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作名称" min-width="140">
        <template slot-scope="scope">
          <span>{{ operateNameMap[scope.row.operateName] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作ID" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.operateId }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作类型" min-width="140">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type==2?'':
            scope.row.type==3?'danger':'success'">{{ typeMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="变化数据" min-width="140">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.oldData||scope.row.newData" trigger="hover" placement="top">
            <el-table :data="getValue(scope.row)" :fit ="true" :row-class-name="tableRowClassName" size="mini">
              <el-table-column
                v-for="(item, index) in getLabel(scope.row)"
                :key="index"
                :label="item"
                show-overflow-tooltip
                min-width="100"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row[item] }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div slot="reference">
              <el-tag size="medium">数据变化详情</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import {
  searchRecords
} from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import {
  operationStatusMap
} from '@/utils/mapArr'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OperateRecords',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      operationStatusMap,
      typeMap: {
        1: '添加',
        2: '修改',
        3: '删除'
      },
      operateNameMap: {
        1: '代理商比例',
        2: '代理商',
        3: '代理商分配套餐',
        4: '套餐',
        5: '供应商批次',
        6: '供应商账号',
        7: '卡片',
        8: '卡片实名',
        9: '佣金'
      },
      pickerOptions: this.processDate(),
      operateNameSelect: [
        {
          value: '1',
          label: '代理商比例'
        },
        {
          value: '2',
          label: '代理商'
        },
        {
          value: '3',
          label: '代理商分配套餐'
        },
        {
          value: '4',
          label: '套餐'
        },
        {
          value: '5',
          label: '供应商批次'
        },
        {
          value: '6',
          label: '供应商账号'
        },
        {
          value: '7',
          label: '卡片'
        },
        {
          value: '8',
          label: '卡片实名'
        },
        {
          value: '9',
          label: '佣金'
        }
      ],
      operationSelect: [
        {
          value: '1',
          label: '添加'
        },
        {
          value: '2',
          label: '修改'
        },
        {
          value: '3',
          label: '删除'
        }
      ],
      tableKey: 0,
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        operateName: '',
        type: '',
        starttime: '',
        endtime: ''
      },
      total: 0,
      listLoading: true,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'warning-row'
      } else if (rowIndex === 1) {
        return 'success-row'
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    getLabel(row) {
      const keyArr = []
      if (row.oldData) {
        keyArr.push(Object.keys(this.toJson(row.oldData)))
      }
      if (row.newData) {
        keyArr.push(Object.keys(this.toJson(row.newData)))
      }
      return Array.from(new Set(keyArr.flat()))
    },
    getValue(row) {
      const dataArr = []
      if (row.oldData) {
        dataArr.push(this.toJson(row.oldData))
      }
      if (row.newData) {
        dataArr.push(this.toJson(row.newData))
      }
      return dataArr
    },
    toJson(row) {
      if (row) {
        return JSON.parse(row)
      } else {
        return {}
      }
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.addtimeStart).getTime() > time.getTime()
        }
      }
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        operateName: '',
        type: '',
        starttime: '',
        endtime: ''
      }
      this.getList()
    },

    getList() {
      this.listLoading = true
      searchRecords(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        this.listLoading = false

        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
.el-table>>>.warning-row {
  background: oldlace;
  }

.el-table>>>.success-row {
  background: #f0f9eb;
}
</style>
