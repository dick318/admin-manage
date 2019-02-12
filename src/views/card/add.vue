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
    <el-form ref="form" :inline="true" class="form" label-width="9rem" style="margin-top:15px;vertical-align: bottom;" >
      <el-form-item label="运营商类型">
        <el-select v-model="listQuery.operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
          <el-option
            v-for="item in operator_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐批次">
        <el-select v-model="operatorid" class="filter-item" filterable clearable placeholder="请选择套餐批次" @change="changeOperatorType">
          <el-option
            v-for="item in operatorTypeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
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
      <el-form-item label="代理商">
        <el-select v-model="listQuery.fid" class="filter-item" filterable clearable placeholder="请选择代理商">
          <el-option
            v-for="item in agentSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="流量折扣率">
        <el-input v-model="listQuery.per" class="filter-item" clearable style="width:130px"/>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :on-change="handleChange"
          :http-request = "upload"
          action=""
          drag>
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="">
        <el-button class ="uploadFile" style="margin-left: 10px;float:right" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { agentArr, operator_type, accountsArr, operatorArr } from '@/utils/mapArr'
import { showAllowPackages } from '@/api/package'

export default {
  name: 'AddCard',
  data() {
    return {
      listQuery: {
        operatorType: '',
        operatorid: '',
        zid: '',
        fid: '',
        per: ''
      },
      operatorid: '',
      operator_type,
      operatorTypeArr: [],
      zidSelect: [],
      agentSelect: [],
      aidObject: {},
      oidObject: {},
      fileList: []
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    getSelect() {
      accountsArr((zidSelect) => {
        this.zidSelect = zidSelect
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.operatorTypeArr = operatorTypeArr
        this.oidObject = oidObject
      })
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
        this.agentSelect = agentSelect
        this.aidObject = aidObject
      })
    },
    changeOperatorType(value) {
      if (value) {
        this.listQuery.operatorid = JSON.parse(value).id
        this.listQuery.operatorType = JSON.parse(value).operatorType
      } else {
        this.listQuery.operatorType = ''
        this.listQuery.operatorid = ''
      }
    },
    upload(param) {
      const loading = this.$loading({ target: '.form' })
      uploadFileFinally('/plat/card/v4/excel/batchCardAdd', param, this.listQuery).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
          if (this.listQuery.fid && this.listQuery.operatorid) {
            showAllowPackages({ aid: this.listQuery.fid, operatorid: this.listQuery.operatorid, isDistribution: 1 }).then(res => {
              var total = res.data ? res.data.total : 0
              if (total === 0) {
                this.$confirm(`${this.aidObject[this.listQuery.fid]}的${this.oidObject[this.listQuery.operatorid]}没有分配过套餐`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push(`/agent/package?name=${this.aidObject[this.listQuery.fid]}&aid=${this.listQuery.fid}&operatorid=${this.listQuery.operatorid}`)
                }).catch(() => {
                  this.$store.dispatch('delView', this.$route)
                  this.$router.push('/card/manage')
                  this.$notify({
                    type: 'info',
                    message: '已取消'
                  })
                })
              }
            })
          } else {
            this.$store.dispatch('delView', this.$route)
            this.$router.push('/card/manage')
          }
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
        if (this.listQuery.per && +this.listQuery.per < 0 || this.listQuery.per && +this.listQuery.per > 1) {
          this.$notify({
            type: 'error',
            message: '导入的比例存在问题！'
          })
        } else {
          this.$refs.upload.submit()
        }
      } else {
        this.$notify({
          type: 'error',
          message: '请上传excel'
        })
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/importCard.xlsx', '_self')
    }
  }
}
</script>
