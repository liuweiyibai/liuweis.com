---
title: 详解 Ts 中常用的泛型工具
date: 2021-08-20 22:10:00
category:
  - TypeScript
thumbnail: "./images/typescript-logo.png"
draft: false
---

### `Omit< key:value,key>`

作用：基于已经声明的类型进行属性剔除获得新类型

用例：

```ts
type User = {
  id: string

  name: string

  email: string
}

type UserWithoutEmail = Omit<User, "email">
// UserWithoutEmail ={id: string;name: string;}
```

### `Pick< key:value,key>`

作用：从 KeyValue 中挑选出部分 Key 对应的类型当作新类型使用（与 omit 相反，omit 是剔除声明项，pick 是挑选声明项）

用例：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, "title" | "completed">

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
}
```

### `Exclude<T, U>`

作用：T 中取 T、U 交集的补集

与 `Omit` 作比较：

`Omit` 左右两个参数属于不同类型，左是一个完整的类型，包含 key、value
`Exclude` 左右两个参数属于同种类型

用例：

```ts
type T0 = Exclude<"a" | "b" | "c", "a">
// "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">
// "c"
type T2 = Exclude<string | number | (() => void), Function>
// string | number
```

### 三者比较

- 相同点：

  - 三种工具类都是使用已有的类型进行属性过滤获得新的类型
  - `Omit` 和 `Exclude` 都是做属性剔除
  - `Omit` 和 `Pick` 的参数类型都是`<{key:value},key>`

- 不同点：

  - `Exclude` 的参数类型没有限制，可以是字面量也可以是具体的类型如 `string`、`boolean` 等，而 `Omit` 和 `Pick` 的第二参数则必须是第一参数的子属性

- `Pick` 搭配 `Exclude` 实现 `Omit：Exclude` 先剔除不要的键名，挑出想要的键名，`Pick` 再从键值对中根据键名挑选出来。
  实现公式：`Omit=Pick<T,Exclude<keyof T,K>>`。其中：`T:<key,value>` 、`K:key`
