<template>
  <div
    v-if="checkPermission(
      ['kuyuplat:analyzer:payinfo','kuyuplat:analyzer:cardoper','kuyuplat:analyzer:cardstatus','kuyuplat:analyzer:actinfo','kuyuplat:notice:search',
       'kuyuplat:analyzer:actinfo','kuyuplat:analyzer:paydayinfo','kuyuplat:analyzer:agentinfo','kuyuplat:analyzer:wxinfo','kuyuplat:analyzer:wxdayinfo'
    ])"
    class="dashboard-editor-container">
    <panel-group v-if="checkPermission(['kuyuplat:analyzer:payinfo','kuyuplat:analyzer:cardoper','kuyuplat:analyzer:cardstatus'])" :normal="cardStatus.normal" :stop="cardStatus.stop" :to-activate="cardStatus.toActivate" />
    <el-tabs v-model="active" type="border-card">
      <el-tab-pane v-if="checkPermission(['kuyuplat:analyzer:cardstatus','kuyuplat:analyzer:actinfo','kuyuplat:notice:search'])" name="card" lazy>
        <span slot="label"><i class="el-icon-date"/> 卡片数据</span>
        <el-row v-if="checkPermission(['kuyuplat:analyzer:cardstatus','kuyuplat:analyzer:actinfo','kuyuplat:notice:search'])" :gutter="8" >
          <el-col v-if="checkPermission(['kuyuplat:analyzer:cardstatus'])" :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;">
            <el-card>
              <pie-Chart
                ref="cardChart"
                :legend-data="cardStatus.legendData"
                :name="cardStatus.name"
                :series-data="cardStatus.seriesData"/>
            </el-card>
          </el-col>
          <el-col v-if="checkPermission(['kuyuplat:analyzer:actinfo'])" :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 10}" :xl="{span: 10}">
            <el-card>
              <Line-chart ref="cardChart" :chart-data="chartData"/>
            </el-card>
          </el-col>
          <el-col v-if="checkPermission(['kuyuplat:notice:search'])" :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
            <box-card/>
          </el-col>
        </el-row>
        <el-row v-if="checkPermission(['kuyuplat:analyzer:cardstatus'])" :gutter="10" style="margin-top:10px">
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <el-card>
              <raddar-chart ref="cardChart"/>
            </el-card>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <el-card>
              <raddar-chart1 ref="cardChart"/>
            </el-card>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}">
            <el-card>
              <raddar-chart2 ref="cardChart"/>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:analyzer:payinfo','kuyuplat:analyzer:paydayinfo'])" name="finance" lazy>
        <span slot="label"><svg-icon icon-class="balance-scale"/> 财务数据</span>
        <el-row v-if="checkPermission(['kuyuplat:analyzer:payinfo'])" :gutter="8">
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
            <el-card>
              <Line-chart ref="financeChart" :chart-data="totalMoneyData"/>
            </el-card>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
            <el-card>
              <Line-chart ref="financeChart" :chart-data="payCountData"/>
            </el-card>
          </el-col>
        </el-row>
        <weChatPay v-if="checkPermission(['kuyuplat:analyzer:paydayinfo'])"/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:analyzer:agentinfo'])" name="agent" lazy>
        <span slot="label"><svg-icon icon-class="sitemap"/> 代理商数据</span>
        <el-card>
          <agentMap/>
        </el-card>
        <el-row :gutter="8" style="margin-top:10px;">
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
            <el-card>
              <pie-Chart
                ref="agentChart"
                :legend-data="accountType.legendData"
                :name="accountType.name"
                :series-data="accountType.seriesData"/>
            </el-card>
          </el-col>
          <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}">
            <el-card>
              <pie-Chart
                ref="agentChart"
                :legend-data="agentType.legendData"
                :name="agentType.name"
                :series-data="agentType.seriesData"/>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['kuyuplat:analyzer:wxinfo','kuyuplat:analyzer:wxdayinfo'])" name="wechat" lazy>
        <span slot="label"><svg-icon icon-class="wechat"/>  微信粉丝数据</span>
        <el-card>
          <weChatFans ref="wechatChart"/>
        </el-card>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import PanelGroup from './components/payinfo'
import RaddarChart from './components/RaddarChart'
import RaddarChart1 from './components/RaddarChart.1'
import RaddarChart2 from './components/RaddarChart.2'
import LineChart from './components/LineChart'
import BoxCard from './components/BoxCard'
import PieChart from './components/PieChart'
import weChatPay from './components/weChatPay'
import agentMap from './components/agentMap'
import weChatFans from './components/weChatFans'

import { cardStatus, actMonthInfo, payMonthInfo, agentInfo } from '@/api/data'
import { cardStatusMap, utypeMap } from '@/utils/mapArr'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'DashboardAdmin',
  components: {
    weChatFans,
    agentMap,
    PanelGroup,
    LineChart,
    RaddarChart,
    RaddarChart1,
    RaddarChart2,
    BoxCard,
    PieChart,
    weChatPay
  },
  data() {
    return {
      active: 'card',
      cardStatusMap,
      utypeMap,
      cardStatus: {
        normal: 0,
        stop: 0,
        toActivate: 0,
        legendData: [],
        name: '卡片状态',
        seriesData: []
      },
      agentType: {
        legendData: [],
        name: '代理商等级',
        seriesData: []
      },
      accountType: {
        legendData: [],
        name: '代理商类型',
        seriesData: []
      },
      accountTypeMap: {
        0: '未知',
        1: '行业用户',
        2: '渠道用户'
      },
      totalMoneyData: {
        sumData: [],
        cmccData: [],
        ctccData: [],
        cuccData: [],
        xAxisData: [],
        legendData: ['总充值额', '移动充值额', '电信充值额', '联通充值额']
      },
      payCountData: {
        sumData: [],
        cmccData: [],
        ctccData: [],
        cuccData: [],
        xAxisData: [],
        legendData: ['总充值次数', '移动充值次数', '电信充值次数', '联通充值次数']
      },
      chartData: {
        sumData: [],
        cmccData: [],
        ctccData: [],
        cuccData: [],
        xAxisData: [],
        legendData: ['总卡数', '移动卡数', '电信卡数', '联通卡数']
      }
    }
  },

  watch: {
    active(val) {
      this.$nextTick(() => {
        switch (val) {
          case 'card':
            this.$refs.cardChart.chart.resize()
            break
          case 'finance':
            this.$refs.financeChart.chart.resize()
            break
          case 'agent':
            this.$refs.agentChart.chart.resize()
            break
          case 'wechat':
            this.$refs.wechatChart.$refs.chart.chart.resize()
            break
          default:
            break
        }
      })
    }
  },
  created() {
    if (this.checkPermission(['kuyuplat:analyzer:actinfo'])) {
      this.getActMonthInfo()
    }
    if (this.checkPermission(['kuyuplat:analyzer:cardstatus'])) {
      this.getCardStatus()
    }
    if (this.checkPermission(['kuyuplat:analyzer:payinfo'])) {
      this.getPayMonthInfo()
    }
    if (this.checkPermission(['kuyuplat:analyzer:agentinfo'])) {
      this.getAgent()
    }
  },
  methods: {
    checkPermission,
    getAgent() {
      agentInfo({ gbkey: 'type' }).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            if (key !== 'total') {
              this.accountType.seriesData.push(
                { value, name: this.utypeMap[+key] || key }
              )
              this.accountType.legendData.push(
                this.utypeMap[+key] || key
              )
            }
          }
        }
      })
      agentInfo({ gbkey: 'accountType' }).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            if (key !== 'total') {
              this.agentType.seriesData.push(
                { value, name: this.accountTypeMap[+key] || key }
              )
              this.agentType.legendData.push(
                this.accountTypeMap[+key] || key
              )
            }
          }
        }
      })
    },
    getCardStatus() {
      cardStatus({}).then(res => {
        if (res.status === 0) {
          this.cardStatus.normal = res.data[1]
          this.cardStatus.stop = res.data[2]
          this.cardStatus.toActivate = res.data[4]
          for (const [key, value] of Object.entries(res.data)) {
            this.cardStatus.seriesData.push(
              { value, name: this.cardStatusMap[+key] || key }
            )
            this.cardStatus.legendData.push(
              this.cardStatusMap[+key] || key
            )
          }
        }
      })
    },
    getActMonthInfo() {
      actMonthInfo({}).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            this.chartData.sumData.push(
              { value, name: key }
            )
            this.chartData.xAxisData.push(key)
          }
        }
      })
      actMonthInfo({ operatorType: 1 }).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            this.chartData.cmccData.push(
              { value, name: key }
            )
          }
        }
      })
      actMonthInfo({ operatorType: 2 }).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            this.chartData.ctccData.push(
              { value, name: key }
            )
          }
        }
      })
      actMonthInfo({ operatorType: 3 }).then(res => {
        if (res.status === 0) {
          for (const [key, value] of Object.entries(res.data)) {
            this.chartData.cuccData.push(
              { value, name: key }
            )
          }
        }
      })
    },
    getPayMonthInfo() {
      payMonthInfo({}).then(res => {
        if (res.status === 0) {
          for (const value of Object.values(res.data)) {
            this.totalMoneyData.sumData.push(
              { value: value.totalMoney, name: value.time }
            )
            this.payCountData.sumData.push(
              { value: value.payCount, name: value.time }
            )
            this.totalMoneyData.xAxisData.push(value.time)
            this.payCountData.xAxisData.push(value.time)
          }
        }
      })
      payMonthInfo({ operatorType: 1 }).then(res => {
        if (res.status === 0) {
          for (const value of Object.values(res.data)) {
            this.totalMoneyData.cmccData.push(
              { value: value.totalMoney, name: value.time }
            )
            this.payCountData.cmccData.push(
              { value: value.payCount, name: value.time }
            )
          }
        }
      })
      payMonthInfo({ operatorType: 2 }).then(res => {
        if (res.status === 0) {
          for (const value of Object.values(res.data)) {
            this.totalMoneyData.ctccData.push(
              { value: value.totalMoney, name: value.time }
            )
            this.payCountData.ctccData.push(
              { value: value.payCount, name: value.time }
            )
          }
        }
      })
      payMonthInfo({ operatorType: 3 }).then(res => {
        if (res.status === 0) {
          for (const value of Object.values(res.data)) {
            this.totalMoneyData.cuccData.push(
              { value: value.totalMoney, name: value.time }
            )
            this.payCountData.cuccData.push(
              { value: value.payCount, name: value.time }
            )
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
