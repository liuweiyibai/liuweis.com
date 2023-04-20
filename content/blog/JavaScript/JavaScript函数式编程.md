---
title: 函数式编程
date: 2018-12-30 20:53:58
category:
  - 函数式编程
  - JavaScript
---

什么是纯函数：纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

数组 slice 和 splice 纯函数和不纯函数，slice 会修改原数组，所以每次执行 slice 返回值都得会不同，splice 同样的参数总是会返回相同的结果。

什么是柯里化（curry）？curry 的概念很简单，只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

柯里化是函数式编程的工具，他能实现预加载函数、分步取值、避免重复传参、锁定函数运行环境等等功能。

函数组合？compose 函数，通过函数组合我们可以，一次性的合并多个处理函数，并且可以方便的改变函数的执行顺序。

声明式和命令式编程。

```js
// 比如我们使用一个命令式编程，编写登录，需要按照逻辑过程分别调用接口
// 命令式
var authenticate = function (form) {
  var user = toUser(form)
  return logIn(user)
}

// 声明式，但是使用声明式编程，可以通过组合函数来实现效果
// 用户验证就是 toUser 和 logIn 两种行为的组合
var authenticate = compose(logIn, toUser)
```

函数式编程，数据类型

通过管道把数据在一系列纯函数间传递，是书写函数式程序的方式。

了解 **JIT 优化相关，即时编译。**

什么是纯函数：纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

数组 slice 和 splice 纯函数和不纯函数

什么是柯里化（curry）？curry 的概念很简单，只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

柯里化是函数式编程的工具，他能实现预加载函数、分步取值、避免重复传参、锁定函数运行环境等等功能。

函数组合？compose 函数，通过函数组合我们可以，一次性的合并多个处理函数，并且可以方便的改变函数的执行顺序。两个函数组合之后返回了一个新函数是完全讲得通的：

[参考地址](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch6.html)

[函数式编程](https://coolshell.cn/articles/10822.html)

[函数式编程](https://zh.wikipedia.org/wiki/函数式编程)在维基百科中的定义是一种编程范式，它将电脑运算视为数学上的函数计算，并且避免使用程序状态以及易变对象。

JavaScript 作为一种典型的多范式编程语言，这两年随着 React 的火热，函数式编程的概念也开始流行起来，RxJS、cycle.js、lodash.js、underscore.js 等多种开源库都使用了函数式的特性。

我在阅读 《函数式编程指北》这本书时，对书中出现的一些连串的函数嵌套调用有点摸不到头脑，但是反复看了几次，似乎看出端倪来，所以下面总结一些函数式编程的知识和概念。

## 常见的编程范式

- 面向对象编程：基于类、对象与方法的设计模式，拥有三个基础概念: 封装性、继承性、多态性
- 命令式编程(过程化编程)：更关心解决问题的步骤，一步步以语言的形式告诉计算机做什么
- 事件驱动编程：事件订阅与触发，被广泛用于 GUI 的编程设计中
- 函数式编程：函数是第一等公民，强调将计算过程分解成可复用的函数

## 函数式编程的理念

- 纯函数：是函数式编程的基础
  - 优势
    - 完全独立，与外部解耦
    - 高度可复用
    - 可测试性
  - 条件
    - 不修改参数
    - 引用透明
    - 无副作用
- 函数复合：将多个函数进行组合后调用
  - 扁平化嵌套：避免嵌套地狱 `f(g(k(x)))` 变为 `xxx(f, g, k)(x)`
  - 结果传递：`const pipe = (...fs) => p => fs.reduce((v, f) => f(v), p)`
- 数据不可变性：这是一种数据理念，也是函数式编程中的核心理念之一
  - 核心：一个对象再被创建后便不会再被修改。当需要改变值时，是返回一个全新的对象，而不是直接在原对象上修改；
  - 目的：保证数据的稳定性，有效提高可控性与稳定性
  - `immutable.js`的`trie`数据结构：
    - 结构共享：可以共用不可变对象的内存引用地址，减少内存占用，提高数据操作性能；

## 高阶函数

以函数为参数，返回一个新的增强函数。

- 隔离抽象
- 函数组合
- 函数增强

## 函数式编程的好处

- 复用性强
- 无副作用
- 可缓存
- 可移植性
- 可测试性

## 纯函数

纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。

在 JavaScript 中，最典型的莫过于数组的 slice 和 splice 方法。

```js
const arr = [1, 2, 3, 4, 5]

// slice 是一个纯函数，相同输入总是会返回相同的输出
arr.slice(0, 3) // => [1,2,3]

arr.slice(0, 3) // => [1,2,3]

arr.slice(0, 3) // => [1,2,3]

// splice 是不纯的，每次输入都会返回不同的输出，所以不符合纯函数的定义
arr.splice(0, 3) //=> [1,2,3]

arr.splice(0, 3) //=> [4,5]

arr.splice(0, 3) //=> []
```

**什么是可观察的副作用？**

一个可以被观察的副作用是在函数内部与其外部的任意交互。这可能是在函数内修改外部的变量，或者在函数里调用另外一个函数等。

函数的副作用到底是什么，只要是跟函数外部环境发生的交互就都是副作用，比如函数内部使用了一个外部定义的变量。

> 注: 如果纯函数调用纯函数，则不产生副作用依旧是纯函数。

副作包括但不限于：

- 进行一个 HTTP 请求
- Mutating data
- 输出数据到屏幕或者控制台
- DOM 查询/操作
- Math.random()
- 获取的当前时间

**纯函数的好处？**

纯函数相对于非纯函数来说，在可缓存性、可移植性、可测试性以及并行计算方面都有着巨大的优势。

比如缓存性：

```js
import { memoize } from 'lodash-es'
var squareNumber = memoize(function (x) {
  return x * x
})
squareNumber(4) //=> 16
squareNumber(4) //=> 16 // 从缓存中读取输入值为 4 的结果

// 非纯函数，计算结果依赖外部变量
var minimum = 21
var checkAge = function (age) {
  return age >= minimum
}

// 修改上函数为纯函数，使它不依赖外部状态
// 但是这也限制了函数的扩展性，将变量硬编码在函数内部。
var checkAge = function (age) {
  var minimum = 21
  return age >= minimum
}
```

## 函数柯里化

函数柯里化概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。只需要给函数一个参数（局部调用），就能得到一个新的函数。可以大量减少样板代码的出现。

柯里化是一种“预加载”函数的方法，通过传递较少的参数，得到一个已经记住了这些参数的新函数，某种意义上讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法。

高阶函数的定义，参数或返回值为函数的函数。

比如，我们有一个简单的加法函数，我们将这个加法函数通过柯里化改写一下：

```js
var add = (x, y) => x + y
var add2 = function (x) {
  return function (y) {
    return x + y
  }
}
var add200 = add2(200)
add200(10) // 210
```

可以改写一下上面的 checkAge 函数：

```js
var checkAge = function (min) {
  return function (age) {
    return age > min
  }
}

var checkAge20 = checkAge(20)
checkAge20(18) // false
```

比如常见的正则校验输入值的场景：

```js
import { curry } from 'lodash-es'

// 首先柯里化两个纯函数
var match = curry((reg, str) => str.match(reg))
var filter = curry((f, arr) => arr.filter(f))

// 判断字符串里有没有空格
var haveSpace = match(/\s+/g)

haveSpace('ffffffff') //=>null

haveSpace('a b') //=>[" "]

filter(haveSpace, ['abcdefg', 'Hello World']) //=>["Hello world"]
```

## 组合函数

使用过 Redux 的话应该都使用过 compose，其作用是增强 store，给 store 增加属性或者是方法。

在实际开发中，比如我们要操作一个字符串：

```js
// 将字符串转为大写
var toUpperCase = function (x) {
  return x.toUpperCase()
}
// 给字符串后面增加 ！
var exclaim = function (x) {
  return x + '!'
}

// 定义通用的 compose 组合函数
var compose = (...args) => (x) =>
  args.reduceRight((value, item) => item(value), x)

// 调用顺序，从右到左
var shout = compose(exclaim, toUpperCase)

shout('send in the clowns')
//=> "SEND IN THE CLOWNS!"
```

## 声明式与命令式代码

命令式代码的意思就是，我们通过编写一条又一条指令去让计算机执行一些动作，这其中一般都会涉及到很多繁杂的细节。

而声明式就要优雅很多了，我们通过写表达式的方式来声明我们想干什么，而不是通过一步一步的指示。

## 参考地址

[函数式编程指北](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html)

[站酷-函数式编程](https://coolshell.cn/articles/10822.html)
