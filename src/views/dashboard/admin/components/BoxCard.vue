<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div class="box-content">
      <pan-thumb :image="avatar" class="panThumb"/>
      <mallki text="公告栏" class-name="mallki-text"/>
      <div v-for="(value, index) in list" :key="value.id" :class="{ first: index==0 }" class="progress-item" @click="getInfo(index)">
        {{ index+1 }}.{{ value.tetle }}
      </div>
      <div v-if="list.length>0" class="progress-item showAll" @click="getAll">
        查看全部
      </div>
    </div>
  </el-card>
</template>

<script>
import { searchNotice } from '@/api/data'
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.getList()
  },
  methods: {
    getInfo(index) {
      this.$router.push(`/notice?id=${this.list[index].id}`)
    },
    getAll() {
      this.$router.push('/noticeList')
    },
    getList() {
      this.list = []
      searchNotice({}).then(res => {
        if (+res.status !== 0) {
          return false
        }
        res.data.rows.map((v, i) => {
          if (i < 5) {
            this.list.push(v)
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px !important;
    width: 70px !important;
    position: absolute !important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none !important;
    /deep/ .pan-info {
      box-shadow: none !important;
    }
  }
  .box-content {
    text-indent: 4px;
    line-height: 24px;
    position: relative;
    height: 222px;
    margin-top: 20px;
  }
  .first{
    padding-top:35px
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 25px;
    cursor: pointer;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
  .showAll {
    display: inline-block;
    color: #e6a23c;
    float: right;
  }
}
</style>
