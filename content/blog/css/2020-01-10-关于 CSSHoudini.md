---
title: 关于 CSSHoudini
date: 2020-01-10 17:56:00
category:
  - CSS
  - CSS3
---

[Houdini](https://github.com/CSSHoudini) 是 W3C 新成立的一个任务小组，它的终极目标是实现 CSS 属性的完全兼容。Houdini 提出了一个前无古人的的设想：开放 CSS 的 API 给开发者，开发者可以通过这套接口自行扩展 CSS，并提供相应的工具允许开发者介入浏览器渲染引擎的样式和布局流程中。Houdini 目前包含 6 组 API

## Layout API

开发者可以通过 CSS Layout API 实现自己的布局模块（layout module），这里的“布局模块”指的是 display 的属性值。也就是说，这个 API 实现以后，开发者首次拥有了像 CSS 原生代码（比如 display:flex、display:table）那样的布局能力。

CSS Layout API 暴露了一个 registerLayout 方法给开发者，接收一个布局名（layout name）作为后面在 CSS 中使用的属性值，还有一个包含有这个布局逻辑的 JavaScript 类。假如你想要用这个方法定义一个 masonry 的类，可以这么写：

```js
registerLayout('masonry', class {
  static get inputProperties() {
    return ['width', 'height']
  }
  static get childrenInputProperties() {
    return ['x', 'y', 'position']
  }
  layout(children, constraintSpace, styleMap, breakToken) {
    // Layout logic goes here.
  }
}
```

如果上面这个例子你看不明白也用不着担心。关键在下面的代码，当你下载好 masonry.js 后，将它加入你的站点，然后这么来写 CSS 你就能得到一个 masonry 布局的样式了：

```css
body {
  display: layout('masonry');
}
```

## Paint API

CSS Paint API 和上面说到的 Layout API 非常相似。它提供了一个 registerPaint 方法，操作方式和 registerLayout 方法也很相似。当想要构建一个 CSS 图像的时候，开发者随时可以调用 paint() 函数，也可以使用刚刚注册好的名字。

下面这段代码展示时如何画一个有颜色的圆型：

```js
registerPaint(
  'circle',
  class {
    static get inputProperties() {
      return ['--circle-color']
    }
    paint(ctx, geom, properties) {
      // 改变填充颜色
      const color = properties.get('--circle-color')
      ctx.fillStyle = color
      // 确定圆心和半径
      const x = geom.width / 2
      const y = geom.height / 2
      const radius = Math.min(x, y)
      // 画圆
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
      ctx.fill()
    }
  }
)
```

在 CSS 中可以这样使用它：

```css
.bubble {
  --circle-color: blue;
  background-image: paint('circle');
}
```

你将在页面上看到一个以蓝色圆形为背景的元素，它的类是 .bubble，这个圆形背景将始终占满 .bubble 元素。

## Worklets

你已经看过了一些和规范相关的代码（比如 registerLayout 和 registerPaint），估计现在你想知道的是，这些代码得放在哪里呢？答案就是 worklet 脚本（工作流脚本文件）。

Worklets 的概念和 web worker 类似，它们允许你引入脚本文件并执行特定的 JS 代码，这样的 JS 代码要满足两个条件：第一，可以在渲染流程中调用；第二，和主线程独立。

Worklet 脚本严格控制了开发者所能执行的操作类型，这就保证了性能。

## Parser API

CSS Parser API 还没有被写入规范，所以下面我要说的内容随时都会有变化，但是它的基本思想不会变：允许开发者自由扩展 CSS 词法分析器，引入新的结构（constructs），比如新的媒体规则、新的伪类、嵌套、@extends、@apply 等等。只要新的词法分析器知道如何解析这些新结构，CSSOM 就不会直接忽略它们，而是把这些结构放到正确的地方。
