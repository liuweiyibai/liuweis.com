---
title: JavaScript 判断手机品牌
date: 2019-06-14 16:20:00
category:
  - JavaScript
  - HTML5
---

判断打开当前页面的是什么品牌的手机，使用 userAgent 来进行判断：
以下正文涉及 3 类：主流的手机品牌判断方法、是否在微信打开、是否在 PC 或 Pad 打开。

判断业务是否是 iPhone、华为、小米、oppo、vivo、三星 打开

```js
function judgeBrand(sUserAgent) {
  var isIphone = sUserAgent.match(/iphone/i) == 'iphone'
  var isHuawei = sUserAgent.match(/huawei/i) == 'huawei'
  var isHonor = sUserAgent.match(/honor/i) == 'honor'
  var isOppo = sUserAgent.match(/oppo/i) == 'oppo'
  var isOppoR15 = sUserAgent.match(/pacm00/i) == 'pacm00'
  var isVivo = sUserAgent.match(/vivo/i) == 'vivo'
  var isXiaomi = sUserAgent.match(/mi\s/i) == 'mi '
  var isXiaomi2s = sUserAgent.match(/mix\s/i) == 'mix '
  var isRedmi = sUserAgent.match(/redmi/i) == 'redmi'
  var isSamsung = sUserAgent.match(/sm-/i) == 'sm-'

  if (isIphone) {
    return 'iphone'
  } else if (isHuawei || isHonor) {
    return 'huawei'
  } else if (isOppo || isOppoR15) {
    return 'oppo'
  } else if (isVivo) {
    return 'vivo'
  } else if (isXiaomi || isRedmi || isXiaomi2s) {
    return 'xiaomi'
  } else if (isSamsung) {
    return 'samsung'
  } else {
    return 'default'
  }
}

var brand = judgeBrand(navigator.userAgent.toLowerCase())
```

> 小米手机判断比较特殊，小米普通机型拿到的 `ua` 都类似于 `MI 6 Build`、`Mi Note 2 Build` 这样的，所以要匹配 `mi\s`，空格必须加上。如果只匹配 `mi` 的话，用户通过小米浏览器或者其他有带有 `mi` 字符的都会认为是小米手机，例如：`Microsoft`
> 三星手机的品牌判断要使用 `sm-` ，因为三星机型都是 `SM-J3109`、`SM-G9650 Build`、`SM-N9500 Build` 这样的。如果只匹配 `sm` ，就会匹配到某些版本锤子手机
> [手机品牌 userAgent 库](http://www.fynas.com/ua)

判断业务是否是 微信 打开

```js
function isWeChat() {
  var ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua) ? true : false
}
```

判断是在什么平台打开 pad 、pc 、手机端

```js
function checkAgent() {
  var sUserAgent = navigator.userAgent.toLowerCase()
  var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
  var bIsMidp = sUserAgent.match(/midp/i) == 'midp'
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
  var bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
  var bIsAndroid = sUserAgent.match(/android/i) == 'android'
  var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
  var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'

  if (
    !(
      bIsIphoneOs ||
      bIsMidp ||
      bIsUc7 ||
      bIsUc ||
      bIsAndroid ||
      bIsCE ||
      bIsWM ||
      bIsIpad
    )
  ) {
    return 'pc'
  } else if (bIsIpad) {
    return 'pad'
  } else {
    return 'phone'
  }
}
```

> 在使用华为 `P20 Pro` 默认浏览器打开时，会被误判为 `PC`。因为在华为 `P20 Pro` 的默认浏览器上，并没有重写 `userAgent`，拿到的 `userAgent` 跟在 `PC` 上拿到的一样。目前只发现华为机型的默认浏览器有这个错误
