<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.addtimeStart"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.addtimeEnd"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>
      <el-select v-model="listQuery.status" class="filter-item" clearable placeholder="请选择处理状态">
        <el-option
          v-for="item in statusArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="operatorType" class="filter-item" collapse-tags multiple clearable placeholder="请选择运营商类型">
        <el-option
          v-for="item in operator_type"
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
      <!-- <el-button v-waves v-permission="['kuyuplat:cardActionException:export']" class="filter-item" size="small" type="warning" @click="handleDownload">Java导出</el-button> -->
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
      <el-table-column align="center" label="限速描述" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.speedValueDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作原因" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" show-overflow-tooltip min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结果描述" show-overflow-tooltip min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作者" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运营商" show-overflow-tooltip min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.operator_type==1?'移动':scope.row.operator_type==2?'电信':scope.row.operator_type==3?'联通':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商账号" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ zidObject[scope.row.zid]?`${zidObject[scope.row.zid]}--${scope.row.zid}`:scope.row.zid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'warning'">{{ scope.row.status==2?'成功':'失败' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { accountsArr, operator_type } from '@/utils/mapArr'
import { findSpeedLimitAction } from '@/api/card'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'QueryException',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      operator_type,
      pickerOptions: this.processDate(),
      list: [],
      zids: [],
      operatorType: [],
      zidObject: {},
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        addtimeStart: '',
        addtimeEnd: '',
        iccid: '',
        tel: '',
        number: '',
        status: '',
        operatorType: '',
        zid: ''
      },
      zidSelect: [],
      statusArr: [
        {
          value: '1',
          label: '未处理'
        },
        {
          value: '2',
          label: '已处理'
        }
      ]
    }
  },
  created() {
    accountsArr((zidSelect, accountsTypeArr, zidObject) => {
      this.zidSelect = zidSelect
      this.zidObject = zidObject
    })
    this.getList()
  },
  methods: {
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.addtimeStart).getTime() > time.getTime()
        }
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        addtimeStart: '',
        addtimeEnd: '',
        iccid: '',
        tel: '',
        number: '',
        status: '',
        operatorType: '',
        zid: ''
      }
      this.zids = []
      this.operatorType = []
      this.getList()
    },
    getList() {
      if (this.zids.length > 0) {
        this.listQuery.zid = this.zids
        this.listQuery.zid = this.listQuery.zid.join(',')
      } else {
        this.listQuery.zid = ''
      }
      if (this.operatorType.length > 0) {
        this.listQuery.operatorType = this.operatorType
        this.listQuery.operatorType = this.listQuery.operatorType.join(',')
      } else {
        this.listQuery.operatorType = ''
      }
      findSpeedLimitAction(this.listQuery, '.table').then(res => {
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
    // handleDownload() {
    //   if (this.zids.length > 0) {
    //     this.listQuery.zids = this.zids
    //     this.listQuery.zids = this.listQuery.zids.join(',')
    //   } else {
    //     this.listQuery.zids = ''
    //   }
    //   exportCardAction(this.listQuery, '.filter-container').then(res => {
    //     if (+res.status === 0) {
    //       window.open(res.data, '_self')
    //     }
    //     this.$notify({
    //       type: +res.status === 0 ? 'success' : 'error',
    //       message: res.message,
    //       duration: 2000
    //     })
    //   })
    // }
  }
}
</script>
