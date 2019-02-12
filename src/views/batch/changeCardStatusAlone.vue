<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="45px">
        <el-form-item label="卡号" style="display:inline-block">
          <el-input v-model.trim="msisdn" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要操作的卡号，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model.trim="actionReason" class="filter-item" style="width:180px" clearable placeholder="操作原因"/>
          <el-button v-waves size="small" type="primary" class="filter-item " @click="action(2)" >复机</el-button>
          <el-button v-waves size="small" type="danger" class="filter-item " @click="action(1)" >停机</el-button>
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
      <el-table-column show-overflow-tooltip align="center" label="操作类型" min-width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==2?'success':'warning'">{{ scope.row.type|typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作原因" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.actionReason }}</span>
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
import { changeCardStatus } from '@/api/cardInfo'
export default {
  name: 'ChangeStatusAlone',
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
    typeFilter(value) {
      if (value === 1) {
        return '停机'
      } else if (value === 2) {
        return '复机'
      } else {
        return '未处理'
      }
    }
  },
  data() {
    return {
      msisdn: '',
      actionReason: '后台批量循环操作',
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
            changeCardStatus({ msisdn: elem, type, actionReason: this.actionReason }).then(res => {
              for (const v of this.list) {
                if (v.msisdn === elem) {
                  if (!v.id && v.id !== 0) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, {
                      msisdn: elem, type, status: res.status, message: res.message, actionReason: this.actionReason, id: index
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
                if (v.msisdn === elem) {
                  if (!v.id && v.id !== 0) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, {
                      msisdn: elem, type, status: 1, message: '请求失败', actionReason: this.actionReason, id: index
                    })
                    break
                  }
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
