<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.addStarttime"
        value-format="yyyy-MM-dd"
        type="date"
        style="width:200px;"
        placeholder="添加开始日期"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.addEndtime"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        type="date"
        style="width:200px;"
        placeholder="添加结束日期"
        class="filter-item"
      />
      <el-input v-model.trim="listQuery.deviceId" class="filter-item" style="width:220px" clearable placeholder="请输入MIFI唯一标识，IMEI"/>
      <el-input v-model.trim="listQuery.iccid" class="filter-item" style="width:220px" clearable placeholder="请输入ICCID"/>
      <el-select v-model="listQuery.state" class="filter-item" filterable clearable placeholder="请选择设备WiFi状态">
        <el-option
          v-for="item in whether0"
          :key="item.value"
          :label="item.label=='是'?'打开':'关闭'"
          :value="item.value"/>
      </el-select>
      <el-button v-waves size="small" type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter"/>
      <el-button v-waves size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
      <el-button v-waves size="small" type="warning " class="filter-item" icon="el-icon-download" @click="handleDownload"/>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="multipleTable"
      :data="list"
      :key="tableKey"
      :fit ="true"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row
      @cell-click="toggleSelection"
      @selection-change="select">
      <!-- <el-table-column
        type="selection"
        width="55"/> -->
      <el-table-column show-overflow-tooltip align="center" label="IMEI号" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceId }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="iccid" min-width="160">
        <template slot-scope="scope">
          <span style="color:#66b1ff;cursor:pointer" @click="jump(scope.row.iccid)">{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="卡状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state==2||scope.row.state==3?'success':'danger'">{{ stateMap[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="使用量" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.used|ToSize }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="连接数">
        <template slot-scope="scope">
          <span>{{ scope.row.clinum }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="下行速度">
        <template slot-scope="scope">
          <span>{{ scope.row.speedDownlink }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="上传速度">
        <template slot-scope="scope">
          <span>{{ scope.row.speedUplink }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="最大连接数">
        <template slot-scope="scope">
          <span>{{ scope.row.maxcon }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="公司标识">
        <template slot-scope="scope">
          <span>{{ scope.row.enterprise }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="固件版本" min-width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="添加时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="上报时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.reportTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="设置时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.setTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="left" show-overflow-tooltip min-width="400px">
        <template slot-scope="scope">
          <el-button v-permission="['kuyuplat:mifi:swith','kuyuplat:mifi:speed','kuyuplat:mifi:setmax']" type="primary" size="mini" @click="updateSetting(scope.row)">上网功能</el-button>
          <el-button type="success" size="mini" @click="querydata(scope.row)">刷新</el-button>
          <el-button v-permission="['kuyuplat:mifi:webaccess']" type="danger" size="mini" @click="webaccess(scope.row)">黑名单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item v-if="checkPermission(['kuyuplat:mifi:swith'])" label="上网功能开关" prop="opt">
          <el-radio v-model="temp.opt" label="1" style="width:60px">关闭</el-radio>
          <el-radio v-model="temp.opt" label="2" style="width:60px">开启</el-radio>
        </el-form-item>
        <el-form-item v-if="checkPermission(['kuyuplat:mifi:speed'])" label="下载速度，单位byte" prop="download">
          <el-input v-model.trim="temp.download" clearable placeholder="上传速度，下载速度，不可都为空"/>
        </el-form-item>
        <el-form-item v-if="checkPermission(['kuyuplat:mifi:speed'])" label="上传速度，单位byte" prop="upload">
          <el-input v-model.trim="temp.upload" clearable placeholder="上传速度，下载速度，不可都为空"/>
        </el-form-item>
        <el-form-item v-if="checkPermission(['kuyuplat:mifi:setmax'])" label="联网设备最大连接数" prop="limit">
          <el-input v-model.trim.number="temp.limit" clearable placeholder="联网设备最大连接数"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDomainVisible" :title="textMap[dialogStatus]">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item
          v-for="(value, key) in temp.domain"
          :key="key">
          <el-input v-model.trim="value.key" placeholder="请输入域名（唯一）"/>：
          <el-button icon="el-icon-delete" @click.prevent="remove(value)"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOne">新增</el-button>
        <el-button @click="dialogDomainVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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

  </div>
</template>

<script>
import { mifiList, mifiSwitch, mifiSetspeed, mifiSetmax, mifiWebaccess, mifiQuerydata } from '@/api/mifi'
import { whether0, stateMap } from '@/utils/mapArr'
import { toSize } from '@/utils'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'HardwareMifi',
  directives: {
    waves
  },
  filters: {
    ToSize(flow) {
      return toSize((+flow))
    }
  },
  data() {
    return {
      stateMap,
      whether0,
      pickerOptions: this.processDate(),
      tableKey: 0,
      list: [],
      total: null,
      listQuery: {
        uid: '',
        pageNo: 1,
        pageSize: 10,
        state: '',
        iccid: '',
        deviceId: '',
        addStarttime: '',
        addEndtime: ''
      },
      selectArr: [],
      dialogFormVisible: false,
      dialogDomainVisible: false,
      rules: {

      },
      temp: {
        deviceId: '',
        opt: '',
        download: '',
        upload: '',
        limit: '',
        domain: ''
      },
      dialogStatus: '',
      textMap: {
        setting: '上网功能设置',
        webaccess: '域名黑名单'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    select(selection, row) {
      this.selectArr = selection
    },
    toggleSelection(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    jump(card) {
      this.$router.push(`/business/flowInfo?iccid=${card}`)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          return new Date(self.listQuery.addStarttime).getTime() > time.getTime()
        }
      }
    },
    updateSetting(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'setting'
      this.temp.download = row.speedDownlink
      this.temp.upload = row.speedUplink
      this.temp.limit = row.maxcon
      this.temp.deviceId = row.deviceId
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    webaccess(row) {
      this.dialogDomainVisible = true
      this.dialogStatus = 'webaccess'
      this.temp.domain = row.blackList ? row.blackList.split(',') : []
      this.temp.deviceId = row.deviceId
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addOne() {
      this.temp.domain.push({})
    },
    remove(value) {
      var index = this.temp.domain.indexOf(value)
      if (index !== -1) {
        this.temp.domain.splice(index, 1)
      }
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dialogStatus === 'setting') {
            const postArr = []
            if (this.temp.opt) {
              postArr.push(mifiSwitch({ uid: '', deviceId: this.temp.deviceId, opt: this.temp.opt }, '.el-dialog__footer'))
            }
            if (this.temp.download || this.temp.upload) {
              postArr.push(mifiSetspeed({ uid: '', deviceId: this.temp.deviceId, upload: this.temp.upload, download: this.temp.download }, '.el-dialog__footer'))
            }
            if (this.temp.limit) {
              postArr.push(mifiSetmax({ uid: '', deviceId: this.temp.deviceId, limit: this.temp.limit }, '.el-dialog__footer'))
            }
            if (postArr.length !== 0) {
              Promise.all(postArr).then(posts => {
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
                    this.dialogFormVisible = false
                  }
                })
              }).catch((reason) => {
                this.$notify({
                  type: 'error',
                  message: reason
                })
              })
            } else {
              this.dialogFormVisible = false
            }
          }
          if (this.dialogStatus === 'webaccess') {
            const str = []
            this.temp.domain.map((v, i) => {
              if (!str.includes(v.key)) {
                str.push(v.key)
              }
            })
            mifiWebaccess({ deviceId: this.temp.deviceId, domain: str.join(',') }, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.status === 0 ? 'success' : 'error',
                message: res.message,
                duration: 2000
              })
              if (res.status === 0) {
                this.dialogDomainVisible = false
              }
            })
          }
        }
      })
    },
    querydata(row) {
      mifiQuerydata({ deviceId: row.deviceId }, '.table').then(res => {
        this.$notify({
          type: +res.status === 0 ? 'success' : 'error',
          message: res.message,
          duration: 2000
        })
        if (res.status === 0) {
          this.getList('sec')
        }
      })
    },
    handleRefresh() {
      this.listQuery = {
        uid: '',
        pageNo: 1,
        pageSize: 10,
        state: '',
        iccid: '',
        deviceId: '',
        addStarttime: '',
        addEndtime: ''
      }
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
    handleDownload() {
      // downOrder(this.listQuery, '.table').then(res => {
      //   if (+res.status === 0) {
      //     window.open(res.data.url)
      //   }
      //   this.$message({
      //     type: res.status === 0 ? 'success' : 'error',
      //     message: res.message
      //   })
      // })
    },
    getList() {
      mifiList(this.listQuery, '.table').then(res => {
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
