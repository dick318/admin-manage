<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.headname" class="filter-item" style="width:220px" clearable placeholder="请输入负责人"/>
      <el-input v-model.trim="listQuery.name" class="filter-item" style="width:220px" clearable placeholder="请输入网点名称"/>
      <el-input v-model.trim="listQuery.address" class="filter-item" style="width:220px" clearable placeholder="请输入地址"/>
      <el-button v-waves class="filter-item" size="small" type="success" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves v-permission="['kuyuplat:netStand:add']" class="filter-item" size="small" type="warning " icon="el-icon-plus" @click="jump('/other/netStandDetails')" />
    </div>
    <el-table
      :data="list"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      tooltip-effect="dark"
      highlight-current-row>
      <el-table-column align="center" label="ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="网点名称" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.dept }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.headname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人电话" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="网点图片" show-overflow-tooltip >
        <template slot-scope="scope">
          <img :src="scope.row.headimg" style="width:50px" class="image">
        </template>
      </el-table-column>
      <el-table-column align="center" label="省份" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="县区" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细地址" show-overflow-tooltip min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="纬度" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" show-overflow-tooltip min-width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" show-overflow-tooltip min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="150px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:netStand:update']" type="primary" size="mini" icon="el-icon-edit-outline" @click="jump(`/other/netStandDetails?id=${scope.row.id}`)"/>
          <el-button v-permission="['kuyuplat:netStand:delete']" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getNetStand, delNetStand } from '@/api/netStand'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'NetStand',
  components: { Pagination },

  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        headname: '',
        name: '',
        address: '',
        pageNo: 1,
        pageSize: 10
      },
      list: [],
      tableKey: 0,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    jump(type) {
      this.$router.push(type)
    },
    handleDelete(id) {
      this.$confirm('你确定要删除吗？', '注意！', { type: 'warning' }).then(() => {
        delNetStand({ id }, '.el-message-box').then((res) => {
          this.$notify({
            type: +res.status === 0 ? 'success' : 'error',
            message: res.message,
            duration: 2000
          })
          if (res.status === 0) {
            for (const v of this.list) {
              if (v.id === id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1)
                break
              }
            }
          }
        })
      })
    },

    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList('sec')
    },
    handleRefresh() {
      this.listQuery = {
        headname: '',
        name: '',
        address: '',
        pageNo: 1,
        pageSize: 10
      }
      this.getList('sec')
    },
    getList(type) {
      getNetStand(this.listQuery, '.table').then(res => {
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
