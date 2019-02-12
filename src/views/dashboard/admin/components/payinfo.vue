<template>
  <el-row :gutter="30" class="panel-group">
    <el-col v-if="checkPermission(['kuyuplat:analyzer:payinfo'])||checkPermission(['kuyuplat:analyzer:cardoper'])||checkPermission(['kuyuplat:analyzer:cardstatus'])" :xs="24" :sm="24" :lg="12" :xl="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message hidden-xs-only">
          <svg-icon icon-class="bank" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">本月充值</span>
            <count-to :start-val="0" :end-val="payinfo.curMoney" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">本月次数</span>
            <count-to :start-val="0" :end-val="payinfo.curCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"><span class="card-panel-title">上月充值</span>
            <count-to :start-val="0" :end-val="payinfo.lastMoney" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"><span class="card-panel-title">上月次数</span>
            <count-to :start-val="0" :end-val="payinfo.lastCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col v-if="checkPermission(['kuyuplat:analyzer:cardoper'])" :xs="24" :sm="24" :lg="12" :xl="8" class="card-panel-col">
      <div class="card-panel cardOperator">
        <div class="card-panel-icon-wrapper icon-people hidden-xs-only">
          <svg-icon icon-class="card" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">卡片总数</span>
            <count-to :start-val="0" :end-val="cardOperator.total" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">移动</span>
            <count-to :start-val="0" :end-val="cardOperator.cmcc" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"><span class="card-panel-title">电信</span>
            <count-to :start-val="0" :end-val="cardOperator.ctcc" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"><span class="card-panel-title">联通</span>
            <count-to :start-val="0" :end-val="cardOperator.cucc" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col v-if="checkPermission(['kuyuplat:analyzer:cardstatus'])" :xs="24" :sm="24" :lg="12" :xl="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard hidden-xs-only">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">正常数</span>
            <count-to :start-val="0" :end-val="normal" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description lineOne">
          <div class="card-panel-text"><span class="card-panel-title">停机数</span>
            <count-to :start-val="0" :end-val="stop" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"><span class="card-panel-title">待激活数</span>
            <count-to :start-val="0" :end-val="toActivate" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import checkPermission from '@/utils/permission' // 权限判断函数
import { payinfo, cardOperator } from '@/api/data'

export default {
  components: {
    CountTo
  },
  props: {
    normal: {
      type: Number,
      default: 0
    },
    stop: {
      type: Number,
      default: 0
    },
    toActivate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      payinfo: {
        curMoney: 0,
        curCount: 0,
        lastMoney: 0,
        lastCount: 0
      },
      cardOperator: {
        cmcc: 0,
        ctcc: 0,
        cucc: 0,
        total: 0
      }
    }
  },
  created() {
    payinfo({}).then(res => {
      if (res.status === 0) {
        this.payinfo = Object.assign(this.payinfo, res.data)
      }
    })
    cardOperator({}).then(res => {
      if (res.status === 0) {
        this.cardOperator.cmcc = res.data[1]
        this.cardOperator.ctcc = res.data[2]
        this.cardOperator.cucc = res.data[3]
        this.cardOperator.total = res.data.total
      }
    })
  },
  methods: {
    checkPermission
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .lineOne{
      margin-top: 20px!important;
    }
    .card-panel-description {
      font-weight: bold;
      display: inline-block;
      margin: 0 10px;
      width: 35%;
      .card-panel-text {
        white-space: nowrap;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-title{
          display: inline-block;
          width: 70px;
      }
      .card-panel-num {
        line-height: 22px;
        font-size: 20px;
        color: #F56C6C;
      }
    }
  }
}
</style>
