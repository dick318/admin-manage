<template>
  <div class="app-container">
    <div class="warn-content">
      <a>提示信息!</a>
      <div>操作步骤:第一步：下载模板，按模板格式上传</div>
      <div>操作步骤:第二步：点EXCEL导入</div>
      <div>操作步骤:第三步：确定导入</div>
      <div>操作步骤:第四步：返回</div>
      <div class="downLoad" style="color:#F56C6C" @click="downLoad">模板格式下载</div>
    </div>
    <div class="filter-container upload" style="margin-top:15px;">
      Excel操作联通资费计划:
      <el-form ref="form" :inline="true" label-width="9rem" style="margin-top:15px;vertical-align: bottom;" >
        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            :limit="1"
            :auto-upload="false"
            :http-request = "upload"
            action=""
            drag>
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="">
          <el-button v-permission="['kuyuplat:ratePlan:commit','kuyuplat:excel:ratePlanCommit']" class ="uploadFile" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <el-button v-permission="['kuyuplat:ratePlan:export']" class ="uploadFile" style="margin-left: 10px;" size="small" type="danger" @click="downloadAll">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="filter-container" style="margin-top:15px;">
      联通资费计划更改:
      <el-form :inline="true" label-width="8rem">
        <el-form-item label="iccid" style="display:inline-block">
          <el-input v-model.trim="listQuery.iccid" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要处理的卡，一行一个！" type="textarea"/>
        </el-form-item>
        <el-form-item label="供应商账号">
          <el-select v-model="listQuery.zid" class="filter-item" filterable clearable placeholder="请选择供应商账号">
            <el-option
              v-for="item in zidSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资费计划">
          <el-select v-model="listQuery.target" class="filter-item" filterable clearable placeholder="请选择资费计划">
            <el-option
              v-for="item in targetArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves v-permission="['common']" size="small" type="primary" class="filter-item action" @click="order" >处理</el-button>
          <el-button v-waves v-permission="['common']" size="small" type="danger" class="filter-item down" @click="down" >导出</el-button>
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
      <el-table-column show-overflow-tooltip align="center" label="卡号" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.oldItem }}</span>
        </template>
      </el-table-column>

    </el-table> -->
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { ratePlanCommit, ratePlanExport } from '@/api/cuccRate'
import { accountsArr } from '@/utils/mapArr'
import { uploadFileFinally } from '@/utils'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'CuccRatePlan',
  directives: {
    waves
  },
  filters: {
    filterFun(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    }
  },
  data() {
    return {
      zidSelect: [],
      listQuery: {
        iccid: '',
        zid: '',
        target: ''
      },
      list: [],
      targetArr: [
        {
          value: '450WLW016523_MON-FLEX_100M',
          label: '450WLW016523_MON-FLEX_100M'
        },
        {
          value: '450WLW016523_MON-FLEX_1024M',
          label: '450WLW016523_MON-FLEX_1024M'
        },
        {
          value: '450WLW016523_MON-FLEX_200M',
          label: '450WLW016523_MON-FLEX_200M'
        },
        {
          value: '450WLW016523_MON-FLEX_20480M',
          label: '450WLW016523_MON-FLEX_20480M'
        },
        {
          value: '450WLW016523_MON-FLEX_2048M',
          label: '450WLW016523_MON-FLEX_2048M'
        },
        {
          value: '450WLW016523_MON-FLEX_30M',
          label: '450WLW016523_MON-FLEX_30M'
        },
        {
          value: '450WLW016523_MON-FLEX_500M',
          label: '450WLW016523_MON-FLEX_500M'
        },
        {
          value: '450WLW016523_MON-FLEX_5120M',
          label: '450WLW016523_MON-FLEX_5120M'
        },
        {
          value: '450WLW016523_MON-FLEX_5M',
          label: '450WLW016523_MON-FLEX_5M'
        }
      ],
      fileList: []
    }
  },
  created() {
    accountsArr((zidSelect) => {
      this.zidSelect = zidSelect
    })
  },
  methods: {
    checkPermission,
    downloadAll() {
      ratePlanExport({}, '.filter-container').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    },
    upload(param) {
      const loading = this.$loading({ target: '.upload' })
      uploadFileFinally('/plat/card/v4/excel/ratePlanCommit', param, {}).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
          this.$router.push('/business/cuccRatePlan')
        }
        loading.close()
      }).catch(() => {
        loading.close()
        this.$notify({
          type: 'error',
          message: '请求失败！'
        })
      })
    },
    submitUpload() {
      if (this.fileList.length > 0) {
        if (!checkPermission(['kuyuplat:excel:ratePlanCommit'])) {
          this.$notify({
            type: 'error',
            message: '没有excel联通资费计划提交权限'
          })
          return false
        }
        this.$refs.upload.submit()
      } else {
        if (!checkPermission(['kuyuplat:ratePlan:commit'])) {
          this.$notify({
            type: 'error',
            message: '没有联通资费计划提交权限'
          })
          return false
        }
        this.$confirm('此操作将不用修改直接提交资费计划吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ratePlanCommit({}, '.el-message-box').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
          })
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    down() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['原卡号', '新卡号', '原因']
        excel.export_json_to_excel({
          header: tHeader,
          data: this.list,
          filename: `异卡换套餐失败表格${new Date().toLocaleDateString()}`,
          autoWidth: this.autoWidth
        })

        this.downloadLoading = false
      })
    },
    // order() {
    //   if (!this.listQuery.iccid) {
    //     this.$message({
    //       type: 'error',
    //       message: '请输入老卡号后操作'
    //     })
    //     return
    //   }
    //   if (!this.listQuery.zid) {
    //     this.$message({
    //       type: 'error',
    //       message: '请选择供应商账号'
    //     })
    //     return
    //   }
    //   if (!this.listQuery.target) {
    //     this.$message({
    //       type: 'error',
    //       message: '请选择资费计划'
    //     })
    //     return
    //   }
    //   var iccid = this.listQuery.iccid.split('\n')

    //   this.list = []
    //   for (const [index, elem] of iccid.entries()) {
    //     var oldItem = elem
    //       .replace('"', '')
    //       .replace('"', '')
    //       .replace("'", '')
    //       .replace(' ', '')
    //     var time = Math.round(index / 10)
    //     setTimeout(() => {
    //       cuccRatePlan({
    //         iccid: oldItem,
    //         zid: this.listQuery.zid,
    //         target: this.listQuery.target
    //       }).then(res => {
    //         const loading = this.$loading({ target: document.getElementsByClassName('.add') })
    //         if (index === iccid.length - 1) {
    //           loading.close()
    //         }
    //         if (res.status === 1) {
    //           this.list.push({ oldItem: elem, message: res.message })
    //         }
    //         this.$message({
    //           type: +res.status === 0 ? 'success' : 'error',
    //           message: res.message
    //         })
    //       })
    //     }, 500 * time * 10)
    //   }
    // },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/ratePlan.xlsx', '_self')
    }
  }
}
</script>
