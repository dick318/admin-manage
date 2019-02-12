<template>
  <div
    :class="className"
    :id="id"
    :xData="xData"
    :legendData="legendData"
    :seriesData0="seriesData0"
    :seriesData1="seriesData1"
    :seriesData2="seriesData2"
    :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    xData: {
      type: Array,
      required: true
    },
    legendData: {
      type: Array,
      required: true
    },
    seriesData0: {
      type: Array,
      required: true
    },
    seriesData1: {
      type: Array,
      required: true
    },
    seriesData2: {
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
    xData: function(newData, oldData) {
      this.chart.setOption({
        xAxis: [{
          data: this.xData
        }]
      })
    },
    seriesData0: function(newData, oldData) {
      this.chart.setOption({
        series: [{
          data: this.seriesData0
        }]
      })
    },
    seriesData1: function(newData, oldData) {
      this.chart.setOption({
        series: [{}, {
          data: this.seriesData1
        }]
      })
    },
    seriesData2: function(newData, oldData) {
      this.chart.setOption({
        series: [{}, {}, {
          data: this.seriesData2
        }]
      })
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter: `{b} <br/>{a0} : {c0} MB<br/> {a1} : {c1} MB<br/>  {a2} : {c2} %`
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          textStyle: {
            color: '#90979c'
          },
          data: this.legendData
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: this.xData
        }],

        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        },
        {
          type: 'value',
          name: '使用率',
          min: 0,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisLabel: {
            formatter: '{value} %'
          }
        }],
        series: [{
          name: this.legendData[0],
          type: 'bar',
          barMaxWidth: 35,
          barGap: '-100%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: 'rgba(255,144,128,1)'
                },
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.seriesData0
        },

        {
          name: this.legendData[1],
          type: 'bar',
          barMaxWidth: 35,
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'inside',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.seriesData1
        }, {
          name: this.legendData[2],
          type: 'line',
          symbolSize: 10,
          yAxisIndex: 1,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.seriesData2
        }
        ]
      })
    }
  }
}
</script>
