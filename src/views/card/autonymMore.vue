<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-position="right" class="form" label-width="220px">
        <el-form-item label="卡号:">
          <el-input v-model="msisdns" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写要处理的卡号，一行一个！" type="textarea" />
        </el-form-item>
        <el-form-item label="请填写姓名(企业名称):">
          <el-input v-model.trim="form.name" placeholder="姓名(企业名称)" style="width:250px" />
        </el-form-item>
        <el-form-item label="请填写电话(企业联系人电话):">
          <el-input v-model.trim="form.phone" placeholder="电话(企业联系人电话)" style="width:250px" />
        </el-form-item>
        <el-form-item label="请填写身份证(企业组织结构代码):">
          <el-input v-model.trim="form.cardNo" placeholder="身份证(企业组织结构代码)" style="width:250px" />
        </el-form-item>
        <el-form-item label="身份证(企业营业执照)正面:">
          <el-upload :show-file-list="false" :on-success="handlePicOne" :before-upload="beforeAvatarUpload" :data="moreData" class="avatar-uploader" action="http://112.74.198.2:8091/tool/file/upload">
            <img v-if="form.pic1" :src="form.pic1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证(企业营业执照)反面:">
          <el-upload :show-file-list="false" :on-success="handlePicTwo" :data="moreData" :before-upload="beforeAvatarUpload" class="avatar-uploader" action="http://112.74.198.2:8091/tool/file/upload">
            <img v-if="form.pic2" :src="form.pic2" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="手持身份证:">
          <el-upload :show-file-list="false" :on-success="handlePicThree" :before-upload="beforeAvatarUpload" :data="moreData" class="avatar-uploader" action="http://112.74.198.2:8091/tool/file/upload">
            <img v-if="form.pic3" :src="form.pic3" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <el-button v-waves size="small" type="primary" class="filter-item action" @click="order">处理</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { addCardReal } from '@/api/cardReal'

export default {
  name: 'AutonymMore',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        msisdns: '',
        name: '',
        phone: '',
        cardNo: '',
        pic1: '',
        pic2: '',
        pic3: ''
      },
      msisdns: '',
      moreData: {
        uid: 50,
        target: 'sekill'
      }
    }
  },
  methods: {
    order() {
      if (!this.msisdns) {
        this.$notify({
          type: 'error',
          message: '请输入卡号后操作'
        })
        return
      }
      if (!this.form.name) {
        this.$notify({
          type: 'error',
          message: '请输入姓名(企业名称)'
        })
        return
      }
      if (!this.form.phone) {
        this.$notify({
          type: 'error',
          message: '请输入电话(企业联系人电话)'
        })
        return
      }
      if (!this.form.cardNo) {
        this.$notify({
          type: 'error',
          message: '请输入身份证(企业组织结构代码)'
        })
        return
      }
      if (!this.form.pic1 && !this.form.pic2 && this.form.pic3) {
        this.$notify({
          type: 'error',
          message: '请上传相应的图片'
        })
        return
      }
      this.form.msisdns = Array.from(new Set(this.msisdns.split('\n'))).join(',')
      addCardReal(this.form, '.filter-container').then(res => {
        this.$notify({
          type: res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (res.status === 0) {
          this.$store.dispatch('delView', this.$route)
          this.$router.push('/card/autonym')
        }
      })
    },
    handlePicOne(res, file) {
      this.form.pic1 = res.status === 0 ? res.data : ''
    },
    handlePicTwo(res, file) {
      this.form.pic2 = res.status === 0 ? res.data : ''
    },
    handlePicThree(res, file) {
      this.form.pic3 = res.status === 0 ? res.data : ''
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG和PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG && isLt2M) || (isLt2M && isPNG)
    }
  }
}
</script>
<style scoped>
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

