<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" class="filter-item" clearable style="width: 200px;" placeholder="请输入自定义套餐名称" @clear="handleFilter"/>
      <el-select v-model="listQuery.operatorid" class="filter-item" filterable clearable placeholder="请选择供应商批次类型" @clear="handleFilter">
        <el-option v-for="item in oidSelect" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <el-select v-model="listQuery.packageType" class="filter-item" clearable placeholder="请选择运营商类型" @clear="handleFilter">
        <el-option v-for="item in operator_type" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->

      <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="套餐类型" @clear="handleFilter">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isDis" class="filter-item" clearable placeholder="是否特惠" @clear="handleFilter">
        <el-option v-for="item in whether" :key="item.value" :label="item.label+'特惠'" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isInfinite" class="filter-item" clearable placeholder="是否无限量" @clear="handleFilter">
        <el-option v-for="item in whether" :key="item.value" :label="item.label+'无限量'" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-permission="['kuyuplat:package:save']" v-waves class="filter-item" size="small" type="success" icon="el-icon-plus" @click="handleAdd" />
      <el-button v-waves v-permission="['kuyuplat:packageBatch:save']" class="filter-item" size="small" type="warning" @click="jump('/business/addPackageMore')">批量添加</el-button>
      <el-button v-waves v-permission="['kuyuplat:packageBatch:update']" class="filter-item" size="small" type="warning" @click="jump('/business/updatePackageMore')">批量修改</el-button>
      <!-- <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/> -->
      <el-button v-permission="['kuyuplat:package:export']" v-waves class="filter-item" size="small" type="warning " @click="handleDownloadJava">Java导出</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table :data="list" :key="tableKey" :fit="true" row-key="id" element-loading-text="给我一点时间" class="table" size="mini" highlight-current-row>
      <!-- header-cell-class-name ='header-cell-class-name'
     row-class-name='row-class-name' cell-class-name='cell-class-name' -->
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐批次名称" min-width="160">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid]?`${oidObject[scope.row.operatorid]}--${scope.row.operatorid}`:scope.row.operatorid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="自定义套餐名称" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="供应商套餐名称" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.package }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="原价（元）" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.oldPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="实际价格（元）" align="center" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="时长（天）" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.usetime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="流量（M）" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.flow }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="卡片分类">
        <template slot-scope="scope">
          <span>{{ cardTypeMap[scope.row.cardType] }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐类型">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="运营商类型">
        <template slot-scope="scope">
          <span>{{ scope.row.packageType==1?'移动':scope.row.packageType==2?'电信':'联通' }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'success':'danger'">{{ scope.row.status==1?'已上架':'已下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="平台状态" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.hide==1?'success':'danger'">{{ scope.row.hide ==1?'平台上架':'平台下架' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="无限套餐">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isInfinite==1?'':'danger'">{{ scope.row.isInfinite==1?'普通':'无限' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="特惠套餐">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDis==1?'':'danger'">{{ scope.row.splStatus==1?'普通':'特惠' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="固定套餐">
        <template slot-scope="scope">
          <el-tag :type="scope.row.base==1?'':'danger'">{{ scope.row.base==1?'普通':'固定' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="叠加套餐">
        <template slot-scope="scope">
          <el-tag :type="scope.row.stackable==1?'':'danger'">{{ scope.row.stackable==1?'普通':'叠加' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="定价类型" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.unite==1?'danger':''">{{ scope.row.unite==1?'统一定价':'随意定价' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="280">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:package:update']" :class="{ handleUpdate: scope.$index==0 }" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)"/>
          <el-button v-permission="['kuyuplat:packageStatus:update']" :type="scope.row.status=== 2?'success':'warning'" size="mini" @click="handleStatus(scope.row)">{{ scope.row.status=== 2?"上架":'下架' }}</el-button>
          <el-button v-permission="['kuyuplat:packageHide:update']" :type="scope.row.hide=== 2?'success':'warning'" size="mini" @click="handleHide(scope.row)">{{ scope.row.hide=== 2?"平台上架":'平台下架' }}</el-button>
          <el-button v-permission="['kuyuplat:package:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="pageSize" :pager-count="5" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-position="right" class="dialog" label-width="11rem">
        <el-form-item label="供应商" prop="operatorid">
          <el-select v-if="checkPermission(['kuyuplat:packageName:search'])" v-model="temp.operatorid" class="filter-item" filterable clearable placeholder="请选择供应商批次类型" @change="handleChange">
            <el-option v-for="item in oidSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐名称id">
          <el-select v-model="temp.sonId" class="filter-item" filterable clearable placeholder="多月套餐请选择对应固定包">
            <el-option v-for="item in sonIdArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡片分类" prop="cardType">
          <el-select v-model="temp.cardType" class="filter-item" filterable clearable placeholder="请选择卡片分类">
            <el-option v-for="item in cardTypeSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义套餐类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" filterable clearable placeholder="请选择自定义套餐类型">
            <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="运营商类型" prop="packageType">
          <el-select v-model="temp.packageType" class="filter-item" filterable clearable placeholder="请选择运营商类型">
            <el-option v-for="item in operator_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="特惠套餐" prop="isDis">
          <el-radio v-model="temp.isDis" :label="2" style="margin-left:10px;width:90px">是</el-radio>
          <el-radio v-model="temp.isDis" :label="1" style="margin-left:10px;width:90px">否</el-radio>
        </el-form-item>
        <el-form-item label="套餐定价类型" prop="unite">
          <el-radio v-model="temp.unite" :label="1" style="margin-left:10px;width:90px">统一定价</el-radio>
          <el-radio v-model="temp.unite" :label="2" style="margin-left:10px;width:90px">随意定价</el-radio>
        </el-form-item>
        <el-form-item label="固定套餐" prop="base">
          <el-radio v-model="temp.base" :label="2" style="margin-left:10px;width:90px">是</el-radio>
          <el-radio v-model="temp.base" :label="1" style="margin-left:10px;width:90px">否</el-radio>
        </el-form-item>
        <el-form-item label="叠加套餐" prop="stackable">
          <el-radio v-model="temp.stackable" :label="2" style="margin-left:10px;width:90px">是</el-radio>
          <el-radio v-model="temp.stackable" :label="1" style="margin-left:10px;width:90px">否</el-radio>
        </el-form-item>
        <el-form-item label="无限套餐" prop="isInfinite">
          <el-radio v-model="temp.isInfinite" :label="2" style="margin-left:10px;width:90px">是</el-radio>
          <el-radio v-model="temp.isInfinite" :label="1" style="margin-left:10px;width:90px">否</el-radio>
        </el-form-item>
        <el-form-item label="实际价格（元）" prop="price">
          <el-input v-model.trim.number="temp.price" clearable />
        </el-form-item>
        <el-form-item label="原价（元）" prop="oldPrice">
          <el-input v-model.trim.number="temp.oldPrice" clearable />
        </el-form-item>
        <el-form-item label="套餐批次名称">
          <el-input v-model.trim="temp.operatorPackageName" clearable />
        </el-form-item>
        <el-form-item label="套餐批次ID">
          <el-input v-model.trim="temp.packageid" clearable />
        </el-form-item>
        <el-form-item label="自定义套餐名称" prop="name">
          <el-input v-model.trim="temp.name" clearable />
        </el-form-item>
        <el-form-item label="自定义套餐流量（M）" prop="flow">
          <el-input v-model.trim.number="temp.flow" clearable />
        </el-form-item>
        <el-form-item label="自定义套餐时长（天）" prop="usetime">
          <el-input v-model.trim.number="temp.usetime" clearable />
        </el-form-item>
        <el-form-item label="排序（越大越靠前）">
          <el-input v-model.trim.number="temp.sort" clearable />
        </el-form-item>
        <el-form-item label="自定义套餐简介" prop="text">
          <el-input v-model.trim="temp.text" clearable type="textarea"/>
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
import { exportFlowPackages, searchFlowPackages, updateFlowPackage, updateStatus, updateHide, deleteFlowPackage, saveFlowPackage, getFlowPackages } from '@/api/package'
import {
  typeMap,
  operator_type,
  type,
  operatorArr,
  cardTypeMap,
  whether,
  cardTypeSelect
} from '@/utils/mapArr'
import checkPermission from '@/utils/permission' // 权限判断函数
import waves from '@/directive/waves' // 水波纹指令
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { packageList } from '../guide/defineSteps'
export default {
  name: 'Package',
  directives: {
    waves
  },
  data() {
    return {
      whether,
      typeMap,
      cardTypeMap,
      cardTypeSelect,
      driver: null,
      tableKey: 0,
      list: [],
      total: null,
      oidSelect: [],
      sonIdArr: [],
      operator_type,
      type,
      pageSize: 10,
      listQuery: {
        pageNo: 1,
        name: '',
        packageType: '',
        type: '',
        isDis: '',
        isInfinite: '',
        operatorid: ''
      },
      temp: {
        id: undefined,
        operatorid: '',
        sonId: 0,
        cardType: '',
        type: '',
        packageType: '',
        isDis: 1,
        unite: 2,
        base: 1,
        stackable: 1,
        isInfinite: 1,
        price: '',
        oldPrice: '',
        operatorPackageName: '',
        packageid: '',
        name: '',
        flow: '',
        usetime: '',
        sort: 0,
        text: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      rules: {
        operatorid: [
          {
            required: true,
            message: '请选择供应商批次类型',
            trigger: 'blur'
          }
        ],
        cardType: [
          {
            required: true,
            message: '请选择卡片分类',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择自定义套餐类型',
            trigger: 'blur'
          }
        ],
        packageType: [
          {
            required: true,
            message: '请选择运营商类型',
            trigger: 'blur'
          }
        ],
        isDis: [
          {
            required: true,
            message: '请选择是否为特惠套餐',
            trigger: 'blur'
          }
        ],
        unite: [
          {
            required: true,
            message: '请选择套餐定价类型',
            trigger: 'blur'
          }
        ],
        base: [
          {
            required: true,
            message: '请选择是否为固定套餐',
            trigger: 'blur'
          }
        ],
        stackable: [
          {
            required: true,
            message: '请选择是否为叠加套餐',
            trigger: 'blur'
          }
        ],
        isInfinite: [
          {
            required: true,
            message: '请选择是否为无限套餐',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '实际价格不能为空',
            trigger: 'blur'
          },
          { type: 'number', message: '实际价格必须为数字值' }
        ],
        oldPrice: [
          {
            required: true,
            message: '原价不能为空',
            trigger: 'blur'
          },
          { type: 'number', message: '原价必须为数字值' }
        ],
        name: [
          {
            required: true,
            message: '自定义套餐名称不能为空',
            trigger: 'blur'
          }
        ],
        flow: [
          {
            required: true,
            message: '自定义套餐流量不能为空',
            trigger: 'blur'
          },
          { type: 'number', message: '流量必须为数字值' }
        ],
        usetime: [
          {
            required: true,
            message: '自定义套餐时长不能为空',
            trigger: 'blur'
          },
          { type: 'number', message: '时长必须为数字值' }
        ]
      },
      oidObject: {}
    }
  },
  created() {
    this.getSelect()
    this.getList()
  },
  updated() {
    this.driver = new Driver({
      opacity: 0.5,
      doneBtnText: '完成', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      stageBackground: '#ffffff', // Background color for the staged behind highlighted element
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步',
      onReset: Element => {
        this.$router.push(`/business/package`)
      } // Called when overlay is about to be cleared
    })
    if (this.$route.query.guide) {
      this.driver.defineSteps(packageList)
      this.driver.start()
    }
  },
  methods: {
    checkPermission,
    jump(val) {
      this.$router.push(val)
    },
    handleChange(val, flag) {
      getFlowPackages({ operatorid: val, base: 2 }).then(res => {
        const Arr = []
        res.data.map((v, i) => {
          const value = v.id
          const label = v.name
          Arr.push({ value, label })
        })
        this.sonIdArr = Arr
        if (!flag) {
          this.temp.sonId = 0
        }
      })
    },
    getSelect() {
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        name: '',
        packageType: '',
        type: '',
        isDis: '',
        isInfinite: '',
        operatorid: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        operatorid: '',
        sonId: 0,
        cardType: '',
        type: '',
        packageType: '',
        isDis: 1,
        unite: 2,
        base: 1,
        stackable: 1,
        isInfinite: 1,
        price: '',
        oldPrice: '',
        operatorPackageName: '',
        packageid: '',
        name: '',
        flow: '',
        usetime: '',
        sort: 0,
        text: ''
      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.handleChange(row.operatorid, true)
      this.temp.sonId = row.sonId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'create') {
            saveFlowPackage(tempData, '.el-dialog__footer').then((res) => {
              if (+res.status === 0) {
                this.getList('sec')
                this.$notify({
                  title: '成功',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
                this.dialogFormVisible = false
              }
            })
          }
          if (this.dialogStatus === 'update') {
            updateFlowPackage(tempData, '.el-dialog__footer').then((res) => {
              if (+res.status === 0) {
                this.dialogFormVisible = false
                this.getList('sec')
                this.$notify({
                  title: '成功',
                  message: res.message,
                  duration: 2000,
                  type: 'success'

                })
              }
            })
          }
        }
      })
    },
    handleDelete(row) {
      this.$confirm(
        `此操作将删除套餐, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteFlowPackage({
            id: row.id
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
                  this.list.splice(index, 1)
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
    handleHide(row) {
      this.$confirm(
        `此操作将${+row.hide === 2 ? '平台上架' : '平台下架'}套餐, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          row.hide = +row.hide === 2 ? 1 : 2
          updateHide({
            id: row.id,
            hide: row.hide
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
    handleStatus(row) {
      this.$confirm(
        `此操作将${+row.status === 2 ? '上架' : '下架'}套餐, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          row.status = +row.status === 2 ? 1 : 2
          updateStatus({
            id: row.id,
            status: row.status
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
    handleDownloadJava() {
      exportFlowPackages({}, '.table').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (+res.status === 0) {
          window.open(res.data, '_self')
        }
      })
    },
    // downAction(pageSize) {
    //   this.listQuery.pageNo = 1
    //   delete this.listQuery.pageSize
    //   searchFlowPackages(this.listQuery, '.table').then(res => {
    //     if (+res.status === 0) {
    //       const list = res.data.rows
    //       import('@/vendor/Export2Excel').then(excel => {
    //         const tHeader = [
    //           '套餐ID',
    //           '套餐批次',
    //           '自定义套餐名称',
    //           '套餐批次名称',
    //           '原价（元）',
    //           '实际价格（元）',
    //           '时长（天）',
    //           '流量（M）',
    //           '添加时间',
    //           '卡片分类',
    //           '套餐类型',
    //           '运营商类型',
    //           '状态',
    //           '平台状态',
    //           '无限套餐',
    //           '特惠套餐',
    //           '固定套餐',
    //           '叠加套餐',
    //           '定价类型',
    //           '排序',
    //           '简介'
    //         ]
    //         const filterVal = [
    //           'id',
    //           'operatorid',
    //           'name',
    //           'package',
    //           'oldPrice',
    //           'usetime',
    //           'flow',
    //           'addtime',
    //           'cardType',
    //           'type',
    //           'packageType',
    //           'status',
    //           'hide',
    //           'isInfinite',
    //           'isDis',
    //           'base',
    //           'stackable',
    //           'unite',
    //           'sort',
    //           'text'
    //         ]
    //         const data = this.formatJson(filterVal, list)
    //         excel.export_json_to_excel({
    //           header: tHeader,
    //           data,
    //           filename: `套餐信息${new Date().toLocaleDateString()}`
    //         })
    //         this.$message({
    //           type: 'success',
    //           message: res.message
    //         })
    //       })
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: '数量过多'
    //       })
    //       this.$prompt('', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         inputPlaceholder: '请输入导出数量',
    //         inputErrorMessage: '数量填写不正确',
    //         inputValue: 10000,
    //         inputValidator: function(value) {
    //           if (/(^[1-9]\d*$)/.test(+value)) {
    //             return true
    //           } else {
    //             return false
    //           }
    //         }
    //       }).then(({ value }) => {
    //         this.downAction(value)
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消'
    //         })
    //       })
    //     }
    //   })
    // },
    // handleDownload() {
    //   this.downAction()
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       if (j === 'type') {
    //         return typeMap[v[j]]
    //       } else if (j === 'splStatus') {
    //         return +v[j] === 1 ? '普通' : '特殊'
    //       } else if (j === 'packageType') {
    //         return +v[j] === 1 ? '移动' : +v[j] === 2 ? '电信' : '联通'
    //       } else if (j === 'operatorid') {
    //         return this.oidObject[v[j]] ? `${this.oidObject[v[j]]}--${v[j]}` : v[j]
    //       } else if (j === 'status') {
    //         return +v[j] === 1 ? '已上架' : '已下架'
    //       } else {
    //         return v[j]
    //       }
    //     })
    //   )
    // },
    getList(type) {
      searchFlowPackages(Object.assign(this.listQuery, { pageSize: this.pageSize }), '.table').then(res => {
        if (!type) {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
        }
        if (+res.status === 0) {
          this.list = res.data.rows
          this.total = res.data.total
        }
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
