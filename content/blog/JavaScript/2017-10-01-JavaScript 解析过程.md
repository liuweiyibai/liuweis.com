---
title: JavaScript 解析过程
date: 2017-10-01 18:24:58
thumbnail: "../../assets/thumbnails/js.png"
category:
  - JavaScript
---

对于常见编译型语言（例如：Java）来说，编译步骤分为：词法分析->语法分析->语义检查->代码优化和字节码生成。

对于解释型语言（例如 JavaScript）来说，通过词法分析 -> 语法分析 -> 语法树，就可以开始解释执行了。

具体过程：

1. 词法分析是将字符流(char stream)转换为记号流(token stream)
2. 语法分析成 AST (Abstract Syntax Tree)
3. 预编译，当 JavaScript 引擎解析脚本时，它会在预编译期对所有声明的变量和函数进行处理！并且是先预声明变量，再预定义函数！

## 变量查找过程

JavaScript 引擎通过作用域链（scope chain）把多个嵌套的作用域串连在一起，并借助这个链条帮助 JavaScript 解释器检索变量的值。这个作用域链相当于一个索引表，并通过编号来存储它们的嵌套关系。当 JavaScript 解释器检索变量的值，会按着这个索引编号进行快速查找，直到找到全局对象（global object）为止，如果没有找到值，则传递一个特殊的 undefined 值。
