---
title: CSS Modules 的理解和使用
date: 2018-08-16 02:20:20
category:
  - CSS
  - PostCSS
---

## CSS Modules

`CSS Modules` 是构建步骤中的一个过程，需要 `Webpack` 或者 `Browserify` 的帮助，通过构建工具可以将 `类名` 或者 `其他选择器` 的名字作用域化

`CSS` 没有作用域，所以所有的 `class` 名称都是全局的。`CSS-Modules` 是为了解决这个问题，`CSS Modules` 是在构建 `CSS` 步骤中的一个其他操作。构建通常需要使用 `Webpack` 或者 `Browserify` 。通过构建工具的帮助，可以将 `class` 的名字或者选择器的名字作用域化。也就是说利用 `Node.js` 管理样式依赖

`CSS Modules` 允许将所有 CSS `class` 自动打碎，这是 `CSS Modules` 的默认设置。然后生成一个 `JSON` 文件（sources map）和原本的 `class` 关联

## 如何使用

- 局部作用域

  `CSS` 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。
  这就是 CSS Modules 的做法。 `Webpack` 中的 `css-loader` 开启 `modules` 功能后，就是将 `CSS` 类名编译为一个哈希字符串，这样这个类名就是独一无二的了

  [文档地址](https://www.webpackjs.com/loaders/css-loader/#modules)

  ```js
  // webpack.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
      ],
    },
  }
  ```

- 全局作用域

  ```css
  .title {
    color: red;
  }
  /* css modules  */
  /* 允许使用:global(.className)的语法，
  声明一个全局规则。凡是这样声明的class，都不会被编译成哈希字符串。 */
  :global(.title) {
    color: green;
  }
  ```

- 定制哈希类名

  ```js
  module: {
    loaders: [
      // ...
      {
        test: /\.css$/,
        loader:
          'style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]',
      },
    ]
  }
  ```

- `CSS` 组合，一个类名继承另一个选择器的规则

  ```css
  .yangshi {
    background-color: blue;
  }
  .title {
    composes: yangshi;
    color: red;
  }
  ```

- 也可以引用某个文件中的 `CSS` 样式来组合

  ```css
  /* another.css */
  .blue {
    color: blue;
  }

  /* other.css */
  .title {
    composes: blue from './another.css';
    font-size: 20px;
  }
  ```
