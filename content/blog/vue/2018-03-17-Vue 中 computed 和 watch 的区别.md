---
title: Vue 中 computed 和 watch 的区别
category:
  - Vue
date: 2018-03-17 22:13:45
---

computed 和 watch 都可以观察页面的数据变化。当处理页面的数据变化时，我们有时候很容易滥用 watch。 而通常更好的办法是使用 computed 属性，而不是命令是的 watch 回调。

计算属性是计算属性，观察是观察。计算属性顾名思义就是通过其他变量计算得来的另一个属性，fullName 在它所依赖 firstName，lastName 这两个变量变化时重新计算自己的值。计算属性具有缓存。计算属性是基于它们的依赖进行缓存的。计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 lastName 和 firstName 都没有发生改变，多次访问 fullName 计算属性会立即返回之前的计算结果，而不必再次执行函数。而观察 watch 是观察一个特定的值，当该值变化时执行特定的函数。例如分页组件中，我们可以检测页码执行获取数据的函数。

computed 和 watch 都可以观察页面的数据变化。当处理页面的数据变化时，我们有时候很容易滥用 watch。 而通常更好的办法 是使用 computed 属性，而不是命令是的 watch 回调。 这里我直接引用 Vue 官网的例子来说明：

计算属性是计算属性的依赖的任何一个值发生变化，就会更新计算属性的值。

```html
<!-- 实现效果第三个表单的值 是第一个和第二个的拼接，并且在前俩表单数值变化时，第三个表单数值也在变化 -->
<div id="myDiv">
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
  <input type="text" v-model="fullName" />
</div>
<script>
  new Vue({
    el: '#myDiv',
    data: {
      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar',
    },
    // 使用watch
    watch: {
      firstName: function (val) {
        this.fullName = val + ' ' + this.lastName
      },
      lastName: function (val) {
        this.fullName = this.firstName + ' ' + val
      },
    },
    // 使用计算属性
    computed: {
      fullName: function () {
        return this.firstName + ' ' + this.lastName
      },
    },
  })
</script>
```

很容易看出 computed 在实现上边的效果时，是更简单的。

详解 comouted 计算属性：对于任何复杂逻辑，你都应当使用计算属性。
在 Vue 的模板内（双花括号）是可以写一些简单的 js 表达式的。但是如果在页面中使用大量或是复杂的表达式去处理数据，对页面的维护会有很大的影响。我们在模板内就要写一个计算属性值，这个时候就需要用到 computed 计算属性来处理复杂的逻辑运算。

1. 优点：
   在数据未发生变化时，优先读取缓存。computed 计算属性只有在相关的数据发生变化时才会改变要计算的属性，当相关数据没有变化是，它会读取缓存。而不必想 motheds 方法 和 watch 方法是的每次都去执行函数。

2. setter 和 getter 方法：（注意在 Vue 中书写时用 set 和 get）
   setter 方法在设置值是触发。
   getter 方法在获取值时触发。

```js
// 计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter
computed:{
  fullName:{
    // 设置值
    set(){
      alert("set");
    },
    // 取值
    get(){
      alert("get");
      return  this.firstName  + " " +this.lastName;
    },
  }
}
```

watch 方法
虽然计算属性在大多数情况下是非常适合的，但是在有些情况下我们需要自定义一个 watcher，在数据变化时来执行异步操作或开销较大的操作时，这时 watch 是非常有用的。
