<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.packageType" class="filter-item" clearable placeholder="请选择运营商类型" @clear="handleFilter">
        <el-option v-for="item in operator_type" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="套餐类型" @clear="handleFilter">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.splStatus" class="filter-item" clearable placeholder="特殊套餐" @clear="handleFilter">
        <el-option v-for="item in whether" :key="item.value" :label="item.label+'特殊套餐'" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isDistribution" class="filter-item" clearable placeholder="是否分配" @clear="handleFilter">
        <el-option v-for="item in whether0" :key="item.value" :label="item.label=='是'?'已分配':'未分配'" :value="item.value" />
      </el-select>
      <el-input v-model.trim="listQuery.name" class="filter-item" clearable style="width: 200px;" placeholder="请输入自定义套餐名称" @clear="handleFilter" />
      <el-select v-model="listQuery.aid" class="filter-item" filterable clearable placeholder="请选择代理商">
        <el-option v-for="item in agentSelect" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.operatorid" class="filter-item" filterable clearable placeholder="请选择供应商批次类型" @clear="handleFilter">
        <el-option v-for="item in oidSelect" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:packagePrice:delete']" class="filter-item" size="small" type="danger" icon="el-icon-delete" @click="handleDelete"/>
      <el-button v-waves class="filter-item" size="small" type="warning " icon="el-icon-download" @click="handleDownload"/>
      <el-input-number v-model="per" :precision="2" :step="0.1" class="filter-item" style="width:130px" controls-position="right"/>
      <el-button v-permission="['kuyuplat:package:distribution']" v-waves class="filter-item" size="small" type="success" @click="handleAdd">分配</el-button>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit="true"
      class="table"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <!-- header-cell-class-name ='header-cell-class-name'
     row-class-name='row-class-name' cell-class-name='cell-class-name' -->
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column show-overflow-tooltip align="center" label="套餐ID">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="代理商" min-width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.aid?'success':'warning'">{{ scope.row.aid?anameObject[scope.row.aid]?anameObject[scope.row.aid]:scope.row.aid:'未分配' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐名称" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type| typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐批次" min-width="120">
        <template slot-scope="scope">
          <span>{{ oidObject[scope.row.operatorid]?`${oidObject[scope.row.operatorid]}--${scope.row.operatorid}`:scope.row.operatorid }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="套餐价格:（元）" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="结算价:（元）" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.parentprice }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="自主定价:（元）" align="center" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.selfprice }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="定价类型" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.unite==1?'danger':''">{{ scope.row.unite==1?'统一定价':'随意定价' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="特殊套餐">
        <template slot-scope="scope">
          <el-tag :type="scope.row.splStatus==1?'':'danger'">{{ scope.row.splStatus==1?'普通':'特殊' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="特殊价格:（元）" align="center" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.splPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="运营商类型">
        <template slot-scope="scope">
          <span>{{ scope.row.packageType==1?'移动':scope.row.packageType==2?'电信':'联通' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" show-overflow-tooltip align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:package:distribution']" v-if="scope.row.aid" :class="{ handleUpdate: scope.$index==0 }" type="primary" size="mini" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'update')"/>
          <el-button v-permission="['kuyuplat:packagePrice:delete']" v-if="scope.row.aid" type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteOne(scope.row)"/>
          <el-button v-permission="['kuyuplat:package:distribution']" v-if="!scope.row.aid" type="primary" size="mini" @click="handleUpdate(scope.row,'updateOne')">设置价格</el-button>
          <el-button v-permission="['kuyuplat:package:distribution']" v-if="!scope.row.aid" type="danger" size="mini" @click="handleUpdate(scope.row,'addOne')">单个添加</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="9rem">
        <el-form-item v-if="+temp.unite==1" label="比例（小于1）" prop="per">
          <el-input v-model.trim="temp.per" clearable />
        </el-form-item>
        <el-form-item v-if="temp.unite==2" label="结算价:（元）" prop="parentprice">
          <el-input v-model.trim="temp.parentprice" clearable />
        </el-form-item>
        <el-form-item label="自主定价:（元）" prop="selfprice">
          <el-input v-model.trim="temp.selfprice" clearable />
        </el-form-item>
        <el-form-item label="套餐类型：" prop="splStatus" style="padding-right: 45px;">
          <el-radio v-model="temp.splStatus" :label="1" style="margin-left:0;width:5rem;white-space: nowrap;">普通</el-radio>
          <el-radio v-model="temp.splStatus" :label="2" style="margin-left:0;width:4rem">特殊</el-radio>
        </el-form-item>
        <el-form-item v-show="temp.splStatus==2" label="特殊定价:（元）" prop="splPrice">
          <el-input v-model.trim="temp.splPrice" clearable />
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
import { showAllowPackages, distributionPackages, delePackages, remindParentPrice } from '@/api/package'
import {
  typeMap,
  operator_type,
  type,
  agentArr,
  operatorArr,
  whether,
  whether0
} from '@/utils/mapArr'
import checkPermission from '@/utils/permission' // 权限判断函数
import waves from '@/directive/waves' // 水波纹指令
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { packageList } from '../guide/defineSteps'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AgentPackage',
  components: { Pagination },
  directives: {
    waves
  },
  filters: {
    typeFilter(type) {
      return typeMap[type]
    }
  },
  data() {
    return {
      whether,
      whether0,
      driver: null,
      tableKey: 0,
      list: [],
      total: 0,
      agentSelect: [],
      per: 1,
      oidSelect: [],
      operator_type,
      anameObject: {},
      type,
      pageSize: 10,
      listQuery: {
        pageNo: 1,
        name: '',
        aid: +this.$route.query.aid || '',
        packageType: '',
        type: '',
        operatorid: +this.$route.query.operatorid || '',
        splStatus: '',
        isDistribution: ''
      },
      temp: {
        id: undefined,
        per: '',
        parentprice: '',
        selfprice: '',
        splStatus: '',
        splPrice: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        updateOne: '设置价格',
        addOne: '单个添加'
      },
      rules: {
        parentprice: [
          {
            required: true,
            message: '结算价不能为空',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '自主定价不能为空',
            trigger: 'blur'
          }
        ]
      },
      oidObject: {},
      selectArr: []
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
        this.$router.push(`/agent/package`)
      } // Called when overlay is about to be cleared
    })
    if (this.$route.query.guide) {
      this.driver.defineSteps(packageList)
      this.driver.start()
    }
  },
  methods: {
    checkPermission,
    handleDelete() {
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.$confirm('你确定要删除吗？', '注意').then(
        () => {
          const loading = this.$loading()
          this.selectArr.map((v, i) => {
            var data = {
              aid: v.aid, pid: v.id
            }
            if (i === this.selectArr.length - 1) {
              loading.close()
            }
            delePackages(data).then(res => {
              if (i === this.selectArr.length - 1) {
                if (+res.status === 0) {
                  this.getList('sec')
                }
                loading.close()
              }
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
            })
          })
        }
      ).catch()
    },
    handleUpdate(row, type) {
      row.splStatus = row.splStatus
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = type
      this.dialogFormVisible = true
    },
    handleDeleteOne(row) {
      this.$confirm('你确定要删除该套餐吗？', '注意', { callback: (action) => {
        if (action === 'confirm') {
          delePackages({ aid: row.aid, pid: row.id }, '.el-message-box').then(res => {
            if (+res.status === 0) {
              this.getList('sec')
            }
            this.$notify({
              type: +res.status === 0 ? 'success' : 'error',
              message: res.message,
              duration: 2000
            })
          })
        }
      } })
    },
    handleAdd() {
      if (!this.listQuery.aid) {
        this.$message.error('请先选择一个代理商！')
        return false
      }
      if (this.selectArr.length === 0) {
        this.$message.error('请选中后提交！')
        return false
      }
      this.$confirm('你确定要分配吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var pidSelf = []
          var pidUnite = []
          var parentpriceSelf = []
          var priceSelf = []
          this.selectArr.map((v, i) => {
            if (v.unite === 2) {
              pidSelf.push(v.pid)
              parentpriceSelf.push(this.per ? (v.price * this.per).toFixed(2) : v.parentprice)
              priceSelf.push(v.selfprice)
            }
            if (v.unite === 1) {
              pidUnite.push(v.pid)
            }
          })
          var dataSelf = {
            pid: pidSelf.join(','), parentprice: parentpriceSelf.join(','), price: priceSelf.join(','), aid: this.listQuery.aid
          }
          var dataUnite = {
            pid: pidUnite.join(','), aid: this.listQuery.aid, per: this.per
          }
          const postOneArr = []
          const postTwoArr = []
          if (dataSelf.pid) {
            postOneArr.push(remindParentPrice(dataSelf, '.table'))
            postTwoArr.push(distributionPackages(dataSelf, '.table'))
          }
          if (dataUnite.pid) {
            postOneArr.push(remindParentPrice(dataUnite, '.table'))
            postTwoArr.push(distributionPackages(dataUnite, '.table'))
          }
          Promise.all(postOneArr).then(posts => {
            let flag = false
            posts.map((v, i) => {
              if (v.status !== 0) {
                flag = true
                this.$confirm(v.message, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(() => {
                    Promise.all(postTwoArr).then(posts => {
                      let flag = false
                      posts.map((v, i) => {
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
                          this.getList()
                        }
                      })
                    }).catch((reason) => {
                      this.$notify({
                        type: 'error',
                        message: reason
                      })
                    })
                  })
                  .catch(() => {
                    this.$notify({
                      type: 'info',
                      message: '已取消'
                    })
                  })
              } else if (!flag && i === posts.length - 1) {
                this.$notify({
                  type: 'success',
                  message: '操作成功'
                })
                Promise.all(postTwoArr).then(posts => {
                  let flag = false
                  posts.map((v, i) => {
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
                      this.getList()
                    }
                  })
                }).catch((reason) => {
                  this.$notify({
                    type: 'error',
                    message: reason
                  })
                })
              }
            })
          }).catch((reason) => {
            this.$notify({
              type: 'error',
              message: reason
            })
          })
        })
    },
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    getSelect() {
      agentArr((agentSelect, bankCardObject, alipayObject, anameObject) => {
        this.agentSelect = agentSelect
        this.anameObject = anameObject
      })
      operatorArr((oidSelect, operatorTypeArr, oidObject) => {
        this.oidSelect = oidSelect
        this.oidObject = oidObject
      })
    },
    handleRefresh() {
      this.listQuery = {
        pageNo: 1,
        name: '',
        aid: '',
        packageType: '',
        type: '',
        operatorid: '',
        splStatus: '',
        isDistribution: ''
      }
      this.getList()
    },
    // cloesInline(row) {
    //   this.$nextTick(() => {
    //     row.editParentPrice = false
    //   })
    //   console.log(1)
    // },
    // updateInline(row) {
    //   this.$nextTick(() => {
    //     row.editParentPrice = false
    //   })
    // },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        price: '',
        parentprice: '',
        status: ''
      }
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          var data = {}
          if (+tempData.unite === 2) {
            data = {
              aid: tempData.aid,
              pid: tempData.pid,
              parentprice: tempData.parentprice,
              splStatus: tempData.splStatus,
              splPrice: tempData.splPrice,
              price: tempData.selfprice
            }
          } else {
            data = {
              aid: tempData.aid,
              pid: tempData.pid,
              per: tempData.per,
              splStatus: tempData.splStatus,
              splPrice: tempData.splPrice
            }
          }
          if (this.dialogStatus !== 'updateOne') {
            data.aid = data.aid || this.listQuery.aid
            remindParentPrice(data, '.table').then(res => {
              if (res.status === 0) {
                distributionPackages(data, '.table').then(response => {
                  if (+response.status === 0) {
                    this.dialogFormVisible = false
                    this.getList('sec')
                  }
                  this.$notify({
                    type: +response.status === 0 ? 'success' : 'error',
                    message: response.message
                  })
                })
              } else {
                this.$confirm(res.message, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(() => {
                    distributionPackages(data, '.table').then(response => {
                      if (+response.status === 0) {
                        this.dialogFormVisible = false
                        this.getList('sec')
                      }
                      this.$notify({
                        type: +response.status === 0 ? 'success' : 'error',
                        message: response.message
                      })
                    })
                  })
                  .catch(() => {
                    this.$notify({
                      type: 'info',
                      message: '已取消'
                    })
                  })
              }
            })
            return false
          } else {
            this.dialogFormVisible = false
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                this.$notify({
                  title: '成功',
                  message: '本地保存更新成功',
                  type: 'success'

                })
                break
              }
            }
          }
        }
      })
    },
    downAction(pageSize) {
      this.listQuery.pageNo = 1
      delete this.listQuery.pageSize
      showAllowPackages(this.listQuery, '.table').then(res => {
        if (+res.status === 0) {
          const list = res.data.rows
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '套餐ID',
              '自定义套餐名称',
              '套餐批次',
              '原价:（元）',
              '结算价:（元）',
              '自主定价:（元）',
              '套餐类型',
              '特殊套餐',
              '运营商类型',
              '状态（1.已上架 2.已下架 ）',
              '添加时间',
              '排序'
            ]
            const filterVal = [
              'pid',
              'name',
              'operatorid',
              'oldPrice',
              'parentprice',
              'price',
              'type',
              'splStatus',
              'packageType',
              'status',
              'addtime',
              'sort'
            ]
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: `套餐信息${new Date().toLocaleDateString()}`
            })
            this.$notify({
              type: 'success',
              message: res.message,
              duration: 2000
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
          if (j === 'type') {
            return typeMap[v[j]]
          } else if (j === 'splStatus') {
            return +v[j] === 1 ? '普通' : '特殊'
          } else if (j === 'packageType') {
            return +v[j] === 1 ? '移动' : +v[j] === 2 ? '电信' : '联通'
          } else if (j === 'operatorid') {
            return this.oidObject[v[j]] ? `${this.oidObject[v[j]]}--${v[j]}` : v[j]
          } else if (j === 'status') {
            return +v[j] === 1 ? '已上架' : '已下架'
          } else {
            return v[j]
          }
        })
      )
    },
    getList(type) {
      showAllowPackages(Object.assign(this.listQuery, { pageSize: this.pageSize }), '.table').then(res => {
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
