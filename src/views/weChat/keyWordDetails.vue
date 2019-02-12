<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="关键词:" prop="keyword">
          <el-input v-model.trim="form.keyword" placeholder="请填写关键词" style="width:250px" />
        </el-form-item>
        <el-form-item label="标题:">
          <el-input v-model.trim="form.title" placeholder="请填写标题" style="width:250px" />
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model.trim="form.info" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:250px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写简介！" type="textarea" />
        </el-form-item>
        <el-form-item label="封面图片:">
          <el-upload :on-success="handleImgFront" :before-upload="beforeAvatarUpload" :on-error="handleError" :data="moreData" :action="uploadUrl" class="avatar-uploader">
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="自定义链接地址:">
          <el-input v-model.trim.number="form.url" placeholder="请填写自定义链接地址" style="width:250px" />
        </el-form-item>
        <el-form-item label="排序号:" prop="orderid">
          <el-input v-model.trim.number="form.orderid" placeholder="请填写排序号格" style="width:250px" />
        </el-form-item>
        <!-- <el-form-item label="详细页是否显示封面:">
          <el-radio v-model="form.showFront" label="1" style="margin-left:10px">显示</el-radio>
          <el-radio v-model="form.showFront" label="2" style="margin-left:10px">不显示</el-radio>
        </el-form-item> -->
        <el-form-item label="是否授权:">
          <el-radio v-model="form.status" :label="1" style="margin-left:10px">显示</el-radio>
          <el-radio v-model="form.status" :label="2" style="margin-left:10px">不显示</el-radio>
        </el-form-item>
        <el-form-item label="图文详情:" prop="content" >
          <tinymce :height="500" v-model="form.content"/>
          <el-button v-permission="['kuyuplat:autoreply:update','kuyuplat:autoreply:add']" v-waves size="small" type="primary" class="filter-item action" @click="order">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // 水波纹指令
import { getAutoReply, addAutoReply, updateAutoReply } from '@/api/wechat'

export default {
  name: 'KeyWordDetails',
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        keyword: [
          {
            required: true,
            message: '关键字不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          }
        ]
      },
      id: this.$route.query.id,
      form: {
        type: 0,
        keyword: '',
        title: '',
        info: '',
        img: '',
        url: '',
        orderid: '',
        status: '',
        content: '',
        id: ''
      },
      fileList: [],
      dialogVisible: false,
      uploadUrl: 'http://112.74.198.2:8091/tool/file/upload',
      moreData: {
        target: 'sekill'
      }
    }
  },
  created() {
    if (this.id) {
      getAutoReply({ id: this.id }, '.filter-container').then(res => {
        if (res.status === 0) {
          this.form = Object.assign({}, res.data)
        }
      })
    }
  },
  methods: {
    handleError() {
      this.$notify({
        type: 'error',
        message: '请求失败'
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleImgFront(res, file) {
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
      this.form.img = res.status === 0 ? res.data : ''
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.id) {
            updateAutoReply(Object.assign({ id: this.id }, this.form), '.filter-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/weChat/keyWord')
              }
            })
          } else {
            addAutoReply(this.form, '.filter-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/weChat/keyWord')
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

