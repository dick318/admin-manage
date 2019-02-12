<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.nickname" style="width: 200px;" clearable class="filter-item" placeholder="请输入昵称" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-permission="['kuyuplat:fansinfo:sync']" class="filter-item" size="small" type="primary" @click="handleSync">同步</el-button>
      <!-- <el-button v-permission="['common']" class="filter-item" size="small" type="primary" @click="handleJump">分组</el-button> -->
      <el-button v-permission="['kuyuplat:export:wxFansInfo']" v-waves class="filter-item" size="small" type="warning " @click="handleDownload">Java导出</el-button>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
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

      <el-table-column align="center" label="粉丝头像" show-overflow-tooltip >
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" style="width:50px" class="image">
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信ID" show-overflow-tooltip min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.openid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.country+scope.row.province+scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后联系时间" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.lastSayTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="80px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:fansinfo:update']" type="primary" size="mini" @click="handleRemark(scope.row)">备注</el-button>
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
import { getFansList, setFansRemark, syncFans, exportWxFansInfo } from '@/api/wechat'

export default {
  name: 'WeChatFans',
  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        nickname: '',
        pageNo: 1,
        pageSize: 10
      },
      temp: {

      },
      list: [],
      tableKey: 0,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleRemark(row) {
      this.$prompt('', '备注', {
        inputPlaceholder: '请输入备注',
        inputValue: row.remark
      }).then(({ value }) => {
        setFansRemark({ id: row.id, remark: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList('sec')
          }
        })
      }).catch()
    },
    handleSync() {
      this.$confirm('此操作将同步粉丝, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncFans({ }, '.table').then(res => {
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
    handleDownload() {
      this.$confirm('此操作将导出数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        exportWxFansInfo({}, '.filter-container').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleJump(type) {
      this.$router.push(type)
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery.nickname = ''
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    getList(type) {
      getFansList(this.listQuery, '.table').then(res => {
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
