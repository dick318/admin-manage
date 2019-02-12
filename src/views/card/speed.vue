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
      <el-form-item label="运营商类型">
        <el-select v-model="operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
          <el-option
            v-for="item in operator_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="operatorType==3" label="联通限速编码">
        <el-select v-model="listQuery.target" class="filter-item" clearable placeholder="请选择限速编码">
          <el-option
            v-for="item in cuccSpeedSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="operatorType==2" label="电信限速编码">
        <el-select v-model="listQuery.target" class="filter-item" clearable placeholder="请选择限速编码">
          <el-option
            v-for="item in ctccSpeedSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :http-request = "upload"
          :on-change="handleChange"
          action=""
          class="form"
          style="display:inline-block;margin-top:15px;vertical-align: bottom;"
          drag>
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button class ="uploadFile" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { operator_type, cuccSpeedSelect, ctccSpeedSelect } from '@/utils/mapArr'
export default {
  name: 'SpeedCard',
  data() {
    return {
      operator_type,
      cuccSpeedSelect,
      ctccSpeedSelect,
      operatorType: 2,
      listQuery: {
        target: ''
      },
      fileList: []
    }
  },
  methods: {
    upload(param) {
      const loading = this.$loading({ target: '.form' })
      uploadFileFinally('/plat/card/v4/excel/editNetworkAccess', param, this.listQuery).then(res => {
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
        this.$refs.upload.submit()
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
      window.open('http://wx.szcoolfish.com/upload/excelmodel/editNetworkAccess.xlsx', '_self')
    }
  }
}
</script>
