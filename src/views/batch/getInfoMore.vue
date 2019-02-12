<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="45px">
        <el-form-item label="卡号" style="display:inline-block">
          <el-input v-model.trim="msisdn" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要查询的卡，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button v-waves size="small" type="primary" class="filter-item " @click="action" >操作</el-button>
          <el-button v-waves size="small" type="success" class="filter-item " @click="down" >导出</el-button>
          <el-button v-waves size="small" type="danger" class="filter-item " @click="refresh" >清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      id="table"
      :data="list"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>
      <el-table-column show-overflow-tooltip align="center" label="卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.msisdn }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐id" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="总流量" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.sumflow| flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="已用流量" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.useflow | flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="到期时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="单独断网">
        <template slot-scope="scope">
          <span>{{ scope.row.single|whetherFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="达量断网">
        <template slot-scope="scope">
          <span>{{ scope.row.reach| whetherFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="机卡绑定">
        <template slot-scope="scope">
          <span>{{ scope.row.record|whetherFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="阈值" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.maxflow | flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="150">
        <template slot-scope="scope">
          <span>{{ cardStatusMap[scope.row.cardStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐列表" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐开始时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.packageStarttime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐结束时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.packageEndtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==0?'success':'warning'">{{ scope.row.status|statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="消息" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getAddPackage } from '@/api/cardInfo'
import { cardStatusMap } from '@/utils/mapArr'

import { toSize } from '@/utils'

export default {
  name: 'GetInfoMore',
  directives: {
    waves
  },
  filters: {
    whetherFilter(value) {
      if (value && +value === 1) {
        return '是'
      } else {
        return '否'
      }
    },
    statusFilter(value) {
      if (value === 0) {
        return '成功'
      } else if (value === 1) {
        return '失败'
      } else {
        return '未处理'
      }
    },
    flowFilter(value) {
      return toSize(+value * 1024)
    }
  },
  data() {
    return {
      cardStatusMap,
      msisdn: '',
      list: []
    }
  },
  methods: {
    refresh() {
      this.msisdn = ''
      this.list = []
    },
    down() {
      if (this.list.length === 0) {
        this.$notify({
          type: 'error',
          message: '暂无数据导出！'
        })
        return false
      }
       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['id', '卡号', '总流量', '已用流量', '到期时间', '单独断网',
           '达量断网', '机卡绑定', '阈值', '状态', '套餐列表', '套餐开始时间', '套餐结束时间', '结果', '消息']
         const filterVal = [
           'id',
           'msisdn',
           'sumflow',
           'useflow',
           'endtime',
           'single',
           'reach',
           'record',
           'maxflow',
           'cardStatus',
           'packageName',
           'packageStarttime',
           'packageEndtime',
           'status',
           'message'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `批量流量表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'sumflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'useflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'single') {
            return v[j] === 1 ? '是' : '否'
          } else if (j === 'reach') {
            return v[j] === 1 ? '是' : '否'
          } else if (j === 'record') {
            return v[j] === 1 ? '是' : '否'
          } else if (j === 'maxflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'cardStatus') {
            return cardStatusMap[v[j]]
          } else if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else {
            return v[j]
          }
        })
      )
    },
    action() {
      this.list = []
      if (!this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      const msisdnArr = this.msisdn.split('\n')
      for (const [index, elems] of msisdnArr.entries()) {
        const elem = elems.trim()
        var time = Math.round(index / 10)
        this.list.push({ msisdn: elem })
        setTimeout(() => {
          getAddPackage({ msisdn: elem }).then(res => {
            if (res.data.rows.length > 0) {
              res.data.rows.map((v, i) => {
                const row = {
                  id: v.id, msisdn: elem, sumflow: res.data.cardInfo.sumflow, useflow: res.data.cardInfo.useflow,
                  endtime: res.data.cardInfo.endtime, single: res.data.cardInfo.single, reach: res.data.cardInfo.reach,
                  record: res.data.cardInfo.record, maxflow: res.data.cardInfo.maxflow, cardStatus: res.data.cardInfo.cardStatus,
                  packageName: v.packageName, packageStarttime: v.starttime, packageEndtime: v.endtime,
                  status: res.status, message: res.message
                }
                for (var item = 0; item < this.list.length; item++) {
                  if (this.list[item].msisdn === elem) {
                    if (this.list[item].id) {
                      this.list.push(row)
                    } else {
                      const index = this.list.indexOf(this.list[item])
                      this.list.splice(index, 1, row)
                    }
                    break
                  }
                }
              })
            } else {
              for (const v of this.list) {
                if (v.msisdn === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    msisdn: elem, id: index, sumflow: res.data.cardInfo.sumflow, useflow: res.data.cardInfo.useflow,
                    endtime: res.data.cardInfo.endtime, single: res.data.cardInfo.single, reach: res.data.cardInfo.reach,
                    record: res.data.cardInfo.record, maxflow: res.data.cardInfo.maxflow, cardStatus: res.data.cardInfo.cardStatus,
                    status: res.status, message: res.message,
                    duration: 2000
                  })
                  break
                }
              }
            }
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
          })
        }, 500 * time * 10)
      }
    }
  }
}
</script>
