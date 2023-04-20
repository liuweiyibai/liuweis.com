---
title: JavaScript 闭包浅析
date: 2017-12-16 14:18:16
category:
  - JavaScript
---

## 定义

[MDN 上对闭包的定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)，函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起构成闭包（closure）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

简单的说：闭包就是有权限访问另一个函数内部作用域的变量的函数。创建闭包的的常用方式，就是一个函数内部创建另一个函数。闭包主要涉及到 JavaScript 的几个其他的特性: 作用域链、垃圾(内存)回收机制、函数嵌套等等。

## 一些概念

1. 函数作用域

   定义在函数中的参数和变量在函数外部是不可见的

2. 块级作用域

   任何一对花括号中的语句都属于一个块，在这之中的所有变量在代码块外部都是不可访问的，我们称之为块级作用域。但是在 es6 之前，js 是没有块级作用域的，使用 var 在 for 循环中定义 a，出了 for 还是存在 a 这个变量。

   ```js
   for (var a = 0; a < 10; a++) {}
   console.log(a) // 10
   ```

3. 私有变量和静态私有变量

   私有变量包括函数的参数，局部变量和函数内部定义的其他函数。私有变量是每个实例都是独立的，互不干扰的。而静态私有变量是公用的。

4. 特权方法

   有权访问私有变量的方法称为特权方法。

5. 单例模式

   确保每一个类只能有一个实现，即使该类多次实例化返回的也是第一次实例化后的对象。该模式不仅能减少不必要的内存开销，并且可以减少全局的函数和变量冲突。

6. 构造函数模式

   ```js
   function Person(name, age) {
     this.name = name
     this.age = age
     this.sayName = function () {
       console.log(this.name)
     }
   }
   const person1 = new Person('hh', 18)
   person1.sayName() // hh
   console.log(person1)
   ```

   可以使用 constructor 或 instanceof 识别对象实例的类型，使用 new 来创建实例。缺点是：每次创建实例时，每个方法都要被创建一次。

7. 原型模式

   ```js
   function Person() {}
   Person.prototype.name = 'h'h';
   Person.prototype.age = 18;
   Person.prototype.sayName = function () {
     console.log(this.name);
   };
   const person1 = new Person();
   ```

   在创建实例时，原型方法不会被重复创建。缺点：不能初始化实例参数、所有的属性和方法都被实例共享。

## 闭包的实现

```js
// 简单的闭包
function makeSizer(size) {
  var size = size ? size : 1
  return function () {
    // size 会被缓存，保留引用
    console.log(size)
  }
}
// a 是外部函数，a 中还保留着对 size 变量的引用
var a = makeSizer()
a()
```

一般来说，函数内部可以访问函数外部的全局变量：

```js
var a = 1 //全局变量
function f1() {
  console.log(a)
}
f1() // 1
```

但是在函数的外部是访问不到内部的变量的：

```js
function f2() {
  // 此时函数f2已经开辟出一个函数作用域，所以外部是访问不到a这个变量的
  var a = 1 //局部变量
}
alert(a) // error
```

注意，在函数内部定义变量时，要加上 `var` ，否则该变量就是全局变量了:

```js
function f3() {
  a = 1 // 全局变量
}
alert(a) // 1
```

但是，有时候我们想得到函数内部的局部变量，那应该如何实现呢？这就引入了闭包的概念：

```js
function f1() {
  var n = 1
  return function () {
    alert(n)
  }
}
```

## 作用

我们知道闭包就是有权限访问另一个函数内部作用域的变量的函数，JavaScript 具有自动垃圾回收机制，函数运行完之后，其内部的变量和数据会被销毁。但是闭包就是在外部可以访问此函数内部作用域的变量，所以闭包的一个特点就是只要存在引用函数内部变量的可能，JavaScript 就需要在内存中保留这些变量。而且 JavaScript 运行时需要跟踪这个内部变量的所有外部引用，直到最后一个引用被解除（主动把外部引用赋为 null 或者页面关闭），JavaScript 的垃圾收集器才能释放相应的内存空间。

通过代码解析：

```js
function outer() {
  var a = 1
  function inner() {
    return a++
  }
  return inner
}
var abc = outer()
// outer 函数只要执行过，就有了引用函数内部变量 a 的可能；
// 当 outer 函数已经执行过了，所以其中的变量 a 会被内存释放，但是在 return 的函数中 a 再次被使用，所以会在内存中保留 a 变量
// outer 函数如果没有执行过，由于作用域的关系，看不到内部作用域，更不会被保存在内存中了

console.log(abc()) // 1
console.log(abc()) // 2

//因为 a 已经在内存中了，所以再次执行abc()的时候，是在第一次的基础上累加的

var def = outer()
console.log(def()) //1
console.log(def()) //2

// 再次把 outer() 函数赋给一个新的变量def，相当于绑定了一个新的outer实例；

// console.log(a); //ReferenceError: a is not defined
// console.log(inner); //ReferenceError: a is not defined
// 由于作用域的关系我们在外部还是无法直接访问内部作用域的变量名和函数名

abc = null
//由于闭包占用内存空间，所以要谨慎使用闭包。尽量在使用完闭包后，及时解除引用，释放内存；
```

1. 读取函数内部的变量
   就如上面闭包的例子，可以在函数外部读取函数内部的变量。

2. 将变量的值始终保存在内存中
   一般来讲，当函数执行完毕之后，函数内部的局部活动对象就会被销毁，内存中仅保存全局作用域，即 JavaScript 的内存回收机制。
   如果这个函数内部又嵌套了另一个函数,而这个函数是有可能在外部被调用到的.并且这个内部函数又使用了外部函数的某些变量的话.这种内存回收机制就会出现问题。如果在外部函数返回后,又直接调用了内部函数,那么内部函数就无法读取到他所需要的外部函数中变量的值了.所以 JavaScript 解释器在遇到函数定义的时候,会自动把函数和他可能使用的变量(包括本地变量和父级和祖先级函数的变量(自由变量))一起保存起来.也就是构建一个闭包,这些变量将不会被内存回收器所回收,只有当内部的函数不可能被调用以后(例如被删除了,或者没有了指针),才会销毁这个闭包,而没有任何一个闭包引用的变量才会被下一次内存回收启动时所回收

## 闭包应用

[参考地址](https://www.cnblogs.com/vipzhou/p/6519552.html)

- 结合定时器和 for 循环

  按顺序输出

  `1s` 之后，输出 `123`

  ```js
  // 写法 1
  for (var i = 0; i < 3; i++) {
    setTimeout(fn(i), 1000)
  }
  function fn(i) {
    return function () {
      console.log(++i) // 123
    }
  }

  // 写法 2
  for (var i = 0; i < 3; i++) {
    ;(function (index) {
      setTimeout(function () {
        console.log(++index) // 123
      }, 1000)
    })(i)
  }
  ```

- 模拟块级作用域

  我们可以使用闭包能使下面的代码按照我们预期的进行执行（每隔 1s 打印 0,1,2,3,4）。

  ```js
  // 每隔 1s 分别输出 0 1 2 3 4
  for (var i = 0; i < 5; i++) {
    ;(function (index) {
      setTimeout(function () {
        console.log(index)
      }, 1000 * index)
    })(i)
  }

  // es6 的 let
  // for 每次循环 let 都创建了新的作用域
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log(i)
    }, i * 1000)
  }
  ```

- 私有变量

  在 JavaScript 中没有私有成员的概念，所有属性都是公有的。但是有私有变量的概念，任何在函数中定义的变量，都可以认为是私有变量，因为在函数的外部不能访问这些变量。私有变量包括函数的参数，局部变量和函数内部定义的其他函数。

  ```js
  function add(a, b) {
    var sum = a + b
    return sum
  }
  ```

  在 add 函数内部，存在三个私有变量：a、b、sum。这三个变量只能在函数内部访问，在函数外部是无法访问到他们的。但是我们在函数内部创建一个闭包，闭包可以自己通过自己的作用域链就可以访问到这些变量。所以利用闭包，我们就可以创建用于访问私有变量的公有方法（特权方法）。

  ```js
  function Person(name) {
    var privateVariable = 0
    // 创建闭包
    function getName() {
      return 'somethings...'
    }
    this.publicMethod = function () {
      privateVariable++
      return getName
    }
  }

  var p = new Person('name') // 构造函数内部变量和方法只能通过实例方法来访问
  ```

- 结果缓存

  ```js
  function cached(fn) {
    var cache = Object.create(null)
    return function cachedFn(str) {
      var hit = cache[str]
      return hit || (cache[str] = fn(str))
    }
  }
  // 这个函数可以读取缓存，如果缓存中没有就存一下放到缓存中再读。闭包正是可以做到这一点，因为它不会释放外部的引用，从而函数内部的值可以得以保留。
  ```

## 闭包优缺点

- 优点

  阻止一些词法作用域的回收，保存一些有用信息，模拟一个块级作用域

- 缺点

  可以说闭包的优点也是它的缺点，因为他会保存一些信息始终在内存中。故如果出现过多的闭包会导致内存泄漏

## 注意事项

1. 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 `IE` 中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除

2. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值

> 注意这种情况，定义一个函数想要立即执行，写成如下形式是不可行的，在预解释的时候，它把它分解成两部分来对待，第一部分是 `fn` 函数，而第二部分是(),一个匿名函数，执行时会报错。如果小括号带参数，如(`2`)，虽然不会报错，会打印出来 `2`，但并不能把 `fn` 执行，也不能当成参数传递给 `fn` 函数。

```js
function fn(){
//代码区
}()
```

如果你想实现立即执行的函数，可以把要执行的函数放到一对括号里面，对于 JavaScript 来说，括弧`()`里面不能包含语句，所以在这一点上，解析器在解析 `function` 关键字的时候，会将相应的代码解析成 `function` 表达式，而不是 `function` 声明所以，只要将大括号将代码(包括函数部分和在后面加上一对大括号)全部括起来就可以了。 如下：

```js
;(function fn() {
  //代码区...
})()
```

还可以写成：闭包

```js
;(function () {
  var a = 1
  return function () {
    console.log(a)
  }
  //代码区...
})()
```

```js
function fn(n) {
  console.log(arguments) // [1]
  console.log(n) // 1
}
fn(1)
fn(2)
```
