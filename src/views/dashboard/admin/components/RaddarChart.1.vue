<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { cardStatus } from '@/api/data'

const animationDuration = 3000

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      series: {},
      data: ''
    }
  },
  beforeMount() {
    cardStatus({
      operatorType: 2
    }).then(res => {
      if (+res.status !== 0) {
        return false
      }
      var qita = (res.data[0] || 0) +
      (res.data[7] || 0) +
      (res.data[8] || 0) +
      (res.data[9] || 0) +
      (res.data[10] || 0) +
      (res.data[11] || 0)
      this.series = {
        value: [res.data[2] || 0,
          res.data[1] || 0,
          (res.data[4] || 0) + (res.data[3] || 0),
          (res.data[5] || 0) + (res.data[6] || 0),
          qita,
          res.data[11] || 0],
        name: '电信'
      }
      this.chart.setOption({
        series: [{
          // 根据名字对应到相应的系列
          data: [this.series]
        }]
      })
    })
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
          // trigger: 'axis',
          // axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '正常' },
            { name: '待激活' },
            { name: '停机' },
            { name: '销号' },
            { name: '其他' },
            { name: '库存期' }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['电信']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              color: '#4dd9d5',
              opacity: 1
            }
          },
          data: this.data,
          animationDuration: animationDuration
        }
        ]
      })
    }
  }
}
</script>
