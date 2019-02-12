<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.cardNo" class="filter-item" clearable style="width: 200px;" placeholder="请输入卡号" @clear="handleRefresh"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
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
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="pageSize" :pager-count="5" :total="total" background layout="total, sizes,jumper, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
import { searchAddFlowPackages } from '@/api/package'
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
export default {
  name: 'CardPackage',
  directives: {
    waves
  },
  data() {
    return {
      whether,
      typeMap,
      cardTypeMap,
      cardTypeSelect,
      tableKey: 0,
      list: [],
      total: null,
      oidSelect: [],
      operator_type,
      type,
      pageSize: 10,
      listQuery: {
        pageNo: 1,
        cardNo: this.$route.query.cardNo
      },
      oidObject: {}
    }
  },
  created() {
    this.getSelect()
    if (this.listQuery.cardNo) {
      this.getList()
    }
  },
  methods: {
    checkPermission,
    jump(val) {
      this.$router.push(val)
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
        cardNo: ''
      }
      this.list = []
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      if (this.listQuery.cardNo) {
        this.getList()
      } else {
        this.message.error('请输入卡号！')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    getList(type) {
      searchAddFlowPackages(Object.assign(this.listQuery, { pageSize: this.pageSize }), '.table').then(res => {
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
