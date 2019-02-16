<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.username" class="filter-item" style="width:220px" clearable placeholder="请输入用户名"/>
      <el-input v-model.trim="listQuery.groupname" class="filter-item" style="width:220px" clearable placeholder="请输入组名"/>
      <el-date-picker
        v-model="listQuery.acctstarttimeStart"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="记账开始时间的起始时间"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.acctstarttimeEnd"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="记账开始时间的截止时间"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.acctstoptimeStart"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="记账停止时间的起始时间"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.acctstoptimeEnd"
        :picker-options="pickerOptionsStop"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="记账停止时间的截止时间"
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
      <el-table-column align="center" label="RADIUS计费ID" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.radacctid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ACCT会话ID" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctsessionid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="记账编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctuniqueid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组名" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.groupname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="组" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.realm }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="NAS的IP地址" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.nasipaddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="NAS端口ID" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.nasportid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="记账开始时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctstarttime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="记账更新时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctupdatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户会话时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctstarttime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户的认证方式" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctauthentic }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="连接开始时间戳" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.connectinfoStart }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="连接结束时间戳" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.connectinfoStop }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载流量" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctinputoctets }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传流量" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctoutputoctets }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="NAS号码" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.calledstationid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户号码" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.callingstationid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="终止类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.acctterminatecause }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户端类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.servicetype }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="认证协议" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.framedprotocol }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户IP地址" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.framedipaddress }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { searchRadacct } from '@/api/vpdn'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Expenses',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: 0,
      tableKey: 0,
      listQuery: {
        username: '',
        groupname: '',
        acctstarttimeStart: '',
        acctstarttimeEnd: '',
        acctstoptimeStart: '',
        acctstoptimeEnd: '',
        pageNo: 1,
        pageSize: 10
      },
      pickerOptions: this.processDate(),
      pickerOptionsStop: this.processDateStop()
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
          return new Date(self.listQuery.acctstarttimeStart).getTime() > time.getTime()
        }
      }
    },
    processDateStop() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.acctstoptimeStart).getTime() > time.getTime()
        }
      }
    },
    getList(type) {
      searchRadacct(this.listQuery, '.table').then(res => {
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
        groupname: '',
        acctstarttimeStart: '',
        acctstarttimeEnd: '',
        acctstoptimeStart: '',
        acctstoptimeEnd: '',
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
