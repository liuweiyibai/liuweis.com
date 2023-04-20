---
title: 深入理解 JavaScript 函数
date: 2019-02-06 17:27:06
category:
  - JavaScript
  - ECMAScript6
---

把一段需要重复使用的代码, 用 `function` 语法包起来, 方便重复调用, 分块和简化代码. 复杂一点的, 也会加入封装、抽象、分类等思想. 函数可以作为值赋给一个变量; 作为参数传递给另一个函数; 作为另一个函数的返回值

## 定义函数的方式

1. 函数声明

   ```js
   a() // 'aaa'
   function a() {
     console.log('aaa')
   }
   // 使用函数声明定义的函数可以被提升, 也就是在声明前可以访问. js 预解析
   // 过程是: 代码执行前先读取函数声明, 这意味着可以把函数声明放在调用它的语句之后
   ```

2. 函数表达式

   ```js
   console.log(a) // undefined
   var a = function () {
     console.log('aaaa')
   } // 把一个匿名函数赋值给a

   var b = () => console.log('bbbb')

   // 这种形式看起来好像是常规的变量赋值语句, 但是 [函数表达式] 和 [函数声明] 的区别在于, 函数表达式在使用前必须先赋值. 所以上面 a 会是 undefined

   // 造成这种现象是因为解析器在向执行环境中加载数据时, 解析器会率先读取函数声明, 并使其在执行任何代码前可用; 至于函数表达式, 则必须等到解析器执行到它的所在的的代码行, 才会真正的被解析. 函数表达式中, 创建的函数叫做匿名函数, 因为 function 关键字后面没有标识符
   ```

   ps：箭头函数和普通函数的区别：[js 箭头函数和普通函数的区别](https://blog.csdn.net/qq_40713392/article/details/106319971)

   1. `this`（执行上下文）指向
   2. 箭头函数不能作为构造函数
   3. 箭头函数没有 `arguments` 对象
   4. 箭头函数隐式 `return` 效果

3. 使用 `Function` 构造器声明

   ```js
   const myFunction = new Function('a', 'b', 'return a * b')
   const x = myFunction(4, 3)
   ```

4. 匿名函数

   ```js
   // 匿名函数声明
   ;(function () {
     var x = 'Hello!!'
     console.log(x) // 自动执行
   })()
   ```

5. 还有一种奇怪的声明方式

   ```js
   var a = function b() {
     console.log('1111')
     console.log(a) // 打印出本函数函数体
     console.log(b) // 打印出本函数函数体
   }
   a() // 可以调用
   b() // 报错：b is not defined
   ```

🔔🔔 [面试题](https://github.com/Wscats/articles/issues/73)

```js
get() // 11
var get = function () {
  console.log(22)
}
get() // 22
function get() {
  console.log(11)
}
get() // 22
```

上述代码可以理解为

```js
var get // undefined
get() //11 此时 get 函数声明被提升, 可以在代码的任意位置访问 get 函数（函数声明的 get 函数）
var get = function () {
  console.log(22)
}
get() // 22  代码执行到这里, get 已经被函数表达式 get 重新声明, 所以这里是函数表达式 get 的声明调用
function get() {
  console.log(11)
}
get()
// 22 因为 函数声明已经在代码解析前被解析，所以代码执行到这里这个函数声明不会被解析, 所以 get 还是函数表达式声明的 get
```

JavaScript 中 **函数声明** 和 **函数表达式** 是存在区别的, 函数声明在 JavaScript 解析时进行函数提升, 因此在同一个作用域内, 不管函数声明在哪里定义, 该函数都可以进行调用. 而函数表达式的值是在 JavaScript 运行时确定, 并且在表达式赋值完成后, 该函数才能调用

## 匿名函数

```js
s(1, 2) // undefined is not a function
var s = function (x, y) {
  console.log(x + y)
}
```

上面的函数表达式中的创建, 即创建一个 **匿名函数**, 并将匿名函数赋值给变量 s, 用 s 来进行函数的调用, 调用的方式就是在变量 s 后面加上一对括号`()`, 如果有参数传入的话就是 `s(1,2)`, 这就是匿名函数的一种调用方式。还有一种匿名函数的调用方式是: 使用()将匿名函数括起来, 然后后面再加一对小括号（包含参数列表）. 我们再看一下以下一个例子：

```js
alert(
  (function (x, y) {
    return x + y
  })(2, 3)
) //5
alert(new Function('x', 'y', 'return x+y;')(2, 3)) // 5
```

在 JavaScript 中 (es6 之前), 是没有块级作用域这种说法的, 以上代码的这种方式就是模仿了块级作用域(通常成为私有作用域), 语法如下所示:

```js
(function(){
 //这里是块级作用域
})();
// 以上代码定义并立即调用了一个匿名函数。经函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。而紧随其后的另一对圆括号会立即调用这个函数。然而要注意一点：
function(){ }();
// 上面的代码是错误的，因为 JavaScript 将 function 关键字当作一个函数声明的开始，而函数声明后面不能加圆括号，如果你不显示告诉编译器，它会默认生成一个缺少名字的function，并且抛出一个语法错误，因为function声明需要一个名字。有趣的是，即便你为上面那个错误的代码加上一个名字，他也会提示语法错误，只不过和上面的原因不一样。在一个表达式后面加上括号()，该表达式会立即执行，但是在一个语句后面加上括号()，是完全不一样的意思，他的只是分组操作符。
```

## 函数的调用方式

1. 方法调用模式

   ```js
   var obj = {
     speed: 50,
     run: function () {
       console.log(this) // this 是当前对象 obj
       console.log(this.speed)
     },
   }
   obj.run() // 对象方法调用方式，this指的是当前调用对象
   ```

2. 函数调用模式

   ```js
   var func1 = function () {
     console.log(this) // window
   }
   function func2() {
     console.log(this) // window
   }
   const func3 = () => console.log(this) // window
   func1()
   func2()
   func3()
   ```

3. 构造器调用模式

   使用函数作为构造函数来实现类的声明效果

   ```js
   function Animal(name) {
     this.name = name
     console.log(this)
   }
   Animal.prototype = {}
   new Animal('aa') // this 指当前实例
   ```

4. `apply` 调用模式

   `apply` 和 `call` 都是改变函数的 `this` 执行，并且调用该函数

   ```js
   function add(p, p1) {
     return p + p1
   }
   var arr = [10, 20]
   var sum = add.apply(null, arr)
   console.log(sum) // 30
   var sum2 = add.call(null, 10, 20)
   console.log(sum2) // 30
   ```

5. 自执行函数

   我们创建了一个匿名的函数, 并立即执行它, 由于外部无法引用它内部的变量, 因此在执行完后很快就会被释放, 关键是这种机制不会污染全局对象. 自执行函数, 即定义和调用合为一体

   ```js
   ;(function () {
     /* code */
   })() // 推荐使用这个
   ;(function () {
     /* code */
   })() // 但是这个也是可以用的
   ```

   自执行函数和闭包

   匿名函数和闭包没有直接关系. 能用匿名函数实现闭包的地方, 一定也能用命名函数实现. 闭包的本质在于 **闭**和**包**, 即把一些变量封闭起来, 使其它程序访问不到, 同时把这个封闭的东西打成包甩出来, 让大家可以直接用这个包（函数）. 立即执行函数只是函数的一种调用方式, 和闭包没有必然的联系. 闭包最典型的实现之一是对象（或类）的私有成员，如

   栗子 🌰1：

   ```js
   function MyClass() {
     // 这是一个封闭在 MyClass 中的局部变量
     var _name
     // 这是一个甩出来的 "包"
     this.getName = function () {
       return _name
     }
     // 这是另一个甩出来的 "包"
     this.setName = function (name) {
       // 这保证了 _name 的第一个字母和空格后的第一个字母是大写
       // 而且因为闭包的原因，_name 不可能被 MyCLass() 外的程序访问到
       // 也就保证了上述命名规则的无例外执行
       _name = name.replace(/^.|\s./g, function (s) {
         return s.toUpperCase()
       })
     }
   }
   var p = new MyClass()
   p.setName('james fancy')
   console.log(p.getName()) // James Fancy
   ```

   栗子 🌰2：

   ```js
   function createFunction() {
     var result = new Array()
     for (var i = 0; i < 10; i++) {
       // 闭包操作
       result[i] = function () {
         return i
       }
     }
     return result
   }
   var aa = createFunction()
   alert(aa[0]()) // 10
   alert(aa[1]()) // 10
   ```

   在这个函数中，我们直接将闭包赋值给数组。这个函数会返回一个函数数组。表面上来看，似乎每个函数都应该返回自己的索引，即位置 0 的函数返回 0，位置 1 的函数返回 1 等等以此类推。但实际上，如同上面例子，每个函数都返回了 10。因为每个函数的作用域链中都保存 createFunctions() 函数的活动对象，所以它们引用的都是同一个变量 i。当 createFunctions() 函数返回后，变量 i 的值死 10，此时每个函数都引用着保存变量 i 的同一个变量对象。所以在每个函数内部 i 的值都是 10。

   栗子 🌰3：

   ```js
   // 所以，我们可以通过如下例子，创建一个自执行函数（匿名函数）强制让闭包的行为符合预期。
   function createFunction1() {
     var result = new Array()
     for (var i = 0; i < 10; i++) {
       result[i] = (function (num) {
         return function () {
           return num
         }
       })(i)
     }

     function a() {
       var res = []
       for (var i = 0; i < 10; i++) {
         res[i] = (function (num) {
           return num
         })(i)
       }
       return res
     }
     var b = a()
     return result
   }
   var bb = createFunction1()
   alert(bb[0]()) // 0
   alert(bb[1]()) // 1
   ```

   在 `createFunctions1()` 这个函数中，我们没有直接将闭包赋值给数组，而是定义了一个匿名函数，并将立即执行该匿名函数的结果赋值给数组。对于立即执行的匿名函数来说，由于外部无法引用它内部的变量，因此在执行完后很快就会被释放。所以这里的匿名函数有一个参数 num，也就是最终的函数要返回的值。在调用每个匿名函数时，我们传入了变量 i。由于函数是按值传递的，所以会将变量 i 的当前值赋值给参数 num，而这个匿名函数内部，又创建并返回了一个返回 num 的闭包。这样一来，result 数组中的每个函数都有自己 num 的一个副本，因此就可以返回各自不同的数值了

## 函数的其它成员

1. `arguments` 实参集合

2. `caller` 函数的调用者

3. `length` 形参的个数

4. `name` 函数的名称

- 在函数中体现

  ```js
  function fn(x, y, z) {
    console.log(fn.length) // => 形参的个数，最后打印 3
    console.log(arguments) // 伪数组，实参参数集合，最后打印 Arguments(3) [10, 20, 30, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    console.log(arguments.callee === fn) // 函数本身，打印 true
    console.log(fn.caller) // 函数的调用者，打印 函数f的函数体
    console.log(fn.name) // => 函数的名字，打印 fn
  }
  const fn1 = (x, y, z) => {
    console.log(fn1.length) // => 形参的个数，打印 3
    // console.log(arguments); // 伪数组，实参参数集合，箭头函数没有 arguments
    // console.log(arguments.callee === fn); // 函数本
    // console.log(fn1.caller); // 函数的调用者，没有该属性
    console.log(fn1.name) // => 函数的名字，最后打印 fn1
  }
  function f() {
    fn(10, 20, 30)
  }
  function f2() {
    fn1(10, 20, 30)
  }
  f()
  f2()
  ```

## 闭包

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使这个函数是在当前词法作用域之外执行。闭包就是一个有权限访问其所在词法作用域中变量的一个函数。

通过代码片段理解：

```js
function foo() {
  var a = 3
  function bar() {
    console.log(a)
  }
  return bar
}
const a = foo()
a()
```

[JavaScript 闭包浅析](/blog/analysis-of-javascript-closure)

## 高阶函数

- 定义

  JavaScript 的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。高阶函数是至少满足下面一个条件的函数：

  1. 接收一个或多个函数作为参数。比如 `filter` 函数
  2. 返回一个函数。 比如 `bind` 函数

  比如：

  ```js
  function add(x, y, f) {
    return f(x) + f(y)
  }
  ```

- 数组中的高阶函数

  1. map 返回新数组
  2. reduce 返回新数组
  3. filter 返回新数组
  4. sort 返回新数组
  5. every
  6. some
  7. find
  8. findIndex
  9. forEach

- 实现高阶函数

  1. 手写数组 `filter` 方法

     ```js
     /**
      * 传入回调函数返回新的数组
      */
     function filter(callback) {
       // 判断
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return []
       }
       let result = []
       for (let i = 0; i < this.length; i++) {
         const item = this[i] // 缓存当前项
         if (callback(item, i, this)) {
           // 如果满足 callback 中的判断条件，就加入新数组中
           result.push(item)
         }
       }
       return result
     }

     Array.prototype.myFilter = filter

     // [].myFilter 时，myFilter 中 this 是调用方法的数组
     ```

  2. 手写数组 `find` 方法

     ```js
     function myFind(callback) {
       // 判断
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return null
       }

       let item = null

       for (let i = 0; i < this.length; i++) {
         let ele = this[i]
         if (callback(ele, i, this)) {
           item = ele
           break // 满足条件就终止循环
         }
       }

       return item
     }
     ```

  3. 由 2 可以实现 `findIndex` 方法

     ```js
     function myFindIndex(callback) {
       // 判断
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         // 查找不到返回-1
         return -1
       }

       let index = null

       for (let i = 0; i < this.length; i++) {
         let ele = this[i]
         if (callback(ele, i, this)) {
           index = i
           break // 满足条件就终止循环
         }
       }

       return index
     }
     ```

  4. 手写数组 `map` 方法

     ```js
     function myFindIndex(callback) {
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return []
       }

       let result = []
       for (let i = 0; i < this.length; i++) {
         let ele = this[i]
         result.push(callback(ele, i, this))
       }
       return result
     }
     ```

  5. 手写数组 `every` 和 `some` 方法

     ```js
     function mySome(callback, thisValue) {
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return false
       }

       var arr = this
       for (var i = 0; i < arr.length; i++) {
         // 如果有一个元素满足 callback 调用返回 true，就返回 true
         var result = callback.call(value, arr[i], i, arr)
         if (result) return true
       }
       return false
     }

     function mySome(callback, thisValue) {
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return false
       }

       var arr = this
       for (var i = 0; i < arr.length; i++) {
         // 有一个不满足 callback 中条件，就返回false
         var result = callback.call(value, arr[i], i, arr)
         if (!result) return false
       }
       return true
     }
     ```

  6. 手写数组 `forEach` 方法

     ```js
     function forEach(callback) {
       if (
         !Array.isArray(this) ||
         !this.length ||
         typeof callback !== 'function'
       ) {
         return []
       }

       for (var n = 0; n < this.length; n++) {
         callback.call(this[n], n)
       }
     }
     ```

  7. 手写数组 `reduce` 方法

     ```js
     function myReduce(fn, initialValue) {
       // 判断调用对象是否为数组
       if (Object.prototype.toString.call([]) !== '[object Array]') {
         throw new TypeError('not a array')
       }
       // 判断调用数组是否为空数组
       const sourceArray = this
       if (sourceArray.length === 0) {
         throw new TypeError('empty array')
       }
       // 判断传入的第一个参数是否为函数
       if (typeof fn !== 'function') {
         throw new TypeError(`${fn} is not a function`)
       }
       // 第二步
       // 回调函数参数初始化
       let accumulator, currentValue, currentIndex
       if (initialValue) {
         accumulator = initialValue
         currentIndex = 0
       } else {
         accumulator = arr[0]
         currentIndex = 1
       }
       // 第三步
       // 开始循环
       while (currentIndex < sourceArray.length) {
         if (Object.prototype.hasOwnProperty.call(sourceArray, currentIndex)) {
           currentValue = sourceArray[currentIndex]
           accumulator = fn(
             accumulator,
             currentValue,
             currentIndex,
             sourceArray
           )
         }
         currentIndex++
       }
       // 第四步
       // 返回结果
       return accumulator
     }
     Array.prototype.myReduce = myReduce
     ```

  8. 用数组 `reduce` 方法实现数组 `map` 方法

     ```js
     function myMap(fn, thisArg) {
       const result = [] // 要返回的新数组
       // 判断省略
       this.reduce((prev, curr, index, array) => {
         result[index] = fn.call(thisArg, array[index], index, array)
       }, 0)
       return result
     }
     Array.prototype.myMap = myMap
     ```

  9. 手写 `bind` 等方法

     ```js
     Function.prototype.bind2 = function (ctx) {
       if (typeof this !== 'function') {
         // 调用者必须是个函数
       }
       var _this = this // 调用者
       var outerArgs = [].prototype.slice.call(arguments, 1)
       var result = function () {
         var innerArgs = [].prototype.slice.call(arguments)
         // 如果 bind 后的函数被作为构造函数使用, 此时 this 应该是 result 的实例
         if (this instanceof result) {
           return _this.apply(this, outerArgs.concat(innerArgs))
         }

         return _this.apply(ctx, outerArgs.concat(innerArgs))
       }
       result.prototype = _this.prototype
     }
     ```

### 函数柯里化

- 定义：

  柯里化是将一个多参数的函数转换成多个单参数的函数，这个函数会返回一个函数去处理下一个参数。并且返回接受余下的参数而且返回结果的新函数。也就是把 `fn(a,b,c)` 转换为 `newFn(a)(b)(c)` 这种形象。柯里化常见的应用有：参数复用、延迟计算。

  简单的 `add` 函数

  ```js
  // 普通的add函数
  function add(x, y) {
    return x + y
  }

  // 柯里化后
  function curryingAdd(x) {
    return function (y) {
      return x + y
    }
  }

  add(1, 2) // 3
  curryingAdd(1)(2) // 3
  ```

  比如我们有个拼接接口地址的函数：

  ```js
  function getUrl(service, context, api) {
    return service + context + api
  }
  let loginUrl = getUrl('http://localhost:8080/', 'auth', '/login')
  let logoutUrl = getUrl('http://localhost:8080/', 'auth', '/logout')
  ```

- 优点

  1. 参数复用

     ```js
     // 正常正则验证字符串 reg.test(txt)
     // 函数封装后
     function check(reg, txt) {
       return reg.test(txt)
     }

     check(/\d+/g, 'test') // false
     check(/[a-z]+/g, 'test') // true

     // 柯里化后
     function curryingCheck(reg) {
       return function (txt) {
         return reg.test(txt)
       }
     }

     var hasNumber = curryingCheck(/\d+/g)
     var hasLetter = curryingCheck(/[a-z]+/g)

     hasNumber('test1') // true
     hasNumber('testtest') // false
     hasLetter('21212') // false

     // 正常来说直接调用check函数就可以了，但是如果我有很多地方都要校验是否有数字，其实就是需要将第一个参数reg进行复用，这样别的地方就能够直接调用hasNumber，hasLetter等函数，让参数能够复用，调用起来也更方便
     ```

     再比如常见的类型判断函数封装

     ```js
     // bind 返回新函数
     const toString = Function.prototype.call.bind(Object.prototype.toString)
     // 调用 toString
     toString([1, 2, 3]) // "[object Array]"
     toString('123') // "[object String]"
     toString(123) // "[object Number]"
     toString(Object(123)) // "[object Number]"
     ```

  2. 延迟计算

     ```js
     const add = (...args) => args.reduce((a, b) => a + b)

     // 柯里化函数
     function currying(func) {
       const args = [] // 用来保存，返回函数后续调用传入的参数
       return function result(...rest) {
         if (rest.length === 0) {
           return func(...args)
         } else {
           args.push(...rest)
           // 返回自身，可以达到func()()()...调用的效果
           return result
         }
       }
     }

     const sum = currying(add)
     sum(1, 2)(3) // 未真正求值，只是进行收集参数
     sum(4) // 未真正求值，进行收集参数
     sum() // 当传入参数为空时，执行计算，输出 10
     ```

  3. 动态创建函数

     ```js
     var addEvent = (function () {
       // 根据不同条件动态返回函数
       if (window.addEventListener) {
         return function (type, el, fn, capture) {
           // 关键
           el.addEventListener(type, fn, capture)
         }
       } else if (window.attachEvent) {
         return function (type, el, fn) {
           // 关键
           el.attachEvent('on' + type, fn)
         }
       }
     })()
     ```

     > 💡 使用惰性函数来解决事件绑定的问题

     ```js
     function addEvent(type, el, fn, capture = false) {
       // 重写函数
       if (window.addEventListener) {
         addEvent = function (type, el, fn, capture) {
           el.addEventListener(type, fn, capture)
         }
       } else if (window.attachEvent) {
         addEvent = function (type, el, fn) {
           el.attachEvent('on' + type, fn)
         }
       }
       // 执行函数，有循环爆栈风险
       addEvent(type, el, fn, capture)
     }
     ```

- 封装通用柯里化函数

  每次前两个参数的值都是一样，我们可以柯里化来封装下来达到参数复用：

  ```js
  function curry(fn) {
    let args = Array.prototype.slice.call(arguments, 1)
    return function () {
      let innerArgs = Array.prototype.slice.call(arguments)
      let finalArgs = args.concat(innerArgs)
      // 最后调用的是fn，参数是除了curry的arguments除了fn之外的其他参数+return函数的所有参数
      if (finalArgs.length < fn.length) {
        // fn.length为函数的参数个数
        return curry.call(this, fn, ...finalArgs)
      } else {
        return fn.apply(null, finalArgs)
      }
    }
  }
  var getAuthUrl = curry(getUrl, 'http://localhost:8080/', 'auth')
  let loginUrl = getAuthUrl('/login')
  let logoutUrl = getAuthUrl('/logout')
  ```

## 组合函数

组合函数类似于管道，多个函数的执行时，上一个函数的返回值会自动传入到第二个参数继续执行。比如我们替换一个 url 中的参数：

```js
function replaceToken(str) {
  return str.replace(/{token}/g, '123455')
}
function replaceAccount(str) {
  return str.replace(/{account}/g, 'xuriliang')
}
replaceAccount(
  replaceToken('http://localhost/api/login?token={token}&account={account}')
)
```

我们可以利用这种嵌套的写法来实现，但如果嵌套过多，代码可读性就不是很好了。当然我们也可以在一个函数里分过程实现，不过这样函数就不符合单一原则了。利用函数组合我们可以这样写：

```js
// 使用迭代方式实现
function compose() {
  var args = arguments
  var start = args.length - 1
  return function () {
    var i = start
    var result = args[start].apply(this, arguments)
    while (i--) result = args[i].call(this, result)
    return result
  }
}
// 使用 reduce 函数实现
function compose2(...funcs) {
  //没有传入函数参数，就返回一个默认函数（直接返回参数）
  if (funcs.length === 0) {
    return (arg) => arg
  }
  if (funcs.length === 1) {
    // 单元素数组时调用reduce，会直接返回该元素，不会执行callback;所以这里手动执行
    return funcs[0]()
  }
  // 依次拼凑执行函数
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 对同一个参数，使用不同函数进行处理
compose(
  replaceToken,
  replaceAccount
)('http://localhost/api/login?token={token}&account={account}')

compose2(
  replaceToken,
  replaceAccount
)('http://localhost/api/login?token={token}&account={account}')
```

组合函数使得我们可以使用一些通用的函数，组合出各种复杂运算。这也是函数编程中 `pointfree` 的概念。

### 巨人的肩膀

- [详解 JS 函数柯里化](https://www.jianshu.com/p/2975c25e4d71)

- [JS 基础——高阶函数](https://segmentfault.com/a/1190000018528025)
