<template>
  <div :class="className" :style="{height:height}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('echarts/map/js/china')
import { debounce } from '@/utils'
import { agentInfo } from '@/api/data'
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
    }
  },
  data() {
    return {
      chart: null,
      data: [
        { name: '海门', value: 9 }
      ],
      geoCoordMap: {
        '河北': [114.48, 38.03],
        '山西': [112.53, 37.87],
        '辽宁': [123.38, 41.8],
        '吉林': [125.35, 43.88],
        '黑龙江': [126.63, 45.75],
        '江苏': [118.78, 32.04],
        '浙江': [120.19, 30.26],
        '安徽': [117.27, 31.86],
        '福建': [119.3, 26.08],
        '江西': [115.89, 28.68],
        '山东': [117, 36.65],
        '河南': [113.65, 34.76],
        '广东': [113.23, 23.16],
        '湖南': [113, 28.21],
        '湖北': [114.31, 30.52],
        '海南': [110.35, 20.02],
        '四川': [104.06, 30.67],
        '贵州': [106.71, 26.57],
        '云南': [102.73, 25.04],
        '陕西': [108.95, 34.27],
        '甘肃': [103.73, 36.03],
        '青海': [101.74, 36.56],
        '内蒙古': [111.65, 40.82],
        '广西': [108.33, 22.84],
        '西藏': [91.11, 29.97],
        '宁夏': [106.27, 38.47],
        '新疆': [87.68, 43.77],
        '北京': [116.46, 39.92],
        '重庆': [106.54, 29.59],
        '上海': [121.48, 31.22],
        '天津': [117.2, 39.13]
      }
    }
  },
  beforeMount() {
    agentInfo({ gbkey: 'province' }).then(res => {
      if (res.status === 0) {
        const dataArr = []
        for (const [key, value] of Object.entries(res.data)) {
          let keyExport = ''
          if (this.geoCoordMap[key.slice(0, 2)]) {
            keyExport = key.slice(0, 2)
          } else if (this.geoCoordMap[key.slice(0, 3)]) {
            keyExport = key.slice(0, 3)
          }
          var geoCoord = this.geoCoordMap[key.slice(0, 2)] || this.geoCoordMap[key.slice(0, 3)]
          if (geoCoord) {
            let flag = false
            if (dataArr.length > 0) {
              for (const [i, v] of dataArr.entries()) {
                if (v.name === keyExport) {
                  const index = dataArr.indexOf(v)
                  v.value = +v.value + value
                  dataArr.splice(index, 1, v)
                  flag = true
                } else if (flag || i === dataArr.length - 1) {
                  dataArr.push({
                    name: keyExport,
                    value: value
                  })
                  break
                }
              }
            } else {
              dataArr.push({
                name: keyExport,
                value: value
              })
            }
          }
        }
        this.data = dataArr
        this.initChart()
      }
    })
  },
  mounted() {
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
    convertData(data = this.data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: '20%',
          top: '10%',
          data: ['代理分布'],
          textStyle: {
            color: '#0084cd'
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [
          {
            name: '代理分布',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.convertData(this.data),
            symbolSize: function(val) {
              return val[2] / 10
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ddb926'
              }
            }
          },
          {
            name: '代理分布',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: this.convertData(this.data.sort(function(a, b) {
              return b.value - a.value
            })),
            symbolSize: function(val) {
              return val[2] / 10
            },
            tooltip: {
              formatter: function(c) {
                return `${c.seriesName}<br/>${c.name}:${c.value[2]}`
              }
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    }
  }
}
</script>
