---
title: 实现 vdom 的渲染
date: 2023-04-11 00:00:00
thumbnail: "../../assets/thumbnails/react.png"
category:
  - React
  - Vue
draft: false
---

我们有如下 vdom 结构，一般我们在使用框架（Vue、React）的时候，都是编写 .vue 文件或者 .jsx、.tsx 文件，这些文件实际都会被转译为 js 文件在浏览器中执行，其中的标签结构会被编译为一个对象结构来表示。比如如下一段 jsx：

```jsx
const App = () => {
  return (
    <ul className="list">
      <li className="item" onClick={() => alert(1)}>
        1
      </li>
      <li className="item">2</li>
      <li className="item">3</li>
    </ul>
  )
}
```

经过 babel 处理，会被转译为类似如下结构：

```js
const vdom = {
  type: "ul",
  props: {
    className: "list",
  },
  children: [
    {
      type: "li",
      props: {
        className: "item",
        style: {
          background: "blue",
          color: "#fff",
        },
        onClick: function () {
          alert(1)
        },
      },
      children: ["1"],
    },
    {
      type: "li",
      props: {
        className: "item",
      },
      children: ["2"],
    },
    {
      type: "li",
      props: {
        className: "item",
      },
      children: ["3"],
    },
  ],
}
```

## render

render 就是将如上 vdom 结构渲染为真实 html 结构，并且要实现原生的 HTML attr 传递，还有事件的绑定

```js
// 判断是不是纯字符串类型
function isTextVdom(vdom) {
  return typeof vdom == "string" || typeof vdom == "number"
}

function isElementVdom(vdom) {
  return typeof vdom == "object" && typeof vdom.type == "string"
}

const render = (vdom, parent = null) => {
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el
  if (isTextVdom(vdom)) {
    return mount(document.createTextNode(vdom))
  } else if (isElementVdom(vdom)) {
    const dom = mount(document.createElement(vdom.type))
    for (const child of vdom.children) {
      render(child, dom)
    }
    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop])
    }
    return dom
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`)
  }
}

function isEventListenerAttr(key, value) {
  return typeof value == "function" && key.startsWith("on")
}

function isStyleAttr(key, value) {
  return key == "style" && typeof value == "object"
}

function isPlainAttr(key, value) {
  return typeof value != "object" && typeof value != "function"
}

const setAttribute = (dom, key, value) => {
  if (isDangerousHTMLAttr(key, value)) {
    dom.innerHTML = value.__html
  } else if (isRefAttr(key, value)) {
    refs[key] = dom
    value(dom)
  } else if (isTextVdom(value)) {
    let textNode = reuseTextNode(value)
    if (textNode) {
      dom.appendChild(textNode)
    } else {
      textNodes.push(document.createTextNode(value))
      dom.appendChild(textNodes[textNodes.length - 1])
    }
  } else if (isEventListenerAttr(key, value)) {
    const eventType = key.slice(2).toLowerCase()
    dom.addEventListener(eventType, value)
  } else if (isStyleAttr(key, value)) {
    Object.assign(dom.style, value)
  } else if (isPlainAttr(key, value)) {
    dom.setAttribute(key, value)
  }
}

// 支持 dangerouslySetInnerHTML
function isDangerousHTMLAttr(key, value) {
  return (
    key === "dangerouslySetInnerHTML" &&
    value &&
    typeof value.__html === "string"
  )
}
 


// 支持 ref 属性
let refs = {}
function isRefAttr(key, value) {
  return key === "ref" && typeof value === "function"
}

// 文本节点重用
let textNodes = []
function reuseTextNode(text) {
  for (let i = 0; i < textNodes.length; i++) {
    if (textNodes[i].textContent === text) {
      return textNodes[i]
    }
  }
  return null
}
```

- render 函数递归遍历整个虚拟 DOM 树，创建对应的 DOM 节点，并插入到父节点中。
- isTextVdom 和 isElementVdom 用来判断一个虚拟 DOM 节点的类型。
- setAttribute 根据不同属性设置 DOM:
  - 对于 on[Event]的事件监听属性,添加对应的事件处理函数。
  - 对于 style 对象属性,批量设置样式。
  - 普通属性如 id、className 直接设置。
- 对非法的虚拟 DOM 抛出错误。
- 支持函数组件，通过检测 vdom.type 是函数。
- 通过refs对象支持 ref 属性
- 抽象平台具体代码,如直接使用document。

文本节点优化,重用而不是重新创建。