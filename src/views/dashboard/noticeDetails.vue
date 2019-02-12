<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item prop="tetle" label="标题:">
          <el-input v-model.trim="form.tetle" placeholder="请填写标题" style="width:250px" />
        </el-form-item>
        <el-form-item label="图文详情:" prop="content" >
          <tinymce :height="500" v-model="form.content"/>
          <el-button v-waves size="small" type="primary" class="filter-item action" @click="order">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // 水波纹指令
import { saveNotice, searchNotice, updateNotice } from '@/api/data'

export default {
  name: 'NoticeDetails',
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        tetle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      id: this.$route.query.id,
      form: {
        tetle: '',
        content: '',
        id: ''
      }
    }
  },
  created() {
    if (this.id) {
      searchNotice({ id: this.id }, '.filter-container').then(res => {
        if (res.status === 0) {
          for (const v of res.data.rows) {
            if (v.id === +this.id) {
              this.form = Object.assign({}, v)
            }
          }
        }
      })
    }
  },
  methods: {
    order() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.id) {
            delete this.form.addtime
            updateNotice(Object.assign({ id: this.id }, this.form), '.filter-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (+res.status !== 0) {
                return false
              }
              this.$store.dispatch('delView', this.$route)
              this.$router.push('/noticeList')
            })
          } else {
            saveNotice(this.form, '.filter-container').then(res => {
              this.$notify({
                type: res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (+res.status !== 0) {
                return false
              }
              this.$store.dispatch('delView', this.$route)
              this.$router.push('/noticeList')
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

