<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商" @change="changeAid">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.operatorid" class="filter-item" filterable clearable placeholder="请选择套餐批次类型" @clear="handleFilter" @change="handleFilter">
        <el-option
          v-for="item in oidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="down">导出</el-button>
    </div>
    <el-table
      :data="items.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
      class="table"
      element-loading-text="给我一点时间"
      style="width: 100%;padding-top: 15px;">
      <el-table-column
        label="排序"
        type="index"
        width="50"/>
      <el-table-column show-overflow-tooltip label="代理商" align="center" min-width="160">
        <template slot-scope="scope">
          <span>{{ anameObject[scope.row.aid]?`${anameObject[scope.row.aid]}`:scope.row.aid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="套餐批次" align="center" min-width="160">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.key]?`${oidObject[scope.row.key]}--${scope.row.key}`:scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="代理商比例" align="center">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="140">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:agent:per']" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:agent:per']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"/>
        </template>

      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getAgent, updatePer } from '@/api/agent'
import waves from '@/directive/waves' // 水波纹指令
import { agentArr, operatorArr } from '@/utils/mapArr'

export default {
  name: 'AgentPer',
  directives: {
    waves
  },
  data() {
    return {
      items: [],
      listQuery: {
        page: 1,
        limit: 10,
        aid: +this.$route.query.aid || '',
        operatorid: ''
      },
      isper: 1,
      agentSelect: [],
      total: null,
      anameObject: {},
      oidSelect: [],
      oidObject: {},
      oidList: {},
      superiorPer: {}
    }
  },
  created() {
    this.getSelect()
    setTimeout(() => {
      this.changeAid(this.listQuery.aid)
    }, 200)
  },
  methods: {
    changeAid(value, operatorid) {
      if (value) {
        this.getPer()
      } else {
        this.items = []
        return false
      }
      setTimeout(() => {
        if (this.isper === 2) {
          return
        }
        this.items = []
        // if(value)
        for (const [k, v] of Object.entries(this.superiorPer)) {
          if (v) {
            if (+operatorid) {
              if (+operatorid === +k) {
                this.items.push({ aid: value, key: k, value: v })
              }
            } else {
              this.items.push({ aid: value, key: k, value: v })
            }
          } else {
            if (+operatorid) {
              if (+operatorid === +k) {
                this.items.push({ aid: value, key: k, value: v })
              }
            } else {
              this.items.push({ aid: value, key: k, value: 0 })
            }
          }
        }
        this.total = this.items.length
      }, 500)
    },
    getPer() {
      getAgent({ id: this.listQuery.aid }, '.table').then(res => {
        if (res.status === 0) {
          if (res.data.isper === 1) {
            this.isper = 1
            const oldData = this.oidList
            this.superiorPer = Object.assign(oldData, JSON.parse(res.data.per || '{}'))
          } else {
            this.$message.error({
              message: '选中的代理商不是比例返点！'
            })
            this.isper = 2
            this.items = []
            return
          }
        }
      })
    },
    getSelect() {
      operatorArr((oidSelect, operatorTypeArr, oidObject, oidList) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
        this.oidList = oidList
      })
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject) => {
        this.agentSelect = agentSelect
        this.anameObject = anameObject
      })
    },
    down() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['代理商', '套餐批次', '代理商比例']
        const filterVal = ['aid', 'key', 'value']
        const list = this.items
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `下级返点比例${new Date().toLocaleDateString()}`,
          autoWidth: this.autoWidth
        })

        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'aid') {
          return this.anameObject[v[j]]
        } else if (j === 'key') {
          return this.oidObject[v[j]]
        } else {
          return v[j]
        }
      }))
    },

    handleUpdate(row) {
      const title = this.oidObject[row.key] ? `${this.oidObject[row.key]}--${row.key}` : row.key
      this.$prompt('', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入该批次设定的比例',
        inputValue: row.value
      })
        .then(({ value }) => {
          if (+value === +row.value) {
            this.$notify({
              type: 'info',
              message: '没有修改'
            })
          } else {
            var update = {}
            var key = row.key
            update[key] = value
            var updataePer = JSON.stringify(
              Object.assign(this.superiorPer, update)
            )
            updatePer({ id: this.listQuery.aid, per: updataePer, isper: 1 }, '.el-message-box').then(
              res => {
                if (res.status === 0) {
                  this.changeAid(this.listQuery.aid, this.listQuery.operatorid)
                }
                this.$notify({
                  type: +res.status === 0 ? 'success' : 'error',
                  message: res.message,
                  duration: 2000
                })
              }
            )
          }
        })
        .catch(() => {})
    },
    handleDelete(row) {
      this.$confirm('此操作将重置该批次比例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var update = {}
          var key = row.key
          update[key] = '0'
          const oldData = this.superiorPer
          var updataePer = JSON.stringify(
            Object.assign(oldData, update)
          )
          updatePer({ id: this.listQuery.aid, per: updataePer, isper: 1 }, '.el-message-box').then(
            res => {
              if (res.status !== 0) {
                update[key] = this.superiorPer[key]
                Object.assign(oldData, update)
              } else {
                this.changeAid(this.listQuery.aid, this.listQuery.operatorid)
              }
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
            }
          )
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
    },
    handleRefresh() {
      this.listQuery.operatorid = ''
      this.changeAid(this.listQuery.aid)
      this.listQuery.page = 1
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    handleFilter() {
      this.changeAid(this.listQuery.aid, this.listQuery.operatorid)
      this.listQuery.page = 1
    }
  }
}
</script>
