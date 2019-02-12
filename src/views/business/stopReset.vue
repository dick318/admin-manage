<template>
  <div
    :msisdn="msisdn"
    source ="mobile"
    class="app-container"
  >
    <div class="filter-container">
      <el-input v-if="source!='mobile'" v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID" @change="handleChange"/>
      <el-input v-if="source!='mobile'" v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号" @change="handleChange"/>
      <el-button v-waves v-if="source!='mobile'" size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-if="source!='mobile'" size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:card:changeCardStatus']" v-waves size="small" type="danger" class="filter-item" @click="stop" >停机</el-button>
      <el-button v-permission="['kuyuplat:card:changeCardStatus']" v-waves size="small" type="success" class="filter-item" @click="reset">复机</el-button>
      <el-button v-permission="['kuyuplat:card:superChangeCardStatus']" v-waves size="small" type="danger" class="filter-item" @click="forceStop">强制停机</el-button>
      <el-button v-permission="['kuyuplat:card:superChangeCardStatus']" v-waves size="small" type="success" class="filter-item" @click="forceReset">强制复机</el-button>
    </div>
    <p v-if="cardStatus" class="warn-content cardStatus" style="margin : 0">
      <span>
        卡状态：<a>{{ cardStatus }}</a>
      </span>
    </p>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row>

      <el-table-column show-overflow-tooltip align="center" label="卡号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作者" width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作类型" width="125">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==1?'danger':'success'">{{ scope.row.type==1?'关机':'开机' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态" width="125">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'danger':'success'">{{ scope.row.status==1?'失败':'成功' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" show-overflow-tooltip label="来源" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" show-overflow-tooltip label="备注" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" show-overflow-tooltip label="返回内容" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
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
import { getCardSimstate } from '@/api/stopReset'
import { queryCardStatus, changeCardStatus, superChangeCardStatus } from '@/api/cardInfo'
import { cardStatusMap } from '@/utils/mapArr'
export default {
  name: 'StopReset',
  directives: {
    waves
  },
  filters: {
    filterFun: function(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    }
  },
  props: {
    // iccid: {
    //   type: String,
    //   default: ''
    // },
    // tel: {
    //   type: String,
    //   default: ''
    // },
    msisdn: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      total: null,
      tableKey: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        tel: this.$route.query.tel,
        iccid: this.$route.query.iccid,
        msisdn: this.$route.query.msisdn
      },
      cardStatus: '',
      sumflow: '',
      useflow: '',
      restflow: '',
      listLoding: true
    }
  },
  created() {
    if (!this.source) {
      this.getList()
    }
    if (this.listQuery.tel || this.listQuery.iccid || this.msisdn) {
      this.getCardInfo()
    }
  },
  methods: {
    handleChange() {
      this.cardStatus = ''
    },
    getList(type) {
      getCardSimstate(Object.assign(this.listQuery, { msisdn: this.msisdn }), '.table').then(res => {
        this.listLoding = false
        if (type === 'sec') {
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
      this.getList('sec')
      this.getCardInfo()
    },
    handleRefresh() {
      this.cardStatus = ''
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        tel: '',
        iccid: '',
        msisdn: ''
      }
      this.list = []
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    getCardInfo() {
      if (!this.listQuery.iccid && !this.listQuery.tel && !this.msisdn) {
        return
      }
      this.cardStatus = '加载中'
      setTimeout(() => {
        queryCardStatus({ method: 'queryStatus', judge: 3, iccid: this.listQuery.iccid, tel: this.listQuery.tel, msisdn: this.msisdn }).then(res => {
          if (+res.status === 0) {
            const data = JSON.parse(res.data)
            this.cardStatus = cardStatusMap[data.statusCode] || data.statusDesc
          } else {
            this.cardStatus = ''
          }
        })
      }, 100)
    },
    changeStuts(type) {
      if (!this.listQuery.iccid && !this.listQuery.tel && !this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      changeCardStatus({ iccid: this.listQuery.iccid, tel: this.listQuery.tel, msisdn: this.msisdn, type }, '.filter-container').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          this.getCardInfo()
        }
        this.getList()
      })
    },
    superchangeStuts(type) {
      if (!this.listQuery.iccid && !this.listQuery.tel && !this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      superChangeCardStatus({ iccid: this.listQuery.iccid, tel: this.listQuery.tel, msisdn: this.msisdn, type }, '.filter-container').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          this.getCardInfo()
        }
        this.getList()
      })
    },
    stop() {
      this.changeStuts(1)
    },
    reset() {
      this.changeStuts(2)
    },
    forceStop() {
      this.superchangeStuts(7)
    },
    forceReset() {
      this.superchangeStuts(8)
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
