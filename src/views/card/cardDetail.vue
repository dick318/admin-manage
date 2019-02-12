<template>
  <div
    :msisdn="msisdn"
    :cardId="cardId"
    :source="source"
  >
    <ul class="flow-ul l sms-ul">
      <li><span>ICCID：</span>{{ data.iccid }}</li>
      <li><span>接入号：</span>{{ data.tel }}</li>
      <li><span>虚拟号：</span>{{ data.number }}</li>
      <li><span>绑定的IMEI号：</span>{{ data.imei }}</li>
      <li><span>实名状态：</span>{{ data.realStatus==1?'未认证':data.realStatus==2?'认证':'' }}</li>
      <li><span>套餐类型：</span>{{ typeMap[data.type] }}</li>
      <li><span>所在运营商：</span>{{ data.operatorType==1?'移动':data.operatorType==2?'电信':data.operatorType==3?'联通':'' }}</li>
      <li><span>供应商帐号：</span>{{ zidObject[data.zid] }}</li>
      <li><span>供应商套餐批次：</span>{{ oidObject[data.operatorid] }}</li>
      <li><span>卡片状态：</span>{{ cardStatusMap[data.cardStatus] }}</li>
      <li><span>生命周期：</span>{{ lifeCycleMap[data.lifeCycle] }}</li>
      <li><span>上网状态(gprs状态)：</span>{{ data.netStatus }}</li>
      <li><span>卡片ID:</span>{{ data.id }}</li>
      <li><span>卡片类型：</span>{{ cardTypeMap[data.cardType] }}</li>
      <li><span>池子编号：</span>{{ data.poolNo }}</li>
      <li><span>卡片基本套餐：</span>{{ data.packageName }}</li>
      <li><span>供应商基础套餐：</span>{{ data.basePackageName }}</li>
      <li><span>流量显示比例：</span>{{ data.per }}</li>
      <li><span>卡片总流量：</span>{{ data.sumflow }}</li>
      <li><span>总使用量：</span>{{ data.useflow }}</li>
      <li><span>卡片总剩余流量：</span>{{ data.flow }}</li>
      <li><span>卡片更新时间：</span>{{ data.updateTime }}</li>
      <li><span>一级代理商：</span>{{ aidObject[data.fid] }}</li>
      <li><span>分配给一级代理商时间：</span>{{ data.firsttime }}</li>
      <li><span>卡片添加时间：</span>{{ data.addtime }}</li>
      <li><span>激活时间：</span>{{ data.startusetime }}</li>
      <li><span>开始时间：</span>{{ data.starttime }}</li>
      <li><span>结束时间：</span>{{ data.endtime }}</li>
      <li><span>最后一次更新时间：</span>{{ data.updatetime }}</li>
      <li><span>预注销开始时间：</span>{{ data.preOffTime }}</li>
      <li><span>备注：</span>{{ data.remarks }}</li>
      <li><span>限速等级：</span>{{ data.speed }}</li>
      <li><span>号码规则等级（易睿通10）：</span>{{ data.cardGrade }}</li>
      <li><span>是否达量断网（电信）：</span>
        <div class="" />
      </li>
      <li><span>达量断网阈值（电信）：</span>
        <div class="" />
      </li>
      <li><span>卡片是否绑定：</span>
        <div class="" />
      </li>
      <li><span>卡片余额：</span>{{ data.amount }}元</li>
      <li><span>卡片所在设备状态：</span>{{ data.deviceStatus }}</li>
      <li><span>充值次数：</span>{{ data.frequency }}</li>
      <li class="text-sum"><span>上游实名状态：</span>{{ data.upstreamRealStatus }}</li>
    </ul>
  </div>
</template>

<script>
import { getCard } from '@/api/card'
import { toSize } from '@/utils'
import {
  accountsArr,
  operatorArr,
  agentArr,
  cardStatusMap,
  lifeCycleMap,
  cardTypeMap,
  typeMap
} from '@/utils/mapArr'
export default {
  name: 'CardDetail',
  props: {
    cardId: {
      type: String,
      default: ''
    },
    msisdn: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typeMap,
      zidObject: {},
      oidObject: {},
      aidObject: {},
      cardStatusMap,
      lifeCycleMap,
      cardTypeMap,
      data: {}
    }
  },
  created() {
    if (!this.source) {
      this.handleFilter()
    }
    operatorArr((oidSelect, operatorTypeArr, oidObject) => {
      this.oidObject = oidObject
    })
    agentArr(
      (
        agentSelect,
        bankCardObject,
        alipayObject,
        anameObject,
        perObject,
        aidObject
      ) => {
        this.aidObject = aidObject
      }
    )
    accountsArr((zidSelect, accountsTypeArr, zidObject) => {
      this.zidObject = zidObject
    })
  },
  methods: {
    handleFilter() {
      getCard({ cardId: this.cardId || this.$route.query.cardId, msisdn: this.msisdn }, '.flow-ul').then(res => {
        if (res.status === 0) {
          this.data = Object.assign(res.data.rows[0], {})
          this.data.sumflow = toSize(+this.data.sumflow * 1024)
          this.data.useflow = toSize(+this.data.useflow * 1024)
          this.data.flow = toSize(+this.data.flow * 1024)
        }
      })
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 768px) {
  .flow-ul li {
    padding: 10px 0;
    width: 50%!important;
    word-wrap:break-word;
  }
}
.app-container {
  padding-top: 0 !important;
}
.flow-details {
  font-size: 15px;
}
.clear {
  clear: both;
}
.flowD-tit {
  font-size: 16px;
  background: #f5f7fa;
  height: 44px;
  line-height: 44px;
  padding-left: 10px;
  font-weight: bold;
}
.flowD-main {
  background: #fff;
  padding: 10px 0 10px 10px;
  overflow: hidden;
}
.flow-ul {
  margin-top: 0 !important;
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  padding-left: 0px;
}
.flow-ul li {
  padding: 10px 0;
  width: 32.5%;
}

li {
  list-style: none;
}
.sms-ul span {
  min-width: 180px !important;
}

.flow-ul span {
  font-weight: bold;
  padding-right: 10px;
  font-size: 12px;
}
.text-sum {
  color: red;
}
.flow-ul div {
  display: inline-block;
}
</style>

