<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="活动名称:" prop="name">
          <el-input v-model.trim="form.name" placeholder="请填写活动名称" style="width:250px" />
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model.trim="form.info" placeholder="请填写简介" style="width:250px" />
        </el-form-item>
        <el-form-item label="活动宣传图:">
          <el-upload :on-success="handleImgFront" :file-list="frontFileList" :on-error="handleError" :before-upload="beforeAvatarUpload" :data="moreData" :action="uploadUrl" class="avatar-uploader">
            <img v-if="form.imgFront" :src="form.imgFront" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="海报:">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-success="handlePoster"
            :data="moreData"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :action="uploadUrl"
            :file-list="fileList"
            :limit="6"
            list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="原价:">
          <el-input v-model.trim.number="form.price" placeholder="请填写原价" style="width:250px" />
        </el-form-item>
        <el-form-item label="活动价格:" prop="sellPrice">
          <el-input v-model.trim.number="form.sellPrice" placeholder="请填写活动价格" style="width:250px" />
        </el-form-item>
        <el-form-item label="活动数目:" prop="sumNum">
          <el-input v-model.trim.number="form.sumNum" placeholder="请填写活动数目" style="width:250px" />
        </el-form-item>
        <el-form-item label="限购一台数目:">
          <el-input v-model.trim.number="form.litNum" placeholder="请填写限购一台数目" style="width:250px" />
        </el-form-item>
        <el-form-item label="开始时间:" prop="starttime">
          <el-date-picker
            v-model="form.starttime"
            type="datetime"
            placeholder="开始日期"
            class="filter-item"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endtime">
          <el-date-picker
            v-model="form.endtime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="结束日期"
            class="filter-item"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="前端显示:">
          <el-radio v-model="form.showFront" label="1" style="margin-left:10px">显示</el-radio>
          <el-radio v-model="form.showFront" label="2" style="margin-left:10px">不显示</el-radio>
        </el-form-item>
        <el-form-item label="显示倒计时:">
          <el-radio v-model="form.countdown" label="1" style="margin-left:10px">显示</el-radio>
          <el-radio v-model="form.countdown" label="2" style="margin-left:10px">不显示</el-radio>
        </el-form-item>
        <el-form-item label="显示剩余数量:">
          <el-radio v-model="form.showNum" label="1" style="margin-left:10px">显示</el-radio>
          <el-radio v-model="form.showNum" label="2" style="margin-left:10px">不显示</el-radio>
        </el-form-item>
        <el-form-item label="图文详情:" prop="text" >
          <tinymce :height="500" v-model="form.text"/>
          <el-button v-waves v-permission="['kuyuplat:seckill:add','kuyuplat:seckill:update']" size="small" type="primary" class="filter-item action" @click="order">提交</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // 水波纹指令
import { getSeckill, editSeckill, addSeckill } from '@/api/seckill'

export default {
  name: 'ActiveDetails',
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        sellPrice: [
          { required: true, message: '请输入活动价格', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],
        sumNum: [
          { required: true, message: '请输入活动数目', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],

        starttime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      },
      id: this.$route.query.id,
      form: {
        name: '',
        info: '',
        imgFront: '',
        poster: '',
        showFront: '',
        countdown: '',
        price: '',
        sellPrice: '',
        sumNum: '',
        starttime: '',
        endtime: '',
        text: '',
        showNum: '',
        litNum: '',
        id: ''
      },
      poster: [],
      frontFileList: [],
      fileList: [],
      pickerOptions: this.processDate(),
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: 'http://112.74.198.2:8091/tool/file/upload',
      moreData: {
        uid: 50,
        target: 'sekill'
      }
    }
  },
  created() {
    if (this.id) {
      getSeckill({ id: this.id }, '.app-container').then(res => {
        if (res.status === 0) {
          const posterArr = res.data.poster ? res.data.poster.split(',') : []
          const poster = []
          posterArr.map((v, i) => {
            poster.push({ url: v })
          })
          this.fileList = poster
          this.form = Object.assign({}, res.data)
        }
      })
    }
  },
  methods: {
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.form.starttime).getTime() > time.getTime()
        }
      }
    },
    handleError() {
      this.$notify({
        type: 'error',
        message: '请求失败！'
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      this.$notify({
        type: 'error',
        message: '最大允许上传个数为6!'
      })
    },
    handlePoster(res, file, fileList) {
      this.fileList = fileList
      if (res.status !== 0) {
        for (const item of this.fileList) {
          if (item.url === file.url) {
            const index = this.fileList.indexOf(item)
            this.fileList.splice(index, 1)
            break
          }
        }
      }
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImgFront(res, file) {
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
      if (res.status !== 0) {
        this.frontFileList = []
      }
      this.form.imgFront = res.status === 0 ? res.data : ''
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG和PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG && isLt2M) || (isLt2M && isPNG)
    },
    order() {
      this.fileList.map((v, i) => {
        this.poster.push(v.response ? v.response.data : v.url)
      })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.poster = this.poster.length > 0 ? this.poster.join(',') : ''

          if (this.id) {
            editSeckill(Object.assign({ id: this.id }, this.form), '.app-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/business/active')
              }
            })
          } else {
            addSeckill(this.form, '.app-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/business/active')
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
@media screen and (max-width: 768px) {
  .form >>> .el-form-item,
  .form >>> .el-form-item__label,
  .form >>> .el-form-item__content {
    display: inline-block !important;
  }
  .form >>> .el-form-item__content {
    margin-left: 0 !important;
  }
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>

