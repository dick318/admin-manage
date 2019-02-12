<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:hunan:start']" size="small" type="primary" class="filter-item" @click="hunanStart">手动执行</el-button>
      <el-button v-waves v-if="show" class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      :stripe="true"
      class="table"
      row-key="id"
      size="mini"
      element-loading-text="给我一点时间"
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
          <el-tag :type="scope.row.type==1?'danger':''">{{ scope.row.type===1?'运行中':'已完成' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="操作者">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type===1" type="primary" size="mini" @click="refresh(scope.row)">刷新</el-button>
        </template>
      </el-table-column> -->
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

  </div>
</template>

<script>
import {
  hunanStart, getHunan
} from '@/api/hunanList'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'HunanList',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      show: true,
      total: null,
      listLoading: true,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDownload() {
      window.open('http://120.77.253.165:20010/excel/card/export/stop', '_self')
    },
    hunanStart() {
      hunanStart({}, '.filter-container').then(res => {
        if (+res.status === 0) {
          this.getList()
        }
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    },
    handleRefresh() {
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
    getList() {
      this.listLoading = true
      getHunan(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
          this.list.map((v, i) => {
            if (v.type === 1) {
              this.show = false
            }
          })
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
