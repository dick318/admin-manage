<template>
  <div
    :msisdn="msisdn"
    :source="source"
    class="app-container  calendar-list-container">
    <div
      class="filter-container">
      <el-input
        v-if="source!='mobile'"
        v-model.trim="listQuery.iccid"
        class="filter-item"
        style="width:220px"
        clearable
        placeholder="请输入ICCID"
        @clear="clear"/>
      <el-input
        v-if="source!='mobile'"
        v-model.trim="listQuery.tel"
        class="filter-item"
        style="width:220px"
        clearable
        placeholder="请输入接入号"
        @clear="clear"/>
      <el-input
        v-if="source!='mobile'"
        v-model.trim="listQuery.number"
        class="filter-item"
        style="width:220px"
        clearable
        placeholder="请输入虚拟号"
        @clear="clear"/>
      <el-button
        v-waves
        v-if="source!='mobile'"
        size="small"
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      />
      <el-button
        v-waves
        v-if="source!='mobile'"
        size="small"
        type="primary"
        class="filter-item"
        icon="el-icon-refresh"
        @click="handleRefresh"/>
      <el-button
        v-waves
        v-permission="['kuyuplat:flowdetail:find']"
        size="small"
        type="success"
        class="filter-item"
        @click="cardJump(`/card/flowDetail?card=${listQuery.iccid|| msisdn ||''}`)">明细</el-button>
      <el-button
        v-waves
        v-permission="['kuyuplat:card:delCache']"
        size="small"
        type="warning"
        class="filter-item"
        @click="handleDelCache">清缓存</el-button>
      <el-button
        v-waves
        v-permission="['kuyuplat:order:unsubscribe']"
        size="small"
        type="danger"
        class="filter-item"
        @click="unsubscribe">退订</el-button>
      <el-button
        v-waves
        v-permission="['kuyuplat:order:unsubscribeForce']"
        size="small"
        type="danger"
        class="filter-item"
        @click="unsubscribeForce">强制退订</el-button>
      <!-- <el-button
        v-waves
        v-permission="['common']"
        size="small"
        type="danger"
        class="filter-item"
        @click="speed">限速</el-button> -->
      <el-button
        v-waves
        v-permission="['kuyuplat:card:imeiReRecord']"
        size="small"
        type="success"
        class="filter-item"
        @click="unbind">解绑</el-button>
      <el-button
        v-waves
        v-permission="['kuyuplat:card:singleCutNet']"
        size="small"
        type="success"
        class="filter-item"
        @click="cutNet(1)">断网</el-button>
      <el-button
        v-waves
        v-permission="['kuyuplat:card:singleCutNet']"
        size="small"
        type="success"
        class="filter-item"
        @click="cutNet(2)">复网</el-button>

      <el-button
        v-waves
        v-permission="['kuyuplat:card:offNetAction']"
        size="small"
        type="success"
        class="filter-item"
        @click="offNet">阈值</el-button>
    </div>
    <p
      v-loading="loading"
      class="warn-content">
      <span>
        总流量:<a>{{ sumflow }}</a>
      </span>
      <span>
        剩余总流量:<a>{{ restflow }}</a>
      </span>
      <span>
        已用流量:<a>{{ useflow }}</a>
      </span>
      <span>
        <router-link :to="`/business/stopReset?iccid=${listQuery.iccid||''}&tel=${listQuery.tel||''}&number=${listQuery.number||''}`" style="color: #E6A23C;">
          卡状态:<a>{{ cardstatus }}</a>
        </router-link>
      </span>
    </p>
    <p
      v-loading="loading"
      class="warn-content">
      <span v-if="reach">
        达量断网:<a>{{ reach }}</a>
      </span>
      <span v-if="maxflow">
        断网阈值:<a>{{ maxflow }}</a>
      </span>
      <span>
        单独断网:<a>{{ single }}</a>
      </span>
      <span>
        机卡绑定:<a>{{ record }}</a>
      </span>
    </p>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list.slice((listQuery.pageNo-1)*listQuery.pageSize,listQuery.pageNo*listQuery.pageSize)"
      :key="tableKey"
      :fit="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="套餐ID">
        <template slot-scope="scope">
          <span>{{ scope.row.packageid }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="套餐列表"
        min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="总流量"
        min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.sumflow| flowFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="已用流量"
        min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.useflow | flowFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="剩余流量"
        min-width="110">
        <template slot-scope="scope">
          <span>{{ (scope.row.sumflow-scope.row.useflow)| flowFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="开始时间"
        min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="到期时间"
        min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:order:unsubscribe']" type="danger" size="mini" @click="handleDelete(scope.row)">退订</el-button>
          <el-button v-permission="['kuyuplat:order:unsubscribeForce']" type="danger" size="mini" @click="handleDelete(scope.row,'force')">强制退订</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="达量断网">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        class="dialog"
        label-position="right"
        label-width="12rem">
        <el-form-item label="请选择阈值类型" prop="type">
          <el-radio v-model="temp.type" label="1" style="width:90px">总使用量</el-radio>
          <el-radio v-model="temp.type" label="2" style="width:90px">套餐外使用量</el-radio>
        </el-form-item>
        <el-form-item label="请选择操作类型" prop="action">
          <el-radio v-model="temp.action" label="1" style="width:60px">新增</el-radio>
          <el-radio v-model="temp.action" label="2" style="width:60px">修改</el-radio>
          <el-radio v-model="temp.action" label="3" style="width:60px">取消</el-radio>
        </el-form-item>
        <el-form-item label="请输入阈值（单位：M）" prop="quota">
          <el-input
            v-model.trim="temp.quota"
            class="filter-item"
            style="width:220px"
            clearable
            placeholder="请输入阈值（单位：M）"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
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
import { getAddPackage, delCache, singleCutNet, offNetAction } from '@/api/cardInfo'
import { getCard } from '@/api/card'
import { unsubscribe, unsubscribeForce } from '@/api/package'
import { imeiReRecord } from '@/api/unbind'
import {
  cardStatusMap,
  cuccSpeedSelect,
  ctccSpeedSelect
} from '@/utils/mapArr'
import waves from '@/directive/waves' // 水波纹指令
import { toSize } from '@/utils'
export default {
  name: 'FlowInfo',
  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return toSize(+value * 1024)
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
    // number: {
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
      cuccSpeedSelect,
      ctccSpeedSelect,
      tableKey: 0,
      list: [],
      total: null,
      loading: false,
      selectArr: [],
      result: [],
      refundStatus: '',
      dialogFormVisible: false,
      listQuery: {
        iccid: this.$route.query.iccid,
        tel: this.$route.query.tel,
        number: this.$route.query.number,
        pageNo: 1,
        pageSize: 10
      },
      temp: {},
      rules: {
        target: [{ required: true, message: '请选择限速编码', trigger: 'blur' }]
      },
      reach: '',
      maxflow: '',
      single: '',
      record: '',
      sumflow: '',
      restflow: '',
      useflow: '',
      cardstatus: ''
    }
  },
  created() {
    if (!this.source) {
      this.getList()
    }
  },
  methods: {
    offNet() {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.list = []
        this.total = 0
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    cutNet(type) {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.list = []
        this.total = 0
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.$confirm(`此操作将进行${type === 1 ? '断网' : '复网'}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          singleCutNet(Object.assign(this.listQuery, { msisdn: this.msisdn, type }), '.filter-container').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    unbind() {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.list = []
        this.total = 0
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      getCard(Object.assign(this.listQuery, { msisdn: this.msisdn }), '.filter-container').then(res => {
        if (res.status === 0 && res.data.total === 1) {
          this.temp = Object.assign({}, res.data.rows[0]) // copy obj
          if (+this.temp.operatorType !== 2) {
            this.$notify({
              type: 'error',
              message: '解绑功能仅支持电信卡！'
            })
            return false
          } else {
            this.$confirm('此操作将进行机卡解绑, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                imeiReRecord({
                  cardId: this.temp.id
                }).then(res => {
                  this.$notify({
                    type: +res.status === 0 ? 'success' : 'error',
                    message: res.message,
                    duration: 2000
                  })
                })
              })
              .catch(() => {
                this.$notify({
                  type: 'info',
                  message: '已取消'
                })
              })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '获取卡片信息失败，请检查查询条件！'
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign(this.temp, { iccid: this.listQuery.iccid, tel: this.listQuery.tel, msisdn: this.tel })
          offNetAction(
            tempData,
            '.el-dialog__footer'
          ).then(res => {
            this.$message({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message
            })
            if (res.status === 0) {
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    // speed() {
    //   if (
    //     !this.listQuery.iccid &&
    //     !this.listQuery.tel &&
    //     !this.listQuery.number
    //   ) {
    //     this.list = []
    //     this.total = 0
    //     this.$message({
    //       type: 'error',
    //       message: '请输入卡号'
    //     })
    //     return false
    //   }
    //   getCard(this.listQuery, '.filter-container').then(res => {
    //     if (res.status === 0 && res.data.total === 1) {
    //       this.getList()
    //       this.temp = Object.assign({}, res.data.rows[0]) // copy obj
    //       this.dialogFormVisible = true
    //       this.$nextTick(() => {
    //         this.$refs['dataForm'].clearValidate()
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '获取卡片信息失败，请检查查询条件！'
    //       })
    //     }
    //   })
    // },
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
    handleDelete(row, type) {
      this.$confirm('此操作将退订该套餐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          (type ? unsubscribeForce : unsubscribe)({ id: row.id }).then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (+res.status === 0) {
              for (const v of this.list) {
                if (v.id === row.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1)
                  break
                }
              }
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    updateDataMore() {
      this.$confirm(`此操作将批量退订套餐, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.result = []
          let flag = ''
          const loading = this.$loading({ target: '.table' })
          this.selectArr.map((v, i) => {
            (this.refundStatus === 'more' ? unsubscribe : unsubscribeForce)(
              { id: v.id },
              '.el-message-box'
            ).then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              this.result.push({
                id: v.id,
                source: v.source,
                card: v.card,
                status: res.status,
                message: res.message
              })
              if (res.status === 0) {
                for (const value of this.list) {
                  if (value.id === v.id) {
                    const index = this.list.indexOf(value)
                    this.list.splice(index, 1)
                    break
                  }
                }
              } else {
                flag = true
              }
            })
            if (i === this.selectArr.length - 1) {
              loading.close()
              if (this.selectArr.length > 0 && flag) {
                this.$confirm(`是否导出该批量操作的结果?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(() => {
                    this.down()
                  })
                  .catch(() => {})
              }
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    down() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '订单号', '卡号', '结果', '消息']
        const filterVal = ['id', 'source', 'card', 'status', 'message']
        const data = this.formatJson(filterVal, this.result)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `循环套餐退订结果表格${new Date().toLocaleDateString()}`,
          autoWidth: this.autoWidth
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else {
            return v[j]
          }
        })
      )
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    handleDelCache() {
      if (!this.listQuery.iccid && !this.listQuery.tel) {
        this.list = []
        this.total = 0
        this.$notify({
          type: 'error',
          message: '请输入ICID或者接入号，不支持虚拟号！'
        })
        return false
      }
      this.$confirm('此操作将清除卡片缓存信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCache(
            { iccid: this.listQuery.iccid, tel: this.listQuery.tel },
            '.app-container'
          ).then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (+res.status === 0) {
              this.getList('sec')
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    cardJump(type) {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.$router.push(type)
    },
    handleRefresh() {
      this.listQuery = {
        iccid: '',
        tel: '',
        number: '',
        pageNo: 1,
        pageSize: 10
      }
      this.clear()
    },
    clear() {
      this.sumflow = ''
      this.restflow = ''
      this.useflow = ''
      this.cardstatus = ''
      this.reach = ''
      this.maxflow = ''
      this.single = ''
      this.record = ''
      this.list = []
      this.total = 0
    },
    handleFilter() {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.list = []
        this.total = 0
        this.$notify({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
    },
    getList(type) {
      if (
        !this.listQuery.iccid &&
        !this.listQuery.tel &&
        !this.listQuery.number &&
        !this.msisdn
      ) {
        this.list = []
        this.total = 0
        return false
      }
      this.loading = true
      getAddPackage(Object.assign(this.listQuery, { msisdn: this.msisdn }), '.table')
        .then(res => {
          this.loading = false
          if (!type) {
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
          this.cardstatus = cardStatusMap[res.data.cardInfo.cardStatus]
          this.sumflow = toSize(+res.data.cardInfo.sumflow * 1024) || '0KB'
          this.restflow = toSize(
            (+res.data.cardInfo.sumflow - res.data.cardInfo.useflow) * 1024
          ) || '0KB'
          this.useflow = toSize(+res.data.cardInfo.useflow * 1024) || '0KB'
          this.maxflow =
            +res.data.cardInfo.maxflow === -1
              ? '无'
              : toSize(+res.data.cardInfo.maxflow * 1024 * 1024)
          this.single = +res.data.cardInfo.single === 1 ? '是' : '否'
          this.record = +res.data.cardInfo.record === 1 ? '是' : '否'
          this.reach = +res.data.cardInfo.reach === 1 ? '是' : '否'
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 768px) {
  .warn-content {
    display: block !important;
  }
}
.warn-content {
  display: flex;
  margin-top: 0;
}
.warn-content span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}
</style>
