<template>
  <div class="app-container calendar-list-container">
    <p class="warn-content">
      代理商登陆网址:
      <a :href="dls_url" target="_blank">{{ dls_url }}</a>
    </p>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" style="width: 200px;" clearable class="filter-item" placeholder="请输入代理商名称" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:agent:save']" class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate"/>
      <el-button v-waves class="filter-item download" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
    </div>
    <tree-table :data="list" :expand-all="expandAll" :icon="true" :icon-sec="iconSec" :first-label="firstLabel" :toggle-expanded="toggleExpanded" :permission= "checkPermission(['kuyuplat:agent:launch'])" class="table" border>
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span v-if="scope.row.type!=='agent'&&scope.row.type!=='kefu'">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="登录账号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="电话" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="等级">
        <template slot-scope="scope">
          <span>{{ scope.row.type| typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="上级代理商">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.accountType| accountTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="返点类型">
        <template slot-scope="scope">
          <span>{{ scope.row.isper| isperFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="剩余佣金(元)" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="账户余额(元)" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="720">
        <template v-if="scope.row.type!=='agent'&&scope.row.type!=='kefu'" slot-scope="scope">
          <el-button v-permission="['kuyuplat:card:find']" type="warning" size="mini" @click="jump(`/card/manage?aid=${scope.row.id}`)">卡片</el-button>
          <el-button v-permission="['kuyuplat:agent:update']" v-if="scope.row.type==1" type="primary" icon="el-icon-edit-outline" size="mini" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:agent:per']" v-if="scope.row.type==1" type="primary" size="mini" @click="handleUpdateType(scope.row)">返点类型</el-button>
          <el-button v-permission="['kuyuplat:agentAccount:search']" v-if="scope.row.type==1" type="primary" size="mini" @click="jump(`/agent/amount?aid=${scope.row.id}`)">充值</el-button>
          <el-button v-permission="['kuyuplat:agent:password']" type="info" size="mini" @click="handlePassword(scope.row)">密码</el-button>
          <el-button v-permission="['kuyuplat:commissions:search']" v-if="scope.row.type==1" type="info" size="mini" @click="jump(`/finance/commission?name=${scope.row.name}&aid=${scope.row.id}`)">佣金</el-button>
          <el-button v-permission="['kuyuplat:packagePrice:show']" v-if="scope.row.isper == 2&&scope.row.type==1" type="success" size="mini" @click="jump(`/agent/package?name=${scope.row.name}&aid=${scope.row.id}`)">套餐</el-button>
          <el-button v-permission="['kuyuplat:agent:per']" v-if="scope.row.isper == 1&&scope.row.type==1" type="primary" size="mini" @click="jump(`/agent/per?aid=${scope.row.id}`)">比例</el-button>
          <el-button v-permission="['kuyuplat:userRole:distribute']" v-if="scope.row.type==1" type="primary" size="mini" @click="handleRole(scope.row)">角色</el-button>
          <el-button v-permission="['kuyuplat:userMenu:distribute']" v-if="scope.row.type==1" type="primary" size="mini" @click="handleUserRole(scope.row)">权限</el-button>
          <el-button v-permission="['kuyuplat:withdrawal:close']" :type="scope.row.close == 0?'danger':'primary'" size="mini" @click="handleWithdrawal(scope.row)">{{ scope.row.close == 0?'关闭提现':'开启提现' }}</el-button>
          <el-button v-permission="['kuyuplat:agent:delete']" v-if="scope.row.type==1" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column>
    </tree-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item v-if ="dialogStatus=='updateUserRole'" label="权限" prop="menu">
          <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字进行过滤"/>
          <el-tree
            ref="tree"
            :data="menu"
            :default-checked-keys="checkedKeys"
            :default-expanded-keys="expandedKeys"
            :filter-node-method="filterNode"
            show-checkbox
            highlight-current
            empty-text="暂无数据"
            node-key="id"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="代理商登陆账号" prop="username">
          <el-input v-model.trim="temp.username" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='update'" label="代理商名称" prop="name">
          <el-input v-model.trim="temp.name" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='update'" label="代理商类型" prop="accountType" style="padding-right: 45px;">
          <el-radio v-model="temp.accountType" :label="1" style="margin-left:0;width:5rem;white-space: nowrap;">行业用户</el-radio>
          <el-radio v-model="temp.accountType" :label="2" style="margin-left:0;width:4rem">渠道用户</el-radio>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='password'" label="代理商密码" prop="password">
          <el-input v-model.trim="temp.password" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='update'" label="代理商电话" prop="phone">
          <el-input v-model.trim.number="temp.phone" clearable />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='update'" label="代理商地区">
          <el-cascader :options="options" v-model="selectedOptions" size="large" @change="handleChange" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='updateRole'" label="角色" style="width:250px">
          <el-select v-model="role" class="filter-item" clearable placeholder="请选择角色">
            <el-option v-for="item in roleSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='updateType'" label="返点类型" prop="accountType" style="padding-right: 45px;">
          <el-radio v-model="temp.isper" :label="1" style="margin-left:0;width:5rem;white-space: nowrap;">比例返点</el-radio>
          <el-radio v-model="temp.isper" :label="2" style="margin-left:0;width:4rem">套餐返点</el-radio>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'||dialogStatus=='update'" label="代理商支付类型">
          <el-select v-model="temp.payType" class="filter-item" clearable placeholder="代理商支付类型" >
            <el-option
              v-for="item in payType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.payType==2&&(dialogStatus=='create'||dialogStatus=='update')" label="其他平台名称:">
          <el-input v-model.trim="temp.website_name"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==2&&(dialogStatus=='create'||dialogStatus=='update')" label="收费链接:">
          <el-input v-model.trim="temp.pay_link"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==1&&(dialogStatus=='create'||dialogStatus=='update')" label="微信公众号名称:">
          <el-input v-model.trim="temp.wechat_name"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==1&&(dialogStatus=='create'||dialogStatus=='update')" label="微信公众号AppId:">
          <el-input v-model.trim="temp.appid"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==1&&(dialogStatus=='create'||dialogStatus=='update')" label="公众号AppSecret:">
          <el-input v-model.trim="temp.secret"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==1&&(dialogStatus=='create'||dialogStatus=='update')" label="支付商户MCHID:">
          <el-input v-model.trim="temp.mchid"/>
        </el-form-item>
        <el-form-item v-if="temp.payType==1&&(dialogStatus=='create'||dialogStatus=='update')" label="商户PartnerKey:">
          <el-input v-model.trim="temp.key"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="微信提醒">
          <el-input v-model.trim="temp.openid" class="filter-item" clearable placeholder="填写需要推送的openid，以英文逗号隔开，最多五个" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import {
  searchAgents,
  addAgent,
  agentUpdate,
  agentDel,
  launchAgent,
  agentUpdatePassword,
  updatePer,
  closeWithdrawal
} from '@/api/agent'
import { toTreeData } from '@/utils/tree'
import { distributeUserRole, distributeUserMenu, searchUserRole, searchUserMenu } from '@/api/role'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
import { roleArr } from '@/utils/mapArr'
import store from '@/store'

export default {
  name: 'AgentManage',
  components: { treeTable },
  directives: {
    waves
  },
  filters: {
    isperFilter(isper) {
      const isperMap = {
        1: '比例返点',
        2: '套餐返点'
      }
      return isperMap[isper]
    },
    TypeFilter(type) {
      const statusMap = {
        1: '一级',
        2: '二级',
        3: '三级',
        4: '四级',
        100: '客服'
      }
      return statusMap[type]
    },
    accountTypeFilter(accountType) {
      const statusMap = {
        1: '行业用户',
        2: '渠道用户'
      }
      return statusMap[accountType]
    }
  },
  data() {
    return {
      filterText: '',
      options: provinceAndCityData,
      selectedOptions: [],
      tableKey: 0,
      roleSelect: [],
      parentArr: [],
      role: '',
      iconSec: false,
      firstLabel: '代理商名称',
      payType: [
        {
          value: 0,
          label: '当前平台支付'
        },
        {
          value: 1,
          label: '公众号支付'
        },
        {
          value: 2,
          label: '其它平台支付'
        }
      ],
      list: [],
      total: null,
      expandAll: false,
      menu: [],
      checkedKeys: [],
      expandedKeys: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: this.$route.query.name
      },
      temp: {
        id: undefined,
        name: '',
        phone: '',
        username: '',
        province: '',
        city: '',
        accountType: '',
        password: '',
        payType: '',
        openid: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        updateType: '返点类型设置',
        updateRole: '角色设置',
        updateUserRole: '权限设置'
      },
      rules: {
        name: [
          {
            required: true,
            message: '代理商名称不能为空',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '代理商登陆账号不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '代理商密码不能为空',
            trigger: 'blur'
          }
        ],
        accountType: [
          {
            required: true,
            message: '代理商类型不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    dls_url() {
      return this.$store.getters.url
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    dialogFormVisible(val) {
      if (!val) {
        this.filterText = ''
      }
    }
  },
  created() {
    this.getList()
    roleArr(1, res => {
      this.roleSelect = res
    })
  },
  methods: {
    checkPermission,
    handleWithdrawal(row) {
      this.$confirm(
        `此操作将${+row.close === 0 ? '关闭提现' : '开启提现'}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          row.close = +row.close === 0 ? 1 : 0
          closeWithdrawal({
            id: row.id,
            status: row.close
          }, '.el-dialog__footer').then((res) => {
            if (+res.status === 0) {
              this.$notify({
                title: '成功',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              for (const v of this.list) {
                if (v.id === row.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, row)
                  break
                }
              }
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消'
          })
        })
    },
    toggleExpanded(value) {
      if (!value._expanded) {
        if (+value.type === 1 && !value.children || value.type === 1 && value.children.length === 0) {
          const typeOne = [
            { 'id': `kefu-${value.id}`, 'pid': value.id, 'name': '客服', 'type': 'kefu' },
            { 'id': `agent-${value.id}`, 'pid': value.id, 'name': '代理商', 'type': 'agent' }
          ]
          this.list = [].concat(this.getTreeData(typeOne, this.list))
        } else if (value.type !== 1) {
          let type
          let id
          if (value.type === 'agent') {
            id = value.id.split('-')[1]
            type = 2
          } else if (value.type === 'kefu') {
            id = value.id.split('-')[1]
            type = 100
          } else if (value.type === '100') {
            return false
          } else {
            type = value.type + 1
          }
          launchAgent({ aid: id || value.id, type }, `.rowClassName${value.id}`).then(res => {
            if (res.status === 0) {
              this.$nextTick(() => {
                if (+res.data.total > 0) {
                  if (value.type === 'agent') {
                    res.data.rows.map((cNode, j) => {
                      cNode.pid = `agent-${id}`
                    })
                  } else if (value.type === 'kefu') {
                    res.data.rows.map((cNode, j) => {
                      cNode.pid = `kefu-${id}`
                    })
                  }
                  if (!value.children || value.children.length === 0) {
                    this.list = [].concat(this.getTreeData(res.data.rows, this.list))
                  }
                }
              })
            }
          })
        }
      }
      value._expanded = !value._expanded
    },
    // 这里处理没有children结构的数据
    getTreeData(list, dataArr) {
      dataArr.map((pNode, i) => {
        const childObj = pNode.children || []
        list.map((cNode, j) => {
          if (pNode.id === cNode.pid) {
            childObj.push(cNode)
          }
        })
        pNode.children = childObj
        if (childObj.length > 0) {
          this.getTreeData(list, childObj)
        }
      })
      return dataArr
    },
    handleRole(row) {
      searchUserRole({ userId: row.userid }).then(res => {
        if (res.status !== 0) {
          return
        }
        this.role = ''
        if (res.data.length > 0) {
          res.data.map((v, i) => {
            if (v.checked === 'true') {
              this.role = v.id
            }
          })
        }
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'updateRole'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }).catch(
        () => {
          this.role = ''
          this.temp = Object.assign({}, row) // copy obj
          this.dialogStatus = 'updateRole'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      )
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleUserRole(row) {
      this.checkedKeys = []
      this.menu = []
      this.expandedKeys = []
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'updateUserRole'
      this.dialogFormVisible = true
      searchUserMenu({ userId: row.userid }).then(res => {
        if (res.status === 0) {
          const oneArr = []
          const twoArr = []
          for (var b in res.data) {
            if (res.data[b]['checked'] === 'true') {
              oneArr.push(res.data[b]['id'])
            }
            if (+res.data[b]['parentId'] === 0 && res.data[b]['checked'] === 'false ') {
              twoArr.push(res.data[b]['id'])
            }
          }
          this.menu = toTreeData(res.data)
          this.checkedKeys = this.checkedKeys.concat(oneArr)
          this.expandedKeys = this.expandedKeys.concat(twoArr)
        }
      })
    },
    jump(type) {
      this.$router.push(type)
    },
    handleChange(value) {
      this.temp.province = CodeToText[value[0]]
      this.temp.city = CodeToText[value[1]]
    },
    handleRefresh() {
      this.listQuery.pageNo = 1
      this.listQuery.name = ''
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        phone: '',
        username: '',
        province: '',
        city: '',
        accountType: '',
        password: '',
        payType: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addAgent(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.getList('sec ')
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
        }
      })
    },
    handleUpdate(row) {
      if (TextToCode[row.province]) {
        this.selectedOptions = [
          TextToCode[row.province].code,
          TextToCode[row.province][row.city]
            ? TextToCode[row.province][row.city].code
            : ''
        ]
      } else {
        this.selectedOptions = []
      }
      row.accountType = row.accountType
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateType(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'updateType'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'password') {
            agentUpdatePassword({
              id: tempData.id,
              password: tempData.password
            }, '.el-dialog__footer').then(res => {
              if (res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
            return false
          }
          if (this.dialogStatus === 'updateUserRole') {
            distributeUserMenu({
              menuId: this.$refs.tree.getCheckedKeys().join(','),
              userId: tempData.userid
            }, '.el-dialog__footer').then(res => {
              if (res.status === 0) {
                this.getList('sec')
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
            return false
          }
          if (this.dialogStatus === 'updateType') {
            let data = {}
            if (tempData.isper === 2) {
              data = {
                id: tempData.id,
                isper: tempData.isper
              }
            } else {
              data = {
                id: tempData.id,
                isper: tempData.isper,
                per: tempData.per && +tempData.per !== 0 ? tempData.per : '{}'
              }
            }
            updatePer(data, '.el-dialog__footer').then(res => {
              if (res.status === 0) {
                store.dispatch('setAgentStatus', false)
                this.getList('sec')
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
            return false
          }
          if (this.dialogStatus === 'updateRole') {
            distributeUserRole({
              roleId: this.role,
              userId: tempData.userid
            }, '.el-dialog__footer').then(res => {
              if (res.status === 0) {
                this.getList('sec')
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
            return false
          }
          agentUpdate({
            id: tempData.id,
            name: tempData.name,
            phone: tempData.phone,
            accountType: tempData.accountType,
            province: tempData.province,
            city: tempData.city,
            appid: tempData.appid,
            mchid: tempData.mchid,
            key: tempData.key,
            secret: tempData.secret,
            websiteName: tempData.website_name,
            wechatName: tempData.wechat_name,
            payLink: tempData.payLink,
            payType: tempData.payType,
            openid: tempData.openid
          }, '.el-dialog__footer').then(res => {
            if (+res.status === 0) {
              store.dispatch('setAgentStatus', false)
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              this.getList('sec')
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    handlePassword(row) {
      this.dialogStatus = 'password'
      this.temp = Object.assign({}, row) // copy obj
      this.temp.password = ''
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该代理商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          agentDel({
            id: row.id
          }, '.el-message-box').then(res => {
            if (+res.status === 0) {
              store.dispatch('setAgentStatus', false)
              this.$notify({
                title: '结果',
                message: res.message,
                duration: 2000,
                type: 'success'

              })
              this.getList('sec')
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    downAction(pageSize) {
      searchAgents({
        name: this.listQuery.name,
        pageSize: pageSize,
        pageNo: 1
      }, '.table').then(res => {
        if (+res.status === 0) {
         import('@/vendor/Export2Excel').then(excel => {
           const tHeader = [
             'ID',
             '名称',
             '登录账号',
             '电话',
             '银行卡',
             '支付宝',
             '类型',
             '返点类型',
             '剩余佣金（元）',
             '账户余额（元）',
             '添加时间'
           ]
           const filterVal = [
             'id',
             'name',
             'username',
             'phone',
             'bankCard',
             'alipay',
             'accountType',
             'isper',
             'amount',
             'money',
             'addtime'
           ]
           const data = this.formatJson(filterVal, res.data.rows)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: `代理商信息${new Date().toLocaleDateString()}`
           })
         })
        } else {
          this.$notify({
            type: 'error',
            message: '数量过多'
          })
          this.$prompt('', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入导出数量',
            inputErrorMessage: '数量填写不正确',
            inputValue: 10000,
            inputValidator: function(value) {
              if (/(^[1-9]\d*$)/.test(+value)) {
                return true
              } else {
                return false
              }
            }
          }).then(({ value }) => {
            this.downAction(value)
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    handleDownload() {
      this.downAction()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'accountType') {
            return v[j] === 1 ? '行业用户' : '渠道用户'
          } else if (j === 'isper') {
            return v[j] === 1 ? '比例返点' : '套餐返点'
          } else {
            return v[j]
          }
        })
      )
    },
    getList(type) {
      searchAgents(this.listQuery, '.table').then(res => {
        if (+res.status !== 0) {
          return false
        }
        if (res.data.rows.length > 0) {
          const parentArr = res.data.rows.filter(l => +l.type === 1)
          this.list = this.getTreeData(res.data.rows, parentArr)
          if (this.listQuery.name) {
            this.expandAll = true
            this.iconSec = true
          } else {
            this.expandAll = false
            this.iconSec = false
          }
        } else {
          this.list = []
        }
        this.total = res.data.total || 0
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}
</style>
