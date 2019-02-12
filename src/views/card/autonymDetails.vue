<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-position="right" class="form" label-width="220px">
        <el-form-item label="卡号:">
          <el-input v-model.trim="form.card" class="filter-item" clearable style="width:250px" readonly/>
        </el-form-item>
        <el-form-item label="客户姓名:">
          <el-input v-model.trim="form.name" placeholder="姓名(企业名称)" style="width:250px" readonly/>
        </el-form-item>
        <el-form-item label="客户电话:">
          <el-input v-model.trim="form.phone" placeholder="电话(企业联系人电话)" style="width:250px" readonly/>
        </el-form-item>
        <el-form-item label="身份证号:">
          <el-input v-model.trim="form.cardNo" placeholder="身份证(企业组织结构代码)" style="width:250px" readonly/>
        </el-form-item>
        <el-form-item label="身份证证件照1:">
          <img v-if="form.pic1" :src="form.pic1" class="avatar">
        </el-form-item>
        <el-form-item label="身份证证件照2:">
          <img v-if="form.pic2" :src="form.pic2" class="avatar">
        </el-form-item>
        <el-form-item label="身份证证件照3:">
          <img v-if="form.pic3" :src="form.pic3" class="avatar">
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="form.status" class="filter-item" clearable placeholder="请选择审核状态">
            <el-option
              v-for="item in withdrawStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-button v-waves size="small" type="primary" class="filter-item action" @click="order">审核</el-button>
        </el-form-item>
        <el-form-item v-if="form.status==3" label="失败的原因:">
          <el-input v-model.trim="form.text" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:240px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写失败的原因！" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { withdrawStatus } from '@/utils/mapArr'
import { getCardReal, editCardReal } from '@/api/cardReal'

export default {
  name: 'AutonymDetails',
  directives: {
    waves
  },
  data() {
    return {
      withdrawStatus,
      form: {
        card: '',
        name: '',
        phone: '',
        cardNo: '',
        pic1: '',
        pic2: '',
        pic3: ''
      },
      id: this.$route.query.id,
      tel: this.$route.query.tel || this.$route.query.iccid || '',
      list: []
    }
  },
  created() {
    getCardReal({ id: this.id, tel: this.tel }, '.filter-container').then(res => {
      if (+res.status === 0) {
        this.form = this.tel ? res.data.rows[0] : res.data
      }
      this.$notify({
        type: +res.status === 0 ? 'success' : 'error',
        message: res.message,
        duration: 2000
      })
    })
  },
  methods: {
    order() {
      if (this.form.status === 1) {
        this.$notify({
          type: 'error',
          message: '请选择审核状态'
        })
        return
      }
      if (this.form.status === 3) {
        if (!this.form.text) {
          this.$notify({
            type: 'error',
            message: '请输入拒绝理由！'
          })
          return
        }
      }
      editCardReal({ status: this.form.status, ids: this.form.id, reason: this.form.text }, '.filter-container').then(res => {
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
    }

  }
}
</script>

