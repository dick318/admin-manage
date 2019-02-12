<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="60px">
        <el-form-item label="订单号" style="display:inline-block">
          <el-input v-model.trim="orderID" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要查询的订单号，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="卡号" style="display:inline-block">
          <el-input v-model.trim="cardNo" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要查询的卡号，一行一个！" type="textarea"/>
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
      <el-table-column show-overflow-tooltip align="center" label="查询卡号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.cardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="接入号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="虚拟号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单时间" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="代理商" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.aname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="昵称" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐批次" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.oname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==3?'success':'danger'">{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="订单金额(元)" min-width="105">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
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
import {
  searchOrderAccounts
} from '@/api/order'
import { statusMap } from '@/utils/mapArr'

export default {
  name: 'AmountOrderMore',
  directives: {
    waves
  },
  data() {
    return {
      statusResultMap: {
        0: '成功',
        1: '失败'
      },
      statusMap,
      orderID: '',
      cardNo: '',
      list: []
    }
  },
  methods: {
    refresh() {
      this.orderID = ''
      this.cardNo = ''
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
         const tHeader = ['id', '查询卡号', '订单号', 'iccid', '接入号', '虚拟号',
           '订单时间', '代理商', '昵称',
           '套餐批次', '状态', '订单金额(元)', '结果', '消息']
         const filterVal = [
           'id',
           'cardNo',
           'orderID',
           'iccid',
           'tel',
           'number',
           'addtime',
           'aname',
           'nickname',
           'oname',
           'status',
           'money',
           'statusResult',
           'message'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `余额订单批量查询表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return statusMap[v[j]]
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
      if (!this.orderID && !this.cardNo) {
        this.$notify({
          type: 'error',
          message: '请输入数据后操作'
        })
        return
      }
      const orderIDArr = Array.from(new Set(
        this.orderID ? this.orderID.split('\n') : []
      ))
      const cardNoArr = Array.from(new Set(
        this.cardNo ? this.cardNo.split('\n') : []
      ))
      if (orderIDArr.length > 0) {
        for (const [index, elems] of orderIDArr.entries()) {
          const elem = elems.trim()
          var time = Math.round(index / 10)
          this.list.push({ orderID: elem })
          setTimeout(() => {
            searchOrderAccounts({ orderID: elem }).then(res => {
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
      if (cardNoArr.length > 0) {
        for (const [index, elems] of cardNoArr.entries()) {
          const elem = elems.trim()
          var timeTwo = Math.round(index / 10)
          this.list.push({ cardNo: elem })
          setTimeout(() => {
            searchOrderAccounts({ cardNo: elem }).then(res => {
              if (res.data.rows.length > 0) {
                res.data.rows.map((v, i) => {
                  const row = Object.assign(v, { statusResult: res.status, message: res.message })
                  for (var item = 0; item < this.list.length; item++) {
                    if (this.list[item].cardNo === elem) {
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
                  if (v.cardNo === elem) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, {
                      cardNo: elem, statusResult: res.status, message: res.message
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
                if (v.cardNo === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    cardNo: elem, statusResult: 1, message: '请求失败'
                  })
                  break
                }
              }
            })
          }, 500 * timeTwo * 10)
        }
      }
    }
  }
}
</script>
