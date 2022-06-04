---
title: 深入 JavaScript 数组
date: 2019-10-07 14:08:23
category:
  - JavaScript
---

数组的标准定义是：一个存储元素的线性集合（collection），元素可以通过索引来任意存
取，索引通常是数字，用来计算元素之间存储位置的偏移量。几乎所有的编程语言都有类
似的数据结构。然而 JavaScript 的数组却略有不同。

JavaScript 中的数组是一种特殊的对象，用来表示偏移量的索引是该对象的属性，索引可
能是整数。然而，这些数字索引在内部被转换为字符串类型，这是因为 JavaScript 对象中
的属性名必须是字符串。数组在 JavaScript 中只是一种特殊的对象，所以效率上不如其他
语言中的数组高。

JavaScript 中的数组，严格来说应该称作对象，是特殊的 JavaScript 对象，在内部被归类为数
组。由于 Array 在 JavaScript 中被当作对象，因此它有许多属性和方法可以在编程时使用。

## 数组基础

1. 定义

   ```js
   var numbers = [] // 创建数组
   numbers.length // 数组长度
   var numbers = new Array(1, 2, 3, 4, 5) // 使用构造函数创建
   var numbers = new Array(10) // 单个参数可以用来指定数组长度
   ```

2. 读写操作

   可以通过索引对数进行元素的读写。使用 for 循环对数组所有元素进行依次读取。

3. 查找操作

   ```js
   indexOf() // 返回索引 || -1
   find() // 返回满足条件的元素
   findIndex() // 返回满足条件的元素的索引
   ```

4. 由已有数组创建新数组

   concat() 和 splice() 方法允许通过已有数组创建新数组。concat 方法可以合并多个数组创建一个新数组，splice() 方法截取一个数组的子集创建一个新数组。

5. 为数组添加元素

   push() 和 unshift()或者通过索引直接设置值，splice() 可以在指定位置添加元素。

6. 删除元素

   pop 删除尾部元素、shift 删除首部元素，splice() 可以在指定位置删除元素。

7. 排序

   使用 sort 方法进行排序，下面会详细说到几种数组常见的排序算法。

8. 迭代器方法

   forEach、every、some、[reduce()](#reduce)

   返回新数组的迭代器方法: map、filter

9. 二维数组、多维数组

   数组降维扁平化

## 数组扁平化

实现步骤：

1. 对源数组的所有元素进行遍历

2. 判断遍历的元素是否为数组

3. 若不是数组则`concat`进之前的计算结果中，ps：初始计算结果为空数组`[]`

4. 若是数组则递归调用函数继续遍历

实现方案：

1. 方案 1

   使用 `reduce` 实现

   ```js
   function flatten(array = []) {
     return array.reduce((result, item) => {
       return result.concat(Array.isArray(item) ? flatten(item) : item)
     }, [])
   }
   let arr = [1, [2, [3, [4, 5]]]]
   let result = flatten(arr)
   console.log(result)
   // [ 1, 2, 3, 4, 5 ]
   ```

2. 方案 2

   ```js
   function flatten(array = []) {
     return array
       .toString()
       .split(',')
       .map((item) => {
         return Number(item)
       })
   }
   let arr = [1, [2, [3, [4, 5]]]]

   // 对象数组不适用此方法
   let arr2 = [{ a: 1, b: 2 }, [{ c: 2 }], [[{ d: 3 }]]]
   let result = flatten(arr)
   console.log(result)
   // [ 1, 2, 3, 4, 5 ]
   ```

3. 方案 3

   ```js
   function flatten(array) {
     return array
       .join(',')
       .split(',')
       .map((item) => {
         return Number(item)
       })
   }

   let arr = [1, [2, [3, [4, 5]]]]
   // 同样不适合对象数组降维
   let result = flatten(arr)
   console.log(result)
   // [ 1, 2, 3, 4, 5 ]
   ```

4. 方案 4

   ```js
   function flatten(array) {
     let res = []
     array.forEach((item) => {
       if (Array.isArray(item)) {
         res = res.concat(flatten(item))
       } else {
         res.push(item)
       }
     })
     return res
   }

   let arr = [1, [2, [3, [4, 5]]]]
   let result = flatten(arr)
   console.log(result)
   // [ 1, 2, 3, 4, 5 ]
   ```

5. 方案 5

   ```js
   function flatten(array) {
     while (array.some((item) => Array.isArray(item))) {
       array = [].concat(...array)
     }
     return array
   }

   let arr = [1, [2, [3, [4, 5]]]]
   let result = flatten(arr)
   console.log(result)
   // [ 1, 2, 3, 4, 5 ]
   ```

6. 其他方案

   使用 [lodash](https://www.lodashjs.com/) 工具函数解决

## reduce

reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终为一个值，是 es5 中新增的又一个数组逐项处理方法，那 reduce 方法跟 foreach、map 等数组方法又有啥区别呢。

### [语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#syntax)

```js
arr.reduce(callback( accumulator, currentValue, [, index[, array]] )[, initialValue])
```

### **参数**

- callback（一个在数组中每一项上调用的函数，接受四个函数：）
  1. previousValue（上一次调用回调函数时的返回值，或者初始值）
  2. currentValue（当前正在处理的数组元素）
  3. currentIndex（当前正在处理的数组元素下标）
  4. array（调用 reduce()方法的数组）
- initialValue（可选的初始值。作为第一次调用回调函数时传给 previousValue 的值）

### **参数图解**

![reduce参数参数](https://cdn.clearlywind.com/blog-images/images/js-reduce.jpg)

`reduce` 的精华所在是将累计器逐个作用于数组成员上，把上一次输出的值作为下一次输入的值。下面举个简单的栗子，看看 `reduce` 的计算结果。

```js
const arr = [3, 5, 1, 4, 2]
const a = arr.reduce((t, v) => t + v)
// 等同于
const b = arr.reduce((t, v) => t + v, 0)
```

![reduce 的作用动图](https://cdn.clearlywind.com/blog-images/images/js-reduce-workflow.gif)

reduce 实质上是一个累计器函数，通过用户自定义的累计器对数组的元素进行自定义累计，得出一个由累计器生成的值。另外 reduce 还有一个胞弟 reduceRight，两个方法的功能其实是一样的，只不过 reduce 是升序执行，reduceRight 是降序执行。

对空数组调用 reduce()和 reduceRight()是不会执行其回调函数的，可认为 reduce()对空数组无效

### 使用场景

- 代替 map 和 filter 完成某些效果

  ```js
  const arr = [0, 1, 2, 3]

  // 代替map：[0, 2, 4, 6]
  const a = arr.map((v) => v * 2)
  const b = arr.reduce((t, v) => [...t, v * 2], [])

  // 代替filter：[2, 3]
  const c = arr.filter((v) => v > 1)
  const d = arr.reduce((t, v) => (v > 1 ? [...t, v] : t), [])

  // 代替map和filter：[4, 6]
  const e = arr.map((v) => v * 2).filter((v) => v > 2)
  const f = arr.reduce((t, v) => (v * 2 > 2 ? [...t, v * 2] : t), [])
  ```

- 返回数组最大值

  ```js
  var max = a.reduce(function (pre, cur, inde, arr) {
    return pre > cur ? pre : cur
  })
  ```

- 数组分割

  ```js
  /**
   * @params arr 原数组
   * @params size 要分割为几个数组
   */
  function Chunk(arr = [], size = 1) {
    return arr.length
      ? arr.reduce(
          (t, v) => (
            t[t.length - 1].length === size
              ? t.push([v])
              : t[t.length - 1].push(v),
            t
          ),
          [[]]
        )
      : []
  }

  const arr = [1, 2, 3, 4, 5]
  Chunk(arr, 2) // [[1, 2], [3, 4], [5]]
  ```

- 数组过滤

  ```js
  function Difference(arr = [], oarr = []) {
    return arr.reduce((t, v) => (!oarr.includes(v) && t.push(v), t), [])
  }

  const arr1 = [1, 2, 3, 4, 5]
  const arr2 = [2, 3, 6]
  Difference(arr1, arr2) // [1, 4, 5]
  ```

- 数组填充

  ```js
  function Fill(arr = [], val = '', start = 0, end = arr.length) {
    if (start < 0 || start >= end || end > arr.length) return arr
    return [
      ...arr.slice(0, start),
      ...arr.slice(start, end).reduce((t, v) => (t.push(val || v), t), []),
      ...arr.slice(end, arr.length),
    ]
  }

  const arr = [0, 1, 2, 3, 4, 5, 6]
  Fill(arr, 'aaa', 2, 5) // [0, 1, "aaa", "aaa", "aaa", 5, 6]
  ```

- 数组扁平

  ```js
  function Flat(arr = []) {
    return arr.reduce((t, v) => t.concat(Array.isArray(v) ? Flat(v) : v), [])
  }
  const arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]]
  Flat(arr) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  ```

- 数组去重

  ```js
  function Uniq(arr = []) {
    return arr.reduce((t, v) => (t.includes(v) ? t : [...t, v]), [])
  }

  const arr = [2, 1, 0, 3, 2, 1, 2]
  Uniq(arr) // [2, 1, 0, 3]
  ```

- 数组最大最小值

  ```js
  function Max(arr = []) {
    return arr.reduce((t, v) => (t > v ? t : v))
  }

  function Min(arr = []) {
    return arr.reduce((t, v) => (t < v ? t : v))
  }

  const arr = [12, 45, 21, 65, 38, 76, 108, 43]
  Max(arr) // 108
  Min(arr) // 12
  ```

- 数组成员独立拆解

  ```js
  function Unzip(arr = []) {
    return arr.reduce(
      (t, v) => (v.forEach((w, i) => t[i].push(w)), t),
      Array.from({
        length: Math.max(...arr.map((v) => v.length)),
      }).map((v) => [])
    )
  }

  const arr = [
    ['a', 1, true],
    ['b', 2, false],
  ]
  Unzip(arr) // [["a", "b"], [1, 2], [true, false]]
  ```

- 对数组成员个数进行统计

  此方法是字符统计和单词统计的原理，入参时把字符串处理成数组即可

  ```js
  function Count(arr = []) {
    return arr.reduce((t, v) => ((t[v] = (t[v] || 0) + 1), t), {})
  }

  const arr = [0, 1, 1, 2, 2, 2]
  Count(arr) // { 0: 1, 1: 2, 2: 3 }
  ```

- 对数组成员位置进行记录

  ```js
  function Position(arr = [], val) {
    return arr.reduce((t, v, i) => (v === val && t.push(i), t), [])
  }

  const arr = [2, 1, 5, 4, 2, 1, 6, 6, 7]
  Position(arr, 2) // [0, 4]
  ```

- 对数组成员特性进行分组

  ```js
  function Group(arr = [], key) {
    return key
      ? arr.reduce(
          (t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t),
          {}
        )
      : {}
  }

  const arr = [
    { area: 'GZ', name: 'YZW', age: 27 },
    { area: 'GZ', name: 'TYJ', age: 25 },
    { area: 'SZ', name: 'AAA', age: 23 },
    { area: 'FS', name: 'BBB', age: 21 },
    { area: 'SZ', name: 'CCC', age: 19 },
  ] // 以地区area作为分组依据
  Group(arr, 'area') // { GZ: Array(2), SZ: Array(2), FS: Array(1) }
  ```

- 对数组成员包含的关键字进行统计

  ```js
  function Keyword(arr = [], keys = []) {
    return keys.reduce(
      (t, v) => (arr.some((w) => w.includes(v)) && t.push(v), t),
      []
    )
  }

  const text = [
    '今天天气真好，我想出去钓鱼',
    '我一边看电视，一边写作业',
    '小明喜欢同桌的小红，又喜欢后桌的小君，真TM花心',
    '最近上班喜欢摸鱼的人实在太多了，代码不好好写，在想入非非',
  ]
  const keyword = ['偷懒', '喜欢', '睡觉', '摸鱼', '真好', '一边', '明天']
  Keyword(text, keyword) // ["喜欢", "摸鱼", "真好", "一边"]
  ```

- 字符串翻转

  ```js
  function ReverseStr(str = '') {
    return str.split('').reduceRight((t, v) => t + v)
  }

  const str = 'reduce最牛逼'
  ReverseStr(str) // "逼牛最ecuder"
  ```

- 累加累乘

  ```js
  function Accumulation(...vals) {
    return vals.reduce((t, v) => t + v, 0)
  }

  function Multiplication(...vals) {
    return vals.reduce((t, v) => t * v, 1)
  }

  Accumulation(1, 2, 3, 4, 5) // 15
  Multiplication(1, 2, 3, 4, 5) // 120
  ```

- 异步累计

  ```js
  async function AsyncTotal(arr = []) {
    return arr.reduce(async (t, v) => {
      const at = await t
      const todo = await Todo(v)
      at[v] = todo
      return at
    }, Promise.resolve({}))
  }

  const result = await AsyncTotal() // 需在async包围下使用
  ```

- 斐波那契数列

  ```js
  function Fibonacci(len = 2) {
    const arr = [...new Array(len).keys()]
    return arr.reduce((t, v, i) => (i > 1 && t.push(t[i - 1] + t[i - 2]), t), [
      0,
      1,
    ])
  }

  Fibonacci(10) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
  ```

- 返回对象指定的键值

  ```js
  function GetKeys(obj = {}, keys = []) {
    return Object.keys(obj).reduce(
      (t, v) => (keys.includes(v) && (t[v] = obj[v]), t),
      {}
    )
  }

  const target = { a: 1, b: 2, c: 3, d: 4 }
  const keyword = ['a', 'd']
  GetKeys(target, keyword) // { a: 1, d: 4 }
  ```

- 权重求和

  ```js
  const score = [
    { score: 90, subject: 'chinese', weight: 0.5 },
    { score: 95, subject: 'math', weight: 0.3 },
    { score: 85, subject: 'english', weight: 0.2 },
  ]
  const result = score.reduce((t, v) => t + v.score * v.weight, 0) // 90.5
  ```

- 数组转对象

  ```js
  const people = [
    { area: 'GZ', name: 'YZW', age: 27 },
    { area: 'SZ', name: 'TYJ', age: 25 },
  ]
  const map = people.reduce((t, v) => {
    const { name, ...rest } = v
    t[name] = rest
    return t
  }, {}) // { YZW: {…}, TYJ: {…} }
  ```

- redux Compose 函数原理

  ```js
  function Compose(...funs) {
    if (funs.length === 0) {
      return (arg) => arg
    }
    if (funs.length === 1) {
      return funs[0]
    }
    // 先执行参数部分
    return funs.reduce((t, v) => (...arg) => t(v(...arg)))
  }
  ```

### 总结

总结 forEach、map 以及 reduce 的不同点：

- forEach 方法是将数组中的每一个值取出做一些事情
- map 方法是将数组中的每一个值放入一个方法中后返回一个新的数组
- reduce 方法 将数组中的每一个值与前面的被返回相加的总和(初试值为数组的第一个值或者 initialValue)

## 实现数组原生方法
