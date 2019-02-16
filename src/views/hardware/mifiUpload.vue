<template>
  <div class="app-container">
    <uploadExcel :post-url="postUrl" :push-url="pushUrl" :down-load-url="downLoadUrl"/>
  </div>
</template>

<script>
import uploadExcel from '@/components/Upload/uploadExcel'

export default {
  name: 'MifiUpload',
  components: { uploadExcel },
  data() {
    return {
      postUrl: '/plat/mifi/v4/import',
      pushUrl: '/hardware/mifi',
      downLoadUrl: 'http://wx.szcoolfish.com/upload/excelmodel/MIFI-IMPORT.xlsx'
    }
  }
}
</script>
