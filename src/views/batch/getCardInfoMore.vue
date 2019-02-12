<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="45px">
        <el-form-item label="卡号" style="display:inline-block">
          <el-input v-model.trim="msisdn" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要操作的卡号，一行一个！" type="textarea"/>
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
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" type="text">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="查询卡号" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" type="text">{{ scope.row.msisdn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="iccid" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" type="text">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="接入号" show-overflow-tooltip min-width="115">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="虚拟号" show-overflow-tooltip min-width="115">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡片余额" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer">{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已用流量" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.useflow| flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总流量" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sumflow| flowFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卡状态" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.cardStatus==1?'':scope.row.cardStatus==2?'success':'warning'">
            {{ scope.row.cardStatus| cardStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生命周期" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.lifeCycle==1||scope.row.lifeCycle==2?'':scope.row.lifeCycle==3?'success':'warning'">{{ lifeCycleMap[scope.row.lifeCycle] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.realStatus==1?'danger':'success'">{{ scope.row.realStatus==1?'未认证':scope.row.realStatus==2?'认证':'' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运营商类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operatorType==1?'移动':scope.row.operatorType==2?'电信':scope.row.operatorType==3?'联通':'' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理商名称" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.fid?aidObject[scope.row.fid]:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="基本套餐" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐批次" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid]?`${oidObject[scope.row.operatorid]}--${scope.row.operatorid}`:scope.row.operatorid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡片分类" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ cardTypeMap[scope.row.cardType] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐分类" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.type |typeMapFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商账号" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ zidObject[scope.row.zid]?`${zidObject[scope.row.zid]}--${scope.row.zid}`:scope.row.zid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==0?'success':'warning'">{{ scope.row.status|statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="消息">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getCard } from '@/api/card'
import { toSize } from '@/utils'
import { cardTypeMap, lifeCycleMap, accountsArr, cardStatusMap, typeMap,
  agentArr, operatorArr } from '@/utils/mapArr'
export default {
  name: 'GetCardInfoMore',
  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return toSize(+value * 1024)
    },
    typeMapFilter(value) {
      return typeMap[value]
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
    cardStatusFilter(card_status) {
      return cardStatusMap[card_status] ? cardStatusMap[card_status] : '未知状态'
    }
  },
  data() {
    return {
      cardTypeMap,
      lifeCycleMap,
      cardStatusMap,
      typeMap,
      zidObject: {},
      oidObject: {},
      aidObject: {},
      msisdn: '',
      list: []
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    getSelect() {
      accountsArr((zidSelect, accountsTypeArr, zidObject) => {
        this.zidObject = zidObject
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidObject = oidObject
      })
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
        this.aidObject = aidObject
      })
    },
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
        const tHeader = [
          'id',
          '查询卡号',
          'iccid',
          '接入号',
          '虚拟号',
          '卡片余额（元）',
          '已用流量',
          '总流量',
          '卡状态',
          '生命周期',
          '实名状态',
          '运营商类型',
          '代理商名称',
          '基本套餐',
          '套餐批次',
          '卡片分类',
          '套餐分类',
          '供应商账号',
          '备注',
          '添加时间',
          '结束时间', '结果', '消息'
        ]
        const filterVal = [
          'id',
          'msisdn',
          'iccid',
          'tel',
          'number',
          'amount',
          'useflow',
          'sumflow',
          'cardStatus',
          'lifeCycle',
          'realStatus',
          'operatorType',
          'fid',
          'pname',
          'operatorid',
          'cardType',
          'type',
          'zid',
          'remarks',
          'addtime',
          'endtime',
          'status',
          'message'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `批量查询卡片信息${new Date().toLocaleDateString()}`
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'cardStatus') {
            return cardStatusMap[v[j]]
          } else if (j === 'realStatus') {
            return +v[j] === 1 ? '未认证' : '认证'
          } else if (j === 'operatorType') {
            return +v[j] === 1 ? '移动' : +v[j] === 2 ? '电信' : '联通'
          } else if (j === 'lifeCycle') {
            return this.lifeCycleMap[+v[j]] || +v[j]
          } else if (j === 'operatorid') {
            return this.oidObject[+v[j]] || +v[j]
          } else if (j === 'cardType') {
            return this.cardTypeMap[+v[j]] || +v[j]
          } else if (j === 'type') {
            return this.typeMap[+v[j]] || +v[j]
          } else if (j === 'zid') {
            return this.zidObject[+v[j]] || +v[j]
          } else if (j === 'useflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'sumflow') {
            return toSize(+v[j] * 1024)
          } else if (j === 'fid') {
            return this.aidObject[+v[j]]
          } else if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else {
            return v[j]
          }
        })
      )
    },
    action(type) {
      this.list = []
      if (!this.msisdn) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
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
            getCard({ msisdn: elem }).then(res => {
              if (res.data.rows.length > 0) {
                res.data.rows.map((v, i) => {
                  const row = Object.assign(v, { msisdn: elem, status: res.status, message: res.message })
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
                      msisdn: elem, status: res.status, message: res.message
                    })
                    break
                  }
                }
              }
            }).catch(() => {
              for (const v of this.list) {
                if (v.msisdn === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    msisdn: elem, status: 1, message: '请求失败'
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
}
</script>
