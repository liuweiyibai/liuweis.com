---
title: 实现 vdom 的渲染
date: 2023-04-09 00:00:00
thumbnail: "../../assets/thumbnails/react.png"
category:
  - React
  - Vue
draft: false
---

```jsx
const data = {
  item1: "bbb",
  item2: "ddd",
}
const jsx = (
  <ul className="list">
    <li
      className="item"
      style={{ background: "blue", color: "pink" }}
      onClick={() => alert(2)}
    >
      {data.item1}
    </li>
    <li className="item">
      {data.item2}
      <i>2</i>
    </li>
    <li className="item">{data.item2}</li>
  </ul>
)

// 简单的实现将 jsx 编译为 vdom 结构
function jsxToVdom(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number") {
    return jsx
  }

  const { type, props } = jsx
  const children = props.children || []

  return {
    type,
    props: {
      ...props,
      children: children.map((c) => jsxToVdom(c)),
    },
  }
}
```
