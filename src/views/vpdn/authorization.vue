<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.username" class="filter-item" style="width:220px" clearable placeholder="请输入用户名"/>
      <el-date-picker
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="起始时间"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="截止时间"
        class="filter-item"
      />
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <!-- <el-button v-waves v-permission="['kuyuplat:cardreplace:save']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate"/> -->
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <!-- <el-button v-waves v-permission="['kuyuplat:excel:cardReplaceInfo']" class="filter-item" size="small" type="warning " @click="handleDownload">Java导出</el-button> -->
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column align="center" label="id" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.pass }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户状态" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.reply }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="记录连接时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.authdate }}</span>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { searchRadpostauth } from '@/api/vpdn'
export default {
  name: 'Authorization',
  directives: {
    waves
  },
  //   filters: {
  //     filterProvince(address) {
  //       return address ? address.split(',')[0] : ''
  //     },
  //     filterCity(address) {
  //       return address ? address.split(',')[1] : ''
  //     },
  //     filterArea(address) {
  //       return address ? address.split(',')[2] : ''
  //     },
  //     filterAddress(address) {
  //       return address ? address.split(',')[3] : ''
  //     },
  //     filterIspay(ispay) {
  //       let payText
  //       if (ispay === 1) {
  //         payText = '免运费'
  //       }
  //       if (ispay === 2) {
  //         payText = '未支付'
  //       }
  //       if (ispay === 3) {
  //         payText = '支付成功'
  //       }
  //       return payText
  //     }
  //   },
  data() {
    return {
      list: [],
      total: null,
      tableKey: 0,
      listQuery: {
        username: '',
        starttime: '',
        endtime: '',
        pageNo: 1,
        pageSize: 10
      },
      pickerOptions: this.processDate()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    getList(type) {
      searchRadpostauth(this.listQuery, '.table').then(res => {
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status !== 0) {
          return false
        }
        this.list = res.data.rows
        this.total = +res.data.total
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleRefresh() {
      this.listQuery = {
        username: '',
        starttime: '',
        endtime: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    }
  }
}
</script>
<style >
.cardStatus {
  display: flex;
  margin-top: 0;
}
.cardStatus span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}
</style>
