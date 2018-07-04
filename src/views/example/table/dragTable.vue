<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入代理商名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list.slice((this.listQuery.page-1)*this.listQuery.limit,this.listQuery.page*this.listQuery.limit)" row-key="id" :key='tableKey' v-loading.body="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.accountType| typeFilter}}</span>
        </template>
      </el-table-column>
   <el-table-column width="180px" align="center" label="返点比例">
        <template slot-scope="scope">
          <span>{{scope.row.per| perFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="登录账号">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="银行卡">
        <template slot-scope="scope">
          <span>{{scope.row.bankCard}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="支付宝">
        <template slot-scope="scope">
          <span>{{scope.row.alipay}}</span>
        </template>
      </el-table-column>
   
      <el-table-column width="180px" align="center" label="剩余佣金(元)">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
   
      <el-table-column width="180px" align="center" label="账户余额(元)">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.addtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :inline="true" :model="temp" label-position="left" label-width="145px" style='width: 600px; margin-left:50px;'>
        <el-form-item label="代理商名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>    
        <el-form-item label="代理商电话" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item> 
        <el-form-item label="代理商登陆账号" prop="username">
          <el-input v-model="temp.username"></el-input>
        </el-form-item>
        <el-form-item label="代理商类型" prop="accountType">
          <el-radio v-model="temp.accountType" label="1">行业用户</el-radio>
          <el-radio v-model="temp.accountType" label="2">渠道用户</el-radio>
        </el-form-item>
        <el-form-item label="代理商密码" prop="password" v-if="dialogStatus=='create'">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item label="代理商支付类型" prop="payType">
          <el-radio-group v-model="temp.payType" :inline="true" @change='payType'>
            <el-radio :label="1">当前平台支付</el-radio>
            <el-radio :label="2">公众号支付</el-radio>
            <el-radio :label="3">其它平台支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="平台名称" prop="website_name" v-if="temp.payType=='3'">
          <el-input v-model="temp.website_name"></el-input>
        </el-form-item>
        <el-form-item label="支付支付链接" prop="pay_link" v-if="temp.payType=='3'">
          <el-input v-model="temp.pay_link"></el-input>
        </el-form-item>
        <el-form-item label="公众号名称" prop="wechat_name" v-if="temp.payType=='2'">
          <el-input v-model="temp.wechat_name"></el-input>
        </el-form-item>
        <el-form-item label="公众号AppId" prop="appid" v-if="temp.payType=='2'">
          <el-input v-model="temp.appid"></el-input>
        </el-form-item>
        <el-form-item label="公众号AppSecret" prop="appsecret" v-if="temp.payType=='2'">
          <el-input v-model="temp.appsecret"></el-input>
        </el-form-item>
        <el-form-item label="支付商户MCHID" prop="mchid" v-if="temp.payType=='2'">
          <el-input v-model="temp.mchid"></el-input>
        </el-form-item>
        <el-form-item label="商户秘钥PartnerKey" prop="key" v-if="temp.payType=='2'">
          <el-input v-model="temp.key"></el-input>
        </el-form-item>
        <el-form-item label="代理商地区">
          <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
        </el-form-item>
        <el-form-item label="微信推送openid" prop="openid" v-if="dialogStatus=='update'">
          <el-input v-model="temp.openid"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
  
</div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, delAgent } from '@/api/article'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // 水波纹指令
import { provinceAndCityData, CodeToText } from 'element-china-area-data'

export default {
  name: 'dragTable',
  directives: {
    waves
  },
  data() {
    return {
      options: provinceAndCityData,
      selectedOptions: [],
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        phone: '',
        username: '',
        province: '',
        city: '',
        accountType: '',
        password: '',
        payType: 1,
        website_name: '',
        pay_link: '',
        wechat_name: '',
        appid: '',
        appsecret: '',
        mchid: '',
        key: '',
        openid: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '代理商名称不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '代理商登陆账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '代理商密码不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    perFilter(per) {
      if (+per === 0 || per == null) {
        per = '套餐返点'
      } else {
        per = '比例返点'
      }
      return per
    },
    typeFilter(accountType) {
      const statusMap = {
        1: '行业用户',
        2: '渠道用户'
      }
      return statusMap[accountType]
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleChange(value) {
      this.temp.province = CodeToText[value[0]]
      this.temp.city = CodeToText[value[1]]
    },
    payType() {
      console.log(1)
    },
    handleRefresh() {
      this.listQuery.page = 1
      this.listQuery.name = ''
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        phone: '',
        username: '',
        accountType: '',
        password: '',
        payType: 1,
        website_name: '',
        pay_link: '',
        wechat_name: '',
        appid: '',
        appsecret: '',
        mchid: '',
        key: '',
        openid: ''
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.dialogFormVisible = true
          })
        }
      })
    },
    handleUpdate(row) {
      console.log()
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该代理商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAgent({ id: row.id }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style scoped>
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
