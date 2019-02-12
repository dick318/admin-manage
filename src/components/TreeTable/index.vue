<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    :row-class-name ="rowClassName"
    :fit ="true"
    :border="false"
    row-key="id"
    size="mini"
    highlight-current-row
    element-loading-text="给我一点时间">
    <el-table-column v-if="columns.length===0" :label="firstLabel" width="250">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)&&permission" class="tree-ctrl" @click="toggleExpanded(scope.row)" >
          <i v-if="!scope.row._expanded||iconSecFlag(0,scope.row)" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        <span >{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.row)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    toggleExpanded:Function,
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    permission: {
      type: Boolean,
      default: false
    },
    firstLabel: {
      type: String,
      default: '名称'
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    rowClassName(row, rowIndex){
      return `rowClassName${row.row.id}`
    },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // // 切换下级是否展开 
    // toggleExpanded: function(trIndex) {
    //   console.log(this.formatData[trIndex])
    //   const record = this.formatData[trIndex]
    //   record._expanded = !record._expanded
    // },
    // 图标显示
    iconShow(index, record) {
      return this.icon||(index === 0 && record.children && record.children.length > 0)
    },
    iconSecFlag(index, record) {
      // console.log(!(index === 0 && record.children && record.children.length > 0))
      return this.iconSec&&!(index === 0 && record.children && record.children.length > 0)
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
