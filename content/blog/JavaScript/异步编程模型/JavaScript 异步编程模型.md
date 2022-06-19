---
title: JavaScript 异步编程模型
date: 2021-10-04 17:13:57
category:
  - JavaScript
---

JavaScript 语言的执行环境是"单线程"（single thread）。

所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段 JavaScript 代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决这个问题，JavaScript 语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。

"同步模式"就是上一段的模式，后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的；"异步模式"则完全不同，每一个任务有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的。

在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是 Ajax 操作。在服务器端，"异步模式"甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有 http 请求， 服务器内存占用会增大，性能会急剧下降，很快就会失去响应。

## 发展历程

异步最早的解决方案是回调函数，如 ajax、事件的回调、setInterval/setTimeout 中的回调。但是回调函数有回调地狱的问题;

为了解决回调地狱的问题，社区提出了 Promise 解决方案，ES6 将其写进了语言标准。Promise 一定程度上解决了回调地狱的问题，但是 Promise 也存在一些问题，如错误不能被 try catch，而且使用 Promise 的链式调用，其实并没有从根本上解决回调地狱的问题，只是换了一种写法。

ES6 中引入 Generator 函数，Generator 是一种异步编程解决方案，Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权，Generator 函数可以看出是异步任务的容器，需要暂停的地方，都用 yield 语句注明。但是 Generator 使用起来较为复杂。

ES7 又提出了新的异步解决方案: `async/await`，`async` 是 `Generator` 函数的语法糖，`async/await` 使得异步代码看起来像同步代码，异步编程发展的目标就是让异步逻辑的代码看起来像同步执行一样。

```js
// 回调
a(function () {
  b(function () {
    c(function () {
      d()
    })
  })
})
```

进化为

```js
;(async function () {
  await a()
  await b()
  await c()
  await d()
})()
```

## 协程？

- 进程和线程

  众所周知，进程和线程都是一个时间段的描述，是 CPU 工作时间段的描述，不过是颗粒大小不同，进程是 CPU 资源分配的最小单位，线程是 CPU 调度的最小单位。

  其实协程（微线程，纤程，Coroutine）的概念很早就提出来了，可以认为是比线程更小的执行单元，但直到最近几年才在某些语言中得到广泛应用。

- 协程

  子程序，或者称为函数，在所有语言中都是层级调用的，比如 A 调用 B，B 在执行过程中又调用 C，C 执行完毕返回，B 执行完毕返回，最后是 A 执行完毕，显然子程序调用是通过栈实现的，一个线程就是执行一个子程序，子程序调用总是一个入口，一次返回，调用顺序是明确的；而协程的调用和子程序不同，协程看上去也是子程序，但执行过程中，在子程序内部可中断，然后转而执行别的子程序，在适当的时候再返回来接着执行。

下面总结一下 JavaScript 常用的异步处理方式。

### 1.回调函数

回调函数是异步操作最基本的方法。

```js
ajax(url, () => {
  // 处理逻辑
})
```

回调函数有一个致命的弱点，就是容易写出回调地狱（Callback hell）。假设多个请求存在依赖性，你可能就会写出如下代码：

```js
ajax(url, () => {
  // 处理逻辑
  ajax(url1, () => {
    // 处理逻辑
    ajax(url2, () => {
      // 处理逻辑
    })
  })
})
```

回调函数的优点是简单、容易理解和实现，缺点是不利于代码的阅读和维护，各个部分之间高度耦合，使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），而且每个任务只能指定一个回调函数。此外它不能使用 try catch 捕获错误，不能直接 return。

### 2.事件监听

这种方式采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

下面是两个函数 f1 和 f2，编程的意图是 f2 必须等到 f1 执行完成，才能执行。首先，为 f1 绑定一个事件（这里采用的 jQuery 的写法）

```js
// 监听 done 事件
f1.on("done", f2)
```

上面这行代码的意思是，当 f1 发生 done 事件，就执行 f2。然后，对 f1 进行改写：

```js
function f1() {
  setTimeout(function () {
    // ...
    f1.trigger("done")
  }, 1000)
}
```

上面代码中，`f1.trigger('done')` 表示，执行完成后，立即触发 done 事件，从而开始执行 f2。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"去耦合"，有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。阅读代码的时候，很难看出主流程。

### 3.发布/订阅

我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"发布/订阅模式"（publish-subscribe pattern），又称"观察者模式"（observer pattern）。

这个模式有多种实现，下面采用的是 Ben Alman 的 Tiny Pub/Sub，这是 jQuery 的一个插件。

首先，f2 向"信号中心"jQuery 订阅"done"信号。

```js
jQuery.subscribe("done", f2)
```

然后，f1 进行如下改写：

```js
function f1() {
  setTimeout(function () {
    // f1的任务代码
    jQuery.publish("done")
  }, 1000)
}
```

`jQuery.publish("done")` 的意思是，f1 执行完成后，向"信号中心" jQuery 发布 "done" 信号，从而引发 f2 的执行。

此外，f2 完成执行后，也可以取消订阅（unsubscribe）。

`jQuery.unsubscribe("done", f2);`

这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

### 4.Promise 对象

Promises 对象是 CommonJS 工作组提出的一种规范，目的是为异步编程提供统一接口。

简单说，它的思想是，每一个异步任务返回一个 Promise 对象，该对象有一个 then 方法，允许指定回调函数。

Promise 有一套规范，我们可以通过规范去自己实现一个 Promise 对象，所以这里我单独写了一篇关于 Promise 的文章。

[异步编程模型 Promise](http://www.baidu.com)

### 5.生成器

Generator 函数是 ES6 提供的一种异步编程解决方案，整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。

1. 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
2. Generator 函数除了状态机，还是一个遍历器对象生成函数。
3. 可暂停函数, yield 可暂停，next 方法可启动，每次返回的是 yield 后的表达式结果。
4. yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```js
function* generator() {
  let a = yield 111
  console.log(a)
  let b = yield 222
  console.log(b)
  let c = yield 333
  console.log(c)
  let d = yield 444
  console.log(d)
}
let t = generator()
// next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值
t.next(1) // 第一次调用 next 函数时，传递的参数无效
t.next(2) // 输出 2
t.next(3) // 3
t.next(4) // 4
t.next(5) // 5
```

手动迭代 Generator 函数很麻烦，实现逻辑有点绕，而实际开发一般会配合 co 库去使用。co 是一个为 Node.js 和浏览器打造的基于生成器的流程控制工具，借助于 Promise，你可以使用更加优雅的方式编写非阻塞代码。

co 最大的好处在于通过它可以把异步的流程以同步的方式书写出来，并且可以使用 try/catch。

[co 和 Generator](https://www.baidu.com)

### async/await

ES7 中引入了 async/await 概念。async 其实是一个语法糖，它的实现就是将 Generator 函数和自动执行器（co），包装在一个函数中。

async/await 的优点是代码清晰，不用像 Promise 写很多 then 链，就可以处理回调地狱的问题。并且错误可以被 try catch。

使用 async/await 有如下特点：

1. async/await 是基于 Promise 实现的，它不能用于普通的回调函数。
2. async/await 与 Promise 一样，是非阻塞的。
3. async/await 使得异步代码看起来像同步代码，这正是它的魔力所在。

一个函数如果加上 async ，那么该函数就会返回一个 Promise 对象：

```js
async function async1() {
  return "1"
}
console.log(async1()) // Promise {<resolved>: "1"}
```

async/await 可以说是异步终极解决方案了：

- async/await 函数相对于 Promise，优势体现在：

  1. 处理 then 的调用链，能够更清晰准确的写出代码
  2. 优雅地解决回调地狱问题。

  当然 async/await 函数也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低，代码没有依赖性的话，完全可以使用 Promise.all 的方式。

- async/await 函数对 Generator 函数的改进，体现在以下三点：

  1. 内置执行器。

     Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。

  2. 更广的适用性。

     co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

  3. 更好的语义。

     async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。
