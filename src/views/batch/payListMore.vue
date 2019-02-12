<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="60px">
        <el-form-item label="订单号" style="display:inline-block">
          <el-input v-model.trim="orderID" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要查询的订单号，一行一个！" type="textarea"/>
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
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="昵称" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'success':scope.row.status==2?'danger':'warning'">{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="订单类型" min-width="150">
        <template slot-scope="scope">
          <span>{{ orderTypeMap[scope.row.orderType] }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="支付渠道" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.payType==1?'success':''">{{ payTypeMap[scope.row.payType] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusResult==0?'success':'warning'">{{ statusResultMap[scope.row.statusResult]||'未处理' }}</el-tag>
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
import { searchWeipayList } from '@/api/payList'
import { statusMap, orderTypeMap } from '@/utils/mapArr'

export default {
  name: 'PayListMore',
  directives: {
    waves
  },
  data() {
    return {
      payTypeMap: {
        1: '微信',
        2: '支付宝'
      },
      statusResultMap: {
        0: '成功',
        1: '失败'
      },
      orderTypeMap,
      statusMap,
      orderID: '',
      list: []
    }
  },
  methods: {
    refresh() {
      this.orderID = ''
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
         const tHeader = ['id', '昵称', '订单号', '订单金额(元)', '订单时间', '状态',
           '订单类型', '支付渠道', '结果', '消息']
         const filterVal = [
           'id',
           'nickname',
           'orderID',
           'money',
           'addtime',
           'status',
           'orderType',
           'payType',
           'statusResult',
           'message'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `微信支付批量查询表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return statusMap[v[j]]
          } else if (j === 'orderType') {
            return orderTypeMap[v[j]]
          } else if (j === 'payType') {
            return this.payTypeMap[v[j]]
          } else if (j === 'statusResult') {
            return this.statusResultMap[v[j]]
          } else {
            return v[j]
          }
        })
      )
    },
    action() {
      this.list = []
      if (!this.orderID) {
        this.$notify({
          type: 'error',
          message: '请输入订单后操作'
        })
        return
      }
      const orderIDArr = Array.from(new Set(this.orderID.split('\n')))
      for (const [index, elems] of orderIDArr.entries()) {
        const elem = elems.trim()
        var time = Math.round(index / 10)
        this.list.push({ orderID: elem })
        setTimeout(() => {
          searchWeipayList({ orderID: elem }).then(res => {
            if (res.data.rows.length > 0) {
              res.data.rows.map((v, i) => {
                const row = Object.assign(v, { statusResult: res.status, message: res.message })
                for (var item = 0; item < this.list.length; item++) {
                  if (this.list[item].orderID === elem) {
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
                if (v.orderID === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    orderID: elem, statusResult: res.status, message: res.message
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
          }).catch(() => {
            for (const v of this.list) {
              if (v.orderID === elem) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, {
                  orderID: elem, statusResult: 1, message: '请求失败'
                })
                break
              }
            }
          })
        }, 500 * time * 10)
      }
    }
  }
}
</script>
