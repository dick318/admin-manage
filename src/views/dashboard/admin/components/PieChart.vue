<template>
  <div
    :class="className"
    :legendData="legendData"
    :name="name"
    :seriesData="seriesData"
    :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    },
    legendData: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    seriesData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData: function(newData, oldData) {
      this.chart.setOption({
        series: [{
          data: this.seriesData
        }]
      })
    },
    legendData: function(newData, oldData) {
      this.chart.setOption({
        legend: [{
          data: this.legendData
        }]
      })
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          itemGap: 25,
          left: 'center',
          bottom: '10',
          data: this.legendData
        },
        calculable: true,
        series: [
          {
            name: this.name,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
