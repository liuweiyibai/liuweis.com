---
title: 异步编程模型 Promise
date: 2021-10-04 17:13:16
category:
  - JavaScript
---

Promise A+ 规范，

Promise 有 then 方法的对象或者函数
thenable 有 then 方法的对象或者函数
value promise 状态成功的值，resolve(value)，值可以是任何数据类型
reason promise 状态失败的原因，reject(reason)，
exception 使用 throw 抛出的异常

## 规范

### 状态

1. pending 状态

   1. pending 初始状态，可以被改变
   2. 在 resolve 和 reject 前都处于 pending
   3. resolve 修改 pending 为 fulfilled
   4. reject 修改 pending 为 rejected

2. fulfilled
3. rejected

### then

then 用来访问最后的结果，无论是 value 还是 reason。
then 的入参两个回调函数
then 的返回值也是一个 promise

## 基于 Promise 规范实现

```js
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class Promise {
  constructor() {
    // 状态初始化
    this.status = PENDING
    this.value = null
    this.reason = null
  }
  then(on) {}
}
```
