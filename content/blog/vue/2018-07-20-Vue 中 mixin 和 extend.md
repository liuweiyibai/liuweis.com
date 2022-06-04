---
title: Vue 中 mixin 和 extend
category:
  - Vue
date: 2018-07-20 12:11:55
---

## mixin

`mixin` 是组件复用的一种方式，组件中 `mixins` 选项接收一个混入对象的数组。这些混入对象可以像正常的组件实例对象一样包含组件实例选项，这些选项将会被合并到最终的组件选项中。

使用过 `React` 的都知道 `React` 中有高阶组件，高阶组件的作用就抽是象一些逻辑，达到组件复用的目的，而 Vue 中组件复用的方式就是 `mixins`

> 混入 (`mixins`) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

- 基本使用

  ```js
  // 定义 mixin
  export const commonMinxin = {
    data(){
      return {
        dataFirst:"1",
        dataSecond:"2"
      }
    },
    methods:{
      changeFirst(){
        ....
      }
    }
  }

  // App.vue 中使用 mixin
  import {commonMinxin} from './';
  export default {
    // 将我们预先定义好的可复用的部分(minxin)，注册到组件中
    mixins:[commonMinxin],
    methods:{
      ...
    },
    mounted(){
      console.log(this.$data);// 可以访问到 `commonMinxin` 预先定义的 `data`;
      this.changeFirst(); // 可以执行 `commonMinxin` 预先定义的methods
    },
  }
  ```

- 应用场景

  在项目中，如果我们需要提取公用的数据或者通用的方法，并且这些数据与方法不需要组件间进行维护，就可以使用 `mixins` 当做多个组件间公共模块进行维护。

- 特点

  1. 方法和参数在各组件中不共享。
  2. 值为对象的选项，如 methods,components 等，选项会被合并，键冲突的组件会覆盖混入对象的。
  3. 值为函数的选项，如 created, mounted 等，就会被合并调用，混合对象里的钩子函数在组件里的钩子函数之前调用。

- 与 vuex 的区别

  1. vuex 用来做状态管理的，里面定义的变量在每个组件中均可以使用和修改，在任一组件中修改此变量的值之后，其他组件中此变量的值也会随之修改。
  2. Mixins 可以定义共用的变量，在每个组件中使用，引入组件中之后，各个变量是相互独立的，值的修改在组件中不会相互影响。

- 与公共组件的区别

  1. 组件在父组件中引入组件，相当于在父组件中给出一片独立的空间供子组件使用，然后根据 props 来传值，但本质上两者是相对独立的。
  2. Mixins 则是在引入组件之后与组件中的对象和方法进行合并，相当于扩展了父组件的对象与方法，可以理解为形成了一个新的组件。

- mixins 中的异步请求

  当混合里面包含异步请求函数，而我们又需要在组件中使用异步请求函数的返回值时，我们应不要返回结果而是直接返回异步函数

- 如果 `mixins` 中定义的数据项和组件中定义的数据项重名了怎么办

  > 数据对象在内部会进行浅合并 (一层属性深度)，在和组件的数据发生冲突时以组件数据优先。

- 如果有重复的生命周期函数将怎么处理

  > 同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。

  ```js
  const mixin = {
    created: function () {
      console.log('混入对象的钩子被调用')
    },
  }

  new Vue({
    mixins: [mixin],
    created: function () {
      console.log('组件钩子被调用')
    },
  })
  // => "混入对象的钩子被调用"
  // => "组件钩子被调用"
  ```

- 全局混入

  > 一旦使用了全局混入，将会影响到所有 Vue 实例

  ```js
  // 为自定义的选项 'myOption' 注入一个处理器。
  Vue.mixin({
    created () {
      var myOption = this.$options.myOption
      if (myOption) {
        console.log(myOption)
      }
    }
  })

  new Vue({
    myOption: 'hello!'
    ...
  })
  // => "hello!"
  ```

## extend

vue.extend()方法其实是 Vue 的一个构造器，继承自 Vue，可以通过 extent 拓展全局组件

1. 首先我们新建一个 hello.vue

   ```html:title=hello.vue
   <template>
     <div>{{text}}</div>
   </template>
   <script>
     export default {
       name: 'hello',
       data() {
         return {
           text: '',
         }
       },
     }
   </script>
   ```

2. 接下来我们在同级新建一个 hello.js

   ```js:title=hello.js
   import Vue from 'vue'
   import HelloTemplate from './hello.vue'

   // 使用extend方法创建vue的子类
   const HelloConstructor = Vue.extend(HelloTemplate)

   // 使用这个方法调用hello组件
   function Hello(options) {
     options = options || {}
     if (typeof options === 'string') {
       options = {
         text: options,
       }
     }

     // 实例化子组件，然后获取到DOM结构并挂载到body上
     const helloInstence = new HelloConstructor({ data: options })
     helloInstence.vm = helloInstence.$mount()
     console.log(helloInstence.vm)
     document.body.appendChild(helloInstence.vm.$el)
   }
   export default Hello
   ```

- 最后在入口文件 main.js 引入

  ```js
  import Hello from './src/components/hello/hello;
  Hello({
    text:'hello world'
  })
  ```

## 二者区别

1. extend,extends, mixins 区别
2. Vue.extend 创建组件的构造函数，为了复用
3. mixins 可以混入多个 mixin，extends 只能继承一个
4. mixins 类似于面向切面的编程（AOP），extends 类似于面向对象的编程
5. 优先级 Vue.extend>extends>mixins
