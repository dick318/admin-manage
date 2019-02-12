<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.tel" style="width: 200px;" clearable class="filter-item" placeholder="请输入接入号" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.iccid" style="width: 200px;" clearable class="filter-item" placeholder="请输入ICCID" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.content" style="width: 200px;" clearable class="filter-item" placeholder="请输入短信内容" @clear="handleFilter" />
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option
          v-for="item in agentSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.type" class="filter-item" filterable clearable placeholder="请选择操作类型">
        <el-option
          v-for="item in typeSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.addStarttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="添加开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.addEndtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="添加结束日期"
        class="filter-item"
      />            <el-date-picker
        v-model="listQuery.sendStarttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="发送开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.sendEndtime"
        :picker-options="sendPickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="发送结束日期"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:sms:send']" v-waves class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="addSms" />
    </div>
    <el-table
      :data="list"
      :fit ="true"
      row-key="id"
      class="table"
      element-loading-text="给我一点时间"
      size="mini"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理商" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入号" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ICCID" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="短信内容" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip min-width="135">
        <template slot-scope="scope">
          <el-tag :type="typeStatusMap[scope.row.status]">{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="短信类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'success':''">{{ typeMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="套餐批次" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" :inline="true" label-position="right" class="dialog" label-width="9rem">
        <el-form-item label="接入号:" prop="tel">
          <el-input v-model.trim="temp.tel"/>
        </el-form-item>
        <el-form-item label="指令:">
          <el-select v-model="instruct" class="filter-item" filterable clearable placeholder="请选择指令" @change="getContent">
            <el-option
              v-for="item in instructListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model.trim="temp.content" :autosize="{ minRows: 5, maxRows: 8}" style="margin-top:10px;width:200px;vertical-align: bottom;" class="filter-item" clearable placeholder="请填写内容！" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { smsList, smsSend, instructList } from '@/api/sms'
import {
  agentArr
} from '@/utils/mapArr'
export default {
  name: 'SmsManage',
  directives: {
    waves
  },
  data() {
    return {
      typeStatusMap: {
        1: 'info',
        2: '',
        3: 'success',
        4: 'danger'
      },
      statusMap: {
        1: '创建中',
        2: '发送中',
        3: '发送成功',
        4: '发送失败'
      },
      typeMap: {
        1: '发送',
        2: '接受'
      },
      instruct: '',
      instructListSelect: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        tel: '',
        iccid: '',
        content: '',
        aid: '',
        type: '',
        addStarttime: '',
        addEndtime: '',
        sendStarttime: '',
        sendEndtime: ''
      },
      pickerOptions: this.processDate(),
      sendPickerOptions: this.sendProcessDate(),
      temp: {
        content: '',
        tel: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '发送'
      },
      list: [],
      tableKey: 0,
      total: 0,
      agentSelect: [],
      typeSelect: [
        {
          value: '1',
          label: '发送'
        },
        {
          value: '2',
          label: '接受'
        }
      ],
      rules: {
        content: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            required: true,
            message: '接入号不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    agentArr((agentSelect) => {
      this.agentSelect = agentSelect
    })
    instructList({}).then(res => {
      if (res.status !== 0) {
        return false
      }
      res.data.rows.map((v, i) => {
        const value = v.content
        const label = v.tetle
        this.instructListSelect.push(
          { value, label }
        )
      })
    })
  },
  methods: {
    getContent(val) {
      this.temp.content = this.instruct
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.addStarttime).getTime() > time.getTime()
        }
      }
    },
    sendProcessDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.sendStarttime).getTime() > time.getTime()
        }
      }
    },
    resetTemp() {
      this.temp = {
        tel: '',
        content: ''
      }
    },
    addSms() {
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
          smsSend(this.temp, '.el-dialog__footer')
            .then(res => {
              if (+res.status === 0) {
                this.$notify({
                  title: '结果',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.getList()
                this.dialogFormVisible = false
              }
            })
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList('sec')
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList('sec')
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        tel: '',
        iccid: '',
        content: '',
        aid: '',
        type: '',
        addStarttime: '',
        addEndtime: '',
        sendStarttime: '',
        sendEndtime: ''
      }
      this.getList('sec')
    },
    getList(type) {
      smsList(this.listQuery, '.table').then(res => {
        if (res.status === 0) {
          this.list = res.data.rows
          this.total = +res.data.total
        }
        if (type === 'sec') {
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
