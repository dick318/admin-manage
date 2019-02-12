
const tempData = {
  state: {
    agentSelect: [],
    alipayObject: {},
    bankCardObject: {},
    anameObject: {},
    aidObject: {},
    perObject: {},
    oidSelect: [],
    operatorTypeArr: [],
    oidObject: {},
    oidList: {},
    zidSelect: [],
    accountsTypeArr: [],
    zidObject: {},
    roleSelect: [],
    agentStatus: false,
    roleStatus: false,
    accountsStatus: false,
    operatorStatus: false
  },
  mutations: {
    SET_AGENTSELECT: (state, agentSelect) => {
      state.agentSelect = agentSelect
    },
    SET_AGENTSTATUS: (state, agentStatus) => {
      state.agentStatus = agentStatus
    },
    SET_ROLESTATUS: (state, roleStatus) => {
      state.roleStatus = roleStatus
    },
    SET_ACCOUNTSSTATUS: (state, accountsStatus) => {
      state.accountsStatus = accountsStatus
    },
    SET_OPERATORSTATUS: (state, operatorStatus) => {
      state.operatorStatus = operatorStatus
    },
    SET_ALIPAYOBJECT: (state, alipayObject) => {
      state.alipayObject = alipayObject
    },
    SET_BANKCARDOBJECT: (state, bankCardObject) => {
      state.bankCardObject = bankCardObject
    },
    SET_ANAMEOBJECT: (state, anameObject) => {
      state.anameObject = anameObject
    },
    SET_AIDOBJECT: (state, aidObject) => {
      state.aidObject = aidObject
    },
    SET_PEROBJECT: (state, perObject) => {
      state.perObject = perObject
    },
    SET_OIDSELECT: (state, oidSelect) => {
      state.oidSelect = oidSelect
    },
    SET_OIDLIST: (state, oidList) => {
      state.oidList = oidList
    },
    SET_OPERATORTYPEARR: (state, operatorTypeArr) => {
      state.operatorTypeArr = operatorTypeArr
    },
    SET_OIDOBJECT: (state, oidObject) => {
      state.oidObject = oidObject
    },
    SET_ZIDSELECT: (state, zidSelect) => {
      state.zidSelect = zidSelect
    },
    SET_ACCOUNTSTYPEARR: (state, accountsTypeArr) => {
      state.accountsTypeArr = accountsTypeArr
    },
    SET_ZIDOBJECT: (state, zidObject) => {
      state.zidObject = zidObject
    },
    SET_ROLESELECT: (state, roleSelect) => {
      state.roleSelect = roleSelect
    }
  },
  actions: {
    setAgentSelect({ commit }, agentSelect) {
      commit('SET_AGENTSELECT', agentSelect)
    },
    setAgentStatus({ commit }, agentStatus) {
      commit('SET_AGENTSTATUS', agentStatus)
    },
    setRoleStatus({ commit }, roleStatus) {
      commit('SET_ROLESTATUS', roleStatus)
    },
    setAccountsStatus({ commit }, accountsStatus) {
      commit('SET_ACCOUNTSSTATUS', accountsStatus)
    },
    setOperatorStatus({ commit }, operatorStatus) {
      commit('SET_OPERATORSTATUS', operatorStatus)
    },
    setAlipayObject({ commit }, alipayObject) {
      commit('SET_ALIPAYOBJECT', alipayObject)
    },
    setBankCardObject({ commit }, bankCardObject) {
      commit('SET_BANKCARDOBJECT', bankCardObject)
    },
    setAnameObject({ commit }, anameObject) {
      commit('SET_ANAMEOBJECT', anameObject)
    },
    setAidObject({ commit }, aidObject) {
      commit('SET_AIDOBJECT', aidObject)
    },
    setPerObject({ commit }, perObject) {
      commit('SET_PEROBJECT', perObject)
    },
    setOidSelect({ commit }, oidSelect) {
      commit('SET_OIDSELECT', oidSelect)
    },
    setOperatorTypeArr({ commit }, operatorTypeArr) {
      commit('SET_OPERATORTYPEARR', operatorTypeArr)
    },
    setOidObject({ commit }, oidObject) {
      commit('SET_OIDOBJECT', oidObject)
    },
    setOidList({ commit }, oidList) {
      commit('SET_OIDLIST', oidList)
    },
    setZidSelect({ commit }, zidSelect) {
      commit('SET_ZIDSELECT', zidSelect)
    },
    setAccountsTypeArr({ commit }, accountsTypeArr) {
      commit('SET_ACCOUNTSTYPEARR', accountsTypeArr)
    },
    setZidObject({ commit }, zidObject) {
      commit('SET_ZIDOBJECT', zidObject)
    },
    setRoleSelect({ commit }, roleSelect) {
      commit('SET_ROLESELECT', roleSelect)
    }
  }
}

export default tempData
