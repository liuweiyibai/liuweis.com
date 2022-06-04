---
title: 前端 Git 规范
date: 2021-09-26 19:48:20
category:
  - 开发规范
---

### Git 分支命名

- master：主分支，负责记录上线版本的迭代，该分支代码与线上代码是完全一致的。
- develop：开发分支，该分支记录相对稳定的版本，所有的 feature 分支和 bugfix 分支都从该分支创建。其它分支为短期分支，其完成功能开发之后需要删除
- feature/\*：特性（功能）分支，用于开发新的功能，不同的功能创建不同的功能分支，功能分支开发完成并自测通过之后，需要合并到 develop 分支，之后删除该分支。
- bugfix/\*：bug 修复分支，用于修复不紧急的 bug，普通 bug 均需要创建 bugfix 分支开发，开发完成自测没问题后合并到 develop 分支后，删除该分支。
- release/\*：发布分支，用于代码上线准备，该分支从 develop 分支创建，创建之后由测试同学发布到测试环境进行测试，测试过程中发现 bug 需要开发人员在该 release 分支上进行 bug 修复，所有 bug 修复完后，在上线之前，需要合并该 release 分支到 master 分支和 develop 分支。
- hotfix/\*：紧急 bug 修复分支，该分支只有在紧急情况下使用，从 master 分支创建，用于紧急修复线上 bug，修复完成后，需要合并该分支到 master 分支以便上线，同时需要再合并到 develop 分支。

![](https://user-gold-cdn.xitu.io/2018/7/9/1647e5710a461adc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Git Commit Message 格式

type : subject

#### type 提交类型

- feature: 新特性
- fix: 修改问题
- style: 代码格式修改
- test: 测试用例修改
- docs: 文档修改
- refactor: 代码重构
- misc: 其他修改, 比如构建流程, 依赖管理

#### subject 提交描述

对应内容是 commit 目的的简短描述，一般不超过 50 个字符

### 参考链接

- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [约定式提交](https://www.conventionalcommits.org/zh/v1.0.0-beta.2/)
- [必须知道的 Git 分支开发规范](https://juejin.im/post/5b4328bbf265da0fa21a6820)
- [Git 在团队中的最佳实践--如何正确使用 Git Flow](http://www.open-open.com/lib/view/open1451353135339.html)
- [优雅的提交你的 Git Commit Message](https://zhuanlan.zhihu.com/p/34223150)
