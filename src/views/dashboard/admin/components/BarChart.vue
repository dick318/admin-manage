<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getAgentCommission } from '@/api/order'
import { getAgentIncome } from '@/api/data'

const animationDuration = 6000

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
      commission: '',
      recharge: '',
      chart: null
    }
  },
  beforeMount() {
    getAgentCommission().then(res => {
      if (res.status !== 0) {
        return
      }
      this.commission = [
        +res.data['1月'], +res.data['2月'], +res.data['3月'], +res.data['4月'], +res.data['5月'], +res.data['6月'],
        +res.data['7月'], +res.data['8月'], +res.data['9月'], +res.data['10月'], +res.data['11月'], +res.data['12月']
      ]
      if (this.recharge) {
        this.chart.setOption({
          series: [
            {
              data: this.recharge
            }, {
              data: this.commission
            }
          ]
        })
      }
    })
    getAgentIncome({ type: 'month' }).then(res => {
      if (res.status !== 0) {
        return
      }
      this.recharge = [
        +res.data['1月'], +res.data['2月'], +res.data['3月'], +res.data['4月'], +res.data['5月'], +res.data['6月'],
        +res.data['7月'], +res.data['8月'], +res.data['9月'], +res.data['10月'], +res.data['11月'], +res.data['12月']
      ]
      if (this.commission) {
        this.chart.setOption({
          series: [
            {
              data: this.recharge
            }, {
              data: this.commission
            }
          ]
        })
      }
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
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['充值统计', '佣金统计'],
          right: '10%'
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '充值统计',
          type: 'bar',
          barWidth: '40%',
          barGap: '-100%',
          data: [],
          animationDuration
        }, {
          name: '佣金统计',
          type: 'bar',
          barWidth: '40%',
          data: [],
          animationDuration
        }]
      })
    }
  }
}
</script>
