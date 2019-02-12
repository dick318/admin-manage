<template>
  <div class="app-container">
    <el-button v-waves size="small" type="primary" class="filter-item" @click="handleDownload">
      API文档下载
    </el-button>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { downloadFile } from '@/utils'
export default {
  name: 'API',
  directives: {
    waves
  },
  methods: {
    handleDownload() {
      downloadFile('http://wx.szcoolfish.com/filedata/apidoc/external/COOLFISH_API_V3.0.pdf', 'COOLFISH_API_V3.0.pdf')
    }
  }
}
</script>
