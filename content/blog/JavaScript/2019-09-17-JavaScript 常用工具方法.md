---
title: JavaScript 常用工具方法
category:
  - JavaScript
date: 2019-09-17 09:48:00
---

## 正则验证部分

- 邮箱

  ```js
  export const isEmail = (s) => {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
      s
    )
  }
  ```

- 手机号码

  ```js
  export const isMobile = (s) => {
    return /^1[0-9]{10}$/.test(s)
  }
  ```

- 电话号码

  ```js
  export const isPhone = (s) => {
    return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
  }
  ```

- 是否 `url` 地址

  ```js
  export const isURL = (s) => {
    return /^http[s]?:\/\/.*/.test(s)
  }
  ```

- 替换 `url` 中的 `/` 为空字符

  ```js
  const replaceSlash = (str = '') => str.replace(/(\/)/g, '')
  ```

## 类型判断

- 是否字符串

  ```js
  export const isString = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'String'
  }
  ```

- 是否数字

  ```js
  export const isNumber = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
  }
  ```

- 是否 `Boolean`

  ```js
  export const isBoolean = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
  }
  ```

- 是否函数

  ```js
  export const isFunction = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
  }
  ```

- 是否为 `null`

  ```js
  export const isNull = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
  }
  ```

- 是否 `undefined`

  ```js
  export const isUndefined = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
  }
  ```

- 是否对象

  ```js
  export const isObj = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
  }
  ```

- 是否数组

  ```js
  export const isArray = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
  }
  ```

- 是否时间

  ```js
  export const isDate = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
  }
  ```

- 是否正则

  ```js
  export const isRegExp = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'RegExp'
  }
  ```

- 是否错误对象

  ```js
  export const isError = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Error'
  }
  ```

- 是否 `Symbol` 函数

  ```js
  export const isSymbol = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol'
  }
  ```

- 是否 `Promise` 对象

  ```js
  export const isPromise = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Promise'
  }
  ```

- 是否 `Set` 对象

  ```js
  export const isSet = (o) => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Set'
  }
  ```

## 客户端类型

- 是否是微信浏览器

  ```js
  export const isWeiXin = () => {
    return ua.match(/microMessenger/i) == 'micromessenger'
  }
  ```

- 是否是移动端

  ```js
  export const isDeviceMobile = () => {
    return /android|webos|iphone|ipod|balckberry/i.test(ua)
  }
  ```

- 是否是 QQ 浏览器

  ```js
  export const isQQBrowser = () => {
    return !!ua.match(/mqqbrowser|qzone|qqbrowser|qbwebviewtype/i)
  }
  ```

- 是否是爬虫

  ```js
  export const isSpider = () => {
    return /adsbot|googlebot|bingbot|msnbot|yandexbot|baidubot|robot|careerbot|seznambot|bot|baiduspider|jikespider|symantecspider|scannerlwebcrawler|crawler|360spider|sosospider|sogou web sprider|sogou orion spider/.test(
      ua
    )
  }
  ```

- 是否是 `ios`

  ```js
  export const isIos = () => {
    var u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      //安卓手机
      return false
    } else if (u.indexOf('iPhone') > -1) {
      //苹果手机
      return true
    } else if (u.indexOf('iPad') > -1) {
      //iPad
      return false
    } else if (u.indexOf('Windows Phone') > -1) {
      //winphone手机
      return false
    } else {
      return false
    }
  }
  ```

- 是否为 `PC` 端

  ```js
  export const isPC = () => {
    var userAgentInfo = navigator.userAgent
    var Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ]
    var flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  ```

## 重复执行函数

```js
function doRepeat(func, times, waits) {
  let i = 0
  return function (...args) {
    const timer = setInterval(function () {
      if (times === i) {
        clearInterval(timer)
        return
      }
      i++
      func.apply(null, [...args])
    }, waits)
  }
}
```

## 功能函数

- 去除 `html` 标签

  ```js
  export const removeHtmltag = (str) => {
    return str.replace(/<[^>]+>/g, '')
  }
  ```

- 获取 `url` 参数

  - 方法 1

    ```js
    export const getQueryString = (name) => {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const search = window.location.search.split('?')[1] || ''
      const r = search.match(reg) || []
      return r[2]
    }
    ```

  - 方法 2

    使用 `URLSearchParams` 来处理， `URLSearchParams` 接口定义处理 `URL` 参数串，`URLSearchParams` 接口定义了一些实用的方法来处理 `URL` 的查询字符串。使用 `URLSearchParams` 的实例对象可以直接用 `for...of` 结构来处理，不需要使用 `entries()` 所以 `for (var p of mySearchParams)` 就等于 `for (var p of mySearchParams.entries())`

  - 方法 3

    封装一个函数将 `url` 中的参数处理成键值对的格式

    ```js
    var url = `http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&d&enabled`
    const urlParse = (str) => {
      if (typeof str !== 'string') {
        return
      }
      var paramObj = {}
      var decode = decodeURIComponent(str) // 先解码
      var parsePart = decode.split('?#')[decode.split('?#').length - 1]
      // 截断不需要部分
      var paramArr = parsePart.split('&')
      for (var i = 0; i < paramArr.length; i++) {
        var tmp = paramArr[i].split('=')
        var key = tmp[0]
        var value = tmp[1] || true

        // console.log("关键字是:" + key, "值是:" + value);
        if (typeof paramObj[key] === 'undefined') {
          paramObj[key] = value
        } else {
          var newValue = paramObj[key] + ',' + value
          // 有多个重复的先连接字符串,然后才分割开
          paramObj[key] = newValue.split(',')
        }
      }
      // console.log(paramObj);
    }
    ```

- 动态引入 `js`

  ```js
  export const injectScript = (src) => {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = src
    const t = document.getElementsByTagName('script')[0]
    t.parentNode.insertBefore(s, t)
  }
  ```

- 根据 `url` 地址下载

  ```js
  export const download = (url) => {
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
    var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
    if (isChrome || isSafari) {
      var link = document.createElement('a')
      link.href = url
      if (link.download !== undefined) {
        var fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
        link.download = fileName
      }
      if (document.createEvent) {
        var e = document.createEvent('MouseEvents')
        e.initEvent('click', true, true)
        link.dispatchEvent(e)
        return true
      }
    }
    if (url.indexOf('?') === -1) {
      url += '?download'
    }
    window.open(url, '_self')
    return true
  }
  ```

- 获取滚动的坐标

  ```js
  export const getScrollPosition = (el = window) => ({
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
  })
  ```

- 滚动到顶部

  ```js
  export const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0, c - c / 8)
    }
  }
  ```

- `el` 是否在视口范围内

  ```js
  export const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect()
    const { innerHeight, innerWidth } = window
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
          (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
  }
  ```

- 拦截粘贴板

  ```js
  export const copyTextToClipboard = (value) => {
    var textArea = document.createElement('textarea')
    textArea.style.background = 'transparent'
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    try {
      var successful = document.execCommand('copy')
    } catch (err) {
      console.log('Oops, unable to copy')
    }
    document.body.removeChild(textArea)
  }
  ```

- 判断类型集合

  ```js
  export const checkStr = (str, type) => {
    switch (type) {
      case 'phone': //手机号码
        return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str)
      case 'tel': //座机
        return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
      case 'card': //身份证
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
      case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
        return /^[a-zA-Z]\w{5,17}$/.test(str)
      case 'postal': //邮政编码
        return /[1-9]\d{5}(?!\d)/.test(str)
      case 'QQ': //QQ号
        return /^[1-9][0-9]{4,9}$/.test(str)
      case 'email': //邮箱
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
      case 'money': //金额(小数点2位)
        return /^\d*(?:\.\d{0,2})?$/.test(str)
      case 'URL': //网址
        return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
          str
        )
      case 'IP': //IP
        return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(
          str
        )
      case 'date': //日期时间
        return (
          /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(
            str
          ) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
        )
      case 'number': //数字
        return /^[0-9]$/.test(str)
      case 'english': //英文
        return /^[a-zA-Z]+$/.test(str)
      case 'chinese': //中文
        return /^[\\u4E00-\\u9FA5]+$/.test(str)
      case 'lower': //小写
        return /^[a-z]+$/.test(str)
      case 'upper': //大写
        return /^[A-Z]+$/.test(str)
      case 'HTML': //HTML标记
        return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str)
      default:
        return true
    }
  }
  ```

- 严格的身份证校验

  ```js
  export const isCardID = (sId) => {
    if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
      console.log('你输入的身份证长度或格式错误')
      return false
    }
    //身份证城市
    var aCity = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外',
    }
    if (!aCity[parseInt(sId.substr(0, 2))]) {
      console.log('你的身份证地区非法')
      return false
    }

    // 出生日期验证
    var sBirthday = (
        sId.substr(6, 4) +
        '-' +
        Number(sId.substr(10, 2)) +
        '-' +
        Number(sId.substr(12, 2))
      ).replace(/-/g, '/'),
      d = new Date(sBirthday)
    if (
      sBirthday !=
      d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
    ) {
      console.log('身份证上的出生日期非法')
      return false
    }

    // 身份证号码校验
    var sum = 0,
      weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      codes = '10X98765432'
    for (var i = 0; i < sId.length - 1; i++) {
      sum += sId[i] * weights[i]
    }
    var last = codes[sum % 11] //计算出来的最后一位身份证号码
    if (sId[sId.length - 1] != last) {
      console.log('你输入的身份证号非法')
      return false
    }

    return true
  }
  ```

- 范围随机数

  ```js
  export const random = (min, max) => {
    if (arguments.length === 2) {
      return Math.floor(min + Math.random() * (max + 1 - min))
    } else {
      return null
    }
  }
  ```

- 将阿拉伯数字翻译成中文的大写数字

  ```js
  export const numberToChinese = (num) => {
    var AA = new Array(
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十'
    )
    var BB = new Array('', '十', '百', '仟', '萬', '億', '点', '')
    var a = ('' + num).replace(/(^0*)/g, '').split('.'),
      k = 0,
      re = ''
    for (var i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re
          break
        case 4:
          if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$').test(a[0]))
            re = BB[4] + re
          break
        case 8:
          re = BB[5] + re
          BB[7] = BB[5]
          k = 0
          break
      }
      if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
        re = AA[0] + re
      if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
      k++
    }

    if (a.length > 1) {
      // 加上小数部分(如果有小数部分)
      re += BB[6]
      for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
    }
    if (re == '一十') re = '十'
    if (re.match(/^一/) && re.length == 3) re = re.replace('一', '')
    return re
  }
  ```

- 将数字转换为大写金额

  ```js
  export const changeToChinese = (Num) => {
    //判断如果传递进来的不是字符的话转换为字符
    if (typeof Num == 'number') {
      Num = new String(Num)
    }
    Num = Num.replace(/,/g, '') //替换tomoney()中的“,”
    Num = Num.replace(/ /g, '') //替换tomoney()中的空格
    Num = Num.replace(/￥/g, '') //替换掉可能出现的￥字符
    if (isNaN(Num)) {
      //验证输入的字符是否为数字
      //alert("请检查小写金额是否正确");
      return ''
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    var part = String(Num).split('.')
    var newchar = ''
    //小数点前进行转化
    for (var i = part[0].length - 1; i >= 0; i--) {
      if (part[0].length > 10) {
        return ''
        //若数量超过拾亿单位，提示
      }
      var tmpnewchar = ''
      var perchar = part[0].charAt(i)
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }
      switch (part[0].length - i - 1) {
        case 0:
          tmpnewchar = tmpnewchar + '元'
          break
        case 1:
          if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
          break
        case 2:
          if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
          break
        case 3:
          if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
          break
        case 4:
          tmpnewchar = tmpnewchar + '万'
          break
        case 5:
          if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
          break
        case 6:
          if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
          break
        case 7:
          if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
          break
        case 8:
          tmpnewchar = tmpnewchar + '亿'
          break
        case 9:
          tmpnewchar = tmpnewchar + '拾'
          break
      }
      var newchar = tmpnewchar + newchar
    }
    //小数点之后进行转化
    if (Num.indexOf('.') != -1) {
      if (part[1].length > 2) {
        // alert("小数点之后只能保留两位,系统将自动截断");
        part[1] = part[1].substr(0, 2)
      }
      for (i = 0; i < part[1].length; i++) {
        tmpnewchar = ''
        perchar = part[1].charAt(i)
        switch (perchar) {
          case '0':
            tmpnewchar = '零' + tmpnewchar
            break
          case '1':
            tmpnewchar = '壹' + tmpnewchar
            break
          case '2':
            tmpnewchar = '贰' + tmpnewchar
            break
          case '3':
            tmpnewchar = '叁' + tmpnewchar
            break
          case '4':
            tmpnewchar = '肆' + tmpnewchar
            break
          case '5':
            tmpnewchar = '伍' + tmpnewchar
            break
          case '6':
            tmpnewchar = '陆' + tmpnewchar
            break
          case '7':
            tmpnewchar = '柒' + tmpnewchar
            break
          case '8':
            tmpnewchar = '捌' + tmpnewchar
            break
          case '9':
            tmpnewchar = '玖' + tmpnewchar
            break
        }
        if (i == 0) tmpnewchar = tmpnewchar + '角'
        if (i == 1) tmpnewchar = tmpnewchar + '分'
        newchar = newchar + tmpnewchar
      }
    }
    //替换所有无用汉字
    while (newchar.search('零零') != -1) newchar = newchar.replace('零零', '零')
    newchar = newchar.replace('零亿', '亿')
    newchar = newchar.replace('亿万', '亿')
    newchar = newchar.replace('零万', '万')
    newchar = newchar.replace('零元', '元')
    newchar = newchar.replace('零角', '')
    newchar = newchar.replace('零分', '')
    if (newchar.charAt(newchar.length - 1) == '元') {
      newchar = newchar + '整'
    }
    return newchar
  }
  ```

- 判断一个元素是否在数组中

  ```js
  export const contains = (arr, val) => {
    return arr.indexOf(val) != -1 ? true : false
  }
  ```

- 数组排序

  ```js
  /**
   * @param{type} 1：从小到大 2：从大到小 3：随机
   */
  export const sort = (arr, type = 1) => {
    return arr.sort((a, b) => {
      switch (type) {
        case 1:
          return a - b
        case 2:
          return b - a
        case 3:
          return Math.random() - 0.5
        default:
          return arr
      }
    })
  }
  ```

- 数组去重

  ```js
  export const unique = (arr) => {
    if (Array.hasOwnProperty('from')) {
      return Array.from(new Set(arr))
    } else {
      var n = {},
        r = []
      for (var i = 0; i < arr.length; i++) {
        if (!n[arr[i]]) {
          n[arr[i]] = true
          r.push(arr[i])
        }
      }
      return r
    }
  }
  ```

- 求两个集合的并集

  ```js
  export const union = (a, b) => {
    var newArr = a.concat(b)
    return this.unique(newArr)
  }
  ```

- 求两个集合的交集

  ```js
  export const intersect = (a, b) => {
    var _this = this
    a = this.unique(a)
    return this.map(a, function (o) {
      return _this.contains(b, o) ? o : null
    })
  }
  ```

- 删除其中一个元素

  ```js
  export const remove = (arr, ele) => {
    var index = arr.indexOf(ele)
    if (index > -1) {
      arr.splice(index, 1)
    }
    return arr
  }
  ```

- 将类数组转换为数组

  ```js
  export const formArray = (ary) => {
    var arr = []
    if (Array.isArray(ary)) {
      arr = ary
    } else {
      arr = Array.prototype.slice.call(ary)
    }
    return arr
  }
  ```

- 最大值

  ```js
  export const max = (arr) => {
    return Math.max.apply(null, arr)
  }
  ```

- 最小值

  ```js
  export const min = (arr) => {
    return Math.min.apply(null, arr)
  }
  ```

- 求和

  ```js
  export const sum = (arr) => {
    return arr.reduce((pre, cur) => {
      return pre + cur
    })
  }
  ```

- 平均值

  ```js
  export const average = (arr) => {
    return this.sum(arr) / arr.length
  }
  ```

- 去除空格

  ```js
  /**
   * @params{type}: 1-所有空格 2-前后空格 3-前空格 4-后空格
   */
  export const trim = (str, type) => {
    type = type || 1
    switch (type) {
      case 1:
        return str.replace(/\s+/g, '')
      case 2:
        return str.replace(/(^\s*)|(\s*$)/g, '')
      case 3:
        return str.replace(/(^\s*)/g, '')
      case 4:
        return str.replace(/(\s*$)/g, '')
      default:
        return str
    }
  }
  ```

- 字符转换

  ```js
  /**
   * @params{type}: 1:首字母大写 2：首字母小写 3：大小写转换 4：全部大写 5：全部小写
   */

  export const changeCase = (str, type) => {
    type = type || 4
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, function (word) {
          return (
            word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
          )
        })
      case 2:
        return str.replace(/\b\w+\b/g, function (word) {
          return (
            word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
          )
        })
      case 3:
        return str
          .split('')
          .map(function (word) {
            if (/[a-z]/.test(word)) {
              return word.toUpperCase()
            } else {
              return word.toLowerCase()
            }
          })
          .join('')
      case 4:
        return str.toUpperCase()
      case 5:
        return str.toLowerCase()
      default:
        return str
    }
  }
  ```

- 检测密码强度

  ```js
  export const checkPwd = (str) => {
    var Lv = 0
    if (str.length < 6) {
      return Lv
    }
    if (/[0-9]/.test(str)) {
      Lv++
    }
    if (/[a-z]/.test(str)) {
      Lv++
    }
    if (/[A-Z]/.test(str)) {
      Lv++
    }
    if (/[\.|-|_]/.test(str)) {
      Lv++
    }
    return Lv
  }
  ```

- 函数节流器

  ```js
  export const debouncer = (fn, time, interval = 200) => {
    if (time - (window.debounceTimestamp || 0) > interval) {
      fn && fn()
      window.debounceTimestamp = time
    }
  }
  ```

- 在字符串中插入新字符串

  ```js
  export const insertStr = (soure, index, newStr) => {
    var str = soure.slice(0, index) + newStr + soure.slice(index)
    return str
  }
  ```

- 判断两个对象是否键值相同

  ```js
  export const isObjectEqual = (a, b) => {
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)

    if (aProps.length !== bProps.length) {
      return false
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]

      if (a[propName] !== b[propName]) {
        return false
      }
    }
    return true
  }
  ```

- `16` 进制颜色转 `RGB`或者`RGBA` 字符串

  ```js
  export const colorToRGB = (val, opa) => {
    var pattern = /^(#?)[a-fA-F0-9]{6}$/ //16进制颜色值校验规则
    var isOpa = typeof opa == 'number' //判断是否有设置不透明度

    if (!pattern.test(val)) {
      //如果值不符合规则返回空字符
      return ''
    }

    var v = val.replace(/#/, '') //如果有#号先去除#号
    var rgbArr = []
    var rgbStr = ''

    for (var i = 0; i < 3; i++) {
      var item = v.substring(i * 2, i * 2 + 2)
      var num = parseInt(item, 16)
      rgbArr.push(num)
    }

    rgbStr = rgbArr.join()
    rgbStr =
      'rgb' + (isOpa ? 'a' : '') + '(' + rgbStr + (isOpa ? ',' + opa : '') + ')'
    return rgbStr
  }
  ```

- 序列化对象，序列化结果可以用在 url 中

  ```js
  const getUrlString = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
      .map((key) => {
        let val = params[key]

        if (
          '[object Object]' === Object.prototype.toString.call(val) ||
          Array.isArray(val)
        ) {
          if (Array.isArray(params)) {
            keys.push('')
          } else {
            keys.push(key)
          }
          return getUrlString(val, keys, Array.isArray(val))
        } else {
          let tKey = key

          if (keys.length > 0) {
            const tKeys = isArray ? keys : [...keys, key]
            tKey = tKeys.reduce((str, k) => {
              return '' === str ? k : `${str}[${k}]`
            }, '')
          }
          if (isArray) {
            return `${tKey}[]=${val}`
          } else {
            return `${tKey}=${val}`
          }
        }
      })
      .join('&')
    keys.pop()
    return encodeURI(p)
  }

  // 或者

  var a = {
    userId: 1,
    gender: 'male',
  }
  const getUrlString2 = (obj) => {
    return Object.keys(a)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(a[k])
      })
      .join('&')
  }
  ```

- 追加 `url` 参数

  ```js
  export const appendQuery = (url, key, value) => {
    var options = key
    if (typeof options === 'string') {
      options = {}
      options[key] = value
    }
    options = getUrlString2(options)
    if (url.includes('?')) {
      url += '&' + options
    } else {
      url += '?' + options
    }
    return url
  }
  ```

- 生成随机验证码

  ```js
  function createCode() {
    var code = ''
    var codeLength = 4 /* 验证码的长度  */
    var random = new Array(
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ) /*随机数*/
    for (var i = 0; i < codeLength; i++) {
      /* 循环操作,生成 `codeLength=4` 个验证码 */
      var index = Math.floor(
        Math.random() * 36
      ) /* 通过随机数生成索引（0~35） */
      code +=
        random[
          index
        ] /* 根据索引取得随机数加到code上,循环 `codeLength=4`次，取到`codeLength=4` 随机字符 */
    }
    return code
  }
  ```

## 类名操作

- `el` 是否包含某个 `class`

  ```js
  export const hasClass = (el, className) => {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }
  ```

- `el` 添加某个 `class`

  ```js
  export const addClass = (el, className) => {
    if (hasClass(el, className)) {
      return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
  ```

- `el` 去除某个 `class`

  ```js
  export const removeClass = (el, className) => {
    if (!hasClass(el, className)) {
      return
    }
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
    el.className = el.className.replace(reg, ' ')
  }
  ```

## 随机

- 洗牌算法随机

  ```js
  export const shuffle = (arr) => {
    var result = [],
      random
    while (arr.length > 0) {
      random = Math.floor(Math.random() * arr.length)
      result.push(arr[random])
      arr.splice(random, 1)
    }
    return result
  }
  ```

## 倒计时函数

## sleep 函数

- `async` 版本

  ```js
  async function sleep(timer) {
    await setTimeout(async () => {
      console.log(11)
    }, timer)
  }
  sleep(5000)
  ```

- `Promise` 版本

  ```js
  const sleep = function (timer) {
    return new Promise((resolve) => {
      setTimeout(resolve, timer)
    })
  }
  sleep(5000)
  ```

## 加入书签

使用 `js` 将页面加入书签

- `ie` 浏览器下实现的方法

  ```html
  <!-- 使用 a 标签添加 -->
  <a
    href="#"
    onClick="javascript:window.external.addFavorite('www.baidu.com'，'百度')"
  >
    添加到收藏夹
  </a>

  <!-- 使用 JavaScript 添加 -->
  <script>
    window.external.addFavorite(
      '添加到页面收藏夹的完整页面地址',
      '当前页面的标题名称'
    )
  </script>
  ```

- `firefox` 下实现的方法

  通过 `window.sidebar.addPanel()`

  ```html
  <a
    href="#"
    onClick="javascript:window.sidebar.addPanel('百度一下','http://www.baidu.com','');"
    >收藏本站</a
  >
  ```

  在`a`标签上添加`rel="sidebar"`属性

  ```html
  <a href="http://www.baidu.com" title="百度一下" rel="sidebar">收藏本站</a>
  ```

## 字符串常用操作

<https://codepen.io/hotblin/pen/MWwEMpg>

```js
String.prototype.trim = function (char, type) {
  if (char) {
    if (type == 'left') {
      return this.replace(new RegExp('^\\' + char + '+', 'g'), '')
    } else if (type == 'right') {
      return this.replace(new RegExp('\\' + char + '+$', 'g'), '')
    }
    return this.replace(
      new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'),
      ''
    )
  }
  return this.replace(/^\s+|\s+$/g, '')
}

// 去除字符串首尾的全部空白
var str = ' Ruchee '
console.log('xxx' + str.trim() + 'xxx') // xxxRucheexxx

// 去除字符串左侧空白
str = ' Ruchee '
console.log('xxx' + str.trim(' ', 'left') + 'xxx') // xxxRuchee xxx

// 去除字符串右侧空白
str = ' Ruchee '
console.log('xxx' + str.trim(' ', 'right') + 'xxx') // xxx Rucheexxx

// 去除字符串两侧指定字符
str = '/Ruchee/'
console.log(str.trim('/')) // Ruchee

// 去除字符串左侧指定字符
str = '/Ruchee/'
console.log(str.trim('/', 'left')) // Ruchee/

// 去除字符串右侧指定字符
str = '/Ruchee/'
console.log(str.trim('/', 'right')) // /Ruchee
```

- 方法一

  此方法用来将用户输入内容中的尖括号、引号等进行转义

  ```js
  function html_encode(str) {
    var s = ''
    if (str.length == 0) return ''
    s = str.replace(/&/g, '&gt;')
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')
    s = s.replace(/ /g, '&nbsp;')
    s = s.replace(/\'/g, '&#39;')
    s = s.replace(/\"/g, '&quot;')
    s = s.replace(/\n/g, '<br>')
    return s
  }

  // 反转义
  function html_decode(str) {
    var s = ''
    if (str.length == 0) return ''
    s = str.replace(/&gt;/g, '&')
    s = s.replace(/&lt;/g, '<')
    s = s.replace(/&gt;/g, '>')
    s = s.replace(/&nbsp;/g, ' ')
    s = s.replace(/&#39;/g, "'")
    s = s.replace(/&quot;/g, '"')
    s = s.replace(/<br>/g, '\n')
    return s
  }
  ```

- 方法二

  ```js
  // 转义
  function htmlEncode(str) {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }
  // 反转义
  function htmlDecode(str) {
    var div = document.createElement('div')
    div.innerHTML = str
    return div.innerHTML
  }
  ```
