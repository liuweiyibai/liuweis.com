---
title: JavaScript 中 this 详解
date: 2020-05-14 09:48:00
category:
  - JavaScript
---

## this 是什么

> this 是声明函数时附件的参数，指向特定的对象，也就是隐藏参数，也就是说每个函数都可以访问 this

## 为什么要使用 this

this 提供给我们更优雅的方式来隐式的传递对象引用，this 可以帮助我们省略参数

## this 的指向

`this` 的指向在函数声明的时候是不会被确定的，只有函数执行的时候才被确定， `this` 最终指向的是调用它的对象，也就是 `this` 的指向决定于函数的调用方式

## 代码说明

### 注意

1. 在非严格模式下，浏览器中的尽头当然就是 window。

2. 在严格模式下也就是开启了"use strict"的情况下，尽头就是 undefined。

3. Node.js 的全局环境中尽头是 global。

非严格模式中对 this 的指向进行说明

- 栗子 1：普通函数中

  ```js
  var log = console.log
  function demo() {
    var user = 'github'
    log(this.user) // undefined
    log(this) // window
  }
  demo()

  // 这里的函数demo实际上是被window对象使用点语法所点出来的，如下：

  function demo() {
    var user = 'github'
    console.log(this.user) // undefined
    console.log(this) // window
  }

  window.demo()
  ```

- 栗子 2：对象中

  ```js
  var obj = {
    user: 'github',
    fn: function () {
      console.log(this.user) // github
    },
  }

  obj.fn()

  // 这里的 this 指向对象obj
  // 注意看最后一行调用函数的代码
  // obj.fn();

  // 重要的事情！！
  // this 的指向在函数创建时是决定不了的
  // 在调用的时候才可以决定，谁调用就指向谁
  ```

- 栗子 3：多层对象嵌套

  ```js
  // 其实以上两个例子说的还不够准确，我们接着往下看：👇👇

  var obj = {
    user: 'github',
    fn: function () {
      console.log(this.user) // github
    },
  }
  window.obj.fn()

  // 这段代码跟上面的代码几乎是一样的
  // 但是这里为什么没有指向 window 呢？
  // 按你上面说的不是 window 调用的方法吗？
  // 大家先停下来打个 debugger 思考一下为什么
  // 想不明白没关系我们带着疑问来看下段代码

  var obj = {
    a: 1,
    b: {
      a: 2,
      fn: function () {
        console.log(this.a) // 2
      },
    },
  }

  obj.b.fn()

  // 通过 bind、apply、call 手动修改 fn函数中 this为 obj
  obj.b.fn.call(obj, '')

  // 这里执行的时候同样是对象 obj 通过点语法进行的执行
  // 但是 this 同样没有指向 window，这是为什么呢？

  // 好，我们有几种情况需要记住：

  // 1.如果一个函数中有 this
  // 但是它没有被上一级的对象所调用
  // 那么 this 就会指向 window（非严格模式下）

  // 2.如果一个函数中有this
  // 这个函数又被上一级的对象所调用
  // 那么 this 就会指向上一级的对象

  // 3.如果一个函数中有 this
  // 这个函数中包含多个对象
  // 尽管这个函数是被最外层的对象所调用
  // this 却会指向它的上一级对象

  var obj = {
    a: 1,
    b: {
      // a:2,
      fn: function () {
        console.log(this.a) // undefined
      },
    },
  }

  // fn 函数实际是 b 调用的，b 中没有 a 属性
  obj.b.fn()

  // 我们可以看到，对象 b 中没有属性 a，这个 this 指向
  // 的也是对象b，因为this只会指向它的上一级对象
  // 不管这个对象中有没有this要的东西

  // 我们再来看一种情况

  var obj = {
    a: 1,
    b: {
      a: 2,
      fn: function () {
        console.log(this.a) // undefined
        console.log(this) // window
      },
    },
  }
  var demo = obj.b.fn
  demo()

  // 在上面的代码中，this 指向的是window
  // 你们可能会觉得很奇怪
  // 其实是这样的，有一句话很关键，再次敲黑板📌📌

  // this 永远指向的都是最后调用它的对象
  // 也就是看它执行的时候是谁调用的

  // 上面的例子中虽然函数 fn 是被对象 b 所引用了
  // 但是在将 fn 赋值给变量 demo 的时候并没有执行
  // 所以最终 this 指向的是 window
  ```

- 栗子 4：bind 和 apply 和 call 基本使用

  ```js
  function returnThis() {
    return this
  }
  var user = { name: 'github' }

  returnThis() // window 等同于 window.returnThis() 所以是 window

  returnThis.call(user) // github
  returnThis.apply(user) // github
  // returnThis.bind(user)() // github

  // 这里就是Object.prototype.call
  // 和Object.prototype.apply方法
  // 他们可以通过参数来指定 this
  ```

- 栗子 5：再次使用 bind 、 apply、call

  ```js
  function returnThis() {
    return this
  }

  var user1 = { name: 'github' }
  var user1returnThis = returnThis.bind(user1)
  user1returnThis() // github

  var user2 = { name: 'gitee' }
  user1returnThis.call(user2) // github

  // Object.prototype.bind 通过一个新函数来提供了永久的绑定
  // 而且不会被 call 和 apply 修改新的指向
  ```

- 栗子 6：构造函数

  ```js
  function Fn() {
    this.user = 'github'
  }
  var demo = new Fn()
  console.log(demo.user) // github

  // 这里 new 关键字改变了 this 的指向
  // new 关键字创建了一个对象实例
  // 所以可以通过对象 demo 点语法点出函数 Fn 里面的 user
  // 这个 this 指向对象 demo

  // 注意：这里 new 会覆盖 bind 的绑定
  function Cat() {
    console.log(this)
  }

  Cat() // window ，为普通函数时 this 指向 window
  new Cat() // Cat{} 为构造函数时，指向 new 实例对象

  var user1 = { name: 'github' }
  Cat.call(user1) // {name: "github"}

  var user2 = Cat.bind(user1)
  user2() // github
  new user2() // Cat()

  // new > bind > apply = call > object > 普通函数
  ```

- 栗子 7：this 和 return 结合

  ```js
  // 当 this 遇上 return 时
  function fn() {
    this.user = 'github'
    return {}
  }
  var a = new fn() // {}
  console.log(a.user) // undefined

  function fn() {
    this.user = 'github'
    return function () {}
  }
  var a = new fn()
  console.log(a.user) // undefined

  function fn() {
    this.user = 'github'
    return 1
  }
  var a = new fn()
  console.log(a.user) // github

  function fn() {
    this.user = 'github'
    return undefined
  }
  var a = new fn()
  console.log(a.user) // github

  // 总结：如果返回值是一个对象
  // 那么 this 指向就是返回的对象
  // 如果返回值不是一个对象
  // 那么 this 还是指向函数的实例

  // null比较特殊，虽然它是对象
  // 但是这里 this 还是指向那个函数的实例

  function fn() {
    this.user = 'github'
    return null
  }
  var a = new fn()
  console.log(a.user) // github
  ```

- 栗子 8：es6 中 this

  ```js
  // 最后我们介绍一种在 ES6 中的箭头函数
  // 这个箭头函数中的 this 在代码运行前就已经被确定了下来
  // 谁也不能把它覆盖

  // 这样是为了方便让回调函数中 this 使用当前的作用域
  // 让 this 指针更加的清晰
  // 所以对于箭头函数中的 this 指向
  // 我们只要看它创建的位置即可

  function callback(qdx) {
    qdx()
  }
  callback(() => {
    console.log(this) // window
  })

  var user = {
    name: '前端食堂',
    callback: callback, // 这个函数的创建位置其实是在上面 callback 定义
    callback1() {
      callback(() => {
        console.log(this)
      })
    },
  }
  user.callback(() => {
    // 箭头函数的 this 在上层寻找
    console.log(this) //  window
  })
  user.callback1(() => {
    console.log(this) // user
  })
  ```

## this 取值

- 构造函数中

  ```js
  function Person() {
    // 函数中的 this 默认指向window
    // 但是如果函数被 new 过(当做构造函数)，this 指的就是 new 出来的实例对象
    this.a = 100
  }
  // 当函数作为构造函数用，那么其中的 this 就代表它即将 new 出来的实例对象。
  var p = new Person()
  console.log(p.a) // 100
  ```

- 函数作为对象的一个属性

  ```js
  var tools = {
    a:200
    b:function(){
      // console.log(this)
      console.log(this.a)
    }
  }
  // 如果函数作为对象的一个属性时，并且作为对象的一个属性被调用时，函数中的 this 指向该对象。
  tools.b() // 200

  // 但是
  var ss = obj.b
  // 这时的 this 就是 window
  ss() // undefined
  ```

- 函数用 call 或者 apply 调用

  ```js
  var fun = function (aa) {
    this.a = 100
    console.log(aa)
    console.log(this.b)
  }
  var obj = {
    b: 1001,
  }

  fun.apply(obj, [11]) // 11 1001
  fun.call(obj, 12) // 12 1001
  // fun 函数中的 this 被 apply 或 call 改写为 obj ，绑定 this 且直接调用

  fun.bind(obj, 13)() // 13 1001
  // 单纯的绑定 this，需要单独调用
  ```

- 在全局环境下

  this 永远是 window，普通函数在调用时，函数中的 this 也是 window
