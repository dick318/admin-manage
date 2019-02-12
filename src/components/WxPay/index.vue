<template>
  <div>
    <div class="box-title">
      <img :src="WePayLogo" alt="">
      <div class="order">
        总金额：
        <span>￥</span>
        <span class="price">{{ price }}</span>
      </div>
    </div>
    <div v-if="javaCode" id="erweima" class="erweima">
      <img id="codeimg" :src="javaCode" alt="">
    </div>
    <qrcode-vue v-else id="erweima" :value="value" :size="size" level="H"/>
    <div class="info"><img :src="info" alt=""></div>
  </div>
</template>

<script>
import info from '@/assets/info.png'
import WePayLogo from '@/assets/WePayLogo.png'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'WxPay',
  components: {
    QrcodeVue
  },
  props: {
    price: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 260
    },
    value: {
      type: String,
      default: ''
    },
    javaCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      WePayLogo,
      info
    }
  }
}
</script>

<style scoped>

.box-title img{
    width: 150px;
    padding: 0 15px 15px 15px;
    float: left;
}
.box-title div{
    float: left;
    margin-top: 8px;
    padding: 0 0 15px 0;
}
.erweima img{
    width: 260px;
}
.info img{
    padding-top:15px;
}
.order span{
    color: #ff6600;
}

</style>
