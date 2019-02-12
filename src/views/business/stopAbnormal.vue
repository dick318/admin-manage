<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>

      <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="请选择停复机类型">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.dispose" class="filter-item" clearable placeholder="请选择处理状态">
        <el-option
          v-for="item in disposeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.actionType" class="filter-item" clearable placeholder="请选择操作类型">
        <el-option
          v-for="item in actionTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="zids" class="filter-item" collapse-tags multiple clearable placeholder="请选择供应商账号">
        <el-option
          v-for="item in zidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:cardActionException:export']" class="filter-item" size="small" type="warning" @click="handleDownload">Java导出</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="iccid" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="接入号">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="虚拟号" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" show-overflow-tooltip min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作类型" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.actionType==1?'停复机':'上网功能' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.dispose==2?'success':'warning'">{{ scope.row.dispose==2?'已处理':'未处理' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="停复机类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'success':'warning'">{{ scope.row.type==2?'复机':scope.row.type==1?'停机':'' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="异常消息" show-overflow-tooltip min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.excMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常次数" show-overflow-tooltip min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.excNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商账号" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.accountName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="320px">
        <template slot-scope="scope">
          <el-button v-permission="['common']" v-if="scope.row.status==1" type="primary" size="mini" @click="pass(scope.row.id)">通过</el-button>
          <el-button v-permission="['common']" v-if="scope.row.status==1" type="danger" size="mini" @click="refuse(scope.row.id)">拒绝</el-button>
          <el-button v-permission="['common']" type="primary" size="mini" @click="jump(`/business/AutonymDetails?id=${scope.row.id}`)">详情</el-button>
          <el-button v-permission="['common']" type="danger" size="mini" @click="delete(scope.row)"icon="el-icon-delete"/>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30, 50,100,500,1000]"
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
import { accountsArr, withdrawStatus, withdrawStatusMap } from '@/utils/mapArr'
import { searchCardActionException, exportCardAction } from '@/api/stopReset'

export default {
  name: 'StopAbnormal',
  directives: {
    waves
  },
  data() {
    return {
      pickerOptions: this.processDate(),
      withdrawStatus,
      withdrawStatusMap,
      list: [],
      zids: [],
      total: null,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        starttime: '',
        endtime: '',
        iccid: '',
        tel: '',
        number: '',
        type: '',
        dispose: '',
        actionType: '',
        zids: ''
      },
      zidSelect: [],
      typeArr: [
        {
          value: '1',
          label: '停机'
        },
        {
          value: '2',
          label: '复机'
        }
      ],
      disposeArr: [
        {
          value: '1',
          label: '未处理'
        },
        {
          value: '2',
          label: '已处理'
        }
      ],
      actionTypeArr: [
        {
          value: '1',
          label: '停复机'
        },
        {
          value: '2',
          label: '上网功能'
        }
      ]
    }
  },
  created() {
    accountsArr((zidSelect) => {
      this.zidSelect = zidSelect
    })
    this.getList()
  },
  methods: {
    pass(value) {

    },
    refuse(value) {

    },

    jump(type) {
      this.$router.push(type)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
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
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        starttime: '',
        endtime: '',
        iccid: '',
        tel: '',
        number: '',
        type: '',
        dispose: '',
        actionType: '',
        zids: ''
      }
      this.zids = []
      this.getList()
    },
    getList() {
      if (this.zids.length > 0) {
        this.listQuery.zids = this.zids
        this.listQuery.zids = this.listQuery.zids.join(',')
      } else {
        this.listQuery.zids = ''
      }
      searchCardActionException(this.listQuery, '.table').then(res => {
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
    },
    handleDownload() {
      if (this.zids.length > 0) {
        this.listQuery.zids = this.zids
        this.listQuery.zids = this.listQuery.zids.join(',')
      } else {
        this.listQuery.zids = ''
      }
      exportCardAction(this.listQuery, '.filter-container').then(res => {
        if (+res.status === 0) {
          window.open(res.data, '_self')
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
