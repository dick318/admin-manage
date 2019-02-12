<template>
  <div id="container"/>
</template>
<script>
import { TMap } from '@/utils/TMap'

export default {
  data() {
    return {
    }
  },
  mounted() {
    TMap('MJEBZ-P2QR4-VRTUZ-XL6JL-MXW2T-AOB5W&libraries=place').then(qq => {
      var map = new qq.maps.Map(document.getElementById('container'), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(39.916527, 116.397128),
        zoom: 8
      })
      console.log(map)
      this.getAddress({ location: '28.7033487,115.8660847' })
    })
  },
  created: function() {

  },
  methods: {
    // 获取地址
    getAddress(data) {
      data.key = 'MJEBZ-P2QR4-VRTUZ-XL6JL-MXW2T-AOB5W'
      this.$http.jsonp(`https://apis.map.qq.com/ws/geocoder/v1?key=MJEBZ-P2QR4-VRTUZ-XL6JL-MXW2T-AOB5W&location=28.7033487,115.8660847`).then(function(res) {
        console.log(res)
      })
    }
  }
}
</script>
<style>
#container {
    min-width:600px;
    min-height:767px;
}
</style>
