<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-show="secMore" v-model="oldOperator" class="filter-item" filterable clearable placeholder="请选择旧套餐批次">
        <el-option
          v-for="item in operatorTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.label"/>
      </el-select>
      <el-select v-show="secMore" v-model="newOperator" class="filter-item" filterable clearable placeholder="请选择新套餐批次">
        <el-option
          v-for="item in operatorTypeArr"
          :key="item.value"
          :label="item.label"
          :value="item.label"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.oldCard" clearable style="width: 200px;" class="filter-item" placeholder="请输入原卡号"/>
      <el-input v-show="secMore" v-model.trim="listQuery.newCard" clearable style="width: 200px;" class="filter-item" placeholder="请输入iccid"/>
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />

      <el-select v-show="secMore" v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择状态">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves v-show="secMore" size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-if="device==='mobile'" size="small" type="warning " class="filter-item" @click="secMore=!secMore">{{ secMore?'隐藏':'查找' }}</el-button>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-show="secMore" class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
      <el-button v-permission="['kuyuplat:card:change']" v-waves size="small" type="warning" class="filter-item" @click="action" >批量处理</el-button>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>
      <el-table-column show-overflow-tooltip align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="原卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.oldCard }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="新卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.newCard }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="旧供应商" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.oldOperator }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="新供应商" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.newOperator }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="代理商" min-width="160">
        <template slot-scope="scope">
          <span>{{ aidObject[scope.row.aid] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="旧流量">
        <template slot-scope="scope">
          <span>{{ scope.row.oldSumflow |ToSize }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="新流量">
        <template slot-scope="scope">
          <span>{{ scope.row.newSumflow|ToSize }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'':'success'">{{ scope.row.status==1?'提交中':'处理成功' }}</el-tag>
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
import { searchCardChange } from '@/api/changePackage'
import { toSize } from '@/utils'
import { agentArr, operatorArr } from '@/utils/mapArr'

export default {
  name: 'ChangePackage',
  directives: {
    waves
  },
  filters: {
    ToSize(flow) {
      return toSize((+flow) * 1024)
    }
  },
  data() {
    return {
      secMore: true,
      pickerOptions: this.processDate(),
      oldOperator: '',
      newOperator: '',
      listQuery: {
        oldOperator: '',
        newOperator: '',
        aid: '',
        starttime: '',
        endtime: '',
        oldCard: '',
        newCard: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      },
      status: [
        {
          value: '1',
          label: '提交中'
        },
        {
          value: '2',
          label: '处理成功'
        }
      ],
      agentSelect: [],
      list: [],
      aidObject: [],
      operatorTypeArr: [],
      tableKey: 0,
      total: 0,
      aname: ''
    }
  },
  computed: {
    device() {
      return this.$store.getters.device
    }
  },
  created() {
    if (this.device === 'mobile') {
      this.secMore = false
    }
    this.getList()
    operatorArr((oidSelect, operatorTypeArr) => {
      this.operatorTypeArr = operatorTypeArr
    })
    agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
      this.agentSelect = agentSelect
      this.aidObject = aidObject
    })
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    action() {
      this.$router.push('/business/changePackageAction')
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.oldOperator = ''
      this.newOperator = ''
      this.listQuery = {
        oldOperator: '',
        newOperator: '',
        aid: '',
        starttime: '',
        endtime: '',
        oldCard: '',
        newCard: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList('sec')
    },
    handleDownload() {
      this.Download()
    },
    Download(pageSize) {
      searchCardChange(
        {
          pageNo: 1,
          endtime: this.listQuery.endtime,
          oldcard: this.listQuery.oldcard,
          newCard: this.listQuery.newCard,
          status: this.listQuery.status,
          starttime: this.listQuery.starttime,
          pageSize: pageSize
        }, '.table'
      ).then(res => {
        if (+res.status === 0) {
          const list = res.data.rows
           import('@/vendor/Export2Excel').then(excel => {
             const tHeader = [
               '原卡号',
               '新卡号',
               '旧供应商',
               '新供应商',
               '添加时间',
               '代理商',
               '旧流量',
               '新流量',
               '状态'
             ]
             const filterVal = [
               'oldCard',
               'newCard',
               'oldOperator',
               'newOperator',
               'addtime',
               'aid',
               'oldSumflow',
               'newSumflow',
               'status'
             ]
             const data = this.formatJson(filterVal, list)
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: `异卡换套餐记录${new Date().toLocaleDateString()}`
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
            inputPlaceholder: '请输入导出记录条数',
            inputErrorMessage: '记录条数填写不正确',
            inputValue: 10000,
            inputValidator: function(value) {
              if (/(^[1-9]\d*$)/.test(+value)) {
                return true
              } else {
                return false
              }
            }
          }).then(({ value }) => {
            this.Download(value)
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
            return +v[j] === 1 ? '提交中' : '处理成功'
          } else if (j === 'oldSumflow') {
            return toSize((+v[j]) * 1024)
          } else if (j === 'newSumflow') {
            return toSize((+v[j]) * 1024)
          } else if (j === 'aid') {
            return this.aidObject[+v[j]]
          } else {
            return v[j]
          }
        })
      )
    },
    getList(type) {
      if (this.oldOperator) {
        this.listQuery.oldOperator = this.oldOperator
        this.listQuery.oldOperator = this.listQuery.oldOperator.split('-')[0]
      }
      if (this.newOperator) {
        this.listQuery.newOperator = this.newOperator
        this.listQuery.newOperator = this.listQuery.newOperator.split('-')[0]
      }
      searchCardChange(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
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
