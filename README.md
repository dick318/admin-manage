# admin-manage

## 说明

> 基于webpack4+vue+element-ui+axios+vuex的物联网卡后台管理系统，完整实现了卡片，订单，套餐等整个流程。

> 该项目为前后端分离的项目。

> 如果该项目对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！

> 或者您可以 "follow" 一下，该项目将持续更新，不断完善功能。

> 如有问题或者好的建议可以在 Issues 中提。

## 前言

> 移动端查询充值项目
[传送门](https://github.com/xwlaix/app-recharge)。

> 代理商后台管理系统的前端项目
[传送门](https://github.com/xwlaix/agent-manage)。

## 项目介绍

`admin-manage`是一个物联网卡管理后台页面，基于 [vue](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件。
主要包括首页数据分析、代理商管理、卡片管理、业务管理、财务管理、微信管理、短信管理、LNS管理、MIFI管理等功能。

## 项目演示

项目在线演示地址：[http://p.szcoolfish.com](http://p.szcoolfish.com)  

![https://github.com/xwlaix/admin-manage/blob/master/example.gif](https://github.com/xwlaix/admin-manage/blob/master/example.gif)

## 技术选型

技术 | 说明 | 官网
----|----|----
Vue | 前端框架 | [https://vuejs.org/](https://vuejs.org/)
Vuex | 全局状态管理框架 | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
webpack4 | 模块打包器 | [https://webpack.js.org/](https://webpack.js.org/)
element-ui | 前端UI框架 | [https://element.eleme.io/](https://element.eleme.io/)
Axios | 前端HTTP框架 | [https://github.com/axios/axios](https://github.com/axios/axios)
vue-element-admin | 项目脚手架参考 | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
### 项目布局

``` lua
  ├── build                      // 构建相关
  ├── config                     // 配置相关
  ├── src                        // 源代码
  │   ├── api                    // 所有请求
  │   ├── assets                 // 主题 字体等静态资源
  │   ├── components             // 全局公用组件
  │   ├── directive              // 全局指令
  │   ├── filters                // 全局 filter
  │   ├── icons                  // 项目所有 svg icons
  │   ├── lang                   // 国际化 language
  │   ├── router                 // 路由
  │   ├── store                  // 全局 store管理
  │   ├── styles                 // 全局样式
  │   ├── utils                  // 全局公用方法
  │   ├── vendor                 // 公用vendor
  │   ├── views                  // views 所有页面
  │   ├── App.vue                // 入口页面
  │   ├── main.js                // 入口文件 加载组件 初始化等
  │   └── permission.js          // 权限管理
  ├── static                     // 第三方不打包资源
  │   └── Tinymce                // 富文本
  ├── .babelrc                   // babel-loader 配置
  ├── .eslintrc.js               // eslint 配置项
  ├── .gitignore                 // git 忽略项
  ├── .travis.yml                // 自动化CI配置
  ├── favicon.ico                // favicon图标
  ├── index.html                 // html模板
  └── package.json               // package.json
```

## 搭建步骤
- 下载node并安装：[https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi](https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi);
- 访问在线接口已经默认设置，具体地址为config/dev.env.js文件中的BASE_API;
- 克隆源代码到本地，使用vscode打开，并完成编译;
- 在vscode命令行中运行命令：npm install,下载相关依赖;
- 在vscode命令行中运行命令：npm run dev,运行项目;
- 访问地址：浏览器自动打开页面，默认设置为[http://localhost:9526](http://localhost:9526);
- 如果遇到无法运行该命令，需要配置npm的环境变量，如在path变量中添加：C:\Users\zhenghong\AppData\Roaming\npm。
  
## 全局请求loading层设置
- 在调用统一管理的 api service 请求函数中设置loading层选择器。
- 在 request.js 保存loading数组，判断有无配置，有的话保存请求连接和loading对象。
- 在获取到返回值后销毁对应的请求接口的loading层。


## 许可证

[MIT](https://github.com/xwlaix/agent-manage/blob/master/LICENSE)

Copyright (c) 2018-2019 xwlaix
