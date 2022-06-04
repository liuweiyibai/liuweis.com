---
title: Lint 工具流
date: 2021-09-26 19:48:20
category:
  - 开发规范
---

为了提高整体开发效率，需要定制一些 vue/electron/官网等脚手架工具。首先要将一些代码规范考虑在内，需要保持 git 仓库的代码就像是一个人写出来的。根据团队习惯，考虑后使用组合工具：

1. **规范提交代码（必需）**：`eslint` + `stylelint` + `prettier` + `husky` + `lint-staged`。
1. **规范 commit 日志（必需）**：`commitlint` + `commitizen` + `cz-conventional-changelog` + `conventional-changelog-cli`
1. **规范提交流程（github 项目）**：`release-it` + `gh-pages`。
1. **辅助代码分析（可选）**：`jsinspect` + `jscpd`

## 1. 规范提交代码

针对写出符合团队代码规范的 js、css 代码

1. **eslint**: 对 js 做规则约束。强制校验
1. **stylelint**: 对 css 做规则约束
1. **prettier**: 代码格式化。强制格式化
1. **husky + [lint-staged](https://github.com/okonet/lint-staged)**：本地 git 钩子工具

### 1.1 [eslint](https://github.com/eslint/eslint)

#### 1.1.1 安装

```shell
npm install --save-dev eslint eslint-plugin-vue babel-eslint
```

#### 1.1.2 `.eslintrc.js`配置

```js
module.exports = {
    root: true,
    // 指定代码的运行环境。不同的运行环境，全局变量不一样
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
    // ESLint 默认使用Espree作为其解析器,安装了 babel-eslint 用来代替默认的解析器
      parser: 'babel-eslint'
    },
    // 使得不需要自行定义大量的规则
    extends: [
      // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
      'plugin:vue/essential'
    ],
    // 插件
    plugins: [
      'vue'
    ],
    // add your custom rules here
    rules: {
      // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'indent': [2, 4, { 'SwitchCase': 1 }],
      ...
    }
  }
```

#### 1.1.3 提交前强制校验

将约束命令放置在提交代码前检查，这就要使用[husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged)工具，工具能在提交代码 precommit 时调用钩子命令。

```sh
npm install husky lint-staged -D
```

```json
"scripts": {
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
},
"gitHooks": {
  "pre-commit": "lint-staged"
},
"lint-staged": {
  "*.{js,vue,ts}": [
    "npm run lint"
  ]
},
```

:::tip
如果是 vue-cli3 项目创建的项目，以上配置都自动生成了，直接执行 vue-cli-service lint 即可。
:::

### 1.2 [prettier](https://github.com/prettier/prettier)

#### 1.2.1 安装

```shell
npm install --save-dev prettier
```

#### 1.2.2. `.prettierrc.js`配置

```js
module.exports = {
  printWidth: 100, // 设置prettier单行输出（不折行）的（最大）长度

  tabWidth: 4, // 设置工具每一个水平缩进的空格数

  useTabs: false, // 使用tab（制表位）缩进而非空格

  semi: false, // 在语句末尾添加分号

  singleQuote: true, // 使用单引号而非双引号

  trailingComma: 'none', // 在任何可能的多行中输入尾逗号

  bracketSpacing: true, // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格

  arrowParens: 'avoid', // 为单行箭头函数的参数添加圆括号，参数个数为1时可以省略圆括号

  parser: 'babylon', // 指定使用哪一种解析器

  jsxBracketSameLine: true, // 在多行JSX元素最后一行的末尾添加 > 而使 > 单独一行（不适用于自闭和元素）

  rangeStart: 0, // 只格式化某个文件的一部分

  rangeEnd: Infinity, // 只格式化某个文件的一部分

  filepath: 'none', // 指定文件的输入路径，这将被用于解析器参照

  requirePragma: false, // (v1.7.0+) Prettier可以严格按照按照文件顶部的一些特殊的注释格式化代码，这些注释称为“require pragma”(必须杂注)

  insertPragma: false, //  (v1.8.0+) Prettier可以在文件的顶部插入一个 @format的特殊注释，以表明改文件已经被Prettier格式化过了。

  proseWrap: 'preserve', // (v1.8.2+)
}
```

#### 1.2.3 提交前强制格式化

在提交 git 时需要对整个项目执行`format`格式化，使得代码强制统一。格式化之后再用`eslint`检查语法错误，无误后把格式化后的代码用`git add .`添加进入。如果有错误直接中断提交。

```json
"scripts": {
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
},
"gitHooks": {
  "pre-commit": "lint-staged"
},
"lint-staged": {
  "*.{js,vue,ts}": [
    "prettier --write",
    "npm run lint"
  ]
},
```

### 1.3 stylelint

[参见 stylelint](/standard-stylelint.html)

## 2. 规范 commit 日志(必需)

在多人协作的项目中，如果 Git 的提交说明精准，在后期协作以及 Bug 处理时会变得有据可查，项目的开发可以根据规范的提交说明快速生成开发日志，从而方便开发者或用户追踪项目的开发信息和功能特性。

规范的 Git 提交说明:

- 提供更多的历史信息，方便快速浏览
- 可以过滤某些 commit，便于筛选代码 review
- 可以追踪 commit 生成更新日志
- 可以关联 issues

Git 提交说明结构:

Git 提交说明可分为三个部分：Header、Body 和 Footer。

```html
<header>
  <body>
    <footer></footer>
  </body>
</header>
```

Header 部分包括三个字段 type（必需）、scope（可选）和 subject（必需）。

```html
<type
  >(<scope>): <subject></subject></scope
></type>
```

type 用于说明 commit 的提交性质。(Angular 规范)

- feat 新增一个功能
- fix 修复一个 Bug
- docs 文档变更
- style 代码格式（不影响功能，例如空格、分号等格式修正）
- refactor 代码重构
- perf 改善性能
- test 测试
- build 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）
- ci 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等
- chore 变更构建流程或辅助工具
- revert 代码回退

### 2.1 [commitlint](https://github.com/conventional-changelog/commitlint)

**约定 commit message 提交的格式**。

#### 2.1.1 安装

```sh
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

#### 2.1.2 配置

在根目录执行以下命令作为 commitlint 的配置

```sh
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

#### 2.1.2 提交前校验

```json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

### 2.2 commitizen cz-conventional-changelog

commitlint 约定了提交的格式，但每次书写都需要记住那些约定，增加记忆负担。所以**使用 cz 工具让提交 commit 过程更加可视化**。

commitizen/cz-cli 是一个可以实现规范的提交说明的工具，提供选择的提交信息类别，快速生成提交说明。

#### 2.2.1 安装

```sh
npm i commitizen cz-conventional-changelog -D
```

#### 2.2.2 配置

使用 cz-conventional-changelog 适配器（介于 AngularJS 规范），约定提交代码时的选项。

```json
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```

#### 2.2.3 命令执行

以后 git commit 都使用 npm run commit（即 git-cz）代替

```json
"scripts": {
    "commit": "git add -A && git-cz"
},
```

commitlint + commitizen cz-conventional-changelog + conventional-changelog-cli

### 2.3 [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

**自动根据 commit 生成 changelog**。

良好的 changelog 可以让用户一眼知道组件库的版本迭代演进，也是长期维护项目的必备内容。

#### 2.3.1 安装

```sh
npm install conventional-changelog-cli -D
```

#### 2.3.2 命令执行

```json
"scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
},
```

:::tip
每次发布组件包版本后，即可使用 npm run changelog 命令，自动根据 git commit 生成日志。
:::

## 3. 规范提交流程（可选）

针对 github + npm 项目，可以简化流程。内部非开源项目可跳过该内容。

- gh-pages（发布 demo 到 github）
- release-it/[standard-version](https://github.com/conventional-changelog/standard-version)（自动提交 github 代码 + 自动修改 lib 库版本 + 推送 npm 服务器）

#### 3.1 安装

```sh
npm i gh-pages release-it -D
```

#### 3.2 命令执行

```json
"scripts": {
    "release": "release-it",
    "release:docs": "npm run build:docs && gh-pages -d docs/.vuepress/dist
},
```

## 4. 辅助代码分析（可选）

敏捷开发过程中，代码复查是至关重要的一环，团队需要使用工具辅助代码分析。经比较和实践后，使用工具：`jsinspect` + `jscpd`

1. **jsinspect**: 对 js 或 jsx 代码做重复检测。
1. **jscpd**: 对代码重复率进行报告总结，辅助代码复查

### 4.1 [jsinspect](https://github.com/danielstjules/jsinspect)

#### 4.1.1 安装

```shell
npm install jsinspect --save-dev
```

#### 4.1.2 提交前强制校验

```json
"scripts": {
    "inspect": "jsinspect -t 50 ./src",
}
```

### 4.2 [jscpd](https://github.com/kucherenko/jscpd)

#### 4.2.1 安装

```shell
npm install jscpd --save-dev
```

#### 4.2.2 代码复查辅助命令

```json
"scripts": {
    "codereview": "jscpd ./src"
}
```

## 总结

- eslint + husky + lint-staged + prettier 作为基础工具。
- commitlint 约束提交规范,commitizen 让工具通过 select 选项，进行 git commit, conventional-changelog-cli 自动根据 git commit 生成 changelog 文件。
- release-it 核心是可以把包自动发送到 npm 上，gh-pages 把指定目录发布到 github gh-pages 分支上。

配置好以上工具，开发组件库时常用三个命令：

- 平时开发提交 commit： npm run commit "commit": "git add -A && git-cz",
- 发布 npm 包: npm publish "prepublish": "npm run build && release-it && npm run changelog",
- 发布 docs: npm run docs "release:docs": "npm run build:docs && gh-pages -d docs/.vuepress/dist",

以下示例个实际 github 项目配置: [lq782655835/yi-ui](https://github.com/lq782655835/yi-ui)

```json
"scripts": {
    "commit": "git add -A && git-cz",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0",
    "release": "release-it",
    "lint": "vue-cli-service lint"
},
"husky": {
    "hooks": {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
},
"lint-staged": {
    "packages/**/*.{vue,ts,tsx,js,jsx,json}": [
        "prettier --write",
        "npm run lint"
    ]
},
"config": {
    "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
    }
}
```
