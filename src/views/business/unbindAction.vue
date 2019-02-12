<template>
  <div class="app-container">
    <div class="warn-content">
      <a>提示信息!</a>
      <div style="color:#F56C6C">每次批量不要过50张卡</div>
      <div>操作步骤:第一步：输入卡号，格式一行一个</div>
      <div>操作步骤:第二步：确定解绑</div>
      <div style="color:#F56C6C">批量解绑为队列任务需要等待一定时间</div>
    </div>
    <div class="filter-container">
      <el-form label-width="45px">
        <el-form-item label="ICCID" style="display:inline-block">
          <el-input v-model.trim="iccid" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要操作的ICCID，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="tel" style="display:inline-block">
          <el-input v-model.trim="tel" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:260px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要操作的tel，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button v-waves v-permission="['kuyuplat:card:imeiReRecord']" size="small" type="primary" class="filter-item action" @click="order" >解绑</el-button>
          <el-button v-waves size="small" type="success" class="filter-item down" @click="down" >导出</el-button>
          <el-button v-waves size="small" type="danger" class="filter-item down" @click="refresh" >清空</el-button>
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
      <el-table-column show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="tel" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==0?'success':'warning'">{{ scope.row.status|statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="结果" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { imeiReRecord } from '@/api/unbind'
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { unbindAction } from '../guide/defineSteps'
export default {
  name: 'UnbindAction',
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
      iccid: '',
      tel: '',
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
        this.$router.push(`/business/unbindAction`)
      } // Called when overlay is about to be cleared
    })
    if (this.$route.query.guide) {
      this.driver.defineSteps(unbindAction)
      this.driver.start()
    }
  },
  methods: {
    refresh() {
      this.iccid = ''
      this.tel = ''
      this.list = []
    },
    down() {
       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['iccid', 'tel', '结果', '消息']
         const filterVal = [
           'iccid',
           'tel',
           'status',
           'message'
         ]
         const data = this.formatJson(filterVal, this.list)
         excel.export_json_to_excel({
           header: tHeader,
           data,
           filename: `循环机卡解绑表格${new Date().toLocaleDateString()}`,
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
    order() {
      this.list = []
      if (!this.iccid && !this.tel) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      const iccidArr = this.iccid ? this.iccid.split('\n') : []
      const telArr = this.tel ? this.tel.split('\n') : []
      if (iccidArr.length > 0) {
        for (const [index, card] of iccidArr.entries()) {
          var time = Math.round(index / 10)
          this.list.push({ iccid: card })
          setTimeout(() => {
            imeiReRecord({
              iccid: card
                .replace('"', '')
                .replace('"', '')
                .replace("'", '')
                .replace(' ', '')
            }).then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              for (const v of this.list) {
                if (v.iccid === card) {
                  if (!v.id && v.id !== 0) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, {
                      iccid: card, status: res.status, message: res.message, id: index
                    })
                    break
                  }
                }
              }
            })
          }, 500 * time * 10)
        }
      }
      if (telArr.length > 0) {
        for (const [index, card] of telArr.entries()) {
          var timeTel = Math.round(index / 10)
          this.list.push({ tel: card })
          setTimeout(() => {
            imeiReRecord({
              tel: card
                .replace('"', '')
                .replace('"', '')
                .replace("'", '')
                .replace(' ', '')
            }).then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              for (const v of this.list) {
                if (v.tel === card) {
                  if (!v.id && v.id !== 0) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, {
                      tel: card, status: res.status, message: res.message, id: index
                    })
                    break
                  }
                }
              }
            })
          }, 500 * timeTel * 10)
        }
      }
    }
  }
}
</script>
