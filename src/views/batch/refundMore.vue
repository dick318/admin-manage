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
      <el-table-column show-overflow-tooltip align="center" label="卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订单号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流量详情" align="center" min-width="480">
        <el-table-column show-overflow-tooltip align="center" label="卡状态" min-width="80">
          <template slot-scope="scope">
            <span>{{ cardStatusMap[scope.row.cardStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="卡总流量" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.sumflow | flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="卡已用流量" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.useflow | flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="流量结果" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.flowStatusResult==0?'success':'warning'">{{ statusResultMap[scope.row.flowStatusResult]||'未处理' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="流量消息" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.flowMessage }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="订购记录" align="center" min-width="1070">
        <el-table-column show-overflow-tooltip align="center" label="套餐名" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.packageName }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="套餐开始时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.starttime }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="套餐结束时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.endtime }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="供应商账号" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.operatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订购类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type" :type="scope.row.type==2?'success':'danger'">{{ packageEffectMap[scope.row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订购状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" :type="scope.row.status==2?'success':'danger'">{{ orderStatusMap[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="总流量" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.pSumflow| flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="已用流量" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.pUseflow| flowFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订购结果" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusResultPackage==0?'success':'warning'">{{ statusResultMap[scope.row.statusResultPackage]||'未处理' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订购消息" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.messagePackage }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="订单记录" align="center" min-width="700">
        <el-table-column show-overflow-tooltip align="center" label="操作时间" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.addtime }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="代理商" min-width="80">
          <template slot-scope="scope">
            <span>{{ aidObject[scope.row.aid] }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="金额" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="支付方式" min-width="80">
          <template slot-scope="scope">
            <span>{{ tradeMap[scope.row.tradeType] }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订单状态" min-width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatus" :type="scope.row.orderStatus==3?'success':'danger'">{{ statusMap[scope.row.orderStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订单结果" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusResultOrder==0?'success':'warning'">{{ statusResultMap[scope.row.statusResultOrder]||'未处理' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="订单消息" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.messageOrder }}</span>
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { searchOrders } from '@/api/order'
import { getAddPackage } from '@/api/cardInfo'
import { searchAddPackages } from '@/api/addPackage'
import { cardStatusMap, packageEffectMap, orderStatusMap, statusMap, agentArr, tradeMap } from '@/utils/mapArr'
import { toSize } from '@/utils'

export default {
  name: 'RefundMore',
  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return toSize(+value * 1024)
    }
  },
  data() {
    return {
      statusResultMap: {
        0: '成功',
        1: '失败'
      },
      orderStatusMap,
      cardStatusMap,
      packageEffectMap,
      tradeMap,
      aidObject: '',
      statusMap,
      orderID: '',
      list: [],
      cardFlow: []
    }
  },
  watch: {
    list(value) {
      value.map((v, i) => {
        if (!this.cardFlow.includes(v.card)) {
          this.cardFlow.push(v.cardId)
          const elem = v.cardId
          getAddPackage({ cardId: elem }).then(res => {
            if (res.data.rows.length > 0) {
              res.data.rows.map((v, i) => {
                const row = {
                  sumflow: res.data.cardInfo.sumflow, useflow: res.data.cardInfo.useflow, cardStatus: res.data.cardInfo.cardStatus,
                  flowStatusResult: res.status, flowMessage: res.message
                }
                for (var item = 0; item < this.list.length; item++) {
                  if (this.list[item].msisdn === elem) {
                    if (this.list[item].id) {
                      this.list.push(row)
                    } else {
                      const index = this.list.indexOf(this.list[item])
                      this.list.splice(index, 1, Object.assign(row, this.list[item]))
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
                    sumflow: res.data.cardInfo.sumflow, useflow: res.data.cardInfo.useflow, cardStatus: res.data.cardInfo.cardStatus,
                    flowStatusResult: res.status, flowMessage: res.message
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
        }
      })
    }
  },
  created() {
    agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
      this.aidObject = aidObject
    })
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
         const tHeader = ['卡号', '订单号', '卡状态', '卡总流量', '卡已用流量', '流量结果', '流量消息',
           '套餐名', '套餐开始时间', '套餐结束时间', '供应商账号', '订购类型', '订购状态', '总流量', '已用流量', '订购结果', '订购消息',
           '操作时间', '代理商', '金额', '支付方式', '金额', '订单结果', '订单消息']
         const filterVal = [
           'card',
           'orderID',
           'cardStatus',
           'sumflow',
           'useflow',
           'flowStatusResult',
           'flowMessage',
           'packageName',
           'starttime',
           'endtime',
           'operatorName',
           'type',
           'status',
           'pSumflow',
           'pUseflow',
           'statusResultPackage',
           'messagePackage',
           'addtime',
           'aid',
           'money',
           'tradeType',
           'orderStatus',
           'statusResultOrder',
           'messageOrder'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `退款批量查询表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'cardStatus') {
            return cardStatusMap[v[j]]
          } else if (j === 'useflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'sumflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'type') {
            return packageEffectMap[v[j]]
          } else if (j === 'status') {
            return orderStatusMap[v[j]]
          } else if (j === 'pSumflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'pUseflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'aid') {
            return this.aidObject[v[j]]
          } else if (j === 'tradeType') {
            return tradeMap[v[j]]
          } else if (j === 'orderStatus') {
            return statusMap[v[j]]
          } else if (j === 'flowStatusResult') {
            return this.statusResultMap[v[j]]
          } else if (j === 'statusResultPackage') {
            return this.statusResultMap[v[j]]
          } else if (j === 'statusResultOrder') {
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
          message: '请输入数据后操作'
        })
        return
      }
      const orderIDArr = Array.from(new Set(
        this.orderID ? this.orderID.split('\n') : []
      ))
      for (const [index, elems] of orderIDArr.entries()) {
        const elem = elems.trim()
        var time = Math.round(index / 10)
        this.list.push({ orderID: elem })
        setTimeout(() => {
          searchOrders({ orderID: elem }).then(res => {
            if (res.data.rows.length > 0) {
              res.data.rows.map((v, i) => {
                const row = Object.assign(v, { statusResultOrder: res.status, messageOrder: res.message })
                row.orderStatus = v.status
                delete row.status
                for (var item = 0; item < this.list.length; item++) {
                  if (this.list[item].orderID === elem) {
                    if (this.list[item].id && this.list[item].messageOrder) {
                      this.list.push(row)
                    } else {
                      const index = this.list.indexOf(this.list[item])
                      this.list.splice(index, 1, Object.assign(row, this.list[item]))
                    }
                    break
                  }
                }
              })
            } else {
              for (const v of this.list) {
                if (v.orderID === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1,
                    Object.assign({
                      orderID: elem, statusResultOrder: res.status, messageOrder: res.message
                    }, v))
                }
              }
            }
          }).catch(() => {
            for (const v of this.list) {
              if (v.orderID === elem) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, {
                  orderID: elem, statusResultOrder: 1, messageOrder: '请求失败'
                })
                break
              }
            }
          })
          searchAddPackages({ source: elem }).then(res => {
            if (res.data.rows.length > 0) {
              res.data.rows.map((v, i) => {
                const row = Object.assign(v, { statusResultPackage: res.status, messagePackage: res.message })
                row.pSumflow = v.sumflow
                row.pUseflow = v.useflow
                delete row.sumflow
                delete row.useflow
                delete row.addtime
                for (var item = 0; item < this.list.length; item++) {
                  if (this.list[item].orderID === elem) {
                    if (this.list[item].id && this.list[item].messagePackage) {
                      this.list.push(row)
                    } else {
                      const index = this.list.indexOf(this.list[item])
                      this.list.splice(index, 1, Object.assign(row, this.list[item]))
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
                    orderID: elem, statusResultPackage: res.status, messagePackage: res.message
                  })
                  break
                }
              }
            }
          }).catch(() => {
            for (const v of this.list) {
              if (v.orderID === elem) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, {
                  orderID: elem, statusResultPackage: 1, messagePackage: '请求失败'
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
