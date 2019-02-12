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

    <el-form ref="form" :inline="true" label-width="9rem" class="form" style="margin-top:15px;vertical-align: bottom;" >
      <el-form-item label="供应商账号">
        <el-select v-model="listQuery.zid" class="filter-item" filterable clearable placeholder="请选择供应商账号">
          <el-option
            v-for="item in zidSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="广东移动">
        <el-select v-model="listQuery.account" class="filter-item" clearable placeholder="是否为广东移动">
          <el-option v-for="item in whether0" :key="item.value" :label="item.label+'广东移动'" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="激活类型">
        <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="请选择激活类型">
          <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="接入号集合 " style="display:inline-block">
        <el-input v-model.trim="tels" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要处理的接入号，一行一个！" type="textarea"/>
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
import { whether0, accountsArr, activeTypeSelect } from '@/utils/mapArr'
import { batchActivate } from '@/api/card'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'ActiveCard',
  data() {
    return {
      whether0,
      listQuery: {
        tels: '',
        account: '',
        type: '',
        zid: ''
      },
      tels: '',
      zidSelect: [],
      typeArr: activeTypeSelect,
      fileList: []
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    checkPermission,
    getSelect() {
      accountsArr((zidSelect) => {
        this.zidSelect = zidSelect
      })
    },
    upload(param) {
      const loading = this.$loading({ target: '.form' })
      uploadFileFinally('/plat/card/v4/excel/batchActivate', param, this.listQuery).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
          this.$store.dispatch('delView', this.$route)
          this.$router.push('/card/manage')
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
        if (checkPermission(['kuyuplat:card:batchChangeCardStatus'])) {
          this.$notify({
            type: 'error',
            message: '没有批量停复机权限'
          })
          return false
        }
        this.$refs.upload.submit()
      } else {
        if (!checkPermission(['kuyuplat:card:batchChangeCardStatus'])) {
          this.$notify({
            type: 'error',
            message: '没有批量停复机权限'
          })
          return false
        }
        this.listQuery.tels = this.tels.split('\n').join(',')
        batchActivate(this.listQuery).then(res => {
          this.$notify({
            type: res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.$store.dispatch('delView', this.$route)
            this.$router.push('/card/manage')
          }
        })
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/batchActivate.xlsx', '_self')
    }
  }
}
</script>
