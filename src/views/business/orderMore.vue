<template>
  <div class="app-container">
    <div class="warn-content">
      <a>提示信息!</a>
      <div style="color:#F56C6C">每次批量不要过100张卡</div>
      <div>操作步骤:第一步：输入卡号，格式一行一个</div>
      <div>操作步骤:第二步：选择不同套餐批次</div>
      <div>操作步骤:第三步：选择不同套餐</div>
      <div>操作步骤:第四步：确定订购</div>
      <div style="color:#F56C6C">批量订购为队列任务需要等待一定时间</div>
    </div>
    <div class="filter-container">
      <el-input v-model.trim="card" :autosize="{ minRows: 4, maxRows: 8}" style="margin-top:10px;width:280px;display:block" class="filter-item" clearable placeholder="请填写要订购的卡号，一行一个！" type="textarea"/>
      <el-select v-if="checkPermission(['kuyuplat:packageName:search'])" v-model="operatorid" class="filter-item" filterable clearable placeholder="请选择套餐批次" @change="getPcakage">
        <el-option
          v-for="item in oidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="packageid" class="filter-item selectPackage" filterable clearable placeholder="请选择要订购的套餐">
        <el-option
          v-for="item in packageArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="type" class="filter-item " filterable clearable placeholder="请选择生效类型">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <!-- <el-input-number v-permission="['industry.addpackage.order']" v-model="number" :min="1" :max="12" class="number filter-item" controls-position="right"/> -->
      <!-- <div class="el-select filter-item el-select--medium">
        <el-radio v-model="type" label="1" style="margin-left:10px">普通</el-radio>
        <el-radio v-model="type" label="2" style="margin-left:10px">次月</el-radio>
        <el-radio v-model="type" label="3" style="margin-left:10px">叠加</el-radio>
      </div> -->
      <el-input v-model.trim="remarks" class="filter-item" style="width: 220px;" clearable placeholder="请填写备注！" />
      <el-button v-waves v-permission="['kuyuplat:platform:order']" size="small" type="primary" class="filter-item orderAction" @click="order" >订购</el-button>
      <el-button v-waves v-permission="['kuyuplat:platform:order']" size="small" type="primary" class="filter-item orderAction" @click="order('self')" >循环订购</el-button>
      <el-button v-waves size="small" type="success" class="filter-item " @click="down" >导出</el-button>
      <el-button v-waves size="small" type="danger" class="filter-item " @click="refresh" >清空</el-button>
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
          <span>{{ scope.row.cards }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐列表ID" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.packageId }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐批次" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.oname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="套餐生效类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'success':'danger'">{{ packageEffectMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订购结果" min-width="130">
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
import { operatorArr, typeArr } from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
import { getFlowPackages, platformOrder } from '@/api/package'
import { cardTypeMap, typeMap, packageEffectMap } from '@/utils/mapArr'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'OrderPackageMore',
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
    }
  },
  data() {
    return {
      packageEffectMap,
      card: '',
      operatorid: '',
      oidSelect: [],
      packageid: '',
      number: 1,
      packageArr: '',
      type: '',
      typeArr,
      remarks: '',
      oidObject: {},
      list: []
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    checkPermission,
    refresh() {
      this.card = ''
      this.operatorid = ''
      this.packageid = ''
      this.type = ''
      this.remarks = ''
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
         const tHeader = ['卡号', '套餐列表ID', '套餐批次', '套餐生效类型', '备注', '订购结果', '消息']
         const filterVal = [
           'cards',
           'packageId',
           'oname',
           'type',
           'remarks',
           'status',
           'message'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `循环订购表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'type') {
            return packageEffectMap[v[j]]
          } else if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else {
            return v[j]
          }
        })
      )
    },
    getSelect() {
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    getPcakage(val) {
      this.packageid = ''
      getFlowPackages({ operatorid: val }, '.selectPackage').then(res => {
        const Arr = []
        if (+res.status === 0) {
          const Data = Object.values(res.data)
          for (let index = 0; index < Data.length; index++) {
            const value = `${Data[index].id}`
            var label = `${Data[index].name}  【${cardTypeMap[Data[index].cardType ]} · ${typeMap[Data[index].type ]}】`
            Arr.push({ value, label })
          }
        }
        this.packageArr = Arr
      })
    },
    order(type) {
      if (!this.card) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      if (!this.packageid) {
        this.$notify({
          type: 'error',
          message: '请选择套餐后操作'
        })
        return
      }
      if (!type) {
        const data = {
          cards: Array.from(new Set(this.card.split('\n'))).join(','), remarks: this.remarks, packageId: this.packageid, type: this.type ? this.type : 1, operatorid: this.operatorid
        }
        platformOrder(data, '.filter-container').then(res => {
          this.orderPackageAction(res, data)
        })
      } else {
        const msisdnArr = this.card.split('\n')
        for (const [index, elems] of msisdnArr.entries()) {
          const elem = elems.trim()
          var time = Math.round(index / 10)
          const data = {
            cards: elems.trim(), remarks: this.remarks, packageId: this.packageid, type: this.type ? this.type : 1, operatorid: this.operatorid
          }
          this.list.push(data)
          setTimeout(() => {
            platformOrder(data).then(res => {
              for (const v of this.list) {
                if (v.cards === elem) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, Object.assign(v, {
                    oname: this.oidObject[this.operatorid],
                    remarks: this.remarks, status: res.status, message: res.message
                  }))
                  break
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
    },
    orderPackageAction(res, data) {
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
    }
  }
}
</script>
<style scoped>
.el-dialog__header{
    padding: 0!important;
}
</style>
