---
title: 聊聊 JavaScript 的深浅拷贝
date: 2020-09-29 21:12:40
category:
  - JavaScript
---

当我们进行数据拷贝的时候，如果该数据是一个引用类型，并且拷贝的时候仅仅传递的是该对象的指针，那么就属于浅拷贝。由于拷贝过程中只传递了指针，并没有重新创建一个新的引用类型对象，所以二者共享同一片内存空间，即通过指针指向同一片内存空间。

## 浅拷贝

1. 对象浅拷贝

   ```js
   // 方式1 Object.assign()
   const a = { msg: { name: 'lihb' } }
   const b = Object.assign({}, a)
   a.msg.name = 'lily'
   console.log(b.msg.name) // lily
   // 但是当一旦修改对象a的msg的name属性值，克隆的b对象的msg的name属性也跟着变化了，所以属于浅拷贝。

   // 方式2 扩展运算符(...)
   const a = { msg: { name: 'lihb' } }
   const b = { ...a }
   a.msg.name = 'lily'
   console.log(b.msg.name) // lily
   // 同样的，修改对象a中的name，克隆对象b中的name值也跟着变化了。
   ```

2. 数组浅拷贝

   当数组中元素是引用数据类型数组或者对象时，单纯的切割数组合并数组或者是使用扩展运算符，都是浅拷贝行为

   ```js
   // 方式1 slice()
   const a = [{ name: 'lihb' }]
   const b = a.slice()
   a[0].name = 'lily'
   console.log(b[0].name) // lily
   // 一旦修改对象a[0]的name属性值，克隆的对象b[0]的name属性值也跟着变化，所以属于浅拷贝。

   // 方式2 concat
   const a = [{ name: 'lihb' }]
   const b = a.concat()
   a[0].name = 'lily'
   console.log(b[0].name) // lily
   // 同样的，修改对象a[0]的name属性值，克隆的对象b[0]的name属性值也跟着变化。

   // 方式3 扩展运算符
   const a = [{ name: 'lihb' }]
   const b = [...a]
   a[0].name = 'lily'
   console.log(b[0].name) // lily
   // 同样的，修改对象a[0]的name属性值，克隆的对象b[0]的name属性值也跟着变化。
   ```

## 深拷贝

如果当我们进行数据拷贝的时候，如果该数据是一个引用类型，并且拷贝的时候，传递的不是该对象的指针，而是创建一个新的与之相同的引用类型数据，那么就属于深拷贝。由于拷贝过程中重新创建了一个新的引用类型数据，所以二者拥有独立的内存空间，相互修改不会互相影响。

常见的对象和数组深拷贝方式为:

1. JSON.stringify 和 JSON.parse

   ```js
   const a = { msg: { name: 'lihb' }, arr: [1, 2, 3] }
   const b = JSON.parse(JSON.stringify(a))
   a.msg.name = 'lily'
   console.log(b.msg.name) // lihb
   a.arr.push(4)
   console.log(b.arr[4]) // undefined
   ```

   可以看到，对对象 a 进行修改后，拷贝的对象 b 中的数组和对象都没有受到影响，所以属于深拷贝。

   虽然 JSON.stringify()和 JSON.parse()能实现深拷贝，但是其并不能处理所有数据类型，当数据为函数的时候，拷贝的结果为 null；当数据为正则的时候，拷贝结果为一个空对象{}，如:

   ```js
   const a = {
     fn: () => {},
     reg: new RegExp(/123/),
   }
   const b = JSON.parse(JSON.stringify(a))
   console.log(b) // { reg: {} }
   ```

   可以看到，`JSON.stringify()` 和 `JSON.parse()` 对正则和函数深拷贝无效。

2. 自己实现深拷贝

   进行深拷贝的时候，我们主要关注的是对象类型，即在拷贝对象的时候，该对象必须创建的一个新的对象，如果对象的属性值仍然为对象，则需要进行递归拷贝。对象类型主要为，Date、RegExp、Array、Object 等。

   ```js
   function deepClone(source) {
     if (typeof source !== 'object') {
       // 非对象类型(undefined、boolean、number、string、symbol)，直接返回原值即可
       return source
     }
     if (source === null) {
       // 为null类型的时候
       return source
     }
     if (source instanceof Date) {
       // Date类型
       return new Date(source)
     }
     if (source instanceof RegExp) {
       // RegExp正则类型
       return new RegExp(source)
     }
     let result
     if (Array.isArray(source)) {
       // 数组
       result = []
       source.forEach((item) => {
         result.push(deepClone(item))
       })
       return result
     } else {
       // 为对象的时候
       result = {}
       const keys = [
         ...Object.getOwnPropertyNames(source),
         ...Object.getOwnPropertySymbols(source),
       ] // 取出对象的key以及symbol类型的key
       keys.forEach((key) => {
         let item = source[key]
         result[key] = deepClone(item)
       })
       return result
     }
   }
   let a = {
     name: 'a',
     msg: { name: 'lihb' },
     date: new Date('2020-09-17'),
     reg: new RegExp(/123/),
   }
   let b = deepClone(a)
   a.msg.name = 'lily'
   a.date = new Date('2020-08-08')
   a.reg = new RegExp(/456/)
   console.log(b)
   // { name: 'a', msg: { name: 'lihb' }, date: 2020-09-17T00:00:00.000Z, reg: /123/ }
   ```

   由于需要进行递归拷贝，所以对于非对象类型的数据直接返回原值即可。对于 Date 类型的值，则直接传入当前值 new 一个 Date 对象即可，对于 RegExp 对象的值，也是直接传入当前值 new 一个 RegExp 对象即可。对于数组类型，遍历数组的每一项并进行递归拷贝即可。对于对象，同样遍历对象的所有 key 值，同时对其值进行递归拷贝即可。对于对象还需要考虑属性值为 Symbol 的类型，因为 Symbol 类型的 key 无法直接通过 Object.keys()枚举到。

## 相互引用问题

上面的深拷贝实现看上去很完善，但是还有一种情况未考虑到，那就是对象相互引用的情况，这种情况将会导致递归无法结束。

```js
const a = { name: 'a' }
const b = { name: 'b' }
a.b = b
b.a = a // 相互引用
console.log(a) // { name: 'a', b: { name: 'b', a: [Circular] } }
```

对于上面这种情况，我们需要怎么拷贝相互引用后的 a 对象呢？
我们也是按照上面的方式进行递归拷贝:

1. 创建一个空的对象，表示对 a 对象的拷贝结果

   ```js
   const aClone = {}
   ```

2. 遍历 a 中的属性，name 和 b, 首先拷贝 name 属性和 b 属性

   ```js
   aClone.name = a.name
   ```

3. 接着拷贝 b 属性，而 b 的属性值为 b 对象，需要进行递归拷贝，同时包含 name 和 a 属性，先拷贝 name 属性

   ```js
   const bClone = {}
   bClone.name = b.name
   ```

4. 接着拷贝 a 属性，而 a 的属性值为 a 对象，我们需要将之前 a 的拷贝对象 aClone 赋值即可

   ```js
   bClone.a = aClone
   ```

5. 此时 bClone 已经拷贝完成，再将 bClone 赋值给 aClone 的 b 属性即可

   ```js
   aClone.b = bClone
   console.log(aClone) // { name: 'a', b: { name: 'b', a: [Circular] }}
   ```

其中最关键的就是第 4 步，这里就是结束递归的关键，我们是拿到了 a 的拷贝结果进行了赋值，所以我们需要记录下某个对象的拷贝结果，如果之前已经拷贝过，那么我们直接拿到拷贝结果赋值即可完成相互引用。

而 js 提供了一种 WeakMap 数据结构，其只能用对象作为 key 值进行存储，我们可以用拷贝前的对象作为 key，拷贝后的结果对象作为 value，当出现相互引用关系的时候，我们只需要从 WeakMap 对象中取出之前已经拷贝的结果对象赋值即可形成相互引用关系。

```js
function deepClone(source, map = new WeakMap()) {
  // 传入一个 WeakMap 对象用于记录拷贝前和拷贝后的映射关系
  if (typeof source !== 'object') {
    // 非对象类型(undefined、boolean、number、string、symbol)，直接返回原值即可
    return source
  }
  if (source === null) {
    // 为 null 类型的时候
    return source
  }
  if (source instanceof Date) {
    // Date 类型
    return new Date(source)
  }
  if (source instanceof RegExp) {
    // RegExp 正则类型
    return new RegExp(source)
  }
  if (map.get(source)) {
    // 如果存在相互引用，则从 map 中取出之前拷贝的结果对象并返回以便形成相互引用关系
    return map.get(source)
  }
  let result
  if (Array.isArray(source)) {
    // 数组
    result = []
    map.set(source, result) // 数组也会存在相互引用
    source.forEach((item) => {
      result.push(deepClone(item, map))
    })
    return result
  } else {
    // 为对象的时候
    result = {}
    map.set(source, result) // 保存已拷贝的对象
    const keys = [
      ...Object.getOwnPropertyNames(source),
      ...Object.getOwnPropertySymbols(source),
    ] // 取出对象的 key 以及 symbol 类型的 key
    keys.forEach((key) => {
      let item = source[key]
      result[key] = deepClone(item, map)
    })
    return result
  }
}
```

至此已经实现了一个相对比较完善的深拷贝。

## WeakMap

WeakMap 有一个特点就是属性值只能是对象，而 Map 的属性值则无限制，可以是任何类型。从其名字可以看出，WeakMap 是一种弱引用，所以不会造成内存泄漏。接下来我们就是要弄清楚为什么是弱引用。

我们首先看看 WeakMap 的 polyfill 实现，如下:

```js
var WeakMap = function () {
  this.name = '**wm**' + uuid()
}
WeakMap.prototype = {
  set: function (key, value) {
    // 这里的 key 是一个对象，并且是局部变量
    Object.defineProperty(key, this.name, {
      // 给传入的对象上添加一个 this.name 属性，值为要保存的结果
      value: [key, value],
    })
    return this
  },
  get: function (key) {
    var entry = key[this.name]
    return entry && (entry[0] === key ? entry[1] : undefined)
  },
}
```

从 WeakMap 的实现上我们可以看到，WeakMap 并没有直接引用传入的对象，当我们调用 WeakMap 对象 set()方法的时候，会传入一个对象，然后在传入的对象上添加一个 this.name 属性，值为一个数组，第一项为传入的对象，第二项为设置的值，当 set 方法调用结束后，局部变量 key 被释放，所以 WeakMap 并没有直接引用传入的对象，即弱引用。

其执行过程等价于下面的方法调用:

```js
var obj = { name: 'lihb' }

function set(key, value) {
  var k = 'this.name' // 这里模拟 this.name 的值作为 key
  key[k] = [key, value]
}
set(obj, 'test') // 这里模拟 WeakMap 的 set()方法
obj = null // obj 将会被垃圾回收器回收
```

所以 set 的作用就是给传入的对象设置了一个属性而已，不存在被谁引用的关系。

<!-- https://juejin.cn/post/6896637675492065287#heading-1 -->
