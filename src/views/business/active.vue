<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入活动名称" @clear="handleFilter" />
      <el-select v-model="listQuery.status" class="filter-item" filterable collapse-tags multiple clearable placeholder="请选择活动状态">
        <el-option
          v-for="item in activeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.showFront" class="filter-item" filterable clearable placeholder="请选择前端显示">
        <el-option
          v-for="item in whether"
          :label="item.value=='1'?'显示':'不显示'"
          :key="item.value"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:seckill:add']" class="filter-item" size="small" type="warning " icon="el-icon-plus" @click="jump('/business/activeDetails')" />
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
      <el-table-column align="center" label="活动名称" show-overflow-tooltip min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="宣传图" show-overflow-tooltip >
        <template slot-scope="scope">
          <img :src="scope.row.imgFront" style="width:50px" class="image">
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.info }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="前端显示" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-tag :type="scope.row.showFront==1?'':'warning'">{{ scope.row.showFront|showType }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column align="center" label="倒计时" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-tag :type="scope.row.countdown==1?'':'warning'">{{ scope.row.countdown|showType }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column align="center" label="原价" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="限购单台数量" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.litNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卖出个数" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.sellNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余数量" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-tag :type="scope.row.showNum==1?'':'warning'">{{ scope.row.showNum|showType }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动价格" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.sellPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'warning'">{{ scope.row.status == 1 ? "未开始" : scope.row.status == 2 ? "进行中" : "已结束" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="350px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:seckill:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="jump(`/business/activeDetails?id=${scope.row.id}`)"/>
          <el-button v-permission="['kuyuplat:seckill:update']" type="primary" size="mini" @click="update(scope.row)">数量</el-button>
          <el-button v-permission="['kuyuplat:obtain:find']" type="success" size="mini" @click="jump(`/other/generalize?id=${scope.row.id}`)">查看</el-button>
          <el-button v-permission="['kuyuplat:seckill:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getSeckill, editSeckill, delSeckill } from '@/api/seckill'
import { whether } from '@/utils/mapArr'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Active',
  components: { Pagination },
  directives: {
    waves
  },
  filters: {
    showType(value) {
      return +value === 1 ? '显示' : '不显示'
    }
  },
  data() {
    return {
      whether,
      listQuery: {
        showFront: '',
        status: '',
        name: ''
      },
      status: [],
      activeSelect: [{
        value: 1,
        label: '未开始'
      }, {
        value: 2,
        label: '进行中'
      }, {
        value: 3,
        label: '已结束'
      }],
      list: [],
      tableKey: 0,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    jump(type) {
      this.$router.push(type)
    },
    update(row) {
      this.$prompt('', '输入已卖出个数，并确认', {
        inputValue: row.sellNum
      }).then(({ value }) => {
        editSeckill({ id: row.id, sellNum: value }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.getList()
          }
        })
      }).catch({})
    },
    handleDelete(id) {
      this.$confirm('你确定要删除吗？', '注意！', { type: 'warning' }).then(() => {
        delSeckill({ id }, '.el-message-box').then((res) => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      })
    },

    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.status = []
      this.listQuery = {
        showFront: '',
        status: '',
        name: ''
      }
      this.getList('sec')
    },
    getList(type) {
      if (this.status.length > 0) {
        this.listQuery.status = this.status
        this.listQuery.status = this.listQuery.status.join(',')
      } else {
        this.listQuery.status = ''
      }
      getSeckill(this.listQuery, '.table').then(res => {
        if (res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
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
