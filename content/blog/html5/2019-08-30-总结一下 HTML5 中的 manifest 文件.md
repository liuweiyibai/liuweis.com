---
title: 总结一下 HTML5 中的 manifest 文件
date: 2019-08-30 18:00:28
category:
  - HTML5
  - Webpack
  - PWA
---

在前端，说到 `manifest` 可以指代下列含义：

- `html` 标签的 `manifest` 属性
- `PWA` 将 `web` 应用程序安装到设备的主屏幕
- `webpack` 中 `webpack-manifest-plugin` 插件打包出来的 `manifest.json` 文件，用来生成一份资源清单，为后端渲染服务所用
- `webpack` 中 `dll` 打包时，输出的 `manifest.json` 文件，用来分析已经打包过的文件，优化打包速度和大小
- `webpack` 中 `manifest` 运行时代码

下面来分别介绍下：

## html 标签属性 manifest

```html:title=index.html;
<!DOCTYPE html>
<html lang="en" manifest="/tc.mymanifest">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="/theme.css" />
    <script src="/main.js"></script>
    <script src="/main2.js"></script>
  </head>
  <body></body>
</html>
```

当浏览器解析这段 `html` 标签时，就会去访问 `tc.mymanifest` 这个文件，这是一个缓存清单文件

**tc.mymanifest：**

```text
# v1 这是注释
CACHE MANIFEST
/theme.css
/main.js

NETWORK:
*

FALLBACK:
/html5/ /404.html
```

`CACHE MANIFEST` 指定需要缓存的文件，第一次下载完成以后，文件都不会再从网络请求了，即使用户不是离线状态，除非 `tc.mymanifest` 更新了，缓存清单更新之后，才会再次下载。标记了 `manifest` 的 `html` 本身也被缓存

`NETWORK` 指定非缓存文件，所有类似资源的请求都会绕过缓存，即使用户处于离线状态，也不会读缓存

`FALLBACK` 指定了一个后备页面，当资源无法访问时，浏览器会使用该页面。比如上面指定离线访问`/html5/`目录时，就会用本地的`/404.html` 页面

缓存清单可以是任意后缀名，不过必须指定 `content-type` 属性为 `text/cache-manifest`

那如何更新缓存？一般有以下几种方式：

- 用户清空浏览器缓存
- `manifest` 文件被修改(即使注释被修改)
- 由程序来更新应用缓存

需要特别注意：用户第一次访问该网页，缓存文件之后，第二次进入该页面，发现 `tc.mymanifest` 缓存清单更新了，于是会重新下载缓存文件，但是，第二次进入显示的页面仍然执行的是旧文件，下载的新文件，只会在**第三次进入该页面后执行！！！**

如果希望用户立即看到新内容，需要 JavaScript 监听更新事件，重新加载页面

```js
window.addEventListener(
  'load',
  function (e) {
    window.applicationCache.addEventListener(
      'updateready',
      function (e) {
        if (
          window.applicationCache.status == window.applicationCache.UPDATEREADY
        ) {
          // 更新缓存
          // 重新加载
          window.applicationCache.swapCache()
          window.location.reload()
        } else {
        }
      },
      false
    )
  },
  false
)
```

建议对 `tc.mymanifest` 缓存清单设置永不缓存，不过，`manifest` 也有很多缺点，比如需要手动一个个填写缓存的文件，更新文件之后需要二次刷新，如果更新的资源中有一个资源更新失败了，将导致全部更新失败，将用回上一版本的缓存，并且 HTML5 规范也废弃了这个属性，因此不建议使用。

## PWA

为了实现 `PWA` 应用添加至桌面的功能，除了要求站点支持 `HTTPS` 之外，还需要准备 `manifest.json` 文件去配置应用的图标、名称等信息。

```html
<link rel="manifest" href="/manifest.json" />
```

```json
{
  "name": "Minimal PWA",
  "short_name": "PWA Demo",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#313131",
  "background_color": "#313131",
  "icons": [
    {
      "src": "images/touch/homescreen48.png",
      "sizes": "48x48",
      "type": "image/png"
    }
  ]
}
```

通过 Service workers 让 PWA 离线工作，通过一系列配置，就可以把一个 PWA 像 `APP` 一样，添加一个图标到手机屏幕上，点击图标即可打开站点。

> [PWA 概念](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
>
> [Webpack 构建 PWA](https://developers.google.com/web/tools/workbox/guides/generate-service-worker/webpack)

## **webpack-manifest-plugin**

通常情况下，我们打包出来的 `js` , `css` 都是带上版本号的，通过 `HtmlWebpackPlugin` 可以自动帮我们在 `index.html` 里面加上带版本号的 `js` 和 `css`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>learn dll</title>
    <link href="main.198b3634.css" rel="stylesheet" />
  </head>

  <body>
    <div id="app"></div>
    <script type="text/javascript" src="main.d312f172.js"></script>
  </body>
</html>
```

但是在某些情况，`index.html` 模板由后端渲染，那么我们就需要一份打包清单，知道打包后的文件对应的真正路径

如何使用呢？

- 安装

  ```bash
  npm i webpack-manifest-plugin --save-dev
  ```

- 新增到 `webpack.config.js` 中

  ```js
  const ManifestPlugin = require('webpack-manifest-plugin')
  module.exports = {
    // 其他配置
    plugins: [new ManifestPlugin()],
  }
  ```

重新打包后，可以看见 `dist` 目录新生成了一个 `manifest.json`，内容大约是这个样子：

```json
{
  "main.css": "main.198b3634.css",
  "main.js": "main.d312f172.js",
  "index.html": "index.html"
}
```

比如在 SSR（服务端渲染） 开发时，前端打包后，node 后端就可以通过这个 json 数据，返回正确资源路径的 html 模板

```js
const buildPath = require('./dist/manifest.json')

res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ssr</title>
<link href="${buildPath['main.css']}" rel="stylesheet"></head>
<body>
  <div id="app"></div>
<script type="text/javascript" src="${buildPath['main.js']}"></script></body>
</html>
`)
```

## 代码分割

我们之前的打包方式，有一个缺点，就是把业务代码和库代码都统统打到了一个 `main.js` 里面。每次业务代码改动后，`main.js` 的 `hash` 值就变了，导致客户端又要重新下载一遍 `main.js`，但是里面的以来的库代码其实是没改变的！通常情况下，`react` `react-dom` 之类的库，都是不经常改动的。我们希望单独把这些库代码提取出来，生成一个 `vendor.js` ，这样每次改动代码，只是下载 `main.js` ，`vendor.js`可以充分缓存(也就是所谓的代码分割`code splitting`)

`Webpack4` 自带代码分割功能，只要配置:

```js:title=webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

重新打包，发现新生成了一个 `vendor.js` 文件，公用的一些代码就被打包进去了
重新修改 `src/Home.js` ,然后打包，你会发现 `vendor.js` 的 `hash` 值没有改变，这也是我们希望的。

## DLL 打包

上面的打包方式，随着项目的复杂度上升后，打包速度会开始变慢。原因是，每次打包， `webpack` 都要分析哪些是公用库，然后把他打包到 `vendor.js` 里

我们可不可以在第一次构建 `vendor.js` 以后，下次打包，就直接跳过那些被打包到 `vendor.js` 里的代码呢？这样打包速度可以明显提升

这就需要 `DllPlugin` 结合 `DllRefrencePlugin` 插件的运用

dll 打包原理就是：

- 把指定的库代码打包到一个 `dll.js` ，同时生成一份对应的 `manifest.json` 文件
- `Webpack` 打包时，读取 `manifest.json`，知道哪些代码可以直接忽略，从而提高构建速度
  我们新建一个 `webpack.dll.js`

```js:title=webpack.dll.js
module.exports = {
  entry: {
    vendors: ['react', 'react-dom'], // 手动指定打包哪些库
  },
  // ...
  plugins: [
    new webpack.DllPlugin({
      // 生成对应的manifest.json，给 webpack 打包用
      path: path.join(__dirname, './dll/[name].manifest.json'),
      name: '[name]',
    }),
  ],
}
```

添加一条命令:

```bash
"build:dll": "webpack --config webpack.dll.js"
```

运行 `dll` 打包

```bash
npm run build:dll
```

发现生成一个 `dll` 目录，内容包括 `vendors.js` 和 `vendors.manifest.json`

修改`webpack.prod.js`

```js
plugins: [
  new webpack.DllReferencePlugin({
    // 读取dll打包后的manifest.json，分析哪些代码跳过
    manifest: path.resolve(__dirname, './dll/vendors.manifest.json'),
  }),
]
```

重新 `npm run build` ，发现 `dist` 目录里，`vendor.js` 没有了

这是因为 `react` , `react-dom` 已经打包到 `dll.js` 里了， `webpack` 读取 `manifest.json` 之后，知道可以忽略这些代码，于是就没有再打包了

但这里还有个问题，打包后的 `index.html` 还需要添加 `dll.js` 文件，这就需要 `add-asset-html-webpack-plugin` 插件

```bash
npm i add-asset-html-webpack-plugin -D
```

修改`webpack.prod.js`

```js
plugins: [
  // 把 dll.js 加进 index.html 里，并且拷贝文件到 dist 目录
  new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname, './dll/*.dll.js'),
  }),
  new webpack.DllReferencePlugin({
    // 读取dll打包后的manifest.json，分析哪些代码跳过
    manifest: path.resolve(__dirname, './dll/vendors.manifest.json'),
  }),
]
```

重新 `npm run build` ，可以看见 `dll.js` 也被打包进 `dist` 目录了，同时 `index.html` 也正确引用

## **runtime**

`Webpack` 中有运行时的概念，比如我们通过 `Webpack` 打包后分割成了 `dll.js` ，`vendors.js` `main.js` ，那这三个代码，到底哪个先调用，哪个后调用，他们运行顺序就是由运行时代码组织(通过读取 `manifest` 数据)

通常情况下我们无需关心运行时代码，但如果希望尽可能的优化浏览器缓存，那么我们可以把运行时代码单独提取出来，这样某些文件发生改变后，一些与之相关的文件 hash 值并不会也随之改变。

通过配置 runtimeChunk 即可

```js
optimization: {
  runtimeChunk: {
    name: 'manifest'
  }
}
```

## 小结

我们介绍了 5 种 `manifest` 相关的前端技术。 `manifest` 的英文含义是名单, 5 种技术的确都是把 `manifest` 当做清单使用：

- 缓存清单
- `PWA` 清单
- 打包资源路径清单
- `dll` 打包清单
- 代码加载顺序清单

只不过是在不同的场景中使用特定的清单来完成某些功能。
