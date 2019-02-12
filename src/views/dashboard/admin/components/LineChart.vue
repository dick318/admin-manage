<template>
  <div :class="className" :chartData="chartData" :style="{height:height}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
// import resize from '@/components/Charts/mixins/resize'
export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    height: {
      type: String,
      default: '450px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions({ legendData, sumData, cmccData, ctccData, cuccData, xAxisData, totalMoney, payCount, avgMoney, addFans } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legendData
        },
        series: [{
          name: legendData[0], itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          markPoint: {
            data: addFans ? [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ] : []
          },
          markLine: {
            data: addFans ? [
              { type: 'average', name: '平均值' }
            ] : []
          },
          smooth: true,
          type: 'line',
          data: sumData || totalMoney || addFans,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: legendData[1],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: cmccData || payCount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: legendData[2],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#4dd9d5',
              lineStyle: {
                color: '#4dd9d5',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: ctccData || avgMoney,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: legendData[3],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ffb980',
              lineStyle: {
                color: '#ffb980',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: cuccData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
