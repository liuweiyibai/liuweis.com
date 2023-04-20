---
title: 开始使用 styled-components
date: 2020-07-10 14:49:33
category:
  - React
  - Gatsby
  - styled-components
---

在 React 中有 CSS 方案 CSS in JS，它是一种模式，这个 CSS 由 JavaScript 生成而不是在外部文件中定义，是一种 CSS Modules 方案，主要是借助第三方库生成随机类名称的方式来建立一种局部类名的方式。

这种 CSS in JS 的第三方模块有很多 [CSS in JS 方案](https://github.com/MicheleBertoli/css-in-js)

这里我使用 styled-components ，它可以让组件自己的样式对自己生效，不是全局生效，做到互不干扰

## 安装使用

```bash
yarn add styled-components
yarn add @types/styled-components --dev
```

## 使用

简单使用

```js
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

// 声明样式 ButtonA 组件,通过 styled 对象进行创建,注意 styled.html 元素,后面是反引号
const ButtonA = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 3px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #abcdef;
  color: #fff;
`

// 样式化声明ButtonB组件
const ButtonB = styled.button`
  background: red;
  color: #fff;
  width: 100px;
  height: 40px;
  border-radius: 3px;
  outline: none;
  border: none;
  cursor: pointer;
`

class Header extends Component {
  // 样式最好不要在组件中定义
  render() {
    return (
      <Fragment>
        <ButtonA>按钮A</ButtonA>
        <ButtonB>按钮B</ButtonB>
      </Fragment>
    )
  }
}
```

给组件添加样式

```tsx
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  font-size: 22px;
  color: ${(props) => props.color};
`
function IsLink(props) {
  return <StyledLink color={props.color} />
}
```

背景图

```tsx
import BgImg from './react.jpg' // 将图片定义成一个变量的方式来引用

const Content = styled.div`
  width: 550px;
  height: 290px;
  background: url(${BgImg});
`
```

给组件添加属性

```tsx
// 比如定义一个 input 组件，通过 styled-components 给组件添加 attr
import styled from 'styled-components' // 引入styled-components

// 参数是一个对象
const Input = styled.input.attrs({
  placeholder: '请输入信息',
  type: 'text',
})`
  width: ${(props) => props.width};
  height: ${(props) => (props.size === 'small' ? '24px' : '40px')};
  font-size: 14px;
  text-indent: 10px;
  border-radius: 3px;
  border: 1px solid palevioletred;
  display: block;
  margin: 0 0 1em;
  &::placeholder {
    color: palevioletred;
  }
`
// attr 中使用 props
const Input2 = styled.input.attrs((props) => ({
  placeholder: '请输入信息',
  type: 'text',
}))`
  width: ${(props) => props.width};
  height: ${(props) => (props.size === 'small' ? '24px' : '40px')};
`
```

覆盖默认样式

```tsx
// 每添加一个 & 符号，都会随机生成一个类样式
const ButtonB = styled(ButtonA)`
  &&& {
    color: palevioletred;
    font-weight: bold;
  }
`
```

覆盖内联样式，style 内联样式的优先级是最高的，始终优先于外部 CSS，因此无法通过简单地样式组件覆盖它，但是有具体的解决办法的：

```tsx
const ButtonB = styled(ButtonA)`
  &[style] {
    background: blue !important;
    font-weight: bold;
  }
`
```

重置全局样式

```tsx
// 定义全局样式，这其实一个根级组件
import { createGlobalStyle } from 'styled-components'

const globalStyle = createGlobalStyle`
   html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed,
        figure, figcaption, footer, header, hgroup,
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
        }
        article, aside, details, figcaption, figure,
        footer, header, hgroup, menu, nav, section {
            display: block;
        }
        body {
            line-height: 1;
        }
        ol, ul {
            list-style: none;
        }
        blockquote, q {
            quotes: none;
        }
        blockquote:before, blockquote:after,
        q:before, q:after {
            content: '';
            content: none;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }

`
export default globalStyle
```

重复样式混入 🎨

```tsx
import styled, { css } from 'styled-components'
const baseShadow = css`
  box-shadow: ${({ color }) => `0 10px 6px -6px ${color || '#777'}`};
`

// 共用样式使用普通函数进行定义也可以

const StyledLink = styled`
  ${baseShadow}
`

const Btn = () => {
  return <StyledLink color="#fff" />
}
```
