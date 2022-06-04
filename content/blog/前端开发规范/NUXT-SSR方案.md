---
title: NUXT-SSR 方案
date: 2021-09-26 19:48:20
category:
  - 开发规范
---

## 前言

此次重构主要包括：

1. 代码重构、依赖减少

   - 目前落地页下单流程基本上就是：选择归属地/收货地->选号->下单，流程基本固定，但是各个模板变量参数各不相同，导致各个模板不好抽象出公共逻辑，意向单和下单接口调用时需要转换参数，并且每个模板需要转换的参数不一致，导致维护起来很麻烦。
   - 隐藏模块功能，每个模板中维护很多变量、耦合严重。
   - 公共方法抽象（定位、隐藏模块），公用组件抽象（省市区选择组件、详细地址模糊搜索下拉框）提炼等、样式精简。
   - 还有一些小的 icon 图标，可以换成 svg 或者字体图标。

2. 服务端渲染

   现在落地页使用的是客户端渲染，也就是浏览器上面只有一个 html 标签，当浏览器接收到 js 文件后，解析执行 js 文件后生成 html 标签，查看网页源代码如下所示:

   ![客户端渲染](https://cdn.clearlywind.com/static/images/客户端渲染源代码.jpg)

   服务端渲染是直接向浏览器返回已经生成好的 html 标签，优点是：首屏渲染快，直接返回静态 html、seo 友好，可以被搜索引擎爬取；缺点就是对服务器有压力

   ![服务端渲染](https://cdn.clearlywind.com/static/images/服务端渲染源代码.jpg)

3. url 规范化

   目前我们 url 格式不规范，导致在加载一些第三方埋码时 url 参数获取不到，导致埋码失败

## 技术选型

[nuxt](https://zh.nuxtjs.org/docs/2.x/get-started/installation) + [vue](https://cn.vuejs.org/v2/guide/index.html) 开发，服务端和客户端同构渲染，可以减少白屏等待时间，提升页面 seo

- 项目结构

  ```
  |-- .nuxt // Nuxt自动生成，临时的用于编辑的文件，build
  |-- assets // 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript
  |-- components // 用于自己编写的 Vue 组件，比如滚动组件，日历组件，分页组件
  |-- layouts // 布局目录，用于组织应用的布局组件，不可更改。
  |-- middleware // 用于存放中间件
  |-- pages // 用于存放写的页面，我们主要的工作区域
  |-- plugins // 用于存放JavaScript插件的地方
  |-- static // 用于存放静态资源文件，比如图片
  |-- store // 用于组织应用的Vuex 状态管理。
  |-- .editorconfig // 开发工具格式配置
  |-- .eslintrc.js // ESLint的配置文件，用于检查代码格式
  |-- .gitignore // 配置git不上传的文件
  |-- nuxt.config.json // 用于组织Nuxt.js应用的个性化配置，已覆盖默认配置
  |-- package-lock.json // npm自动生成，用于帮助package的统一性设置的，yarn也有相同的操作
  |-- package-lock.json // npm自动生成，用于帮助package的统一性设置的，yarn也有相同的操作
  |-- package.json // npm包管理配置文件
  ```

## 具体优化细节

- 删除冗余代码

  删除项目中没有用到的代码
  去掉页面中引入了却没有使用的组件
  删掉项目中用不到的文件

- 可配置化

  增加项目环境变量配置，根据不同开发环境配置不同静态资源路径、配置接口地址等。

- 重构样式

  通用样式中的代码需适当合理放置（基础样式、颜色样式、边距样式、字体样式等）。
  无需大批量生成基础样式，用到的放上就好了。
  组件及页面内的独立样式使用 scoped 区别开。
  布局统一，不要 em/rem/px 混合使用。
  少用或不用通配符。

- 修复一些逻辑或代码错误

  项目中出现一些 js 异常报错问题（例如，遍历接口返回的数据，但是接口返回的是 null，这时就需要兼容下）
  因为前开发者的逻辑问题，导致代码异常难改，各种混乱引用。
  对于可能出现问题的地方，需要尽行异常捕获，并处理异常情况。
  不规范的 js 方法使用导致程序意外报错。

- 抽离公共方法

  基础方法需抽离出来，放到公共模块。项目中，两次及以上用到的同一功能方法，都需提取出来。一个方法超过一个组件中使用，基本就要考虑抽离了。方法内，如有不合理的实现，必须优化掉。简单逻辑简单化，不要过于复杂实现。 公共方法，尽量通用，解耦合。

- 抽离公共组件

  基础组件需抽离出来。两次及以上用到同一功能的代码，都应该抽离成组件的形式，便于重复使用。包括定位、隐藏模块、渠道信息(app 全局数据)、省市区选择组件

  ::: warning
  是否统一省市区选择为模板 21 那种的省市区选择组件
  :::

  ![模板21省市区选择](https://cdn.clearlywind.com/static/images/模板21选择器.jpg)

- 优化组件内部代码

  组件内部代码，如有不合理或者冗余的地方，必须进行优化。
  props 中参数，补全类型及默认值。

- 请求接口功能统一封装。

  接口请求 url 统一管理。
  错误信息必须捕获并提示。

- 协议页面

  所有协议相关页面要独立维护，静态页面存储在 oss 上，采用 iframe 动态引入

- 其他可复用部分

  1. 顶部新闻滚动

     ![顶部新闻滚动](//cdn.clearlywind.com/static/images/横向滚动新闻.jpg)

  2. 卡种选择

     ![卡种选择](//cdn.clearlywind.com/static/images/卡种选择.jpg)

## 具体需要抽象的组件

1. 省市区选择组件

   省市区分为归属地和收货地，并且二者被选择的先后顺序不确定，需要考虑到选择结束后默认参数赋值的情况
   入参 props

   ```js
   export default {
     props: {
       defaultAddress: {
         type: Object,
         // 如果第一次选择则为 null，需要判断为非 null
         default: {
           province: {
             code: 100100,
             name: '北京市',
           },
           city: {
             code: '',
             name: '',
           },
           area: {
             code: '',
             name: '',
           },
         },
       },
     },
     // 卡种类型
     cardType: String,

     // 是否是收货地址
     isPostCode: Boolean,
   }
   ```

   发布事件，当选中某个城市或者区的时候，抛出 selected 或者 cancel 事件

   selected 事件将选中数据按照上述格式抛出给调用位置
   cancel 将关闭自己

2. 定位和详细地址模糊搜索

   - 高德地图 js 全局注册
   - 需要使用的模板通过 mixins 混入的方式按需引入

   ```js
   export default {
     methods: {
       // 定位函数
       getPosition(callback) {
         // 定位成功过执行 callback
       },
     },
     mounted() {
       const vm = this
       vm.getPosition(function (resp) {
         // 使用
       })
     },
   }
   ```

3. 隐藏模块

   隐藏模块通过指令方式来定义，当 app 加载会请求接口返回可显示模块信息 `window.globalHiddenModules = '1,2,3,4,5'` ，定义一个指令，将隐藏的模块隐藏

   ```html
   <!-- 当隐藏模块中包含 '3,4' 的时候隐藏 -->
   <div v-hidden="3,4"></div>
   ```

4. 协议页面和下单完成页面

   全局向下暴露函数，当任何一个模板点击打开协议时，调用暴露函数(发布订阅模式)，对应事件名要定义常量维护。

   ```js
   // 调用全局方法
   const children = {
     methods: {
       查看协议(params) {
         Bus.$emit('打开移动协议', params)
       },
     },
   }
   const superParent = {
     created() {
       Bus.on('打开移动协议', (params) => {})
       this.$once('hook:beforeDestroy', () => {
         // 取消注册
         Bus.off('打开移动协议')
       })
     },
   }
   ```

## 部署相关

落地页 nginx 负载多个 pm2 节点, ssr 服务反代到后端接口 nginx 负载到各个后端接口服务

docker?

```dockerfile
FROM node:alpine

WORKDIR /app

RUN npm i -g pm2
RUN npm i yarn -g

COPY ./package*.json ./

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

# Build app
RUN yarn run build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true


EXPOSE 3000

USER node

CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
```
