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
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="listQuery.starttime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始日期"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="listQuery.endtime"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="结束日期"
          class="filter-item"
        />
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
      <el-form-item label="卡片类型">
        <el-select v-model="listQuery.card_type" class="filter-item" clearable placeholder="请选择卡片类型">
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
        <el-select v-model="listQuery.real_status" class="filter-item" clearable placeholder="认证状态">
          <el-option v-for="item in whether" :key="item.value" :label="item.label=='是'?'已认证':'未认证'" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="卡片状态">
        <el-select v-model="listQuery.card_status" class="filter-item" clearable placeholder="请选择卡片状态">
          <el-option
            v-for="item in cardStatusSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商类型">
        <el-select v-model="listQuery.operator_type" class="filter-item" clearable placeholder="请选择运营商类型">
          <el-option
            v-for="item in operator_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐批次">
        <el-select v-model="operatorids" class="filter-item" multiple collapse-tags filterable clearable placeholder="请选择套餐批次">
          <el-option
            v-for="item in oidSelect"
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
      <el-form-item label="广东移动">
        <el-select v-model="listQuery.account" class="filter-item" clearable placeholder="是否为广东移动">
          <el-option v-for="item in whether0" :key="item.value" :label="item.label+'广东移动'" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作原因">
        <el-input v-model="listQuery.actionReason" class="filter-item" placeholder="默认：后台批量"/>
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
        <el-button v-permission="['kuyuplat:excel:batchChangeCardStatus','kuyuplat:card:batchChangeCardStatus']" class ="uploadFile" style="margin-left: 10px;float:right" size="small" type="success" @click="submitUpload('1')">开机</el-button>
        <el-button v-permission="['kuyuplat:excel:batchChangeCardStatus','kuyuplat:card:batchChangeCardStatus']" class ="uploadFile" style="margin-left: 10px;float:right" size="small" type="danger" @click="submitUpload('2')">关机</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { whether0, whether, agentArr, cardStatusSelect, cardTypeSelect, type, operator_type, accountsArr, operatorArr } from '@/utils/mapArr'
import { batchChangeCardStatus } from '@/api/batch'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'ChangeStatus',
  data() {
    return {
      listQuery: {
        starttime: '',
        endtime: '',
        aid: '',
        card_type: '',
        type: '',
        real_status: '',
        card_status: '',
        operator_type: '',
        zid: '',
        operatorids: '',
        actionType: '',
        account: '',
        actionReason: ''
      },
      operatorids: [],
      cardStatusSelect,
      cardTypeSelect,
      whether0,
      whether,
      typeArr: type,
      operator_type,
      oidSelect: [],
      zidSelect: [],
      agentSelect: [],
      fileList: [],
      pickerOptions: this.processDate()

    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    checkPermission,
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
    },
    getSelect() {
      accountsArr((zidSelect) => {
        this.zidSelect = zidSelect
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
      uploadFileFinally('/plat/card/v4/excel/batchChangeCardStatus', param, this.listQuery).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
          this.$store.dispatch('delView', this.$route)
          this.$router.push('/other/batch')
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
    submitUpload(type) {
      this.listQuery.actionType = type
      if (this.operatorids.length > 0) {
        this.listQuery.operatorids = this.operatorids
        this.listQuery.operatorids = this.listQuery.operatorids.join(',')
      } else {
        this.listQuery.operatorids = ''
      }
      if (this.fileList.length > 0) {
        if (!checkPermission(['kuyuplat:excel:batchChangeCardStatus'])) {
          this.$notify({
            type: 'error',
            message: '没有excel批量停复机权限'
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
        batchChangeCardStatus(this.listQuery, '.form').then(res => {
          this.$notify({
            type: res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            this.$store.dispatch('delView', this.$route)
            this.$router.push('/other/batch')
          }
        })
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/batchChangeCardStatus.xlsx', '_self')
    }
  }
}
</script>
