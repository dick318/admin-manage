<template>
  <div class="app-container">
    <div class="warn-content">
      <a>提示信息!</a>
      <div style="color:#F56C6C">每次批量不要过50张卡</div>
      <div>操作步骤:第一步：输入老卡号，格式一行一个</div>
      <div>操作步骤:第二步：输入新卡号，格式一行一个</div>
      <div>操作步骤:第三步：确定操作</div>
      <div style="color:#F56C6C">输入换卡，请注意顺序</div>
      <div style="color:#F56C6C">批量异卡换套餐为队列任务需要等待一定时间</div>
    </div>
    <div class="filter-container">
      <el-form label-width="45px">
        <el-form-item label="老卡 " style="display:inline-block">
          <el-input v-model="oldCard" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要处理的老卡，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="新卡" style="display:inline-block">
          <el-input v-model="newCard" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要处理的新卡，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="" style="display:inline-block">
          <el-radio v-model="difagent" label="" style="margin-left:10px">普通转换</el-radio>
          <el-radio v-model="difagent" label="2" style="margin-left:10px">强制转换</el-radio>
        </el-form-item>
        <el-form-item class="order">
          <el-button v-waves v-permission="['kuyuplat:card:change']" size="small" type="primary" class="filter-item action" @click="order" >处理</el-button>
          <el-button v-waves size="small" type="success" class="filter-item down" @click="down" >导出</el-button>
          <el-button v-waves size="small" type="danger" class="filter-item " @click="refresh" >清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="list"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row>
      <el-table-column show-overflow-tooltip align="center" label="原卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.cardold }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="新卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.cardnew }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="转换类型" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.difagent==2?'warning':''">{{ scope.row.difagent|difagentFilter }}</el-tag>
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
import { arrayIsRepeat } from '@/utils' // 水波纹指令
import { cardChange } from '@/api/changePackage'
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { changeAction } from '../guide/defineSteps'

export default {
  name: 'ChangePackageAction',
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
    difagentFilter(value) {
      if (value) {
        return '强制转换'
      } else {
        return '普通转换'
      }
    }
  },
  data() {
    return {
      copyagent: 1,
      difagent: '',
      newCard: '',
      oldCard: '',
      list: []
    }
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
        this.$router.push(`/business/changePackageAction`)
      } // Called when overlay is about to be cleared
    })
    if (this.$route.query.guide) {
      this.driver.defineSteps(changeAction)
      this.driver.start()
    }
  },
  methods: {
    refresh() {
      this.newCard = ''
      this.oldCard = ''
      this.difagent = ''
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
        const header = ['原卡号', '新卡号', '转换类型', '结果', '消息']
        const filterVal = [
          'cardold',
          'cardnew',
          'difagent',
          'status',
          'message'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header,
          data,
          filename: `异卡换套餐表格${new Date().toLocaleDateString()}`,
          autoWidth: this.autoWidth
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'status') {
            return v[j] === 0 ? '成功' : '失败'
          } else if (j === 'difagent') {
            return v[j] ? '强制转换' : '普通转换'
          } else {
            return v[j]
          }
        })
      )
    },
    order() {
      if (!this.oldCard) {
        this.$notify({
          type: 'error',
          message: '请输入老卡号后操作'
        })
        return
      }
      if (!this.newCard) {
        this.$notify({
          type: 'error',
          message: '请输入新卡号后操作'
        })
        return
      }
      var oldArr = this.oldCard.split('\n')
      var newArr = this.newCard.split('\n')
      if (oldArr.length !== newArr.length) {
        this.$notify({
          type: 'error',
          message: '换卡的数量不一致,请注意换行'
        })
        return false
      }
      if (arrayIsRepeat(oldArr)) {
        this.$notify({
          type: 'error',
          message: '旧卡中含有重复的卡，请检查后操作'
        })
        return false
      }
      this.list = []
      for (const [index, elem] of oldArr.entries()) {
        var cardold = elem.trim()
        var cardnew = newArr[index].trim()
        this.list.push({ cardold, cardnew, difagent: this.difagent })
        var time = Math.round(index / 10)
        setTimeout(() => {
          cardChange({
            cardold: elem.trim(),
            cardnew: newArr[index].trim(),
            copyagent: this.copyagent,
            difagent: this.difagent
          }).then(res => {
            for (const v of this.list) {
              if (v.cardold === elem.trim()) {
                if (!v.id && v.id !== 0) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    cardold: elem.trim(), cardnew: newArr[index].trim(), status: res.status, message: res.message, difagent: this.difagent, id: index
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
              if (v.cardold === elem.trim()) {
                if (!v.id && v.id !== 0) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, {
                    cardold: elem.trim(), cardnew: newArr[index].trim(), status: 2, message: '请求失败', difagent: this.difagent, id: index
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
</script>
