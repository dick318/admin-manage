<template>
  <div
    :card="card"
    :source ="source"
    class="app-container"
  >
    <div v-if="source!='mobile'" class="filter-container">
      <el-input v-model.trim="listQuery.card" class="filter-item cardNo" style="width: 220px;" clearable placeholder="请输入卡号" />
      <el-input v-model.trim="listQuery.serialNumber" class="filter-item" style="width: 220px;" clearable placeholder="请输入流水号" />
      <el-select v-model="listQuery.status" class="filter-item" clearable placeholder="请选择结果">
        <el-option
          v-for="item in packageStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="操作开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="操作结束日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.effectiveStarttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="生效开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.effectiveEndtime"
        :picker-options="SpickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="生效结束日期"
        class="filter-item"
      />
      <el-input v-model.trim="listQuery.source" class="filter-item" style="width: 220px;" clearable placeholder="请输入来源" />
      <el-select v-model="operatorNames" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择供应商账号">
        <el-option
          v-for="item in zidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves size="small" type="primary" class="filter-item secCard" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:export:packageInfo']" size="small" type="danger" class="filter-item" @click="handleDownload">java导出</el-button>
    </div>
    <div v-permission="['kuyuplat:platform:order']" class="filter-container orderPackageContainer">
      <el-select v-model="packageValue" class="filter-item orderPackage" filterable clearable placeholder="请选择要订购的套餐">
        <el-option
          v-for="item in packageArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model.trim="remarks" class="filter-item" style="width: 220px;" clearable placeholder="请填写备注！" />
      <el-select v-model="type" class="filter-item " filterable clearable placeholder="请选择生效类型">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves v-permission="['kuyuplat:platform:order']" size="small" type="primary" class="filter-item orderAction" @click="order" >订购</el-button>
      <el-button v-waves v-permission="['kuyuplat:platform:order','kuyuplat:order:unsubscribe']" size="small" type="primary" class="filter-item " @click="changeOrder" >改购</el-button>
      <el-button v-waves v-permission="['kuyuplat:platform:order']" size="small" type="success" class="filter-item" @click="orderMore">批量订购</el-button>
      <el-button v-waves v-permission="['kuyuplat:packagePrice:search']" class="filter-item" size="small" type="warning" @click="cardPackage(`/business/CardPackage?cardNo=${listQuery.card||''}`)">套餐价格</el-button>
      <!-- TODO -->
      <!-- <el-button v-waves v-permission="['kuyuplat:platform:order','kuyuplat:order:unsubscribe']" size="small" type="danger" class="filter-item" @click="changeMore">批量改购</el-button> -->
      <el-button v-waves v-permission="['kuyuplat:order:unsubscribe']" size="small" type="danger" class="filter-item" @click="unsubscribe">退订</el-button>
      <el-button v-waves v-permission="['kuyuplat:order:unsubscribeForce']" size="small" type="danger" class="filter-item" @click="unsubscribeForce">强制退订</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐名称" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="供应商账号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.operatorName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" show-overflow-tooltip label="来源" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐生效类型" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'success':'danger'">{{ packageEffectMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作者">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="操作时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="开始时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="到期时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果" min-width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'danger'">{{ orderStatusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="消息" show-overflow-toolti>
        <template slot-scope="scope">
          {{ scope.row.result }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结算金额">
        <template slot-scope="scope">
          <span>{{ scope.row.profit }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="订购金额">
        <template slot-scope="scope">
          <span>{{ scope.row.finalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="退订者" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.refundOperator }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="退订时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.refundTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="流水号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { searchAddPackages } from '@/api/addPackage'
import { searchAddFlowPackages, unsubscribe, unsubscribeForce, platformOrder, exportPackageInfo } from '@/api/package'
import { accountsArr, inuseMap, packageEffectMap, typeArr, packageStatusSelect, typeMap, cardTypeMap, orderStatusMap } from '@/utils/mapArr'
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { orderPackage } from '../guide/defineSteps'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'OrderPackage',
  components: { Pagination },
  directives: {
    waves
  },
  filters: {
    filterFun(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    },
    filterType(value) {
      if (value === 1) {
        value = '普通'
      }
      if (value === 2) {
        value = '未生效'
      }
      if (value === 3) {
        value = '叠加'
      }
      return value
    }
  },
  props: {
    card: {
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
      inuseMap,
      orderStatusMap,
      packageEffectMap,
      packageStatusSelect,
      pickerOptions: this.processDate(),
      SpickerOptions: this.SprocessDate(),
      packageArr: [],
      operatorids: [],
      zidSelect: [],
      zids: '',
      remarks: '',
      packageValue: [],
      tableKey: 0,
      list: [],
      total: 0,
      number: 1,
      type: '',
      operatorNames: [],
      selectArr: [],
      refundStatus: '',
      result: [],
      typeArr,
      listQuery: {
        operatorNames: '',
        card: this.$route.query.iccid || this.$route.query.tel,
        serialNumber: '',
        status: '',
        starttime: '',
        endtime: '',
        effectiveStarttime: '',
        effectiveEndtime: '',
        source: this.$route.query.source,
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  created() {
    if (!this.source) {
      this.getList()
    }
    accountsArr((zidSelect) => {
      this.zidSelect = zidSelect
    })
  },
  mounted() {
    this.driver = new Driver({
      opacity: 0.50,
      doneBtnText: '完成', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      stageBackground: '#ffffff', // Background color for the staged behind highlighted element
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步',
      onReset: (Element) => {
        this.$router.replace({
          path: '/redirect/orderPackage'
        })
      } // Called when overlay is about to be cleared
    })
    if (this.$route.query.guide) {
      this.driver.defineSteps(orderPackage)
      this.driver.start()
    }
  },
  methods: {
    handleDownload() {
      this.$confirm('此操作将导出数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          starttime: this.listQuery.starttime,
          endtime: this.listQuery.endtime,
          stime: this.listQuery.effectiveStarttime,
          etime: this.listQuery.effectiveEndtime,
          zid: '',
          source: this.listQuery.source,
          status: this.listQuery.status
        }
        if (this.operatorNames.length > 0) {
          data.operatorNames = this.operatorNames
          data.operatorNames = data.operatorNames.join(',')
        } else {
          data.operatorNames = ''
        }
        exportPackageInfo(data, '.filter-container').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    unsubscribeForce() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      if (this.selectArr.length > 50) {
        this.$message.error('选中数量不能超过50！')
        return false
      }
      this.refundStatus = 'moreForce'
      this.updateDataMore()
    },
    unsubscribe() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      if (this.selectArr.length > 50) {
        this.$message.error('选中数量不能超过50！')
        return false
      }
      this.refundStatus = 'more'
      this.updateDataMore()
    },
    changeOrder() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      if (this.selectArr.length > 50) {
        this.$message.error('选中数量不能超过50！')
        return false
      }
      if (!this.type) {
        this.$message.error('请选择生效类型！')
        return false
      }
      this.result = []
      let flag
      const loading = this.$loading({ target: '.table' })
      this.selectArr.map((v, i) => {
        unsubscribe(
          { id: v.id }).then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            const remarks = `改购${this.packageEffectMap[this.type]}`
            const data = {
              cards: v.card, packageId: v.packageid, type: this.type ? this.type : 1, remarks: `${v.id}${remarks}`
            }
            platformOrder(data).then(res => {
              if (res.status === 0) {
                this.result.push({ id: v.id, source: v.source, card: v.card, status: '改购成功', message: res.message })
              } else {
                flag = true
                this.result.push({ id: v.id, source: v.source, card: v.card, status: '订购失败', message: res.message })
              }
              if (i === this.selectArr.length - 1) {
                loading.close()
                this.getList('sec')
                if (this.selectArr.length > 0 && flag) {
                  this.$confirm(`是否导出该批量操作的结果?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.down()
                  }).catch(() => {})
                }
              }
            })
          } else {
            this.result.push({ id: v.id, source: v.source, card: v.card, status: '退订失败', message: res.message })
            if (i === this.selectArr.length - 1) {
              loading.close()
              this.getList('sec')
              if (this.selectArr.length > 0 && flag) {
                this.$confirm(`是否导出该批量操作的结果?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.down()
                }).catch(() => {})
              }
            }
          }
        })
      })
    },
    updateDataMore() {
      this.$confirm(`此操作将批量退订套餐, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.result = []
        let flag
        const loading = this.$loading({ target: '.table' })
        this.selectArr.map((v, i) => {
          (this.refundStatus === 'more' ? unsubscribe : unsubscribeForce)(
            { id: v.id }, '.el-message-box').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (res.status !== 0) {
              flag = true
            }
            this.result.push({ id: v.id, source: v.source, card: v.card, status: res.status === 0 ? '退订成功' : '退订失败', message: res.message })
          })
          if (i === this.selectArr.length - 1) {
            loading.close()
            this.getList('sec')
            if (this.selectArr.length > 0 && flag) {
              this.$confirm(`是否导出该批量操作的结果?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.down()
              }).catch(() => {})
            }
          }
        })
      }).catch(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    getList(type) {
      if (this.operatorNames.length > 0) {
        this.listQuery.operatorNames = this.operatorNames
        this.listQuery.operatorNames = this.listQuery.operatorNames.join(',')
      } else {
        this.listQuery.operatorNames = ''
      }
      searchAddPackages(Object.assign(this.listQuery, { card: this.card || this.listQuery.card }), '.table').then(res => {
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
      })
    },
    getPackage() {
      if (!this.listQuery.card && !this.card) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后查询'
        })
        return
      }
      searchAddFlowPackages({ cardNo: this.listQuery.card || this.card }, '.orderPackage').then(res => {
        const Arr = []
        if (+res.status === 0) {
          const Data = Object.values(res.data.rows)
          for (let index = 0; index < Data.length; index++) {
            const value = `${Data[index].id},${Data[index].operatorid}`
            var label = `${Data[index].name}  【${cardTypeMap[Data[index].cardType ]} · ${typeMap[Data[index].type ]}】`
            Arr.push({ value, label })
          }
        }
        this.packageArr = Arr
      })
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    SprocessDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.effectiveStarttime).getTime() > time.getTime()
        }
      }
    },
    handleFilter() {
      this.packageid = ''
      this.listQuery.pageNo = 1
      this.getList()
      if (this.listQuery.card || this.card) {
        this.getPackage()
      }
    },

    handleRefresh() {
      this.listQuery = {
        card: '',
        serialNumber: '',
        status: '',
        starttime: '',
        endtime: '',
        effectiveStarttime: '',
        effectiveEndtime: '',
        source: '',
        pageNo: 1,
        pageSize: 10,
        operatorNames: ''
      }
      this.operatorNames = []
      this.packageArr = []
      this.type = ''
      this.remarks = ''
      this.getList('sec')
    },
    order(type) {
      if (!this.listQuery.card && !this.card) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      if (!this.packageValue) {
        this.$notify({
          type: 'error',
          message: '请选择套餐后操作'
        })
        return
      }
      const packageId = this.packageValue.split(',')[0]
      const operatorid = this.packageValue.split(',')[1]
      const data = {
        cards: this.listQuery.card || this.card, packageId, operatorid, type: this.type ? this.type : 1
      }
      platformOrder(data, '.orderPackageContainer').then(res => {
        this.orderPackageAction(res, data, type)
      })
    },
    down() {
       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['id', '来源', '卡号', '结果', '消息']
         const filterVal = [
           'id',
           'source',
           'card',
           'status',
           'message'
         ]
         const data = this.formatJson(filterVal, this.result)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `循环操作结果表格${new Date().toLocaleDateString()}`,
           autoWidth: this.autoWidth
         })
       })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    orderPackageAction(res, data, type) {
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
      if (+res.status === 0) {
        this.getList('sec')
      }
    },
    changeMore() {
      this.$router.push('/batch/ChangeCardPackage')
    },
    orderMore() {
      this.$router.push('/business/orderPackageMore')
    },
    cardPackage(type) {
      this.$router.push(type)
    }
  }
}
</script>
<style scoped>
.el-dialog__header{
    padding: 0!important;
}
</style>

