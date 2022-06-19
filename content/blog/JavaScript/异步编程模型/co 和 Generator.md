---
title: co 和 Generator
date: 2021-12-04 10:13:57
category:
  - JavaScript
---

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

Generator 和 Promise，当 yield 后面跟一个 Promise 该如何使用

```js
let step = 0
// 首先准备一个异步函数
const sleep = minute =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log(`${minute} 过后执行到${step}步骤`)
      step++
      resolve()
    }, minute)
  )

function* gen(stage0) {
  console.log(stage0)
  let stage1 = yield sleep(1000)
  console.log("stage1", stage1)
  let stage2 = yield sleep(2000)
  console.log("stage2", stage2)
  let stage3 = yield sleep(3000)
  console.log("stage3", stage3)
  return "all Done!!"
}

function run(generator, v) {
  let { value, done } = generator.next(v)
  if (!done) {
    value.then(res => {
      run(generator, res)
    })
  } else {
    console.log(value)
  }
}

run(gen("start"))
```

上面代码我们可以看到，要想执行完一个 `Generator` 需要递归调用或者通过循环调用，通过判断生成器的 `done` 属性是否完成，来作为结束条件。

手动迭代 Generator 函数很麻烦，实现逻辑有点绕，而实际开发一般会配合 co 库去使用。co 是一个为 Node.js 和浏览器打造的基于生成器的流程控制工具，借助于 Promise，你可以使用更加优雅的方式编写非阻塞代码。

## co

[co](https://github.com/tj/co) 最大的好处在于通过它可以把异步的流程以同步的方式书写出来，并且可以使用 `try/catch`。所以下面大改介绍一下 [co](https://github.com/tj/co) 的代码实现。

co 函数和 [`async await`](/JavaScript/异步编程模型/JavaScript%20异步编程模型/#asyncawait) 很像，其实就像是个 `Generator` 语法糖，不需要我们主动去 yield/next 下一步，自动执行。

### 主函数

co 函数入参为 Generator 函数，返回结果为 Promise

```js
function co(gen) {
  // 获取上下文this
  var ctx = this
  // 获取传入函数后所有参数
  var args = slice.call(arguments, 1)
  // 返回 promise
  return new Promise(function (resolve, reject) {
    // 如果gen是函数，先执行generator函数
    if (typeof gen === "function") gen = gen.apply(ctx, args)
    // 如果gen有值 或 gen非迭代器对象 直接resolve
    if (!gen || typeof gen.next !== "function") return resolve(gen)
    /**
     * 到这里的时候 gen结构为
     * '{ value: xxx, next: function() {},done: true or false}'
     */

    // 这里 先去走第一个yield，因为还没走到gen.next（） 所以不需要传参数
    onFulfilled()

    function onFulfilled(res) {
      var ret
      try {
        // 调用gen.next传参数res，得到yield的结果
        ret = gen.next(res)
      } catch (e) {
        // 出错直接返回
        return reject(e)
      }
      next(ret) // 接受gen.next返回结果 去走判断逻辑
      return null
    }
    // gen 执行throw方法，出错直接 reject
    function onRejected(err) {
      var ret
      try {
        ret = gen.throw(err)
      } catch (e) {
        return reject(e)
      }
      next(ret)
    }
    // 这里return 只是为了结束函数执行 return结果没有实际意义、切勿混淆
    function next(ret) {
      // 如果走完了，此时generator执行完毕 返回 resolve
      if (ret.done) return resolve(ret.value)
      // done为false，说明没走完。 把ret.value转成promise
      var value = toPromise.call(ctx, ret.value)
      // 如果转换完结果为promise，那么继续链式onFulfilled, onRejected 操作
      // 这里就形成了next递归
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
      // 如果转换的结果不是promise 那么抛出错误
      return onRejected(
        new TypeError(
          "You may only yield a function, promise, generator, array, or object, " +
            'but the following object was passed: "' +
            String(ret.value) +
            '"'
        )
      )
    }
  })
}
```

### 工具函数

- `toPromise`

  ```js
  function toPromise(obj) {
    // 假值 直接返回
    if (!obj) return obj
    // 为promise 直接返回
    if (isPromise(obj)) return obj
    // 是generator生成器函数 或 generator迭代器对象 调用co返回
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj)
    // 为函数 转换为promise返回
    if ("function" == typeof obj) return thunkToPromise.call(this, obj)
    // 为数组转化promise返回
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj)
    // 为对象转化promise返回
    if (isObject(obj)) return objectToPromise.call(this, obj)
    // 返回
    return obj
  }
  ```

- `thunkPromise`

  用 thunk 方式去将函数转化为 promise。 [Thunk 函数的含义和用法](//www.ruanyifeng.com/blog/2015/05/thunk.html)

  ```js
  function thunkToPromise(fn) {
    var ctx = this
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err)
        if (arguments.length > 2) res = slice.call(arguments, 1)
        resolve(res)
      })
    })
  }
  ```

- `arrayToPromise`

  将数组的每一项转化为 promise 通过调用 Promise.all 返回。

  ```js
  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this))
  }
  ```

- `objectToPromise`

  将对象的每一项转化为 promise 通过调用 Promise.all 返回。

  ```js
  function objectToPromise(obj) {
    // 初始化 result
    var results = new obj.constructor()
    // 便利所有键名
    var keys = Object.keys(obj)
    // promise组成的数组
    var promises = []
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      // 将每一项转化为promise
      var promise = toPromise.call(this, obj[key])
      // 如果为promise 则调用defer
      if (promise && isPromise(promise)) defer(promise, key)
      else results[key] = obj[key]
    }
    // 最后全部一起返回
    return Promise.all(promises).then(function () {
      return results
    })
    // 将promise resolve结果塞到数组里
    function defer(promise, key) {
      // 先赋值为undefined
      results[key] = undefined
      // 塞到promises数组里，并且把promise resolve的结果存到result里
      promises.push(
        promise.then(function (res) {
          results[key] = res
        })
      )
    }
  }
  ```

- `isPromise`
- `isGenerator`
- `isGeneratorFunction`
- `isObject`

  ```js
  // 判断是否为promise
  function isPromise(obj) {
    return "function" == typeof obj.then
  }
  // 判断是否为generator迭代器对象
  function isGenerator(obj) {
    return "function" == typeof obj.next && "function" == typeof obj.throw
  }
  // 判断是否为generator生成器函数
  function isGeneratorFunction(obj) {
    var constructor = obj.constructor
    if (!constructor) return false
    if (
      "GeneratorFunction" === constructor.name ||
      "GeneratorFunction" === constructor.displayName
    )
      return true
    return isGenerator(constructor.prototype)
  }
  // 判断是否为对象
  function isObject(val) {
    return Object == val.constructor
  }
  ```

- `co.wrap` 函数

  将 Generator 函数转换成 promise 函数。可重复使用，类似于缓存函数功能。
  借助于高阶函数的特性，返回一个新函数 createPromise,然后传给它的参数都会被导入到 Generator 函数中。

  ```js
  co.wrap = function (fn) {
    createPromise.__generatorFunction__ = fn
    return createPromise
    function createPromise() {
      return co.call(this, fn.apply(this, arguments))
    }
  }

  // 例子🌰
  // 查中文名1
  co(function* () {
    const chineseName = yield searchChineseName("tom")
    return chineseName
  })
  // 查中文名2
  co(function* () {
    const chineseName = yield searchChineseName("jarry")
    return chineseName
  })
  // 无法复用，通过co.wrap实现重复利用
  const getChineseName = co.wrap(function* (name) {
    const filename = yield searchChineseName(name)
    return filename
  })
  getChineseName("tom").then(res => {})
  getChineseName("jarry").then(res => {})
  ```

- co 函数导出方式

  ```js
  module.exports = co["default"] = co.co = co
  ```

  co 函数多种的方式的导出，那么也就有多种引入方式了。

  ```js
  const co = require('co')
  require('co').co
  import co from 'co'
  import * as co from 'co'
  import { co } form 'co'
  ```

## async await 简单实现

由此可见，async await 也不过也是一个 generator 语法糖，就是像 co 函数一样，如果上面都看懂了的话，下面的代码也不就不难理解了。

```js
function asyncToGenerator(generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        const { value, done } = generatorResult
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(
            val => step("next", val),
            err => step("throw", err)
          )
        }
      }
      step("next")
    })
  }
}
```
