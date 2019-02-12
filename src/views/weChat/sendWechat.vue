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

    <el-form ref="form" :inline="true" label-width="9rem" class="from" style="margin-top:15px;vertical-align: bottom;" >

      <el-form-item label="卡片类型">
        <el-select v-model="listQuery.cardType" class="filter-item" clearable placeholder="请选择卡片类型">
          <el-option
            v-for="item in cardTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐类型">
        <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="套餐类型">
          <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="认证状态">
        <el-select v-model="listQuery.realStatus" class="filter-item" clearable placeholder="认证状态">
          <el-option v-for="item in whether" :key="item.value" :label="item.label=='是'?'已认证':'未认证'" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="卡片状态">
        <el-select v-model="listQuery.cardStatus" class="filter-item" clearable placeholder="请选择卡片状态">
          <el-option
            v-for="item in cardStatusSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商类型">
        <el-select v-model="listQuery.operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
          <el-option
            v-for="item in operator_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商">
        <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
          <el-option
            v-for="item in agentSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商账号">
        <el-select v-model="zid" class="filter-item" multiple filterable collapse-tags clearable placeholder="请选择供应商账号">
          <el-option
            v-for="item in zidSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐批次">
        <el-select v-model="operatorid" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择套餐批次">
          <el-option
            v-for="item in oidSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="微信模板" >
        <el-select v-model="listQuery.mid" class="filter-item mid" clearable placeholder="请选择微信模板">
          <el-option v-for="item in modelArr" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
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
        <el-button class ="uploadFile" style="margin-left: 10px;float:right" size="small" type="success" @click="submitUpload">发送</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { whether, agentArr, cardStatusSelect, cardTypeSelect, type, operator_type, accountsArr, operatorArr } from '@/utils/mapArr'
import { sendMessage, modelGetAll } from '@/api/wechatMessage'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'SendWechat',
  data() {
    return {
      listQuery: {
        cardType: '',
        type: '',
        aid: '',
        realStatus: '',
        cardStatus: '',
        operatorType: '',
        zid: '',
        operatorid: '',
        mid: ''
      },
      modelArr: [],
      operatorid: [],
      zid: [],
      cardStatusSelect,
      cardTypeSelect,
      whether,
      typeArr: type,
      operator_type,
      oidSelect: [],
      zidSelect: [],
      agentSelect: [],
      fileList: []
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    checkPermission,
    getSelect() {
      modelGetAll({}, '.mid').then(res => {
        if (res.status === 0) {
          this.modelArr = res.data.rows
        }
      })
      accountsArr((zidObject) => {
        this.zidSelect = zidObject
      })
      operatorArr((oidSelect) => {
        this.oidSelect = oidSelect
      })
      agentArr((agentSelect) => {
        this.agentSelect = agentSelect
      })
    },
    upload(param) {
      const loading = this.$loading({ target: '.form' })
      uploadFileFinally('/plat/card/v4/excel/sendMessage', param, this.listQuery).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
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
      if (this.operatorid.length > 0) {
        this.listQuery.operatorid = this.operatorid
        this.listQuery.operatorid = this.listQuery.operatorid.join(',')
      } else {
        this.listQuery.operatorid = ''
      }
      if (this.zid.length > 0) {
        this.listQuery.zid = this.zid
        this.listQuery.zid = this.listQuery.zid.join(',')
      } else {
        this.listQuery.zid = ''
      }
      if (this.fileList.length > 0) {
        if (!checkPermission(['kuyuplat:excel:sendMessage'])) {
          this.$notify({
            type: 'error',
            message: '没有excel批量发送微信消息权限'
          })
          return false
        }
        this.$refs.upload.submit()
      } else {
        if (!checkPermission(['kuyuplat:weixin:sendMessage'])) {
          this.$notify({
            type: 'error',
            message: '没有批量发送微信消息权限'
          })
          return false
        }
        sendMessage(this.listQuery, '.from').then(res => {
          this.$notify({
            type: res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/sendWxMessage.xlsx', '_self')
    }
  }
}
</script>
