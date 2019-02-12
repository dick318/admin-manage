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

    <el-form ref="form" :inline="true" :model="listQuery" :rules="rules" class="form" label-width="9rem" style="margin-top:15px;vertical-align: bottom;" >

      <el-form-item label="扣费月份" prop="month">
        <el-select v-model="listQuery.month" class="filter-item" clearable placeholder="请选择扣费月份">
          <el-option v-for="item in monthArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理商">
        <el-select v-model="aid" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择代理商">
          <el-option
            v-for="item in agentSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="卡片类型" prop="card_type">
        <el-select v-model="listQuery.card_type" class="filter-item" clearable placeholder="请选择卡片类型">
          <el-option
            v-for="item in cardTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="运营商类型" prop="operator_type">
        <el-select v-model="listQuery.operator_type" class="filter-item" clearable placeholder="请选择运营商类型">
          <el-option
            v-for="item in operator_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="供应商账号">
        <el-select v-model="zid" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择供应商账号">
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
import { agentArr, cardTypeSelect, operator_type, accountsArr, operatorArr } from '@/utils/mapArr'
import { monthlyBalance } from '@/api/developmentEntrance'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'MonthlyBalance',
  data() {
    return {
      listQuery: {
        month: '',
        aid: '',
        card_type: '',
        operator_type: '',
        zids: '',
        operatorids: ''
      },
      monthArr: [
        {
          value: 1,
          label: '本月'
        }, {
          value: 2,
          label: '次月'
        }
      ],
      rules: {
        month: [
          {
            required: true, message: '请选择扣费月份', trigger: 'blur'
          }
        ],
        card_type: [
          { required: true, message: '请选择卡片类型', trigger: 'blur' }
        ],
        operator_type: [
          { required: true, message: '请选择运营商类型', trigger: 'blur' }
        ]
      },
      operatorid: [],
      zid: [],
      aid: [],
      cardTypeSelect,
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
      uploadFileFinally('/plat/card/v4/excel/monthBalance', param, this.listQuery).then(res => {
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.operatorid.length > 0) {
            this.listQuery.operatorids = this.operatorid
            this.listQuery.operatorids = this.listQuery.operatorids.join(',')
          } else {
            this.listQuery.operatorids = ''
          }
          if (this.zid.length > 0) {
            this.listQuery.zids = this.zid
            this.listQuery.zids = this.listQuery.zids.join(',')
          } else {
            this.listQuery.zids = ''
          }
          if (this.aid.length > 0) {
            this.listQuery.aid = this.aid
            this.listQuery.aid = this.listQuery.aid.join(',')
          } else {
            this.listQuery.aid = ''
          }
          if (this.fileList.length > 0) {
            if (!checkPermission(['kuyuplat:excel:monthBalance'])) {
              this.$notify({
                type: 'error',
                message: '没有excel批量月末扣费停机权限'
              })
              return false
            }
            this.$refs.upload.submit()
          } else {
            if (!checkPermission(['kuyuplat:card:monthBalance'])) {
              this.$notify({
                type: 'error',
                message: '没有批量月末扣费停机权限'
              })
              return false
            }
            monthlyBalance(this.listQuery, '.form').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
            })
          }
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/monthlyBalance.xlsx', '_self')
    }
  }
}
</script>
