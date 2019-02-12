<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="微信token值:">
          <el-input v-model.trim="form.token" readonly placeholder="微信token值" style="width:250px" />
        </el-form-item>
        <el-form-item label="微信公众号AppId:" prop="appId">
          <el-input v-model.trim="form.appId" placeholder="微信公众号AppId" style="width:250px" />
        </el-form-item>
        <el-form-item label="微信公众号AppSecret:" prop="appSecret">
          <el-input v-model.trim="form.appSecret" placeholder="微信公众号AppSecret" style="width:250px" />
        </el-form-item>
        <el-form-item label="微信支付商户MCHID:" prop="mchid">
          <el-input v-model.trim="form.mchid" placeholder="微信支付商户MCHID" style="width:250px" />
        </el-form-item>
        <el-form-item label="商户秘钥PartnerKey:" prop="partnerKey">
          <el-input v-model.trim="form.partnerKey" placeholder="商户秘钥PartnerKey" style="width:250px" />
          <el-button v-permission="['kuyuplat:wx:setcfg']" v-waves size="small" type="primary" style="margin-left:10px;vertical-align: baseline;" class="filter-item " @click="order">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getWxCfg, setWxCfg } from '@/api/wechat'

export default {
  name: 'WeChatSetting',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        token: '',
        appId: '',
        appSecret: '',
        mchid: '',
        partnerKey: ''
      },
      rules: {
        appId: [
          {
            required: true,
            message: '微信公众号AppId不能为空',
            trigger: 'blur'
          }
        ],
        appSecret: [
          {
            required: true,
            message: '微信公众号AppSecret不能为空',
            trigger: 'blur'
          }
        ],
        mchid: [
          {
            required: true,
            message: '微信支付商户MCHID不能为空',
            trigger: 'blur'
          }
        ],
        partnerKey: [
          {
            required: true,
            message: '商户秘钥PartnerKey不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    getWxCfg({ }, '.filter-container').then(res => {
      this.form = Object.assign({}, res.data)
    })
  },
  methods: {
    order() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          setWxCfg(this.form, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
              }
            }).catch(() => {})
        }
      })
    }
  }
}
</script>

