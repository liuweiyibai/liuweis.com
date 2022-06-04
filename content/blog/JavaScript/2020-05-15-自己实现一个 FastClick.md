---
title: 自己实现一个 FastClick
date: 2020-05-14 09:48:00
category:
  - JavaScript
---

## 前置知识

移动端点击监听执行顺序 `touchstart > touchmove > touchend > click`

## 出现原因

`iPhone` 是全触屏手机的鼻祖，当时的网页都是为了大屏幕设备设置的

为了方便用户阅读，设定为用户快速双击时，缩放页面。

当用户点击第一下时，设备会等待 `300ms` ，若这 `300ms` 内没有再次点击，才响应 `click` 事件

## 解决方案

- 1. 设置 `<meta name="viewport" content="width=device-width">`
     解决之后， `click` 事件仍会有些许延迟，那是因为 `click` 事件执行顺序在 `touchend` 之后，正常延迟。
- 2. 不使用 `click` 事件，改用 `touchstart` 事件
- 3. 使用 `FastClick` 库

  ```js
  var FastClick = require('fastclick')
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      FastClick.attach(document.body)
    },
    false
  )
  ```

  原理:

  移动端在点击第一下的时候会等待 `300ms` ，看用户是否点击第二下。

  FastClick 的原理就是监听 `touchend` 事件，取消原本 `300ms` 后真正的 `click` 事件，自己生成分发一个点击事件

- 自己实现 FastClick

  ```js
  const FastClick = !(function () {
    const attach = (dom) => {
      let targetElement = null
      dom.addEventListener('touchstart', function (e) {
        targetElement = e.target // 获取点击对象
      })
      dom.addEventListener('touchend', function (e) {
        e.preventDefault() // 阻止默认click事件
        let touch = e.changeTouches[0] // 获取点击的位置坐标
        let clickEvent = document.createEvent('MouseEvents')
        // 初始化自定义事件
        clickEvent.initMouseEvent(
          'click',
          true,
          true,
          window,
          1,
          touch.screenX,
          touch.screenY,
          touch.clientX,
          touch.clientY,
          false,
          false,
          false,
          false,
          0,
          null
        )
        targetElement.dispatchEvent(clickEvent) // 自定义事件的触发
      })
    }
    return { attach }
  })()
  ```
