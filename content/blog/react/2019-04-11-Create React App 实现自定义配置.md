---
title: Create React App 实现自定义配置
date: 2019-04-11 22:10:00
category:
  - React
  - Create React App
thumbnail: './images/RE4wB7a.jpeg'
draft: false
---

## 方法一

将 Create React App 配置导出，实现修改

```bash
npm run eject
```

## 方法二

通过其他工具，实现 Create React App 覆盖配置自定义

- 步骤 1：

  下载 `react-app-rewired` 和 `customize-cra`

  ```bash
  npm i react-app-rewired customize-cra -D
  ```

- 步骤 2：

  修改 `package.json` 文件

  ```json
  "scripts": {
  -  "start": "react-scripts start",
  +  "start": "react-app-rewired start",
  -  "build": "react-scripts build",
  +  "build": "react-app-rewired build",
  -  "test": "react-scripts test --env=jsdom",
  +  "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
  }
  ```

- 步骤 3：创建配置文件

  ```js
  // config.override.js
  const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')
  const path = require('path')
  function resolve(dir) {
    return path.join(__dirname, '.', dir)
  }
  module.exports = override(
    // 配置路径别名
    addWebpackAlias({
      components: path.resolve(__dirname, 'src/components')
    }),
    // antd按需加载
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    })
  ```

## 方案 3

[craco](https://github.com/gsoft-inc/craco) 是 `antd` 文档中推荐的一个 `create-react-app` 的默认配置进行自定义的方案

基于 `craco` 实现一个自定义方案

## 参考链接

[react-app-rewired](https://github.com/timarney/react-app-rewired/)

[customize-cra](https://github.com/arackaf/customize-cra)
