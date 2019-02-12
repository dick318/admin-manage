const steps = [
  {
    element: '.hamburger-container',
    popover: {
      title: '侧边栏',
      description: '打开或者关闭侧边栏。',
      position: 'bottom'
    }
  },
  {
    element: '.breadcrumb-container',
    popover: {
      title: '面包屑',
      description: '显示当前页面位置。',
      position: 'bottom'
    }
  },
  {
    element: '.theme-switch',
    popover: {
      title: '换肤栏',
      description: '系统主题换肤设置。',
      position: 'left'
    }
  },
  {
    element: '.tags-view-container',
    popover: {
      title: '标签栏',
      description: '你访问过的历史页面,右键点击标签栏可以刷新当前页。当从这进入引导页面不生效时需要刷新。',
      position: 'bottom'
    }
  }
]

const excelCard = [
  {
    element: '.downLoad',
    popover: {
      title: '模板格式下载',
      description: '下载模板格式Excel。',
      position: 'bottom'
    }
  },
  {
    element: '.el-upload-dragger',
    popover: {
      title: '上传Excel文件',
      description: '将文件拖到此处，或点击上传。',
      position: 'bottom'
    }
  },
  {
    element: '.filter-item',
    popover: {
      title: '代理商选择',
      description: '选择要分卡的代理商。',
      position: 'bottom'
    }
  },
  {
    element: '.uploadFile',
    popover: {
      title: '上传按钮',
      description: '上传文件到服务器。',
      position: 'bottom'
    }
  }
]
const orderPackage = [
  {
    element: '.cardNo',
    popover: {
      title: '卡号',
      description: '输入要订购查询的卡号。',
      position: 'bottom'
    }
  },
  {
    element: '.secCard',
    popover: {
      title: '搜索',
      description: '查询卡片可订购的套餐。',
      position: 'bottom'
    }
  },
  {
    element: '.orderPackage',
    popover: {
      title: '套餐列表',
      description: '选择卡片要订购的套餐。',
      position: 'bottom'
    }
  },
  {
    element: '.number',
    popover: {
      title: '订购数量',
      description: '选择卡片要订购的套餐的数量。',
      position: 'bottom'
    }
  },
  {
    element: '.timeType',
    popover: {
      title: '套餐生效时间',
      description: '选择套餐生效的时间，默认普通，次月下个月生效，叠加立即生效（长周期勿选）。',
      position: 'bottom'
    }
  },
  {
    element: '.payType',
    popover: {
      title: '支付类型',
      description: '默认余额支付，可选微信扫码支付。',
      position: 'bottom'
    }
  },
  {
    element: '.orderAction',
    popover: {
      title: '订购操作',
      description: '对卡进行套餐订购。',
      position: 'bottom'
    }
  }
]
const packageList = [
  {
    element: '.handleUpdate',
    popover: {
      title: '修改自主定价',
      description: '点击修改按钮，修改卡片充值价，充值价格为最终代理商的自主定价。',
      position: 'left'
    }
  }
]
const changeAction = [
  {
    element: '.oldCard',
    popover: {
      title: '老卡',
      description: '输入老卡号，格式一行一个。',
      position: 'bottom'
    }
  },
  {
    element: '.newCard',
    popover: {
      title: '新卡',
      description: '输入新卡号，格式一行一个。',
      position: 'bottom'
    }
  },
  {
    element: '.action',
    popover: {
      title: '处理',
      description: '换卡操作，可实时查看异卡换套餐结果，可选择导出处理结果。',
      position: 'bottom'
    }
  },
  {
    element: '.down',
    popover: {
      title: '导出',
      description: '点击导出按钮，导出操作结果。',
      position: 'bottom'
    }
  }
]
const unbindAction = [
  {
    element: '.unbind',
    popover: {
      title: '卡号',
      description: '输入要解绑的卡号，格式一行一个。',
      position: 'bottom'
    }
  },
  {
    element: '.action',
    popover: {
      title: '解绑',
      description: '解绑操作，可在机卡解绑记录页面查看结果。',
      position: 'bottom'
    }
  }
]
const guide = [
  {
    element: '.Guide',
    popover: {
      title: '操作指南',
      description: '新增功能，操作指南，引导操作平台功能',
      position: 'right'
    }
  }
]
const kefu = [
  {
    element: '.addCustomer',
    popover: {
      title: '添加客服',
      description: '添加客服操作，填入必填项，即可。默认权限为当前账号的权限。',
      position: 'bottom'
    }
  },
  {
    element: '.RoleDistribute',
    popover: {
      title: '分配角色',
      description: '分配角色操作，选择要分配的角色，即可。权限为更改为选中角色的权限。',
      position: 'bottom'
    }
  },
  {
    element: '.MenuDistribute',
    popover: {
      title: '分配权限',
      description: '分配权限操作，选择要分配的权限，即可。权限为更改为选中的权限。',
      position: 'bottom'
    }
  }
]
const role = [
  {
    element: '.addCustomer',
    popover: {
      title: '添加客服',
      description: '添加客服操作，填入必填项，即可。默认权限为当前账号的权限。',
      position: 'bottom'
    }
  },
  {
    element: '.MenuDistribute',
    popover: {
      title: '分配权限',
      description: '分配权限操作，选择要分配的权限，即可。权限为更改为选中的权限。',
      position: 'bottom'
    }
  }
]
const agent = [
  {
    element: '.menu',
    popover: {
      title: '分配权限',
      description: '分配权限操作，选择要分配的权限，即可。权限为更改为选中的权限。',
      position: 'bottom'
    }
  },
  {
    element: '.role',
    popover: {
      title: '分配角色',
      description: '分配角色操作，选择要分配的角色，即可。权限为更改为选中角色的权限。',
      position: 'bottom'
    }
  }
]
const worklistSearch = [
  {
    element: '.downLoad',
    popover: {
      title: '模板格式下载',
      description: '下载模板格式Excel。',
      position: 'bottom'
    }
  },
  {
    element: '.el-upload__text',
    popover: {
      title: '上传Excel文件',
      description: '将文件拖到此处，或点击上传。',
      position: 'bottom'
    }
  },
  {
    element: '.uploadFile',
    popover: {
      title: '上传按钮',
      description: '上传文件到服务器。',
      position: 'bottom'
    }
  }
]

export { agent, role, worklistSearch, kefu, steps, excelCard, orderPackage, packageList, changeAction, unbindAction, guide }
