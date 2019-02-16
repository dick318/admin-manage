import { getAgents } from '@/api/agent'
import { getOperatorIds } from '@/api/operator'
import { getAccounts } from '@/api/supplier'
import { showRoles } from '@/api/role'
import store from '../store'

// 获取代理商select
export function agentArr(callback) {
  if (store.getters.agentStatus) {
    const agentSelect = store.getters.agentSelect
    const bankCardObject = store.getters.bankCardObject
    const alipayObject = store.getters.alipayObject
    const anameObject = store.getters.anameObject
    const aidObject = store.getters.aidObject
    const perObject = store.getters.perObject
    callback(agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject)
  } else {
    return getAgents({ type: 1 }).then(res => {
      const agentSelect = []
      const bankCardObject = {}
      const alipayObject = {}
      const anameObject = {}
      const aidObject = {}
      const perObject = {}
      if (res.status === 0) {
        res.data.map((v, i) => {
          const value = v.id
          const label = v.name
          agentSelect.push({ value, label })
          bankCardObject[value] = v.bankCard
          alipayObject[value] = v.alipay
          anameObject[value] = v.name
          aidObject[value] = v.name
          perObject[value] = v.per
        })
      }
      store.dispatch('setAgentSelect', agentSelect)
      store.dispatch('setAlipayObject', alipayObject)
      store.dispatch('setAnameObject', bankCardObject)
      store.dispatch('setAnameObject', anameObject)
      store.dispatch('setAidObject', aidObject)
      store.dispatch('setPerObject', perObject)
      store.dispatch('setAgentStatus', true)
      callback(agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject)
    })
  }
}

// 获取套餐批次select
export function operatorArr(callback) {
  if (store.getters.operatorStatus) {
    const oidSelect = store.getters.oidSelect
    const operatorTypeArr = store.getters.operatorTypeArr
    const oidObject = store.getters.oidObject
    const oidList = store.getters.oidList
    callback(oidSelect, operatorTypeArr, oidObject, oidList)
  } else {
    return getOperatorIds({}).then(res => {
      const oidSelect = []
      const operatorTypeArr = []
      const oidObject = {}
      const oidList = {}
      if (res.status === 0) {
        res.data.map((v) => {
          const value = v.id
          var label = `${v.name}--${v.id}`
          oidSelect.push({ value, label })
          operatorTypeArr.push({ value: JSON.stringify(v), label: label })
          oidObject[value] = v.name
          oidList[value] = 0
        })
      }
      store.dispatch('setOidSelect', oidSelect)
      store.dispatch('setOperatorTypeArr', operatorTypeArr)
      store.dispatch('setOidObject', oidObject)
      store.dispatch('setOidList', oidList)
      store.dispatch('setOperatorStatus', true)
      callback(oidSelect, operatorTypeArr, oidObject, oidList)
    })
  }
}
// 获取供应商账号select
export function accountsArr(callback) {
  if (store.getters.accountsStatus) {
    const accountsTypeArr = store.getters.accountsTypeArr
    const zidObject = store.getters.zidObject
    const zidSelect = store.getters.zidSelect
    callback(zidSelect, accountsTypeArr, zidObject)
  } else {
    return getAccounts({}).then(res => {
      const zidSelect = []
      const accountsTypeArr = []
      const zidObject = {}
      if (res.status === 0) {
        res.data.map((v) => {
          const value = v.id
          var label = `${v.tetle}--${v.id}`
          zidSelect.push({ value, label })
          accountsTypeArr.push({ v, label })
          zidObject[value] = v.tetle
        })
      }
      store.dispatch('setZidSelect', zidSelect)
      store.dispatch('setAccountsTypeArr', accountsTypeArr)
      store.dispatch('setZidObject', zidObject)
      store.dispatch('setAccountsStatus', true)
      callback(zidSelect, accountsTypeArr, zidObject)
    })
  }
}
// 获取角色select
export function roleArr(type, callback) {
  if (store.getters.roleStatus) {
    const roleSelect = store.getters.roleSelect
    callback(roleSelect)
  } else {
    return showRoles({ type }).then(res => {
      const roleSelect = []
      if (res.status === 0) {
        res.data.rows.map((v, i) => {
          const value = v.id
          var label = v.name
          roleSelect.push({ value, label })
        })
      }
      store.dispatch('setRoleSelect', roleSelect)
      store.dispatch('setRoleStatus', true)
      callback(roleSelect)
    })
  }
}
// 运营商
const operatorTypeMap = {
  1: '移动',
  2: '电信',
  3: '联通'
}

// 生命周期
const lifeCycleMap = {
  1: '库存期',
  2: '沉默期',
  3: '正使用',
  4: '已停机',
  5: '预销号',
  6: '已注销',
  7: '强制停机'
}
// 卡片套餐类型
const cardPackageMap = {
  1: '月套餐',
  2: '累计套餐',
  3: '零月租套餐',
  4: '空套餐',
  5: '当月套餐',
  6: '日套餐'
}
// 套餐类型
const typeMap = {
  1: '月包',
  2: '季包',
  3: '年包',
  4: '基本套餐',
  5: '半年包',
  6: '累计月包'
}
// 套餐批次类型
const packageTypeMap = {
  1: '零月租',
  2: '月套餐',
  3: '累计套餐',
  4: 'MiFi套餐',
  5: '上游套餐',
  6: '日套餐',
  7: '打怪套餐'
}
// 操作类型
const operationStatusMap = {
  0: '队列中',
  1: '队列中',
  2: '运行中',
  3: '已完成',
  4: '失败'
}
// 操作类型
const operationTypeMap = {
  1: '导入卡片',
  2: '修改卡片',
  3: '删除卡片',
  4: '分卡',
  5: '卡片充值',
  6: '卡片激活',
  7: '卡片导出',
  8: '订购记录导出',
  9: '换卡处理',
  10: '异卡换套餐',
  11: '添加套餐',
  12: '修改套餐',
  13: '分配套餐',
  14: '订单导出',
  15: '余额充值导出',
  16: '佣金导出',
  17: '卡片回收',
  18: '批量停复机',
  19: '批量微信发送消息',
  20: '批量激活卡片',
  21: '客服错误卡片导入',
  22: '微信粉丝导出',
  23: '历史月流量数据导入',
  24: '批量退款',
  25: '换卡快递单号导入',
  26: '后台批量换卡',
  27: '换卡快递信息导出',
  28: '月末扣费停机',
  29: '快递发货信息导入',
  30: '联通资费计划提交',
  31: '卡片异常操作导出',
  32: '套餐导出',
  33: '实名信息导出',
  34: '号码批量查询信息',
  35: '支付记录导出',
  36: '工单导出',
  37: '影视购物卡导入',
  38: '号码批量限速',
  39: '财务数据导出',
  40: '卡片批量断复网',
  41: '联通资费计划导出',
  42: 'MIFI设备导入'
}
// 操作类型Select
const operationTypeSelect = [
  {
    value: '1',
    label: '导入卡片'
  },
  {
    value: '2',
    label: '修改卡片'
  },
  {
    value: '3',
    label: '删除卡片'
  },
  {
    value: '4',
    label: '分卡'
  },
  {
    value: '5',
    label: '卡片充值'
  },
  {
    value: '6',
    label: '卡片激活'
  },
  {
    value: '7',
    label: '卡片导出'
  },
  {
    value: '8',
    label: '订购记录导出'
  },
  {
    value: '9',
    label: '换卡处理'
  },
  {
    value: '10',
    label: '异卡换套餐'
  },
  {
    value: '11',
    label: '添加套餐'
  },
  {
    value: '12',
    label: '修改套餐'
  },
  {
    value: '13',
    label: '分配套餐'
  },
  {
    value: '14',
    label: '订单导出'
  },
  {
    value: '15',
    label: '余额充值导出'
  },
  {
    value: '16',
    label: '佣金导出'
  },
  {
    value: '17',
    label: '卡片回收'
  },
  {
    value: '18',
    label: '批量停复机'
  },
  {
    value: '19',
    label: '批量微信发送消息'
  },
  {
    value: '20',
    label: '批量激活卡片'
  },
  {
    value: '21',
    label: '客服错误卡片导入'
  },
  {
    value: '22',
    label: '微信粉丝导出'
  },
  {
    value: '23',
    label: '历史月流量数据导入'
  },
  {
    value: '24',
    label: '批量退款'
  },
  {
    value: '25',
    label: '换卡快递单号导入'
  },
  {
    value: '26',
    label: '后台批量换卡'
  },
  {
    value: '27',
    label: '换卡快递信息导出'
  },
  {
    value: '28',
    label: '月末扣费停机'
  },
  {
    value: '29',
    label: '快递发货信息导入'
  },
  {
    value: '30',
    label: '联通资费计划提交'
  },
  {
    value: '31',
    label: '卡片异常操作导出'
  },
  {
    value: '32',
    label: '套餐导出'
  },
  {
    value: '33',
    label: '实名信息导出'
  },
  {
    value: '34',
    label: '号码批量查询信息'
  },
  {
    value: '35',
    label: '支付记录导出'
  },
  {
    value: '36',
    label: '工单导出'
  },
  {
    value: '37',
    label: '影视购物卡导入'
  },
  {
    value: '38',
    label: '卡片批量限速'
  },
  {
    value: '39',
    label: '财务数据导出'
  },
  {
    value: '40',
    label: '卡片批量断复网'
  },
  {
    value: '41',
    label: '联通资费计划导出'
  },
  {
    value: '42',
    label: 'MIFI设备导入'
  }
]
// 激活类型Select
const activeTypeSelect = [
  {
    value: 1,
    label: '测试期到期处理'
  },
  {
    value: 2,
    label: '沉默期激活处理'
  },
  {
    value: 3,
    label: '库存期激活处理'
  }
]
// 套餐批次类型Select
const packageTypeSelect = [
  {
    value: 1,
    label: '零月租'
  },
  {
    value: 2,
    label: '月套餐'
  },
  {
    value: 3,
    label: '累计套餐'
  },
  {
    value: 4,
    label: 'MiFi套餐'
  },
  {
    value: 5,
    label: '上游套餐'
  },
  {
    value: 6,
    label: '日套餐'
  },
  {
    value: 7,
    label: '打怪套餐'
  }
]
// 支付订单类型Select
const orderTypeSelect = [
  {
    value: 'account',
    label: '余额充值'
  },
  {
    value: 'flow',
    label: '套餐订购'
  },
  {
    value: 'agentflow',
    label: '代理商微信收费'
  },
  {
    value: 'agentaccount',
    label: '代理商余额收费'
  },
  {
    value: 'agentRecharge',
    label: '代理商账户充值'
  },
  {
    value: 'obtain',
    label: '购卡'
  },
  {
    value: 'agentBatch',
    label: '代理商购卡 '
  }
]
// 操作者类型Select
const utypeSelect = [
  {
    value: 0,
    label: '总平台用户'
  },
  {
    value: 1,
    label: '一级代理商'
  },
  {
    value: 2,
    label: '二级代理商'
  },
  {
    value: 3,
    label: '三级代理商'
  },
  {
    value: 4,
    label: '代理商客服'
  }
]
// 电信限速Select
const ctccSpeedSelect = [
  {
    value: 10,
    label: '1Kbps'
  },
  {
    value: 11,
    label: '512Kbps'
  },
  {
    value: 12,
    label: '1Mbps'
  },
  {
    value: 13,
    label: '3Mbps'
  },
  {
    value: 14,
    label: '5Mbps'
  },
  {
    value: 15,
    label: '7Mbps'
  },
  {
    value: 16,
    label: '10Mbps'
  },
  {
    value: 17,
    label: '20Mbps'
  },
  {
    value: 18,
    label: '30Mbps'
  },
  {
    value: 19,
    label: '40Mbps'
  },
  {
    value: 20,
    label: '50Mbps'
  },
  {
    value: 21,
    label: '60Mbps'
  },
  {
    value: 22,
    label: '70Mbps'
  },
  {
    value: 23,
    label: '80Mbps'
  },
  {
    value: 24,
    label: '90Mbps'
  },
  {
    value: 25,
    label: '100Mbps'
  },
  {
    value: 26,
    label: '110Mbps'
  },
  {
    value: 27,
    label: '120Mbps'
  },
  {
    value: 28,
    label: '130Mbps'
  },
  {
    value: 29,
    label: '140Mbps'
  },
  {
    value: 30,
    label: '150Mbps'
  },
  {
    value: 31,
    label: '不限制'
  },
  {
    value: 32,
    label: '64Kbps'
  },
  {
    value: 33,
    label: '256Kbps'
  }
]
// 联通限速Select
const cuccSpeedSelect = [
  {
    value: 1119118,
    label: '正常'
  },
  {
    value: 1119218,
    label: '下行0.5Mb/s 上行0.5Mb/s'
  },
  {
    value: 1119318,
    label: '下行1Mb/s 上行1Mb/s'
  },
  {
    value: 1119418,
    label: '下行2Mb/s 上行2Mb/s'
  },
  {
    value: 1119518,
    label: '下行7.25Mb/s 上行5.75Mb/s'
  }
]
// 结束时间Select
const etime = [
  {
    value: 1,
    label: '已过期'
  },
  {
    value: 2,
    label: '三天内'
  },
  {
    value: 3,
    label: '一周内'
  },
  {
    value: 4,
    label: '一月内'
  },
  {
    value: 5,
    label: '三月内'
  }
]

// 帐号类型
const accountstypeMap = {
  1: '主账号',
  2: '商务账号',
  3: '财务账号',
  4: '仓库账号',
  5: '管理账号',
  6: '客服账号'
}
// 企业付款状态类型
const payeeStatusMap = {
  1: '打款中',
  2: '成功',
  3: '失败',
  4: '未知状态'
}

// 企业付款状态Select
const payeeStatusSelect = [
  {
    value: 1,
    label: '打款中'
  },
  {
    value: 2,
    label: '成功'
  },
  {
    value: 3,
    label: '失败'
  },
  {
    value: 4,
    label: '未知状态'
  }
]
// 帐号Select
const accountstypeSelect = [
  {
    value: 1,
    label: '主账号'
  },
  {
    value: 2,
    label: '商务账号'
  },
  {
    value: 3,
    label: '财务账号'
  },
  {
    value: 4,
    label: '仓库账号'
  },
  {
    value: 5,
    label: '管理账号'
  },
  {
    value: 6,
    label: '客服账号'
  }
]
// 运营商类型Select
const operator_type = [
  {
    value: 1,
    label: '移动'
  },
  {
    value: 2,
    label: '电信'
  },
  {
    value: 3,
    label: '联通'
  }
]
// 是否Select
const whether = [
  // {
  //   value: '',
  //   label: '未选择'
  // },
  {
    value: 1,
    label: '不是'
  },
  {
    value: 2,
    label: '是'
  }
]
// 是否Select
const whether0 = [
  // {
  //   value: '',
  //   label: '未选择'
  // },
  {
    value: 0,
    label: '不是'
  },
  {
    value: 1,
    label: '是'
  }
]
// 卡片套餐类型Select
const cardPackageSelect = [
  {
    value: 1,
    label: '月套餐'
  },
  {
    value: 2,
    label: '累计套餐'
  },
  {
    value: 3,
    label: '零月租套餐'
  },
  {
    value: 4,
    label: '空套餐'
  },
  {
    value: 5,
    label: '当月套餐'
  },
  {
    value: 6,
    label: '日套餐'
  }
]
// 套餐类型Select
const type = [
  {
    value: 1,
    label: '月包'
  },
  {
    value: 2,
    label: '季包'
  },
  {
    value: 3,
    label: '年包'
  },
  {
    value: 4,
    label: '基本套餐'
  },
  {
    value: 5,
    label: '半年包'
  },
  {
    value: 6,
    label: '累计月包'
  }
]
// 卡片状态Select
const cardStatusSelect = [
  {
    value: 1,
    label: '待激活'
  },
  {
    value: 2,
    label: '正常'
  },
  {
    value: 3,
    label: '单向停机'
  },
  {
    value: 4,
    label: '停机'
  },
  {
    value: 5,
    label: '预销号'
  },
  {
    value: 6,
    label: '销号'
  },
  {
    value: 7,
    label: '过户'
  },
  {
    value: 8,
    label: '休眠'
  },
  {
    value: 9,
    label: '未知状态'
  },
  {
    value: 10,
    label: '可测试期'
  },
  {
    value: 11,
    label: '库存期'
  },
  {
    value: 13,
    label: '用户拆机'
  }
]
// 审核状态Select
const withdrawStatus = [
  {
    value: 1,
    label: '未审核'
  },
  {
    value: 2,
    label: '通过'
  },
  {
    value: 3,
    label: '拒绝'
  }
]
// 套餐订购状态Select
const packageStatusSelect = [
  {
    value: 1,
    label: '未成功'
  },
  {
    value: 2,
    label: '请求成功'
  },
  {
    value: 3,
    label: '失效'
  },
  {
    value: 4,
    label: '退购'
  },
  {
    value: 5,
    label: '异卡换套餐'
  }
]
// 套餐支付Select
const payTypeArr = [
  {
    value: 1,
    label: '余额'
  },
  {
    value: 2,
    label: '微信'
  }
]
// 套餐生效Select
const typeArr = [
  {
    value: 0,
    label: '默认'
  },
  {
    value: 1,
    label: '普通'
  },
  {
    value: 2,
    label: '次月（预定）'
  },
  {
    value: 3,
    label: '叠加（长周期请勿选择）'
  },
  {
    value: 4,
    label: '多月'
  }
]
// 机卡解绑状态Select
const unbindStatusSelect = [
  {
    value: 1,
    label: '接受成功'
  },
  {
    value: 2,
    label: '提交成功'
  },
  {
    value: 3,
    label: '处理成功'
  }
]
// 推广支付Select
const obtainStatusSelect = [
  {
    value: 1,
    label: '未支付'
  },
  {
    value: 2,
    label: '已支付'
  },
  {
    value: 3,
    label: '已发货'
  },
  {
    value: 4,
    label: '完成'
  }
]
// 支付Select
const orderStatusSelect = [
  {
    value: 1,
    label: '未支付'
  },
  {
    value: 2,
    label: '已支付'
  },
  {
    value: 3,
    label: '订单完成'
  },
  {
    value: 4,
    label: '退款'
  },
  {
    value: 5,
    label: '退款中'
  }
]

// 套餐生效类型Select
const packageEffectSelect = [
  {
    value: 0,
    label: '默认'
  },
  {
    value: 1,
    label: '普通'
  },
  {
    value: 2,
    label: '次月（预定）'
  },
  {
    value: 3,
    label: '叠加'
  },
  {
    value: 4,
    label: '多月'
  },
  {
    value: 5,
    label: '日叠加'
  },
  {
    value: 6,
    label: '日基础'
  }
]
// 套餐订购状态
const inuseMap = {
  1: '在用',
  2: '待用',
  3: '失效'
}
// 套餐在用状态
const orderStatusMap = {
  1: '未成功',
  2: '请求成功',
  3: '失效',
  4: '退购',
  5: '异卡换套餐'
}
// 套餐生效类型
const packageEffectMap = {
  0: '默认',
  1: '普通',
  2: '次月（预定）',
  3: '叠加',
  4: '多月',
  5: '日叠加',
  6: '日基础'
}
// 订单支付状态
const statusMap = {
  1: '未支付',
  2: '支付成功',
  3: '订单成功',
  4: '退款',
  5: '退款中'
}
// 订单支付状态
const payListMap = {
  1: '未支付',
  2: '支付成功',
  3: '退款'
}
// 机卡解绑状态
const unbindStatus = {
  1: '接受成功',
  2: '提交成功',
  3: '处理成功'
}

const utypeMap = {
  0: '总平台用户',
  1: '一级代理商',
  2: '二级代理商',
  3: '三级代理商',
  4: '四级代理商',
  100: '代理商客服'
}
const stateMap = {
  0: '断网',
  1: '断网',
  2: '正常',
  3: '正常'
}
// 订单支付类型
const tradeMap = {
  1: '微信支付',
  2: '接口调用',
  3: '余额支付',
  4: '微信+余额',
  5: '代理商微信收费',
  6: '代理商微信+余额',
  7: '代理商微信订购',
  8: '代理商账户收费',
  9: '支付宝支付',
  10: '支付宝+余额',
  11: '行业卡用户微信订购',
  12: '月末扣费',
  13: '行业卡用户余额订购'
}

// 订单支付Select
const tradeSelect = [
  {
    value: 1,
    label: '微信支付'
  },
  {
    value: 2,
    label: '接口调用'
  },
  {
    value: 3,
    label: '余额支付'
  },
  {
    value: 4,
    label: '微信+余额'
  },
  {
    value: 5,
    label: '代理商微信收费'
  },
  {
    value: 6,
    label: '代理商微信+余额'
  },
  {
    value: 7,
    label: '代理商微信订购'
  },
  {
    value: 8,
    label: '代理商账户收费'
  },
  {
    value: 9,
    label: '支付宝支付'
  },
  {
    value: 10,
    label: '支付宝+余额'
  },
  {
    value: 11,
    label: '行业卡用户微信订购'
  },
  {
    value: 12,
    label: '月末扣费'
  },
  {
    value: 13,
    label: '行业卡用户余额订购'
  }
]
// 审核状态
const withdrawStatusMap = {
  1: '未审核',
  2: '通过',
  3: '拒绝'
}
const cardStatusMap = {
  1: '待激活',
  2: '正常',
  3: '单向停机',
  4: '停机',
  5: '预销号',
  6: '销号',
  7: '过户',
  8: '休眠',
  9: '未知状态',
  10: '可测试期',
  11: '库存期',
  13: '用户拆机'
}
const cardTypeMap = {
  1: '普通卡',
  2: '池卡',
  3: '空卡',
  4: '行业卡',
  6: '已注销卡',
  7: 'mifi随身带'
}
const orderTypeMap = {
  'account': '余额充值',
  'flow': '套餐订购',
  'agentflow': '代理商微信收费',
  'agentaccount': '代理商余额收费',
  'agentRecharge': '代理商账户充值',
  'obtain': '购卡',
  'agentBatch': '代理商购卡'
}

// 套餐支付Select
const cardTypeSelect = [
  {
    value: 1,
    label: '普通卡'
  },
  {
    value: 2,
    label: '池卡'
  },
  {
    value: 3,
    label: '空卡'
  },
  {
    value: 4,
    label: '行业卡'
  },
  {
    value: 6,
    label: '已注销卡'
  },
  {
    value: 7,
    label: 'mifi随身带'
  }
]
// 生命周期Select
const lifeCycleSelect = [
  {
    value: 1,
    label: '库存期'
  },
  {
    value: 2,
    label: '沉默期'
  },
  {
    value: 3,
    label: '正使用'
  },
  {
    value: 4,
    label: '已停机'
  },
  {
    value: 5,
    label: '预销号'
  },
  {
    value: 6,
    label: '已注销'
  },
  {
    value: 7,
    label: '强制停机'
  }
]
export {
  inuseMap,
  stateMap,
  utypeMap,
  orderStatusMap,
  orderTypeMap,
  orderTypeSelect,
  packageStatusSelect,
  packageEffectMap,
  packageEffectSelect,
  payeeStatusMap,
  payeeStatusSelect,
  activeTypeSelect,
  accountstypeMap,
  accountstypeSelect,
  ctccSpeedSelect,
  cuccSpeedSelect,
  obtainStatusSelect,
  whether0,
  lifeCycleMap,
  lifeCycleSelect,
  utypeSelect,
  operationStatusMap,
  operationTypeMap,
  operationTypeSelect,
  cardTypeSelect,
  packageTypeSelect,
  packageTypeMap,
  operatorTypeMap,
  whether,
  cardStatusSelect,
  unbindStatus,
  unbindStatusSelect,
  cardTypeMap,
  orderStatusSelect,
  payTypeArr,
  typeArr,
  typeMap,
  cardPackageSelect,
  cardPackageMap,
  operator_type,
  type,
  payListMap,
  statusMap,
  tradeMap,
  tradeSelect,
  withdrawStatusMap,
  withdrawStatus,
  cardStatusMap,
  etime
}
