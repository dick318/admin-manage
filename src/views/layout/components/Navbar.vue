<template>
  <div class="navbar">
    <hamburger
      v-if="device!=='mobile'"
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"/>
    <breadcrumb
      v-if="device!=='mobile'"
      class="breadcrumb-container"/>
    <el-dropdown
      class="avatar-container mobile"
      trigger="click">
      <div class="avatar-wrapper">
        <span class="name-wrapper">
          {{ name }}
        </span>
        <img
          :src="avatar+'?imageView2/1/w/80/h/80'"
          class="user-avatar">
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link
          v-if="device!='mobile'&&checkPermission(
            ['kuyuplat:analyzer:payinfo','kuyuplat:analyzer:cardoper','kuyuplat:analyzer:cardstatus','kuyuplat:analyzer:actinfo','uyuplat:notice:search',
             'kuyuplat:analyzer:actinfo','kuyuplat:analyzer:paydayinfo','kuyuplat:analyzer:agentinfo','kuyuplat:analyzer:wxinfo','kuyuplat:analyzer:wxdayinfo'])"
          to="/">
          <el-dropdown-item>
            {{ $t('navbar.dashboard') }}
          </el-dropdown-item>
        </router-link>
        <router-link v-if="device=='mobile'" to="/mobile/home">
          <el-dropdown-item>
            {{ $t('navbar.dashboard') }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span
            style="display:block;"
            @click="logout">
            {{ $t('navbar.logOut') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div
      v-if="device!=='mobile'"
      class="right-menu">
      <el-menu
        unique-opened
        class="el-menu-navbar"
        mode="horizontal"
        @select="handleSelect">
        <el-menu-item
          v-if="errorLogs.length>0"
          index="1">
          <error-log class="errLog-container right-menu-item" />
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="refresh">
          <i class="el-icon-refresh" />
        </el-menu-item>
        <el-menu-item v-if="checkPermission(['kuyuplat:work:search'])" index="3">
          <router-link to="/operateList">
            操作记录
          </router-link>
        </el-menu-item>
        <el-submenu
          v-if="checkPermission(['kuyuplat:cardActionException:search','kuyuplat:card:getCardReal','kuyuplat:hunan:find','kuyuplat:addpackage:search','kuyuplat:cardReplace:search'])"
          index="4"
          popper-class="el-submenu-proper">
          <template slot="title">处理事项</template>
          <el-menu-item v-if="checkPermission(['kuyuplat:cardActionException:search'])" index="4-1">
            <router-link to="/business/stopAbnormal">
              卡片异常停机
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="checkPermission(['kuyuplat:hunan:find'])" index="4-2">
            <router-link to="/business/hunanList">
              湖南监控操作记录
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="checkPermission(['kuyuplat:addpackage:search'])" index="4-3">
            <router-link to="/business/orderPackage">
              套餐订购处理
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="checkPermission(['kuyuplat:cardReplace:search'])" index="4-4">
            <router-link to="/business/changeCard">
              换卡处理
            </router-link>
          </el-menu-item>
          <el-menu-item v-if="checkPermission(['kuyuplat:card:getCardReal'])" index="4-5">
            <router-link to="/card/autonym">
              实名审核
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-submenu
          index="5"
          popper-class="el-submenu-propere">
          <template slot="title">{{ name }}</template>
          <el-menu-item
            v-if="checkPermission(
              ['kuyuplat:analyzer:payinfo','kuyuplat:analyzer:cardoper','kuyuplat:analyzer:cardstatus','kuyuplat:analyzer:actinfo','uyuplat:notice:search',
               'kuyuplat:analyzer:actinfo','kuyuplat:analyzer:paydayinfo','kuyuplat:analyzer:agentinfo','kuyuplat:analyzer:wxinfo','kuyuplat:analyzer:wxdayinfo'])"
            index="5-1">
            <router-link to="/">
              {{ $t('navbar.dashboard') }}
            </router-link>
          </el-menu-item>
          <el-menu-item
            index="5-2"
            @click="logout">
            退出登陆
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'errorLogs'])
  },
  methods: {
    checkPermission,
    refresh() {
      this.$confirm('此操作将刷新重载, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$confirm('此操作将退出登陆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload() // In order to re-instantiate the vue-router object to avoid bugs
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.name-wrapper {
  font-size: 20px;
  vertical-align: top;
  margin-right: 8px;
  color: #303133;
}
.right-menu >>> .el-submenu__title {
  line-height: 50px !important;
  height: 50px !important;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.theme-switch {
  margin-top: 7px !important;
}
.el-menu-item,
.right-menu,
.el-menu-navbar,
.el-submenu,
.el-submenu__title {
  text-align: center;
  line-height: 50px !important;
  height: 50px !important;
}
@media screen and (max-width: 768px) {
  .theme-picker {
    display: none !important;
  }
}
.mobile {
  float: right;
}
.nickname {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  display: inline-block;
  vertical-align: text-bottom;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .avatar-container {
    height: 50px;
    margin-right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .right-menu {
    position: absolute;
    right: 0;
    // float: right;
    // height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
  }
}
</style>
