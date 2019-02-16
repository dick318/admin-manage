<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model.trim="card" clearable class="filter-item" style="width: 200px;" placeholder="请输入卡号" @change="clear" @clear="clear"/>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="danger" class="filter-item" @click="changeStatus(1)">停机</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="changeStatus(2)">复机</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="delchangeCard">删除换卡</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="unbind">解绑</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="password">重置</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="order">补订</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="showPackage">订购</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="changeOrder">改订</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" @click="changeCardPackage">转套餐</el-button>
    </div>
    <el-collapse v-show="secStatus" v-model="activeNames" accordion @change="handleChange">
      <el-collapse-item id="packageInfo" title="套餐信息" name="2" >
        <p class="warn-content">
          <span>
            流量:<a>{{ packageInfo.sumflow }}</a>
          </span>
          <span>
            剩余:<a>{{ packageInfo.restflow }}</a>
          </span>
          <span>
            已用:<a>{{ packageInfo.useflow }}</a>
          </span>
        </p>
        <p class="warn-content">
          <span>
            状态:<a>{{ packageInfo.cardstatus }}</a>
          </span>
          <span v-if="packageInfo.isOffnet">
            达量断网:<a>{{ packageInfo.isOffnet }}</a>
          </span>
          <span v-if="packageInfo.threshold">
            断网阈值:<a>{{ packageInfo.threshold }}</a>
          </span>
          <span>
            单独断网:<a>{{ packageInfo.single }}</a>
          </span>
          <span>
            机卡绑定:<a>{{ packageInfo.record }}</a>
          </span>
        </p>
        <el-table
          :data="packageInfo.list"
          :key="packageInfo.tableKey"
          :fit ="true"
          row-key="id"
          element-loading-text="给我一点时间"
          size="mini"
          highlight-current-row
          max-height="250">

          <el-table-column align="center" label="套餐ID">
            <template slot-scope="scope">
              <span>{{ scope.row.packageid }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="套餐列表" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.packagename }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="总流量" min-width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.sumflow }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="已用流量" min-width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.useflow }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="剩余流量" min-width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.restflow }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="开始时间" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.starttime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="到期时间" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.endtime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item id="cardInfo" title="卡片的信息" name="1" >
        <p class="warn-content">
          <span>
            供应商:<a>{{ cardInfo.zid }}</a>
          </span>
          <span>
            实名:<a>{{ cardInfo.real_status }}</a>
          </span>
        </p>
        <p class="warn-content">
          <span>
            代理商:<a>{{ cardInfo.aname }}</a>
          </span>
          <span>
            余额:<a>{{ cardInfo.amount }}</a>
          </span>
        </p>
        <p v-if="cardInfo.remarks" class="warn-content">
          <span>
            备注:<a>{{ cardInfo.remarks }}</a>
          </span>
        </p>
      </el-collapse-item>
      <el-collapse-item id="orderInfo" title="套餐订购记录" name="3">
        <el-table
          ref="orderInfoTable"
          :data="orderInfo.list"
          :key="orderInfo.tableKey"
          :fit ="true"
          element-loading-text="给我一点时间"
          size="mini"
          highlight-current-row
          max-height="250"
          @cell-click="toggleSelectionOrderInfo"
          @selection-change="selectOrderInfo">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column align="center" label="卡号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.card }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="套餐名称" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.package }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="来源" width="160">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.source" trigger="hover" placement="top">
                <p>{{ scope.row.source }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.source |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="160">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.remarks" trigger="hover" placement="top">
                <p>{{ scope.row.remarks }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.remarks |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column align="center" label="订购状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type==2?'success':'danger'">{{ scope.row.type| packageType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结果">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==2?'success':'danger'">{{ scope.row.status| packageStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="返回内容" width="150">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.result" trigger="hover" placement="top">
                <p>{{ scope.row.result }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.result }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作者" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.uname }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="开始时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.starttime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="退订者" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.refund_operator }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="退订时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.refund_time?scope.row.refund_time:''| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结束时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.endtime }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-collapse-item>
      <el-collapse-item id="changeInfo" title="换卡申请记录" name="4">
        <el-table
          ref="changeTable"
          :data="changeInfo.list"
          :key="changeInfo.tableKey"
          :fit ="true"
          element-loading-text="给我一点时间"
          size="mini"
          highlight-current-row
          max-height="250"
          @cell-click="toggleSelection"
          @selection-change="select">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column align="center" label="原卡号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.oldcard }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="现ICCID" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.newcard }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.operator }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商帐号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.operators }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="代理商" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.agent }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.uname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="电话" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" min-width="160">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.base" trigger="hover" placement="top">
                <p>{{ scope.row.base }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.base |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="原因" min-width="190">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.reason" trigger="hover" placement="top">
                <p>{{ scope.row.reason }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.reason |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column align="center" label="添加时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isTure ==2?'success':'danger'">{{ scope.row.isTure | isTure }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item id="statusInfo" title="停复机" name="5">
        <el-table
          :data="statusInfo.list"
          :key="statusInfo.tableKey"
          :fit ="true"
          element-loading-text="给我一点时间"
          size="mini"
          max-height="250"
          highlight-current-row>

          <el-table-column align="center" label="卡号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.card }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作类型">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type ==2?'success':'danger'">{{ scope.row.type|statusType }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status ==1?'danger':'success'">{{ scope.row.type==1?'失败':'成功' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作者" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.uname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="来源" min-width="190">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.source" trigger="hover" placement="top">
                <p>{{ scope.row.source }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.source |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" min-width="160">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.remarks" trigger="hover" placement="top">
                <p>{{ scope.row.remarks }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.remarks |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="返回内容" min-width="160">
            <template slot-scope="scope">
              <el-popover v-if="scope.row.result" trigger="hover" placement="top">
                <p>{{ scope.row.result }}</p>
                <div slot="reference">
                  <el-tag size="medium">{{ scope.row.result |filterFun }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item id="changePackageInfo" title="异卡换套餐" name="6">
        <el-table
          :data="changePackageInfo.list"
          :key="changePackageInfo.tableKey"
          :fit ="true"
          element-loading-text="给我一点时间"
          size="mini"
          highlight-current-row
          max-height="250">

          <el-table-column align="center" label="原卡号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.old_card }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="现ICCID" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.new_card }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="旧供应商" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.old_operator }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="新供应商" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.new_operator }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="添加时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="代理商" min-width="160">
            <template slot-scope="scope">
              <span>{{ aname[scope.row.aid] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="旧流量" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.old_sumflow | toSize }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="新流量" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.new_sumflow | toSize }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status ==2?'success':'danger'">{{ scope.row.status==1?'提交中':'成功' }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item id="orderManagementInfo" title="订单记录" name="7">
        <el-table
          ref="orderManagementTable"
          :data="orderManagementInfo.list"
          :key="orderManagementInfo.tableKey"
          :fit ="true"
          element-loading-text="给我一点时间"
          size="mini"
          highlight-current-row
          max-height="250"
          @cell-click="toggleSelectionorder"
          @selection-change="selectorder">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column align="center" label="添加时间" min-width="125">
            <template slot-scope="scope">
              <span>{{ scope.row.addtime }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="代理商" min-width="160">
            <template slot-scope="scope">
              <span>{{ aname[scope.row.aid] }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="昵称" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商名称" min-width="160">
            <template slot-scope="scope">
              <span>{{ oid[scope.row.oid] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商账号" min-width="160">
            <template slot-scope="scope">
              <span>{{ zid[scope.row.zid] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="iccid" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.iccid }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="tel" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.tel }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="虚拟号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单号" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.orderID }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态" min-width="160">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==3?'success':'danger'">{{ scope.row.status |statusFilter }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="套餐类型" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.type | packageType }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="套餐名称" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.pname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="支付类型" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.trade_type|tradeTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单金额" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.money }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :visible.sync="orderPackage.dialogVisible"
      title="提示">
      <div v-if="orderPackage.dialogStatus == 'add'||orderPackage.dialogStatus == 'change'" class="filter-container" >
        <div class="el-select filter-item el-select--medium timeType">
          <el-radio v-model="orderPackage.type" label="1" style="margin-left:10px">普通</el-radio>
          <el-radio v-model="orderPackage.type" label="2" style="margin-left:10px">次月</el-radio>
          <el-radio v-model="orderPackage.type" label="3" style="margin-left:10px">叠加</el-radio>
        </div>
        <el-select v-if="orderPackage.dialogStatus == 'add'" v-model="orderPackage.packageValue" class="filter-item" filterable clearable placeholder="请选择要订购的套餐">
          <el-option
            v-for="item in orderPackage.packageArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-input v-model.trim="orderPackage.remark" class="filter-item" style="width: 200px;" clearable placeholder="请输入备注" />
        <el-input v-model.trim="changeCard.remark" class="filter-item" style="width: 200px;" clearable placeholder="请输入备注" />
        <el-input v-model.trim="changeCard.remark" class="filter-item" style="width: 200px;" clearable placeholder="请输入备注" />
      </div>
      <div v-else class="filter-container" >
        <el-input v-model.trim="changeCard.iccidnew" class="filter-item" style="width: 200px;" clearable placeholder="请输入新卡" />
        <el-input v-model.trim="changeCard.iccidold" class="filter-item" style="width: 200px;" clearable placeholder="请输入老卡" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderPackage.dialogVisible = false">取 消</el-button>
        <el-button v-if="orderPackage.dialogStatus=='add'" type="primary" @click="orderPackageAction">订购</el-button>
        <el-button v-if="orderPackage.dialogStatus=='change'" type="primary" @click="changePackageAction">改订</el-button>
        <el-button v-if="orderPackage.dialogStatus=='changeCardPackage'" type="primary" @click="changeCardPackageAction">转套餐</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCardPackage } from '@/api/package'
import { getAddPackage, orderPackageJava, unsubscribePackage, cardChange } from '@/api/addPackage'
import { getchangeList } from '@/api/changePackage'
import waves from '@/directive/waves' // 水波纹指令
import { changePassword, getBindCard } from '@/api/card'
import { changeCard, delchangeCard } from '@/api/changeCard'
import { getInfo } from '@/api/cardInfo'
import { getOrder, supplement, updteOrder } from '@/api/order'
import { changeUnbind } from '@/api/unbind'
import { getAllStatus, changeStatus } from '@/api/stopReset.js'
import { tradeMap, statusMap, typeMap, cardTypeMap, operatorArr, statusTypeMap, isTureMap, cardStatusMap, agentArr, operatorZidArr, packageStatusMap, packageTypeMap } from '@/utils/mapArr'
import { toSize } from '@/utils'

export default {
  name: 'Query',
  directives: {
    waves
  },
  filters: {
    tradeTypeFilter(trade_type) {
      return tradeMap[trade_type]
    },
    filterFun(value) {
      if (value && value.length > 12) {
        value = value.substring(0, 12) + '...'
      }
      return value
    },
    statusFilter(status) {
      return statusMap[status]
    },
    toSize(value) {
      return toSize(+value * 1024)
    },
    packageType(value) {
      return packageTypeMap[value]
    },
    packageStatus(value) {
      return packageStatusMap[value]
    },
    isTure(value) {
      return isTureMap[value]
    },
    statusType(value) {
      return statusTypeMap[value]
    }
  },
  data() {
    return {
      did: sessionStorage.getItem('did'),
      uid: sessionStorage.getItem('uid'),
      id: '',
      card: '',
      iccid: '',
      tel: '',
      number: '',
      changeCard: {
        iccidnew: '',
        iccidold: '',
        opratorId: sessionStorage.getItem('did'),
        difagent: 2,
        copyagent: 1
      },
      orderPackage: {
        dialogStatus: '',
        dialogVisible: false,
        packageValue: [],
        packageArr: [],
        remark: '',
        type: ''
      },
      cardInfo: {
        secStatus: false,
        zid: '',
        aname: '',
        real_status: '',
        amount: '',
        remarks: ''
      },
      packageInfo: {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: 0,
        isOffnet: '',
        threshold: '',
        single: '',
        record: '',
        sumflow: '',
        restflow: '',
        useflow: '',
        cardstatus: ''
      },
      orderInfo: {
        changeArr: [],
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      },
      changeInfo: {
        changeArr: [],
        card: '',
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      },
      statusInfo: {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      },
      changePackageInfo: {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      },
      orderManagementInfo: {
        changeArr: [],
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      },
      activeNames: ['2'],
      aname: '',
      zid: '',
      oid: '',
      secStatus: false
    }
  },
  created() {
    agentArr((res, bankCard, alipay, aname, per) => {
      this.aname = aname
    })
    operatorArr((Arr, oid) => {
      this.oid = oid
    })
    operatorZidArr((Arr, zid) => {
      this.zid = zid
    })
  },
  methods: {
    handleChange(val) {
      switch (+val) {
        case 1:
          break
        default:
          break
      }
    },
    clear() {
      this.packageInfo.sumflow = ''
      this.packageInfo.restflow = ''
      this.packageInfo.useflow = ''
      this.packageInfo.cardstatus = ''
      this.packageInfo.list = []
      this.packageInfo.total = 0
      this.packageInfo.secStatus = false
      this.cardInfo.secStatus = false
      this.orderInfo.secStatus = false
      this.changeInfo.secStatus = false
    },
    changePackageAction() {
      this.orderInfo.changeArr.map((v, i) => {
        unsubscribePackage({ id: v.id, opratorId: this.did, uid: this.uid }).then(res => {
          if (+res.status === 0) {
            orderPackageJava({
              cards: this.card,
              packageId: v.packageid,
              type: this.orderPackage.type ? this.orderPackage.type : 1,
              did: sessionStorage.getItem('did'),
              uid: sessionStorage.getItem('uid'),
              remarks: this.orderPackage.remark
            }).then(res => {
              if (i === this.orderInfo.changeArr.length - 1) {
                this.orderPackage.dialogVisible = false
                if (+res.status === 0) {
                  this.getOrder()
                }
              }
              this.$message({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
            })
          }
        })
      })
    },
    orderPackageAction() {
      const packageId = this.orderPackage.packageValue
      const data = {
        cards: this.card,
        packageId,
        type: this.orderPackage.type ? this.orderPackage.type : 1,
        did: sessionStorage.getItem('did'),
        uid: sessionStorage.getItem('uid'),
        remarks: this.orderPackage.remark
      }
      orderPackageJava(data).then(res => {
        this.orderPackage.dialogVisible = false
        this.$message({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          this.getOrder()
        }
      })
    },
    changeCardPackage() {
      this.orderPackage.dialogVisible = true
      this.orderPackage.dialogStatus = 'changeCardPackage'
    },
    changeCardPackageAction() {
      if (!this.changeCard.iccidnew) {
        this.$message({
          type: 'error',
          message: '请输入新卡号'
        })
        return false
      }
      if (!this.changeCard.iccidold) {
        this.$message({
          type: 'error',
          message: '请输入老卡号'
        })
        return false
      }
      cardChange({
        iccidnew: this.changeCard.iccidnew,
        iccidold: this.changeCard.iccidold,
        opratorId: this.changeCard.opratorId,
        difagent: this.changeCard.difagent,
        copyagent: this.changeCard.copyagent
      }).then(res => {
        this.$message({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          this.getChangePackage()
        }
      })
    },
    showPackage() {
      if (!this.card) {
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.orderPackage.dialogVisible = true
      getCardPackage({ card: this.card }).then(res => {
        const Arr = []
        if (+res.code === 1) {
          const Data = Object.values(res.data.rows)
          for (let index = 0; index < Data.length; index++) {
            const value = `${Data[index].id}`
            var label = `${Data[index].name}  【${cardTypeMap[Data[index].card_type ]} · ${typeMap[Data[index].type ]}】`
            Arr.push({ value, label })
          }
        }
        this.orderPackage.packageArr = Arr
      })
      this.orderPackage.dialogStatus = 'add'
    },
    changeOrder() {
      if (!this.card) {
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      if (this.orderInfo.changeArr.length === 0) {
        this.$message.error('请选择套餐订购中的数据后提交！')
        return false
      }
      this.orderPackage.dialogVisible = true
      this.orderPackage.remark = '改订套餐'
      this.orderPackage.dialogStatus = 'change'
    },
    selectOrderInfo(selection, row) {
      this.orderInfo.changeArr = selection
    },
    toggleSelectionOrderInfo(row) {
      this.$refs.orderInfoTable.toggleRowSelection(row)
    },
    selectorder(selection, row) {
      this.orderManagementInfo.changeArr = selection
    },
    toggleSelectionorder(row) {
      this.$refs.orderManagementTable.toggleRowSelection(row)
    },
    select(selection, row) {
      this.changeInfo.changeArr = selection
    },
    toggleSelection(row) {
      this.$refs.changeTable.toggleRowSelection(row)
    },
    changeStatus(value) {
      if (!this.card) {
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      changeStatus({ card: this.card, status: value }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: res.msg
        })
        if (+res.code === 1) {
          this.getPackage()
        }
      })
    },
    delchangeCard() {
      if (this.changeInfo.changeArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.changeInfo.changeArr.map((v, i) => {
        delchangeCard({ id: v.id }).then(res => {
          if (i === this.changeInfo.changeArr.length - 1) {
            this.dialogVisible = false
            changeCard({
              oldCard: this.changeInfo.card
            }).then(res => {
              this.changeInfo.secStatus = true
              this.changeInfo.list = res.data.rows
              this.changeInfo.total = +res.data.total
            })
          }
          this.$message({
            type: res.code === 1 ? 'success' : 'error',
            message: res.msg
          })
        })
      })
    },
    unbind() {
      if (!this.card) {
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      changeUnbind({ cards: this.card, status: 1 }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: res.msg
        })
        if (+res.code === 1) {
          this.getPackage()
        }
      })
    },
    order() {
      if (this.orderManagementInfo.changeArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.orderManagementInfo.changeArr.map((v, i) => {
        if (+v.status === 2 || +v.status === 3) {
          getAddPackage({
            card: v.iccid,
            source: v.orderID
          }).then(res => {
            var flag = false
            if (+res.data.total !== 0) {
              res.data.rows.map((value, index) => {
                if (+value.status === 2 || +value.status === 3) {
                  flag = true
                  updteOrder({ id: v.id }).then(data => {
                    for (const data of this.orderManagementInfo.list) {
                      if (data.id === v.id) {
                        v.status = 3
                        const index = this.orderManagementInfo.list.indexOf(data)
                        this.orderManagementInfo.list.splice(index, 1, v)
                      }
                    }
                  })
                } else if (!flag) {
                  supplement({ orderNo: v.orderID, did: sessionStorage.getItem('did'), remark: '移动端批量补订套餐' }).then(resData => {
                    for (const data of this.orderManagementInfo.list) {
                      if (data.id === v.id) {
                        v.status = 3
                        const index = this.orderManagementInfo.list.indexOf(data)
                        this.orderManagementInfo.list.splice(index, 1, v)
                      }
                    }
                  })
                }
              })
            } else {
              supplement({ orderNo: v.orderID, did: sessionStorage.getItem('did'), remark: '移动端批量补订套餐' }).then(resData => {
                for (const data of this.orderManagementInfo.list) {
                  if (data.id === v.id) {
                    v.status = 3
                    const index = this.orderManagementInfo.list.indexOf(data)
                    this.orderManagementInfo.list.splice(index, 1, v)
                  }
                }
              })
            }
          })
        }
      })
    },
    password() {
      if (!this.card) {
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      getBindCard({
        card: this.card, uid: sessionStorage.getItem('uid')
      }).then(res => {
        if (+res.code === 1) {
          this.$prompt('请输入要重置的密码', '修改密码', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            inputValue: 888888
          }).then(({ value }) => {
            changePassword({ id: res.data.id, password: value }).then(res => {
              this.$message({
                type: +res.code === 1 ? 'success' : 'error',
                message: res.msg
              })
            })
          })
        }
      })
    },
    handleFilter() {
      if (!this.card) {
        this.packageInfo.list = []
        this.packageInfo.total = 0
        this.$message({
          type: 'error',
          message: '请输入卡号'
        })
        return false
      }
      this.secStatus = true
      this.cardInfo = {
        secStatus: false,
        zid: '',
        aname: '',
        real_status: '',
        amount: '',
        remarks: ''
      }
      this.packageInfo = {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: 0,
        isOffnet: '',
        threshold: '',
        single: '',
        record: '',
        sumflow: '',
        restflow: '',
        useflow: '',
        cardstatus: ''
      }
      this.orderInfo = {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      }
      this.changeInfo = {
        changeArr: [],
        card: '',
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      }
      this.statusInfo = {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      }
      this.changePackageInfo = {
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      }
      this.orderManagementInfo = {
        changeArr: [],
        secStatus: false,
        tableKey: 0,
        list: [],
        total: null
      }
      this.getPackage()
      this.getCard()
      this.getOrder()
      this.getStatus()
      this.getChangePackage()
      setTimeout(() => {
        this.getChange()
        this.getOrderManagement()
      }, 300)
    },
    getCard() {
      if (!this.card) {
        this.cardInfo.list = []
        this.cardInfo.total = 0
        return false
      }
      getBindCard({
        card: this.card, uid: sessionStorage.getItem('uid')
      }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: +res.code === 1 ? '获取卡片信息成功' : res.msg
        })
        if (+res.code === 0) {
          return false
        }

        this.cardInfo.secStatus = true
        this.iccid = res.data.iccid
        this.id = res.data.id
        this.tel = res.data.tel
        this.number = res.data.number
        this.cardInfo.zid = this.zid[+res.data.zid]
        this.cardInfo.aname = this.aname[+res.data.fid]
        this.cardInfo.real_status = +res.data.real_status === 2 ? '是' : '否'
        this.cardInfo.amount = +res.data.amount
        this.cardInfo.remarks = res.data.remarks
      })
    },
    getStatus() {
      if (!this.card) {
        this.statusInfo.list = []
        this.statusInfo.total = 0
        return false
      }
      getAllStatus({
        card: this.card
      }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: +res.code === 1 ? '获取停复机信息成功' : res.msg
        })
        if (+res.code === 0) {
          return false
        }
        this.statusInfo.secStatus = true
        this.statusInfo.list = res.data.rows
        this.statusInfo.total = +res.data.total
      })
    },
    getChangePackage() {
      if (!this.card) {
        this.changePackageInfo.list = []
        this.changePackageInfo.total = 0
        return false
      }
      getchangeList({
        old_card: this.card
      }).then(res => {
        if (+res.code === 1 && +res.data.total) {
          this.$message({
            type: +res.code === 1 ? 'success' : 'error',
            message: +res.code === 1 ? '获取异卡换套餐信息成功' : res.msg
          })
          this.changePackageInfo.secStatus = true
          this.changePackageInfo.list = res.data.rows
          this.changePackageInfo.total = +res.data.total
        } else {
          getchangeList({ new_card: this.card }).then(res => {
            if (+res.code === 1 && +res.data.total) {
              this.$message({
                type: +res.code === 1 ? 'success' : 'error',
                message: +res.code === 1 ? '获取异卡换套餐信息成功' : res.msg
              })
              this.changePackageInfo.secStatus = true
              this.changePackageInfo.list = res.data.rows
              this.changePackageInfo.total = +res.data.total
            } else {
              this.changePackageInfo.secStatus = true
              this.changePackageInfo.list = []
              this.changePackageInfo.total = 0
            }
          })
        }
      })
    },
    getOrderManagement() {
      if (!this.card) {
        this.orderManagementInfo.list = []
        this.orderManagementInfo.total = 0
        return false
      }
      getOrder({
        iccid: this.iccid, tel: this.tel
      }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: +res.code === 1 ? '获取订单信息成功' : res.msg
        })
        if (+res.code === 0) {
          return false
        }
        this.orderManagementInfo.secStatus = true
        this.orderManagementInfo.list = res.data.rows
        this.orderManagementInfo.total = +res.data.total
      })
    },
    getOrder() {
      if (!this.card) {
        this.orderInfo.list = []
        this.orderInfo.total = 0
        return false
      }
      getAddPackage({
        card: this.card
      }).then(res => {
        this.$message({
          type: +res.code === 1 ? 'success' : 'error',
          message: +res.code === 1 ? '获取套餐订购信息成功' : res.msg
        })
        if (+res.code === 0) {
          return false
        }
        this.orderInfo.secStatus = true
        this.orderInfo.list = res.data.rows
        this.orderInfo.total = +res.data.total
      })
    },
    getChange() {
      if (!this.card) {
        this.changeInfo.list = []
        this.changeInfo.total = 0
        return false
      }
      changeCard({
        oldCard: this.iccid
      }).then(res => {
        if (+res.data.total) {
          this.$message({
            type: +res.code === 1 ? 'success' : 'error',
            message: +res.code === 1 ? '获取换卡信息成功' : res.msg
          })
          this.changeInfo.secStatus = true
          this.changeInfo.card = this.iccid
          this.changeInfo.list = res.data.rows
          this.changeInfo.total = +res.data.total
        } else {
          changeCard({
            oldCard: this.tel
          }).then(res => {
            if (+res.data.total) {
              this.$message({
                type: +res.code === 1 ? 'success' : 'error',
                message: +res.code === 1 ? '获取换卡信息成功' : res.msg
              })
              this.changeInfo.secStatus = true
              this.changeInfo.card = this.tel
              this.changeInfo.list = res.data.rows
              this.changeInfo.total = +res.data.total
            } else {
              changeCard({
                oldCard: this.number
              }).then(res => {
                if (+res.data.total) {
                  this.$message({
                    type: +res.code === 1 ? 'success' : 'error',
                    message: +res.code === 1 ? '获取换卡信息成功' : res.msg
                  })
                  this.changeInfo.secStatus = true
                  this.changeInfo.card = this.number
                  this.changeInfo.list = res.data.rows
                  this.changeInfo.total = +res.data.total
                }
              })
            }
          })
        }
      })
    },
    getPackage() {
      if (!this.card) {
        this.packageInfo.list = []
        this.packageInfo.total = 0
        return false
      }
      getInfo({
        card: this.card
      }).then(res => {
        this.$message({
          type: res.code === 1 ? 'success' : 'error',
          message: +res.code === 1 ? '获取流量信息成功' : res.msg
        })
        if (+res.code === 0) {
          return false
        }
        this.packageInfo.secStatus = true
        this.packageInfo.list = res.data.flowlist
        this.packageInfo.total = +res.data.flowlist.length
        this.packageInfo.cardstatus = cardStatusMap[res.data.cardstatus]
        this.packageInfo.sumflow = res.data.sumflow
        this.packageInfo.restflow = res.data.restflow
        this.packageInfo.useflow = res.data.useflow
        this.packageInfo.threshold = +res.data.threshold === -1 ? '无' : toSize(+res.data.threshold * 1024 * 1024)
        this.packageInfo.single = +res.data.single === 2 ? '是' : '否'
        this.packageInfo.record = +res.data.record === 2 ? '是' : '否'
        this.packageInfo.isOffnet = +res.data.isOffnet === 2 ? '是' : '否'
      })
    }
  }
}
</script>
<style scoped>
.warn-content {
  display: flex;
  margin-top: 0;
  padding: 2px!important;
}
.warn-content span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}
</style>
