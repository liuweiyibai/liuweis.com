---
title: 在 React 中使用 TypeScript
date: 2020-05-11 15:35:25
category:
  - React
  - TypeScript
---

## React 中常见的类型

- React.ReactElement

  使用 React.createElement 创建的，可以简单理解为 React 中的 JSX 的元素

- React.ReactNode

  `<div>xxx</div>` xxx 的合法类型

- React.CSSProperties

  组件内联的 style 对象的类型

- React.RefObject

  React.createRef 创建的类型，只读不可改

- React.MutableRefObject

  useRef 创建的类型，可以修改

## 组件声明

### 类组件

类组件使用的定义主要为 `React.Component<P,S>` 和 `React.PureComponent<P,S,SS>`，其中的 P 是 props 的类型，S 是 state 的类型，可以只传入 props 的类型，因为 state 的类型会自己推断

```tsx
export class MyForm extends React.Component<FormProps, FormState> {}
```

### 函数式组件

- 函数式组件

  当我们传递 props 到组件中去的时候，如果使用 TypeScript，就需要给 props 定义类型，使用 interface 定义，那么 props 必须遵循 interface 的结构，确保成员都有被声明，同时也会阻止未期望的 props 被传递下去。

  ```tsx
  interface AppProps = { message: string };
  const App = ({ message }: AppProps) => <div>{message}</div>;
  // 还有一种是使用 React.FC
  interface AppProps {
    value?: string;
  }

  const App: React.FC<AppProps> = ({ value = '', children }) => {
    return <div/>
  }
  ```

- 无状态组件

  无状态组件也被称为展示组件，如果一个展示组件没有内部的 state 可以被写为纯函数组件。

  ```tsx
  import React, { ReactNode, SFC } from 'react'

  export interface IProps {
    title: string | ReactNode
    description: string | ReactNode
  }
  const StepComplete: SFC<IProps> = ({ title, description, children }) => {
    return (
      <div>
        <div>{title}</div>
        <div>{description}</div>
        <div>{children}</div>
      </div>
    )
  }
  export default StepComplete
  ```

- 扩展 HTML 元素属性

  比如我们需要保留 button 的属性，并且要给 button 新增一些属性

  ```tsx
  type ButtonProps = JSX.IntrinsicElements['button']

  function Button({ ...allProps }: ButtonProps) {
    return <button {...allProps} />
  }

  // 或者是
  interface BaseButtonProps {
    className?: string
    disabled?: boolean
    href?: string
  }

  type NativeButtonProps = BaseButtonProps &
    React.ButtonHTMLAttributes<HTMLElement>

  type AnchorButtonProps = BaseButtonProps &
    React.AnchorHTMLAttributes<HTMLElement>

  // Partial, 泛型属性都是可选的,Button 组件拥有button 和 a 的所有属性
  export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

  const Button: React.FC<ButtonProps> = (props) => {}
  ```

## hooks

- useState

  ```tsx
  // 布尔类型，简单数据类型 ts 可以根据自动推导出类型
  const [val, toggle] = React.useState(false)
  toggle(false)
  // 如果初始值是 null 或 undefined，那就要通过泛型手动传入你期望的类型。通过泛型传入 state 类型结构
  const [user, setUser] = React.useState<IUser | null>(null)
  ```

- useEffect

  ```tsx
  useEffect(() => {
    const getUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    getUser()
  }, [])
  ```

- useImperativeHandle

  可以让你在使用 ref 时自定义暴露给父组件的实例值

  ```tsx
  import * as React from 'react'
  import { useState, useEffect, useRef, useImperativeHandle } from 'react'

  type ListProps = {
    innerRef?: React.Ref<{ scrollToTop(): void }>
  }

  function List(props: ListProps) {
    useImperativeHandle(props.innerRef, () => ({
      scrollToTop() {},
    }))
    return null
  }

  function Use() {
    const listRef = useRef<{ scrollToTop(): void }>(null!)

    useEffect(() => {
      listRef.current.scrollToTop()
    }, [])

    return <List innerRef={listRef} />
  }
  ```

  通过 useImperativeHandle 的，将父组件传入的 ref 和 useImperativeHandle 第二个参数返回的对象绑定到了一起

  ```tsx
  function FancyInput(props, ref) {
    const inputRef = useRef()
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus()
      },
    }))
    return <input ref={inputRef} />
  }
  FancyInput = React.forwardRef(FancyInput)
  const fancyInputRef = React.createRef() // React.useRef()
  ;<FancyInput ref={fancyInputRef}>Click me!</FancyInput>
  ```

- useRef

  ```tsx
  // null! 这种语法是非空断言，跟在一个值后面表示你断定它是有值的，所有可以直接获取值
  const ref2 = useRef<HTMLElement>(null!)

  // 也可以使用
  inputEl.current?.focus()
  ```

- useReducer

  ```tsx
  // state类型
  interface ReducerState {
    value: string
  }
  // action类型
  interface AnyAction {
    type: string
    [key: string]: any
  }
  // reducer函数
  const reducer: React.Reducer<ReducerState, AnyAction> = (state, action) => {
    switch (action.type) {
      default:
        return state
    }
  }
  // 初始值
  const initialState: ReducerState = { value: '' }

  const [state, dispatch] = useReducer(reducer, initialState)
  // state 的类型为 ReducerState
  // dispatch 的类型为 React.Dispatch<AnyAction>
  ```

- useMemo

  useMemo 是缓存值

  ```tsx
  function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T
  ```

- useCallback

  那么 useCallback 的使用和 useMemo 比较类似，但它返回的是缓存函数。 通常情况下，我们可以使用 useCallback 来处理父组件更新但不想子组件更新的问题。

  ```tsx
  interface IAppChildProps {
    callback: () => number
  }
  const AppChild = ({ callback }: IAppChildProps) => {
    const [index, setIndex] = React.useState(() => callback())
    React.useEffect(() => {
      setIndex(callback())
    }, [callback])
    return <div> {index}</div>
  }

  const App = () => {
    const [index, setIndex] = React.useState<number>(0)
    const [str, setStr] = React.useState<string>('')
    // 当 index 发生更新时，callback会更新定义
    const callback = React.useCallback(() => {
      return index * 100
    }, [index])
    return (
      <>
        <h1>{str}</h1>
        <AppChild callback={callback} />
        <div>
          <button
            onClick={() => {
              setIndex(index + 1)
            }}
          >
            +
          </button>
          <input
            type="text"
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              setStr(ev.target.value)
            }}
          />
        </div>
      </>
    )
  }
  ```

## 其他 Api

- forwardRef

  函数式组件默认不可以加 ref，它不像类组件那样有自己的实例。这个 API 一般是函数式组件用来接收父组件传来的 ref。通过 forwardRef 可以将 ref 转发给子组件，子组件拿到父组件创建的 ref，绑定到自己的某一个元素中。

  ```tsx
  type Props = {}
  type Ref = HTMLButtonElement
  const FancyButton = React.forwardRef<Ref, Props>((props, ref) => (
    <button ref={ref} className="MyClassName">
      {props.children}
    </button>
  ))

  const App = () => {
    const ref = useRef<HTMLButtonElement>()
    return <FancyButton ref={ref} />
  }
  ```

- ForwardRefRenderFunction

  定义为该类型的函数可以放进 React.forwardRef 函数中作为参数

  ```tsx
  // 定义
  const forwardRender: React.ForwardRefRenderFunction<
    HTMLDivElement,
    AppProps
  > = ({ value }, ref) => {
    return <div ref={ref} />
  }
  const App = React.forwardRef(forwardRender)
  // 使用
  const ref = useRef<HTMLDivElement>(null)
  return <App value="hello" ref={ref} />
  ```

- React.createContext

  泛型有自动推断的功能，所以 useContext 就不需要再写上类型了

  ```tsx
  interface ContextType {
    getPrefixCls: (value: string) => string
  }

  const context = React.createContext<ContextType>({
    getPrefixCls: (value) => `prefix-${value}`,
  })

  const App = () => {
    const { getPrefixCls } = useContext(context)
    getPrefixCls('App') // prefix-App
    return null
  }
  ```

- React.cloneElement

  如果使用的 React.FC 定义的组件，它的 children 类型默认是 React.ReactNode，需要显式转为 React.ReactElement

  ```tsx
  const App: React.FC = ({ children }) => {
    return React.cloneElement(children as React.ReactElement, {
      value: 'hello',
    })
  }
  // 也可以覆写定义
  const App: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return React.cloneElement(children, { value: 'hello' })
  }
  ```

- React.ComponentType

  通过 `React.ComponentType<P>` 定义的组件可以将变量名传入组件，在组件内调用，高阶组件通常会使用

  ```tsx
  interface AppProps {
    value: string
  }
  const App: React.FC<AppProps> = (props) => {
    return null
  }
  // React.ComponentType定义组件
  function HOC<T>(Component: React.ComponentType<T>) {
    return function (props: T) {
      return <Component {...props} />
    }
  }
  const WrappedComponent = HOC(App)
  // 调用
  ;<WrappedComponent value="hello" />
  ```

- Portals

  ReactDOM 中提供了一个方法 createPortal，可以将节点渲染在父组件之外，但是你可以依然使用父组件上下文中的属性。这个特性在我所讲的全局对话框或者提示框中非常有用，它脱离了父节点的容器，插在最外层，在样式上就能通过 position: fixed 来覆盖整个文档树。

## 泛型参数的组件

泛型参数的组件是 typescript2.9 版本新增的，第一次看见是在 ant-deisgn 里，一个很简单的例子就是 Select 组件

```tsx
<Select<number>>
  <Select.Option value={1}>1</Select.Option>
  <Select.Option value={2}>2</Select.Option>
</Select>
```

- 类组件的定义

  ```tsx
  // 定义泛型参数的组件
  class GenericComponent<P> extends React.Component<P> {
    internalProp: P
    constructor(props: P) {
      super(props)
      this.internalProp = props
    }
    render() {
      return null
    }
  }
  type Props = { a: number; b: string }
  ;<GenericComponent<Props> a={10} b="hi" /> // OK
  ;<GenericComponent<Props> a={10} b={20} /> // Error
  ```

- 函数式组件的定义

  ```jsx
  function GenericComponent<P>(props: P) {
    const internalProp = useRef(props)
    return null
  }
  ```

  箭头函数

  ```jsx
  // 这样会解析错误
  const GenericComponent = <P>(props: P) => {
    const internalProp = useRef(props);
    return null;
  };
  // 泛型必须使用extends关键字才能解析
  const GenericComponent = <P extends any>(props: P) => {
    const internalProp = useRef(props);
    return null;
  };
  ```

## 事件

如果 props 或者 state 中定义了鼠标事件或者键盘事件，这些事件泛型包括：

| 表头                           | 表头            |
| ------------------------------ | --------------- |
| `ClipboardEvent<T = Element>`  | 剪贴板事件对象  |
| `DragEvent<T = Element>`       | 拖拽事件对象    |
| `ChangeEvent<T = Element>`     | Change 事件对象 |
| `KeyboardEvent<T = Element>`   | 键盘事件对象    |
| `MouseEvent<T = Element>`      | 鼠标事件对象    |
| `TouchEvent<T = Element>`      | 触摸事件对象    |
| `WheelEvent<T = Element>`      | 滚轮事件对象    |
| `AnimationEvent<T = Element>`  | 动画事件对象    |
| `TransitionEvent<T = Element>` | 过渡事件对象    |

具体使用

```tsx
import { MouseEvent } from 'react'

interface IProps {
  onClick(event: MouseEvent<HTMLDivElement>): void
}

const Element: SFC<IProps> = ({ onClick }) => {
  return <div onClick={onClick} />
}
```
