<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-show="secMore" v-model="listQuery.status" class="filter-item" clearable placeholder="请选择审核状态">
        <el-option
          v-for="item in withdrawStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-show="secMore" v-model.trim="listQuery.cardNo" class="filter-item" style="width:220px" clearable placeholder="请输入身份证号码"/>
      <el-input v-show="secMore" v-model.trim="listQuery.tel" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID或者接入号"/>
      <el-input v-show="secMore" v-model.trim="listQuery.name" class="filter-item" style="width:220px" clearable placeholder="请输入姓名"/>
      <el-input v-show="secMore" v-model.trim="listQuery.phone" class="filter-item" style="width:220px" clearable placeholder="请输入电话"/>
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.starttime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-show="secMore"
        v-model="listQuery.endtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="结束日期"
        class="filter-item"
      />
      <el-button v-waves v-show="secMore" class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves v-if="device==='mobile'" size="small" type="warning " class="filter-item" @click="secMore=!secMore">{{ secMore?'隐藏':'查找' }}</el-button>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:cardReal:editCardReal']" v-waves class="filter-item" size="small" type="success " @click="operationMore('pass')">通过</el-button>
      <el-button v-permission="['kuyuplat:cardReal:editCardReal']" v-waves class="filter-item" size="small" type="warning " @click="operationMore('refuse')">拒绝</el-button>
      <el-button v-permission="['kuyuplat:cardReal:batchAddCardReal']" v-waves class="filter-item" size="small" type="warning" @click="jump('/card/AutonymMore')">批量实名</el-button>
      <el-button v-permission="['kuyuplat:excel:exportCardReal','kuyuplat:cardReal:exportCardReal']" v-waves v-show="secMore" class="filter-item" size="small" type="info " @click="jump('/card/AutonymExport')">导出</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡号" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" show-overflow-tooltip min-width="115">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间" show-overflow-tooltip min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==2?'success':'warning'">{{ withdrawStatusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="正面" min-width="90">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" placement="left" class="item" effect="dark">
            <div slot="content">
              <img :src="scope.row.pic1" style="width:300px" class="image">
            </div>
            <img :src="scope.row.pic1" style="width:50px;height:50px;" class="image">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反面" min-width="90">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" placement="bottom" class="item" effect="dark">
            <div slot="content">
              <img :src="scope.row.pic2" style="width:300px" class="image">
            </div>
            <img :src="scope.row.pic2" style="width:50px;height:50px;" class="image">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手持" min-width="90">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" placement="right" class="item" effect="dark">
            <div slot="content">
              <img :src="scope.row.pic3" style="width:300px" class="image">
            </div>
            <img :src="scope.row.pic3" style="width:50px;height:50px;" class="image">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原因" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作者" show-overflow-tooltip min-width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.dname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="320px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:cardReal:editCardReal']" v-if="scope.row.status==1" type="primary" size="mini" @click="pass([scope.row.id])">通过</el-button>
          <el-button v-permission="['kuyuplat:cardReal:editCardReal']" v-if="scope.row.status==1" type="danger" size="mini" @click="refuse([scope.row.id])">拒绝</el-button>
          <el-button type="primary" size="mini" @click="jump(`/card/AutonymDetails?id=${scope.row.id}`)">详情</el-button>
          <el-button v-permission="['kuyuplat:cardReal:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

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
import waves from '@/directive/waves' // 水波纹指令
import { withdrawStatus, withdrawStatusMap } from '@/utils/mapArr'
import { getCardReal, editCardReal, delCardReal } from '@/api/cardReal'

export default {
  name: 'AutonymCard',
  directives: {
    waves
  },
  data() {
    return {
      secMore: true,
      pickerOptions: this.processDate(),
      withdrawStatus,
      withdrawStatusMap,
      list: [],
      total: null,
      listQuery: {
        status: '',
        cardNo: '',
        iccid: '',
        tel: '',
        number: '',
        name: '',
        phone: '',
        starttime: '',
        endtime: '',
        pageNo: 1,
        pageSize: 10
      },
      selectArr: [],
      reason: '1.第一张为身份证“正”面照，不用手持，放桌上拍清晰，勿遮挡住身份证号与证件任何部位。2.第二张为身份证“反”面照，不用手持，放桌上拍清晰，勿遮挡住身份证号与证件任何部位 。3.第三张请身份证上本人手持身份证的正面照，将身份证和脸必须拍清楚。（将脸与身份证正面拍清楚 ）4.请勿自拍，因为字体是反的。'
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
  },
  methods: {
    handleDelete(row) {
      this.$confirm('此操作将删除该实名记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCardReal({ id: row.id }, '.table').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (+res.status === 0) {
            for (const v of this.list) {
              if (+v.id === +row.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1)
                break
              }
            }
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    operationMore(type) {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      const idArr = []
      this.selectArr.map((v, i) => {
        idArr.push(v.id)
      })
      if (type === 'pass') {
        this.pass(idArr)
      } else if (type === 'refuse') {
        this.refuse(idArr)
      }
    },
    pass(ids) {
      editCardReal({ status: 2, ids: Array.of(ids).join(',') }, '.table').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (res.status === 0) {
          for (const value of ids.values()) {
            for (const v of this.list) {
              if (v.id === value) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1)
                break
              }
            }
          }
        }
      })
    },
    refuse(ids) {
      this.$prompt('', '提示', {
        inputPlaceholder: '请输入拒绝原因',
        inputErrorMessage: '原因不能为空',
        inputValue: this.reason,
        inputValidator: function(value) {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }).then(({ value }) => {
        editCardReal({ status: 3, ids: Array.of(ids).join(','), reason: value }, '.table').then(res => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            for (const value of ids.values()) {
              for (const v of this.list) {
                if (v.id === value) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1)
                  break
                }
              }
            }
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消'
        })
      })
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    jump(type) {
      this.$router.push(type)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.starttime).getTime() > time.getTime()
        }
      }
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
    handleRefresh() {
      this.listQuery = {
        status: '',
        cardNo: '',
        iccid: '',
        tel: '',
        number: '',
        name: '',
        phone: '',
        starttime: '',
        endtime: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },
    getList() {
      getCardReal(this.listQuery, '.table').then(res => {
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
