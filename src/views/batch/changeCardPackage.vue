<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="6rem">
        <el-form-item label="卡号">
          <el-input v-model.trim="msisdn" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要操作的卡号，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="生效类型">
          <el-select v-model="type" class="filter-item " filterable clearable placeholder="请选择生效类型">
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保留时间">
          <el-select v-model="time" class="filter-item " filterable clearable placeholder="请选择最近几个月套餐">
            <el-option
              v-for="item in timeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          （默认一个月一个套餐）
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model.trim="actionReason" class="filter-item" style="width:180px" clearable placeholder="操作原因"/>
        </el-form-item>
        <el-form-item label="操作">
          <el-button v-waves size="small" type="primary" class="filter-item " @click="action(1)" >改订</el-button>
          <el-button v-waves size="small" type="danger" class="filter-item " @click="action(2)" >退订</el-button>
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
      <el-table-column show-overflow-tooltip align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐列表" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
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
      <el-table-column show-overflow-tooltip align="center" label="套餐开始时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐结束时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作类型" min-width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.actionType==1?'success':'warning'">{{ scope.row.actionType|typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作原因" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.actionReason }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="退订结果" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.unsubscribe }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐生效类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'success':'danger'">{{ packageEffectMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订购结果" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.platformOrder }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import moment from 'moment'
import { unsubscribe, platformOrder } from '@/api/package'
import { getAddPackage } from '@/api/cardInfo'
import { typeArr, packageEffectMap } from '@/utils/mapArr'
import { toSize, getCurrentMonthLast } from '@/utils'
export default {
  name: 'ChangeCardPackage',
  directives: {
    waves
  },
  filters: {
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
    },
    typeFilter(value) {
      if (value === 1) {
        return '改订'
      } else if (value === 2) {
        return '退订'
      } else {
        return '未处理'
      }
    }
  },
  data() {
    return {
      type: '',
      time: '',
      msisdn: '',
      actionReason: '',
      list: [],
      typeArr,
      packageEffectMap,
      timeArr: [{
        value: '1',
        label: '不保留'
      }, {
        value: '2',
        label: '一个月'
      }, {
        value: '3',
        label: '两个月'
      }],
      endTime: '',
      startTime: '',
      add: '',
      base: ''
    }
  },
  methods: {
    refresh() {
      this.msisdn = ''
      this.list = []
    },
    getData() {
      var m = getCurrentMonthLast().getMonth() + 1
      var y = getCurrentMonthLast().getFullYear()
      if (m > 13) {
        y = y + 1
      }
      m = (m < 10 ? '0' + m : m > 13 ? '0' + (m - 13) : m)
      var d = moment(`${y}-${m}`, 'YYYY-MM').daysInMonth()
      this.endTime = `${y}-${m}-${d} 23:59:59`
      this.startTime = `${y}-${m}-01 00:00:00`
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
        const tHeader = ['卡号', '操作类型', '操作原因', '结果', '消息']
        const filterVal = [
          'msisdn',
          'type',
          'actionReason',
          'status',
          'message'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `批量循环停复机表格${new Date().toLocaleDateString()}`,
          autoWidth: this.autoWidth
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else if (j === 'type') {
            return v[j] === 1 ? '停机' : '复机'
          } else {
            return v[j]
          }
        })
      )
    },
    action(type) {
      this.list = []
      this.getData()
      if (!this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      if (type === 1 && !this.type && this.type !== 0) {
        this.$notify({
          type: 'error',
          message: '请输入选择套餐生效时间！'
        })
        return
      }
      if (type === 1 && !this.actionReason) {
        this.$notify({
          type: 'error',
          message: '请输入操作理由！'
        })
        return
      }
      if (type === 2 && !this.time) {
        this.$notify({
          type: 'error',
          message: '请选择保留时间！'
        })
        return
      }

      const msisdnArr = Array.from(new Set(this.msisdn.split('\n')))
      if (msisdnArr.length > 0) {
        for (const [index, elems] of msisdnArr.entries()) {
          const elem = elems.trim()
          var time = Math.round(index / 10)
          this.list.push({ msisdn: elem })
          setTimeout(() => {
            type === 1 ? this.changePackage(elem) : this.getPackageList(elem)
          }, 500 * time * 10)
        }
      }
    },
    unsubscribePackage(row) {
      let index
      for (const v of this.list) {
        if (v.id === row.id) {
          index = this.list.indexOf(v)
          break
        }
      }
      if (+this.time === 1) {
        unsubscribe({ id: row.id }).then(res => {
          if (res.status === 0) {
            row.unsubscribe = '退订成功'
          } else {
            row.unsubscribe = res.message
          }
          this.list.splice(index, 1, row)
        })
      } else if (+this.time === 2) {
        if (Date.parse(row.endtime) === Date.parse(this.endTime) && Date.parse(row.starttime) >= Date.parse(this.startTime)) {
          if (this.base === 1) {
            unsubscribe({ id: row.id }).then(res => {
              if (res.status === 0) {
                row.unsubscribe = '退订成功'
              } else {
                row.unsubscribe = res.message
              }
              this.list.splice(index, 1, row)
            })
          } else {
            this.base = 1
          }
        } else {
          unsubscribe({ id: row.id }).then(res => {
            if (res.status === 0) {
              row.unsubscribe = '退订成功'
            } else {
              row.unsubscribe = res.message
            }
            this.list.splice(index, 1, row)
          })
        }
      } else if (+this.time === 3) {
        if (Date.parse(row.endtime) === Date.parse(this.endTime) && Date.parse(row.starttime) >= Date.parse(this.startTime)) {
          if (this.base === 1) {
            unsubscribe({ id: row.id }).then(res => {
              if (res.status === 0) {
                row.unsubscribe = '退订成功'
              } else {
                row.unsubscribe = res.message
              }
              this.list.splice(index, 1, row)
            })
          } else {
            this.base = 1
          }
        } else {
          if (this.add === 1) {
            unsubscribe({ id: row.id }).then(res => {
              if (res.status === 0) {
                row.unsubscribe = '退订成功'
              } else {
                row.unsubscribe = res.message
              }
              this.list.splice(index, 1, row)
            })
          } else {
            this.add = 1
          }
        }
      }
    },
    getPackageList(elem) {
      getAddPackage({ msisdn: elem }).then(res => {
        if (res.data.rows.length > 0) {
          res.data.rows.map((v, i) => {
            const row = {
              id: v.id, msisdn: elem, sumflow: v.sumflow, useflow: v.useflow, actionType: 2,
              endtime: v.endtime, starttime: v.starttime, packageName: v.packageName, packageId: v.packageid,
              actionReason: this.actionReason
            }
            for (var item = 0; item < this.list.length; item++) {
              if (!this.list[item].id && this.list[item].msisdn === elem) {
                const index = this.list.indexOf(this.list[item])
                this.list.splice(index, 1, row)
                this.unsubscribePackage(row)
                break
              } else {
                this.list.push(row)
                this.unsubscribePackage(row)
                break
              }
            }
          })
        } else {
          for (const v of this.list) {
            if (v.msisdn === elem) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, {
                actionReason: this.actionReason,
                msisdn: elem, unsubscribe: '套餐数量小于0，未执行'
              })
              break
            }
          }
        }
      }).catch(() => {
        for (const v of this.list) {
          if (v.msisdn === elem) {
            if (!v.id && v.id !== 0) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, {
                actionType: 2,
                msisdn: elem, unsubscribe: '请求失败'
              })
              break
            }
          }
        }
      })
    },
    changePackage(elem) {
      getAddPackage({ msisdn: elem }).then(res => {
        if (res.data.rows.length === 1) {
          res.data.rows.map((v, i) => {
            const row = {
              id: v.id, msisdn: elem, sumflow: v.sumflow, useflow: v.useflow, starttime: v.starttime,
              endtime: v.endtime, packageName: v.packageName, packageId: v.packageid,
              actionReason: this.actionReason, actionType: 1
            }
            for (var item = 0; item < this.list.length; item++) {
              if (this.list[item].msisdn === elem) {
                const index = this.list.indexOf(this.list[item])
                this.list.splice(index, 1, row)
                unsubscribe({ id: row.id }).then(res => {
                  if (res.status === 0) {
                    row.unsubscribe = '退订成功'
                    platformOrder({ cards: row.msisdn, actionType: 1, packageId: row.packageId, remarks: this.actionReason }).then(res => {
                      if (res.status === 0) {
                        row.platformOrder = '改订成功'
                      } else {
                        row.unsubscribe = res.message
                      }
                      this.list.splice(index, 1, row)
                    })
                  } else {
                    row.unsubscribe = res.message
                  }
                  this.list.splice(index, 1, row)
                })
                break
              }
            }
          })
        } else {
          for (const v of this.list) {
            if (v.msisdn === elem) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, {
                actionType: 1, actionReason: this.actionReason,
                msisdn: elem, unsubscribe: '套餐数量不为一，未执行', platformOrder: '套餐数量不为一，未执行'
              })
              break
            }
          }
        }
      }).catch(() => {
        for (const v of this.list) {
          if (v.msisdn === elem) {
            if (!v.id && v.id !== 0) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, {
                actionType: 1,
                msisdn: elem, unsubscribe: '请求失败'
              })
              break
            }
          }
        }
      })
    }
  }
}
</script>
