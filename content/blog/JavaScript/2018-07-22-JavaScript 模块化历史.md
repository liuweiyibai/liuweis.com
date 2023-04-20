---
title: JavaScript 模块化历史
date: 2018-07-22 10:46:00
category:
  - JavaScript
---

一种思想，到一种规范，解决复杂问题。

通过 rollup 产物来分析各个模块化的方法。

循环依赖问题，common 缓存问题。值引用还是地址引用。按需加载

一开始 `JavaScript` 也没有模块化的概念，当然 `JavaScript` 文件之间也没有太多的束缚，只是简单的堆砌 `script` 标签，也没有全局变量与局部变量的概念，定义的变量都是全局的。因此很容易出现，b 文件改了 a 文件中的变量内容。导致后期开发、维护难的问题，查找、增加变量名都得全局搜索下。避免出现变量被覆盖的问题。

随着 `JavaScript` 语言的发展，前端能做的事情越来越多，项目越来越庞大，处理模块之间的依赖关系成为了维护的关键。单文件维护代码已经太沉重，于是开始进行拆分，进而引入模块化，将负责不同功能的代码拆分成小粒度的模块，方便维护。

下面总结一下 JavaScript 模块化的发展历史。

## **命名空间**

通过闭包形成命名空间，向 `window` 上添加方法，这样做的好处是避免变量全局污染，可以将模块放到单独的作用域。缺点是，它并没有一个明确的依赖树，这使得开发者只能自己确保 JS 文件的加载顺序。

```js
;(function (win, doc) {
  function add() {}
  windwo.add = add
})(window, document)

add(1, 2, 3)
```

### **CommonJS**

CommonJS 社区首先提出了模块化的规范 CommonJS（cjs），所以 CommonJS 是一个规范！

同步读取文件。

CommonJS 规范提供 `module.exports`(或者 `exports`)接口用于对外暴露模块，使用 `require` 加载模块。

Node.js 就采用了这种规范去实现模块化，所以在 Node.js 上只需要简单的 `require` 和 `exports` 就可以实现模块的导入和导出，如下：

```js
var fs = require('fs')
fs.readFile()
exports.getFileSize = function () {}
module.exports = {}
```

这种写法适合服务端，因为在服务器读取模块都是在本地磁盘，加载速度很快。但是如果在客户端，加载模块的时候有可能出现[假死]状况。那么，能不能异步加载模块呢？

### **AMD**

AMD 全称是 Asynchromous Moudle Definition，该规范的思想正如其名，异步加载所需的模块，然后在回调函数中执行主逻辑。这正是我们在浏览器端开发所习惯了的方式。

AMD 是 requirejs 在推广过程中对模块定义的规范化产出。

AMD 是一种异步加载模块，它的模块支持对象，函数，构造器，字符串，json 等各种类型的模块。

这种规范是异步的加载模块，requirejs 应用了这一规范。先定义所有依赖，然后在加载完成后的回调函数中执行:

```js
require([module], callback)
```

- 模块引入

  ```js
  require(['clock'], function (clock) {
    clock.start()
  })
  // AMD虽然实现了异步加载，但是开始就把所有依赖写出来是不符合书写的逻辑顺序的。
  ```

- 模块定义

  ```js
  define('myModule',['依赖包1','依赖包..'],function(依赖包名..){
    return {
      plot:function(x,y){
        return x + y
      }
    }
  })
  ```

- AMD 规范实现

  ```js
  const defaultOptons = {}
  const require = function (deps, factory) {
    return new Promise((resolve, reject) => {})
  }
  ```

## **UMD**

UMD 全称是 Universal Module Definition，目的兼容 CommonJS 和 AMD ，所以它会做一层判断，判断当前环境是浏览器还是 Node.js，如果是浏览器则使用 AMD，Node.js 环境使用 CommonJS 方式，UMD 实现了两种环境的兼容。

### CMD && seaJS

CMD 全称 Common Moudle Definition 规范，是由国内前端大神 - 玉伯，编写的一个 JavaScript 库 — sea.js，在推过过程，提出的一个基于 CommonJS 的新规范 — CMD。该规范与 AMD 类似，写法也类似。但不同的是，CMD 遵循着依赖后置的理念。即 AMD 是一次性加载完该模块所需要的所有模块，再执行回调。而 CMD 是按需加载，即需要用到的时候，才去加载对应模块。

- 简介：是 `seajs` 推崇的规范，`cmd` 则是依赖就近，用的时候再 `require`。它写起来是这样的：

  ```js
  define(function (require, exports, module) {
    var clock = require('clock')
    clock.start()
  })
  ```

- `define` 是一个全局函数， 用来定义模块。

  ```js
  define(function (require, exports, module) {
    // 模块代码
  })
  ```

- `require` 是一个方法， 接受 模块标识 作为唯一参数， 用来获取其他模块提供的接口。

  ```js
  define(function (require, exports) {
    // 获取模块 a 的接口
    var a = require('./a')
    // 调用模块 a 的方法
    a.doSomething()
  })
  ```

- `require.async` 方法用来在模块内部异步加载模块， 并在加载完成后执行指定回调。 callback 参数可选。

  ```js
  define(function (require, exports, module) {
    // 异步加载一个模块，在加载完成时，执行回调
    require.async('./b', function (b) {
      b.doSomething()
    })

    // 异步加载多个模块，在加载完成时，执行回调
    require.async(['./c', './d'], function (c, d) {
      c.doSomething()
      d.doSomething()
    })
  })
  ```

- `exports` 是一个对象， 用来向外提供模块接口。

  ```js
  define(function (require, exports) {
    // 对外提供 foo 属性
    exports.foo = 'bar'

    // 对外提供 doSomething 方法
    exports.doSomething = function () {}
  })
  //除了给 exports 对象增加成员，还可以使用 return 直接向外提供接口。
  define(function (require) {
    // 通过 return 直接提供接口
    return {
      foo: 'bar',
      doSomething: function () {},
    }
  })
  ```

- `module` 是一个对象， 上面存储了与当前模块相关联的一些属性和方法。

  ```js
  define(function (require, exports, module) {
    console.log(module.uri)
    module.exports = {
      foo: 'bar',
      doSomething: function () {},
    }
  })
  ```

## **ES6 模块化**

之前的几种模块化方案都是前端社区自己实现的，只是得到了大家的认可和广泛使用，而 ES6 的模块化方案是真正的官方规范。 在 ES6 中，我们可以使用 `import` 关键字引入模块，通过 `export` 关键字导出模块，功能较之于前几个方案更为强大，也是我们所推崇的，但是由于 ES6 目前无法在浏览器中执行，所以，我们只能通过 `babel` 将不被支持的 `import` 转译为当前受到广泛支持的 `require`

## require

```ts
function require(path: string) {
  // 假设 有个load方法可以读取到path文件内容
  // var code = load(path)

  // 比如一个文件内容如下
  var code = 'function add(a, b) { return a + b }; module.exports = add'

  // 代码块内部的 module 是个形参，实参使我们定义的context对象，对象中有一个 exports 属性
  code = `(function(module){
   ${code}
  })(context)`

  let context = {}
  const run = new Function('context', code)
  console.log(run)
  //  run(context,code)
}

function require(path) {
  // 假设 有个load方法可以读取到path文件内容
  // var code = load(path)

  // 文件内容如下
  var code = 'function add(a, b) { return a + b }; module.exports = add'

  // 代码块内部的 module 是个形参，实参使我们定义的context对象，对象中有一个 exports 属性
  code = `(function(module){
    ${code}
  })(context)`

  let context = {}
  // new Function('参数',..., 最后一个参数是函数体)
  const run = new Function('context', code)
  // run 函数的结构如下：
  // function run(context) {
  //  ;(function (module) {
  //   function add(a, b) {
  //    return a + b
  //   }
  //   module.exports = add
  //  })(context)
  // }

  console.log(run.toString())
  run(context, code)
  return context
}

console.log(require())
```

## 尝试阅读真实 require.js 源码

/\*\*

- nodeJS 模块化实现
- Node 中的模块引入会经历下面几个步骤：

  路径分析
  文件定位
  编译执行
  \*/

/\*\*

- RequireJS
- 通过 define 定义 和 require 来使用
  \*/

/\*\*

- 实现 CommonJS
  \*/

/\*\*

- 简易的 webpack
  \*/
