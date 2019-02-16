<template>
  <div class="app-container calendar-list-container">
    <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入操作者" @clear="handleRefresh" />
    <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="操作类型" @clear="handleFilter">
      <el-option v-for="item in operationTypeSelect" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="listQuery.utype" class="filter-item" clearable placeholder="操作者类型" @clear="handleFilter">
      <el-option v-for="item in utypeSelect" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
    <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
    <el-button v-waves v-permission="['kuyuplat:work:refresh']" size="small" type="success" class="filter-item" @click="handleRefreshAll">刷新进度</el-button >
    <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row>

      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="完成时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="任务状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'':'danger'">{{ operationStatusMap[+scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="任务进度" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.progress }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="成功" min-width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.success||scope.row.success==0"> {{ scope.row.success }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="失败" min-width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fail||scope.row.fail==0" type="danger"> {{ scope.row.fail }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作者" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作类型" min-width="150">
        <template slot-scope="scope">
          <span>{{ operationTypeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="240">
        <template slot-scope="scope">
          <!-- v-if="scope.row.status===2" -->
          <el-button v-permission="['kuyuplat:export:refreshProgress']" type="success" size="mini" @click="refresh(scope.row)">刷新</el-button>
          <el-button type="primary" size="mini" @click="upload(scope.row)">源文件</el-button>
          <el-button type="danger" size="mini" @click="down(scope.row)">结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import {
  workRecord, refreshWorks
} from '@/api/card'
import waves from '@/directive/waves' // 水波纹指令
import {
  operationStatusMap, operationTypeMap, operationTypeSelect, utypeSelect
} from '@/utils/mapArr'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OperateList',
  components: { Pagination },
  directives: {
    waves
  },
  data() {
    return {
      utypeSelect,
      operationStatusMap,
      operationTypeMap,
      operationTypeSelect,
      tableKey: 0,
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        type: '',
        utype: ''
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    downAction(pageSize) {
      workRecord({
        name: this.listQuery.name,
        type: this.listQuery.type,
        utype: this.listQuery.utype,
        pageSize: pageSize,
        pageNo: 1
      }, '.table').then(res => {
        if (+res.status === 0) {
         import('@/vendor/Export2Excel').then(excel => {
           const tHeader = [
             'ID',
             '添加时间',
             '完成时间',
             '任务状态',
             '成功',
             '失败',
             '操作者',
             '操作类型',
             '源文件',
             '结果'
           ]
           const filterVal = [
             'id',
             'addtime',
             'endtime',
             'status',
             'success',
             'fail',
             'uname',
             'type',
             'uploadFile',
             'downFile'
           ]
           const data = this.formatJson(filterVal, res.data.rows)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: `操作记录信息${new Date().toLocaleDateString()}`
           })
         })
        } else {
          this.$notify({
            type: 'error',
            message: '数量过多'
          })
          this.$prompt('', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入导出数量',
            inputErrorMessage: '数量填写不正确',
            inputValue: 10000,
            inputValidator: function(value) {
              if (/(^[1-9]\d*$)/.test(+value)) {
                return true
              } else {
                return false
              }
            }
          }).then(({ value }) => {
            this.downAction(value)
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return operationStatusMap[+v[j]]
          } else if (j === 'type') {
            return operationTypeMap[+v[j]]
          } else {
            return v[j]
          }
        })
      )
    },
    handleDownload() {
      this.downAction()
    },
    handleRefreshAll() {
      for (let item of this.list) {
        const loading = this.$loading()
        refreshWorks({ workId: item.id }, '.table').then(res => {
          if (res.status === 0) {
            const index = this.list.indexOf(item)
            if (index === this.list.length - 1) {
              loading.close()
            }
            if (+res.data.total && +res.data.finished) {
              item.progress = ((+res.data.finished / +res.data.total) * 100).toFixed(2) + '%'
            }
            item = Object.assign(item, res.data)
            if (item.status === 3 || item === 4) {
              delete item.progress
            }
            this.list.splice(index, 1, item)
          }
        })
      }
    },
    refresh(row) {
      refreshWorks({ workId: row.id }, '.table').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (res.status === 0) {
          for (let item of this.list) {
            if (item.id === row.id) {
              const index = this.list.indexOf(item)
              if (+res.data.total && +res.data.finished) {
                item.progress = ((+res.data.finished / +res.data.total) * 100).toFixed(2) + '%'
              }
              item = Object.assign(item, res.data)
              if (item.status === 3 || item === 4) {
                delete item.progress
              }
              this.list.splice(index, 1, row)
              break
            }
          }
        }
      })
    },
    upload(row) {
      if (row.uploadFile) {
        window.open(row.uploadFile, '_self')
      } else {
        this.$notify({
          type: 'error',
          message: '找不到源文件'
        })
      }
    },
    down(row) {
      if (row.downFile) {
        window.open(row.downFile, '_self')
      } else {
        this.$notify({
          type: 'error',
          message: '找不到结果文件'
        })
      }
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        name: '',
        type: '',
        utype: ''
      }
      this.getList()
    },

    getList() {
      workRecord(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
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

