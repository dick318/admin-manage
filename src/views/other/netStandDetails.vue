<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="网点名称:" prop="name">
          <el-input v-model.trim="form.name" placeholder="请填写网点名称" style="width:250px" />
        </el-form-item>
        <el-form-item label="部门:">
          <el-input v-model.trim="form.dept" placeholder="请填写部门" style="width:250px" />
        </el-form-item>
        <el-form-item label="负责人:">
          <el-input v-model.trim="form.headname" placeholder="请填写负责人" style="width:250px" />
        </el-form-item>
        <el-form-item label="负责人电话:" prop="tel">
          <el-input v-model.trim.number="form.tel" placeholder="请填写负责人电话" style="width:250px" />
        </el-form-item>
        <el-form-item label="网点图片:">
          <el-upload :on-success="handleImgFront" :file-list="frontFileList" :on-error="handleError" :before-upload="beforeAvatarUpload" :data="moreData" :action="uploadUrl" class="avatar-uploader">
            <img v-if="form.headimg" :src="form.headimg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="地图位置（自动填写）:">
          <el-input v-model.trim.number="form.place" placeholder="自动完成" readonly="true" style="width:250px" />
        </el-form-item>
        <el-form-item label="选择地址:">
          <el-input v-model.trim="form.address" placeholder="输入地址，自动筛选" style="width:250px;display:inline-block;" />
          <el-input v-model.trim="form.detail" placeholder="详细地址(优先保存)" style="width:250px;display:inline-block;" />
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model.trim="form.number" placeholder="请填写排序" style="width:250px" />
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
import { getNetStand, editNetStand, addNetStand } from '@/api/netStand'

export default {
  name: 'NetStandDetails',
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入网点名称', trigger: 'blur' }
        ],
        headname: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ]
      },
      id: this.$route.query.id,
      form: {
        name: '',
        dept: '',
        headname: '',
        tel: '',
        headimg: '',
        province: '',
        city: '',
        area: '',
        address: '',
        longitude: '',
        latitude: '',
        number: ''
      },
      poster: [],
      frontFileList: [],
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
      getNetStand({ id: this.id }, '.app-container').then(res => {
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
        message: '请求失败！'
      })
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.id) {
            addNetStand(Object.assign({ id: this.id }, this.form), '.app-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/other/netStand')
              }
            })
          } else {
            editNetStand(this.form, '.app-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.$store.dispatch('delView', this.$route)
                this.$router.push('/other/netStand')
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

