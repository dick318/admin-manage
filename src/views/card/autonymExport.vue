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

    <el-form ref="form" :inline="true" class="form" label-width="6rem" style="margin-top:15px;vertical-align: bottom;" >
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
        <el-select v-model="aids" class="filter-item" multiple filterable clearable placeholder="请选择代理商">
          <el-option
            v-for="item in agentSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="套餐批次">
        <el-select v-model="operatorids" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择套餐批次">
          <el-option
            v-for="item in oidSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商账号">
        <el-select v-model="zids" class="filter-item" multiple filterable collapse-tags clearable placeholder="请选择供应商账号">
          <el-option
            v-for="item in zidSelect"
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
        <el-button class ="uploadFile" style="margin-left: 10px;float:right" size="small" type="success" @click="submitUpload">导出</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { whether, agentArr, cardStatusSelect, cardTypeSelect, type, operator_type, accountsArr, operatorArr } from '@/utils/mapArr'
import { exportCardReal } from '@/api/cardReal'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'AutonymExport',
  data() {
    return {
      listQuery: {
        starttime: null,
        endtime: null,
        cardType: '',
        type: '',
        cardStatus: '',
        operatorType: '',
        aids: '',
        operatorids: '',
        zids: ''
      },
      pickerOptions: this.processDate(),
      operatorids: [],
      zids: [],
      aids: [],
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
    handleChange(file, fileList) {
      this.fileList = fileList
    },
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
      uploadFileFinally('/plat/card/v4/exportCardReal', param, this.listQuery).then(res => {
        const data = res.data
        this.$notify({
          type: +data.status === 0 ? 'success' : 'error',
          message: data.message
        })
        if (data.status === 0) {
          this.fileList = []
          this.$store.dispatch('delView', this.$route)
          this.$router.push('/card/autonym')
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
      if (this.operatorids.length > 0) {
        this.listQuery.operatorids = this.operatorids
        this.listQuery.operatorids = this.listQuery.operatorids.join(',')
      } else {
        this.listQuery.operatorids = ''
      }
      if (this.zids.length > 0) {
        this.listQuery.zids = this.zids
        this.listQuery.zids = this.listQuery.zids.join(',')
      } else {
        this.listQuery.zids = ''
      }
      if (this.aids.length > 0) {
        this.listQuery.aids = this.aids
        this.listQuery.aids = this.listQuery.aids.join(',')
      } else {
        this.listQuery.aids = ''
      }
      if (this.fileList.length > 0) {
        if (!checkPermission(['kuyuplat:excel:exportCardReal'])) {
          this.$notify({
            type: 'error',
            message: '没有excel卡片实名信息批量导出权限'
          })
          return false
        }
        this.$refs.upload.submit()
      } else {
        if (!checkPermission(['kuyuplat:cardReal:exportCardReal'])) {
          this.$notify({
            type: 'error',
            message: '没有卡片实名信息批量导出权限'
          })
          return false
        }
        exportCardReal(this.listQuery, '.form').then(res => {
          this.$notify({
            type: res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }
    },
    downLoad() {
      window.open('http://wx.szcoolfish.com/upload/excelmodel/exportCardReal.xlsx', '_self')
    }
  }
}
</script>
