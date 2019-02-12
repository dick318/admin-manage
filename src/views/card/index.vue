<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.addtimeStart"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.addtimeEnd"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-input v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入接入号"/>
      <el-input v-model.trim="listQuery.number" class="filter-item" style="width:220px" clearable placeholder="请输入虚拟号"/>

      <el-select v-show="secMore" v-model="cardType" class="filter-item" collapse-tags multiple clearable placeholder="请选择卡片类型">
        <el-option
          v-for="item in cardTypeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="cardStatus" class="filter-item" collapse-tags multiple clearable placeholder="请选择卡片状态" @clear="handleFilter">
        <el-option
          v-for="item in cardStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="lifeCycle" class="filter-item" collapse-tags multiple clearable placeholder="请选择卡片生命周期" @clear="handleFilter">
        <el-option
          v-for="item in lifeCycleSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.type" class="filter-item" clearable placeholder="套餐类型" @clear="handleFilter">
        <el-option v-for="item in cardPackageSelect" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.realStatus" class="filter-item" clearable placeholder="认证状态" @clear="handleFilter">
        <el-option v-for="item in whether" :key="item.value" :label="item.label=='是'?'已认证':'未认证'" :value="item.value" />
      </el-select>

      <el-input v-show="secMore" v-model.trim="listQuery.remarks" class="filter-item" style="width:130px" clearable placeholder="请输入备注"/>
      <el-select v-show="secMore" v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="operatorid" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择套餐批次">
        <el-option
          v-for="item in oidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="zid" class="filter-item" collapse-tags multiple filterable clearable placeholder="请选择供应商账号">
        <el-option
          v-for="item in zidSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.operatorType" class="filter-item" clearable placeholder="请选择运营商类型">
        <el-option
          v-for="item in operator_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves :type="!secMore?'primary':''" class="filter-item" size="small" @click="secMore=!secMore">{{ !secMore?'高级查询':'返回' }}</el-button>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:export:cardInfo']" class="filter-item" size="small" type="primary" @click="handleDownload">Java导出</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchCardAdd']" class="filter-item" size="small" type="primary " @click="cardJump('/card/add')">导卡</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchCardDivide']" class="filter-item" size="small" type="primary " @click="cardJump('/card/divide')">分卡</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchUpdateCardMoney']" class="filter-item" size="small" type="primary" @click="cardJump('/card/recharge')">充值</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:cardBatchUpdate']" class="filter-item" size="small" type="primary" @click="cardJump('/card/edit')">修改卡片</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:editNetworkAccess']" class="filter-item" size="small" type="primary" @click="cardJump('/card/speed')">限速</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchActivate', 'kuyuplat:card:batchActivate']" class="filter-item" size="small" type="primary" @click="cardJump('/card/activeCtcc')">激活</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:cardChange']" class="filter-item" size="small" type="primary" @click="cardJump('/card/change')">换卡</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchSingleCutNet']" class="filter-item" size="small" type="primary" @click="cardJump('/card/singleCutNet')">断复网</el-button>
      <el-button v-waves v-permission="['kuyuplat:export:finance']" class="filter-item" size="small" type="primary" @click="downloadExportFinance">财务导出</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchCardBack']" class="filter-item" size="small" type="danger" @click="cardJump('/card/back')">回收</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:batchCardDelete']" class="filter-item" size="small" type="danger" @click="cardJump('/card/delete')">删除</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="multipleTable"
      column-key="actions"
      tooltip-effect="dark"
      highlight-current-row
      @filter-change="filterChange">
      <!-- @cell-click="toggleSelection"
      @selection-change="select" -->
      <!-- <el-table-column
        type="selection"
        width="55"/> -->
      <el-table-column :filters="filtersArr" align="center" label="ID" show-overflow-tooltip prop="actions">
        <template slot-scope="scope">
          <span
            style="color:#66b1ff;cursor:pointer"
            type="text"
            @click="cardJump(`/card/detail?iccid=${scope.row.iccid}&number=${scope.row.number}&cardId=${scope.row.id}&tel=${scope.row.tel}`)">
            {{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['iccid']" align="center" label="iccid" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" type="text" @click="cardJump(`/business/flowInfo?iccid=${scope.row.iccid}`)">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['tel']" align="center" label="接入号" show-overflow-tooltip min-width="115">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="cardJump(`/business/flowInfo?tel=${scope.row.tel}`)">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['number']" align="center" label="虚拟号" show-overflow-tooltip min-width="115">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="cardJump(`/business/flowInfo?number=${scope.row.number}`)">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['amount']" align="center" label="卡片余额" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="cardJump(`/card/rechargeList?iccid=${scope.row.iccid}&cardId=${scope.row.id}`)">{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['useflow']" align="center" label="已用流量" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.useflow| flowFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['sumflow']" align="center" label="总流量" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sumflow| flowFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['cardStatus']" align="center" label="卡状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            :class="scope.row.cardStatus==1?'':scope.row.cardStatus==2?'blue-text':'red-text'"
            @click="cardJump(`/business/stopReset?iccid=${scope.row.iccid}&cardId=${scope.row.id}&tel=${scope.row.tel}`)">
            {{ cardStatusMap[scope.row.cardStatus]||'未知状态' }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['lifeCycle']" align="center" label="生命周期" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.lifeCycle==1||scope.row.lifeCycle==2?'':scope.row.lifeCycle==3?'blue-text':'red-text'">{{ lifeCycleMap[scope.row.lifeCycle]||'未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['realStatus']" align="center" label="实名状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="scope.row.realStatus==2"
            class="blue-text"
            @click="cardJump(`/card/AutonymDetails?iccid=${scope.row.iccid}&tel=${scope.row.tel}`)">认证</span>
          <span v-else class="red-text">未认证</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['operatorType']" align="center" label="运营商类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operatorType==1?'移动':scope.row.operatorType==2?'电信':'联通' }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['fid']" align="center" label="代理商名称" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.fid?aidObject[scope.row.fid]:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['packageName']" align="center" label="基本套餐" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['operatorid']" align="center" label="套餐批次" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid]?`${oidObject[scope.row.operatorid]}--${scope.row.operatorid}`:scope.row.operatorid }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['cardType']" align="center" label="卡片分类" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ cardTypeMap[scope.row.cardType] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['type']" align="center" label="套餐分类" show-overflow-tooltip >
        <template slot-scope="scope">
          <span>{{ scope.row.type |typeMapFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['zid']" align="center" label="供应商账号" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ zidObject[scope.row.zid]?`${zidObject[scope.row.zid]}--${scope.row.zid}`:scope.row.zid }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['remarks']" align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showColumn['addtime']" align="center" label="添加时间" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['endtime']" align="center" label="结束时间" show-overflow-tooltip min-width="145">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showColumn['actions']" :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="500px" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh(scope.row)"/>
          <el-button v-permission="['kuyuplat:flowdetail:find']" type="primary" size="mini" @click="cardJump(`flowDetail?id=${scope.row.id}&card=${scope.row.iccid}`)">明细</el-button>
          <el-button v-permission="['kuyuplat:card:editCard']" type="primary" size="mini" @click="recharge(scope.row)">充值</el-button>
          <el-button v-permission="['kuyuplat:card:editCard']" type="success" size="mini" @click="password(scope.row)">密码</el-button>
          <!-- <el-button v-permission="['common']" v-if="scope.row.operatorType!=1" type="success" size="mini" @click="speed(scope.row)">限速</el-button> -->
          <el-button v-permission="['kuyuplat:card:editCard']" type="success" size="mini" @click="per(scope.row)">比例</el-button>
          <el-button v-permission="['kuyuplat:card:active']" v-if="scope.row.operatorType==2" type="warning" size="mini" @click="active(scope.row)">激活</el-button>
          <el-button v-if="checkPermission(['kuyuplat:rule:getRule'])&&checkPermission(['kuyuplat:rule:editRule'])" type="warning" size="mini" @click="grade(scope.row)">等级</el-button>
          <!-- <el-button v-permission="['common']" type="warning" size="mini" @click="threshold(scope.row)">阈值</el-button> -->
          <el-button v-permission="['kuyuplat:card:imeiReRecord']" v-if="scope.row.operatorType==2" type="warning" size="mini" @click="unbind(scope.row)">解绑</el-button>
          <!-- <el-button v-permission="['common']" type="danger" size="mini" @click="recycle(scope.row)">回收</el-button> -->
          <!-- <el-button v-permission="['common']"  v-if="remarksType" type="success" size="mini" @click="remarks(scope.row)">备注</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item v-if="dialogStatus=='recharge'" label="变动余额" prop="money">
          <el-input v-model.trim.number="temp.money" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='grade'" label="流量等级" prop="cardGrade">
          <el-select v-model="temp.cardGrade" class="filter-item" clearable placeholder="请选择流量等级">
            <el-option v-for="item in gradeSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='recharge'" label="变动原因" prop="remarks">
          <el-input v-model.trim="temp.remarks" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='grade'" label="变动原因" prop="reason">
          <el-input v-model.trim="temp.reason" clearable />
        </el-form-item>
        <!-- <el-form-item v-if="dialogStatus=='speed'&&temp.operatorType==3" label="限速编码" prop="target">
          <el-select v-model="temp.target" class="filter-item" clearable placeholder="请选择限速编码">
            <el-option
              v-for="item in cuccSpeedSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='speed'&&temp.operatorType==2" label="限速编码" prop="target">
          <el-select v-model="temp.target" class="filter-item" clearable placeholder="请选择限速编码">
            <el-option
              v-for="item in ctccSpeedSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30, 50,100,500,1000]"
        :page-size="listQuery.pageSize"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getCard, editCard, editRule, getRule, cardActivate, exportCardInfo, exportFinance } from '@/api/card'
import waves from '@/directive/waves' // 水波纹指令
import { ctccSpeedSelect, cuccSpeedSelect, lifeCycleSelect, cardTypeMap,
  cardTypeSelect, lifeCycleMap, accountsArr, cardStatusMap, operator_type, cardPackageMap, cardPackageSelect,
  agentArr, operatorArr, cardStatusSelect, whether } from '@/utils/mapArr'
import { toSize } from '@/utils'
import { imeiReRecord } from '@/api/unbind'
import { queryUseflow, queryCardStatus } from '@/api/cardInfo'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'CardManage',
  directives: {
    waves
  },
  filters: {
    flowFilter(value) {
      return toSize(+value * 1024)
    },
    typeMapFilter(value) {
      return cardPackageMap[value]
    }
  },
  data() {
    return {
      cuccSpeedSelect,
      ctccSpeedSelect,
      cardTypeSelect,
      cardTypeMap,
      lifeCycleMap,
      cardStatusMap,
      lifeCycleSelect,
      whether,
      operator_type,
      cardPackageSelect,
      cardPackageMap,
      cardStatusSelect,
      secMore: false,
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: null,
      agentSelect: [],
      aidObject: {},
      oidSelect: [],
      oidObject: {},
      zidSelect: [],
      zidObject: {},
      operatorid: [],
      lifeCycle: [],
      cardStatus: [],
      cardType: [],
      zid: [],
      listQuery: {
        aid: +this.$route.query.aid || '',
        realStatus: '',
        cardType: '',
        cardStatus: '',
        operatorType: '',
        addtimeStart: null,
        addtimeEnd: null,
        iccid: '',
        tel: '',
        number: '',
        type: '',
        operatorid: '',
        zid: '',
        lifeCycle: '',
        pageNo: 1,
        pageSize: 10
      },
      temp: {

      },
      gradeSelect: [],
      rules: {
        money: [
          { required: true, message: '请输入变动余额', trigger: 'blur' },
          { type: 'number', message: '必须为数值' }
        ],
        remarks: [
          { required: true, message: '请输入变动原因', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入变动原因', trigger: 'blur' }
        ],
        cardGrade: [
          { required: true, message: '请选择流量等级', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '请选择限速编码', trigger: 'blur' }
        ]
      },
      textMap: {
        recharge: '充值',
        // speed: '限速',
        grade: '等级'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      filtersArr: [
        { text: 'iccid', value: 'iccid' },
        { text: '接入号', value: 'tel' },
        { text: '虚拟号', value: 'number' },
        { text: '卡片余额', value: 'amount' },
        { text: '已用流量', value: 'useflow' },
        { text: '总流量', value: 'sumflow' },
        { text: '卡状态', value: 'cardStatus' },
        { text: '生命周期', value: 'lifeCycle' },
        { text: '实名状态', value: 'realStatus' },
        { text: '运营商类型', value: 'operatorType' },
        { text: '代理商名称', value: 'fid' },
        { text: '基本套餐', value: 'packageName' },
        { text: '套餐批次', value: 'operatorid' },
        { text: '卡片分类', value: 'cardType' },
        { text: '套餐分类', value: 'type' },
        { text: '供应商账号', value: 'zid' },
        { text: '备注', value: 'remarks' },
        { text: '添加时间', value: 'addtime' },
        { text: '结束时间', value: 'endtime' },
        { text: '操作', value: 'actions' }
      ],
      showColumn: {
        iccid: true,
        tel: true,
        number: true,
        amount: true,
        useflow: true,
        sumflow: true,
        cardStatus: true,
        lifeCycle: true,
        realStatus: true,
        operatorType: true,
        fid: true,
        packageName: true,
        operatorid: true,
        cardType: true,
        type: true,
        zid: true,
        remarks: true,
        addtime: true,
        endtime: true,
        actions: true
      }
    }
  },
  created() {
    if (this.listQuery.aid) {
      this.secMore = true
    }
    this.getSelect()
    this.getList()
  },
  methods: {
    checkPermission,
    filterChange(value) {
      let Arr = []
      Object.values(value).map((v, i) => {
        Arr = Arr.concat(v)
      })
      Object.keys(this.showColumn).map((v, i) => {
        if (Arr.length === 0) {
          this.showColumn[v] = true
        } else {
          if (!Arr.includes(v)) {
            this.showColumn[v] = false
          } else {
            this.showColumn[v] = true
          }
        }
      })
    },
    cardJump(type) {
      this.$router.push(type)
    },
    editCard(data, select) {
      editCard(data, select).then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          this.dialogFormVisible = false
          if (data.amount) {
            getCard({ cardId: data.cardId }).then(res => {
              if (res.status === 0) {
                const index = this.list.indexOf(res.data)
                this.list.splice(index, 1, res.data)
              } else {
                for (const v of this.list) {
                  if (v.id === data.cardId) {
                    v.amount = (v.amount + data.amount).toFixed(2)
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, res.v)
                    break
                  }
                }
              }
            })
          }
        }
      })
    },
    recharge(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.remarks = ''
      this.dialogStatus = 'recharge'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dialogStatus === 'recharge') {
            const tempData = Object.assign({}, this.temp)
            this.editCard({ cardId: tempData.id, amount: this.temp.money, remarks: this.temp.remarks }, '.el-dialog__footer')
          }
          // if (this.dialogStatus === 'speed') {
          //   const tempData = Object.assign({}, this.temp)
          //   editNetworkAccess({ iccid: tempData.iccid, zid: tempData.zid, target: tempData.target }, '.el-dialog__footer').then(res => {
          //     this.$message({
          //       type: +res.status === 0 ? 'success' : 'error',
          //       message: res.message
          //     })
          //     if (res.status === 0) {
          //       this.dialogFormVisible = false
          //     }
          //   })
          // }
          if (this.dialogStatus === 'grade') {
            const tempData = Object.assign({}, this.temp)
            editRule({ cardId: tempData.id, grade: tempData.cardGrade, reason: tempData.reason }, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                for (const v of this.list) {
                  if (v.id === tempData.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, tempData)
                    break
                  }
                }
                this.dialogFormVisible = false
              }
            })
          }
        }
      })
    },
    // speed(row) {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.dialogStatus = 'speed'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    per(row) {
      this.$prompt('', '比例', {
        inputPattern: /^(\-|\+)?\d+(\.\d+)?$/,
        inputPlaceholder: '请输入要显示的比例',
        inputValidator: (value) => {
          if (value < 0 || value > 1) {
            return false
          }
        },
        inputErrorMessage: '请输入正确的数值'
      }).then(({ value }) => {
        this.editCard({ cardId: row.id, per: value }, '.el-message-box')
      }).catch()
    },
    downloadExportFinance() {
      this.$confirm('此操作将进行财务记录导出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getListQuery()
        exportFinance(this.listQuery, '.el-message-box__btns').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    active(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$confirm('此操作将进行激活, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, this.temp)
        cardActivate({ tels: tempData.tel, iccid: tempData.iccid, cardId: tempData.id }, '.el-message-box__btns').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    grade(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'grade'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      getRule({ cardId: row.id }).then(res => {
        if (res.status === 0) {
          for (const value of Object.values(res.data)) {
            this.gradeSelect.push({
              value: +Object.entries(value)[0][0],
              label: Object.entries(value)[0][1]
            })
          }
        }
      })
    },
    // TODO:阈值方法动作未对接！
    threshold(row) {
      this.$prompt('', '阈值', {
        inputPattern: /^(\-|\+)?\d+(\.\d+)?$/,
        inputPlaceholder: '请输入要调整的阈值',
        inputErrorMessage: '请输入正确的数值'
      }).then(({ value }) => {
        console.log(value)
      }).catch()
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.addtimeStart).getTime() > time.getTime()
        }
      }
    },
    getSelect() {
      accountsArr((zidSelect, accountsTypeArr, zidObject) => {
        this.zidSelect = zidSelect
        this.zidObject = zidObject
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject, perObject, aidObject) => {
        this.agentSelect = agentSelect
        this.aidObject = aidObject
      })
    },
    handleRefresh() {
      this.listQuery = {
        iccid: '',
        tel: '',
        number: '',
        addtimeStart: null,
        addtimeEnd: null,
        cardType: '',
        type: '',
        cardStatus: '',
        realStatus: '',
        operatorType: '',
        aid: '',
        operatorid: '',
        zid: '',
        lifeCycle: '',
        pageNo: 1,
        pageSize: 10
      }
      this.cardType = []
      this.operatorid = []
      this.zid = []
      this.cardStatus = []
      this.lifeCycle = []
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    refresh(row) {
      Promise.all([queryUseflow({ method: 'queryUseflow', judge: 2, cardId: row.id }),
        queryCardStatus({ method: 'queryStatus', judge: 3, cardId: row.id })]).then(posts => {
        let flag = false
        posts.map((v, i) => {
          if (v.status === 0) {
            if (v.data.useflow) {
              row.useflow = +v.data.useflow || 0
            }
            if (v.data.sumflow) {
              row.sumflow = +v.data.sumflow || 0
            }
            if (i === 1) {
              const data = JSON.parse(v.data)
              if (data.statusCode) {
                row.cardStatus = data.statusCode
              }
            }
            for (const v of this.list) {
              if (v.id === row.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, row)
                break
              }
            }
          }
          if (v.status !== 0) {
            this.$notify({
              type: 'error',
              message: v.message
            })
            flag = true
          } else if (!flag && i === posts.length - 1) {
            this.$notify({
              type: 'success',
              message: '操作成功'
            })
          }
        })
      }).catch((reason) => {
        this.$notify({
          type: 'error',
          message: reason.code === 'ECONNABORTED' ? '请求超时' : reason.code
        })
      })
    },
    // recycle(row) {
    //   this.$confirm('此操作将回收卡片, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     cardBack({ cardId: row.id, type: 0, aid: 0 }, '.table').then(res => {
    //       this.$message({
    //         type: +res.status === 0 ? 'success' : 'error',
    //         message: res.message
    //       })
    //       if (+res.status === 0) {
    //         row.aid = ''
    //         for (const v of this.list) {
    //           if (+v.id === +row.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, row)
    //             break
    //           }
    //         }
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    unbind(row) {
      if (+row.operatorType !== 2) {
        this.$notify({
          type: 'error',
          message: '解绑功能仅支持电信卡！'
        })
        return false
      }
      this.$confirm('此操作将进行机卡解绑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        imeiReRecord({
          tel: row.tel, iccid: row.iccid, cardId: row.id
        }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // remarks(row) {
    //   this.$prompt('', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPlaceholder: '请输入卡片备注',
    //     inputValue: row.remarks
    //   }).then(({ value }) => {
    //     cardRemarks({
    //       remarks: value,
    //       id: row.id
    //     }, 'body').then(res => {
    //       this.$message({
    //         type: +res.status === 0 ? 'success' : 'error',
    //         message: res.message
    //       })
    //       if (+res.status === 0) {
    //         row.remarks = value
    //         for (const v of this.list) {
    //           if (v.id === row.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, row)
    //             break
    //           }
    //         }
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    password(row) {
      this.$prompt('', '密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入卡片密码',
        inputErrorMessage: '卡片密码不能为空',
        inputValidator: function(value) {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }).then(({ value }) => {
        this.editCard({ cardId: row.id, password: value }, '.el-message-box')
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleDownload() {
      this.$confirm('此操作将导出卡片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getListQuery()
        exportCardInfo(this.listQuery, '.filter-container').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getListQuery() {
      if (this.operatorid.length > 0) {
        this.listQuery.operatorid = this.operatorid
        this.listQuery.operatorid = this.listQuery.operatorid.join(',')
      } else {
        this.listQuery.operatorid = ''
      }
      if (this.zid.length > 0) {
        this.listQuery.zid = this.zid
        this.listQuery.zid = this.listQuery.zid.join(',')
      } else {
        this.listQuery.zid = ''
      }
      if (this.lifeCycle.length > 0) {
        this.listQuery.lifeCycle = this.lifeCycle
        this.listQuery.lifeCycle = this.listQuery.lifeCycle.join(',')
      } else {
        this.listQuery.lifeCycle = ''
      }
      if (this.cardStatus.length > 0) {
        this.listQuery.cardStatus = this.cardStatus
        this.listQuery.cardStatus = this.listQuery.cardStatus.join(',')
      } else {
        this.listQuery.cardStatus = ''
      }
      if (this.cardType.length > 0) {
        this.listQuery.cardType = this.cardType
        this.listQuery.cardType = this.listQuery.cardType.join(',')
      } else {
        this.listQuery.cardType = ''
      }
    },
    getList() {
      this.getListQuery()
      getCard(this.listQuery, '.multipleTable').then(res => {
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
      })
    }
  }
}
</script>
<style>
/* .edit-input .el-input__inner{
  padding:0 3px!important;
  width: 50px;
  float: left;
} */
</style>

<style scoped>

.el-icon-circle-check-outline {
  position: absolute;
  right: 4px;
  top: 16px;
}
.el-icon-circle-close-outline {
  position: absolute;
  right: -10px;
  top: 16px;
}
.el-button + .el-button {
  margin-left: 0;
}

.icon-star {
  margin-right: 2px;
}

.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
