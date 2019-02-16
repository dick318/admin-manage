<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-show="secMore" v-model="listQuery.seckillId" class="filter-item seckillId" filterable clearable placeholder="请选择秒杀活动">
        <el-option
          v-for="item in seckillArr"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.sname" class="filter-item" style="width:220px" clearable placeholder="请输入姓名"/>
      <el-input v-show="secMore" v-model.trim="listQuery.sphone" class="filter-item" style="width:220px" clearable placeholder="请输入手机号"/>
      <el-select v-show="secMore" v-model="listQuery.Cname" class="filter-item" filterable allow-create clearable placeholder="请选择快递公司">
        <el-option
          v-for="item in CnameArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.Cnumber" class="filter-item" style="width:220px" clearable placeholder="请输入快递单号"/>
      <el-select v-show="secMore" v-model="listQuery.status" class="filter-item" filterable clearable placeholder="请选择支付状态">
        <el-option
          v-for="item in obtainStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-show="secMore" v-model="listQuery.operator" class="filter-item" filterable clearable placeholder="请选择商品类型">
        <el-option
          v-for="item in operatorSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>

      <el-input v-show="secMore" v-model.trim="listQuery.orderid" class="filter-item" style="width:220px" clearable placeholder="请输入订单号"/>
      <el-button v-waves v-show="secMore" size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-if="device==='mobile'" size="small" type="warning " class="filter-item" @click="secMore=!secMore">{{ secMore?'隐藏':'查找' }}</el-button>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:excel:obtainOatchExport']" v-show="secMore" class="filter-item" size="small" type="warning " @click="javaDownload">JAVA导出</el-button>
      <el-button v-waves v-permission="['kuyuplat:excel:obtainBatchUpdate']" class="filter-item" size="small" type="success " @click="jump('/other/generalizeMore')">批量处理</el-button>

    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column align="center" label="id" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sphone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品套餐" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="省份" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区县" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细地址" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='未支付'?'danger':'success'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" type="text" >{{ scope.row.orderid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付金额" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="快递公司" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Cname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物流单号" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.Cnumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发货时间" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.sendtime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="120px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:obtain:update']" v-if="scope.row.status == 2||scope.row.status =='已支付'" type="primary" size="mini" @click="operationPass(scope.row.id)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible" title="发货">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item label="快递公司" prop="Cname">
          <el-select v-model="temp.Cname" class="filter-item" filterable clearable placeholder="请选择快递公司">
            <el-option
              v-for="item in CnameArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="Cnumber">
          <el-input v-model.trim="temp.Cnumber" clearable placeholder="请输入快递单号"/>
        </el-form-item>
        <el-form-item label="卡号">
          <el-input v-model.trim="temp.remarks" clearable placeholder="请输入卡号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { obtainUpdate, batchExport, getObtain } from '@/api/generalize'
import { getSeckillNames } from '@/api/seckill'
import { obtainStatusSelect } from '@/utils/mapArr'
import { downloadFile } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Generalize',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      secMore: true,
      obtainStatusSelect,
      dialogFormVisible: false,
      list: [],
      seckillArr: [],
      total: 0,
      tableKey: 0,
      listQuery: {
        seckillId: +this.$route.query.id || '',
        operator: '',
        sname: '',
        sphone: '',
        Cname: '',
        Cnumber: '',
        status: '',
        orderid: '',
        pageNo: 1,
        pageSize: 10
      },
      rules: {
        Cname: [
          { required: true, message: '请选择快递公司', trigger: 'blur' }
        ],
        Cnumber: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ]
      },
      temp: {},
      operatorSelect: [
        {
          value: '1',
          label: '移动'
        },
        {
          value: '2',
          label: '电信'
        },
        {
          value: '3',
          label: '联通'
        },
        {
          value: '4',
          label: '2000元影视购物卡'
        },
        {
          value: '5',
          label: '4G无线上网设备'
        },
        {
          value: '6',
          label: '流量卡套件'
        },
        {
          value: '7',
          label: '万能遥控器'
        },
        {
          value: '8',
          label: '49元200G/月套餐'
        },
        {
          value: '9',
          label: '19.9元40G/月套餐'
        }
      ],
      CnameArr: [
        {
          value: 'shunfeng',
          label: '顺丰'
        },
        {
          value: '圆通快递',
          label: '圆通快递'
        }
      ],
      loading: true,
      selectArr: [],
      reason: '您好！请联系卖家换卡，谢谢！'
    }
  },
  computed: {
    device() {
      return this.$store.getters.device
    }
  },
  created() {
    if (this.device === 'mobile') {
      this.secMore = false
    }
    this.getList()
    getSeckillNames({}, '.seckillId').then(res => {
      if (+res.status === 0) {
        this.seckillArr = res.data
      }
    })
  },
  methods: {
    operationPass(id) {
      this.temp = Object.assign({}, { id }) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          obtainUpdate({ id: tempData.id, Cname: this.temp.Cname, Cnumber: this.temp.Cnumber, card: this.temp.card }, '.el-dialog__footer').then(res => {
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
            if (+res.status === 0) {
              this.getList('sec')
              this.dialogFormVisible = false
            }
          })
        }
      })
    },
    jump(type) {
      this.$router.push(type)
    },
    getList(type) {
      getObtain(this.listQuery, '.table').then(res => {
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status !== 0) {
          return false
        }
        this.list = res.data.rows
        this.total = +res.data.total
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleRefresh() {
      this.listQuery = {
        seckillId: '',
        sname: '',
        sphone: '',
        Cname: '',
        Cnumber: '',
        status: '',
        orderid: '',
        operator: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },

    javaDownload() {
      const tempData = Object.assign({}, this.listQuery)
      delete tempData.pageNo
      delete tempData.pageSize
      batchExport(tempData, '.table').then(res => {
        if (res.status === 0) {
          downloadFile(res.data)
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
<style >
.cardStatus {
  display: flex;
  margin-top: 0;
}
.cardStatus span {
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}
</style>
