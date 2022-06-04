---
title: JavaScript 原型链和原型链
date: 2018-09-05 12:20:10
category:
  - JavaScript
---

## 简介

JavaScript 中所谓的类（类是对象的抽象定义，对象是类的具现化），其实是一种设计模式，由一个构造函数（consturctor）和一个用于在该类实例间共享属性和方法的原型对象（Objcet.prototype）的结合。在 ES6 中已经出现了类的 api，但是使用 function 来构建类，能加深对于 JavaScript 的理解。

为了达到属性继承，代码复用等目的，通过函数来模拟类来创建对象。

> 为什么不通过 `Object` 创建对象？当 `new` 一个 `Object` 对象后，给 `Object` 对象增加属性和方法，确实可以生成一个对象。但这种做法实在太麻烦，且不易封装复用。

## 基础概念

- 原型

  原型就是一个叫做 `prototype` 的对象。在 JavaScript 中每一个数据类型都是一个对象，比如 number、string 就是构造函数 Number/String 的实例。每一个实例都有一个 `__proto__` 的属性，这个属性指向实例的构造函数的原型对象(`构造函数.prototype`)

  ```js
  var a = 123
  a.__proto__ === Number.prototype // true
  // 实例.__proto__ ==== 构造函数.prototype

  // Number 也是一个函数，只不过这个函数被当做构造器来使用，所以
  Number.__proto__ === Function.prototype // true
  ```

- 原型对象：构造函数/对象.prototype
- 指针：保存（系统内存的）地址
- 引用：初始化后，不可以改变的指针，在内存中的地址
- instanceof 用于判断一个变量是否某个对象的实例（原理是原型链查找）
- prototype 属性

  函数定义的时候函数本身就会默认有一个原型 prototype 的属性（是一个对象），并且该函数原型属性 prototype 中还会有一个 constructor 属性，并且该属性保存了指向这个函数的一个引用，而我们如果用 new 运算符来生成一个对象的时候就没有 prototype 属性。

- `__proto__`

  ```js
  var arr = new Array()
  arr instanceof Array // true
  arr instanceof Object // true; 这是因为 Array 是 Object 的子类
  function Animal() {}
  var a = new Animal()
  a instanceof Animal // true
  ```

- constructor 属性

  专门为 function（当前函数） 而设计的，它存在于每一个 function 的 prototype 属性中。这个 constructor 保存了指向 function（当前函数） 的一个引用

  ```js
  function F() {
    console.log('code')
  }
  var f = new F()
  F.prototype // Object {constructor: function}，是一个对象，对象中有一个constructor 属性
  F.prototype.constructor // function F(){console.log('code');}，这个属性指向了函数自己（固定套路）
  F.constroctor // function Function() { [native code] } 指向自己的构造函数，Function 对象
  f.constroctor // function F(){console.log('code');}，指向了自己的构造函数
  ```

- getPrototypeOf

- isPrototypeOf

## 工厂模式

- 用一个普通的函数来封装创建对象的过程

  ```js
  function creatMan(name, age, size) {
    let obj = new Object()
    obj.name = name
    obj.age = age
    obj.size = size
    obj.sayHi = function () {
      console.log(`姓名是${this.name},年龄是${this.age}...`)
    }
    return obj
  }

  /**
   * 使用这个对象
   */
  var p1 = creatMan('Jack', 32)
  var p2 = creatMan('Zhang', 30)
  p1.sayHi() //姓名是Jack,年龄是32...
  p2.sayHi() //姓名是Zhang,年龄是32...
  alert(p1 instanceof Object) //true
  alert(p2 instanceof Object) //true
  // 如果你有一堆对象，有Person有Dog等等，你无法区分这些对象中哪些是Person哪些是Dog。为了解决上述缺陷，引入了构造函数的概念，使用工厂模式，你无法找到你对象是哪一个。
  ```

## 构造函数模式

通过构造函数来进行封装

- 使用一个函数来构建一个对象

  ```js
  function Man(name, age, size) {
    if (!(this instanceof Person)) {
      return new Person(name, age, size) // 这是防止使用的时候没有用new来调用，this指的是调用这个构造函数的对象
    }
    this.name = name
    this.age = age
    this.size = size
    this.sayHi = function () {
      console.log(`姓名是${this.name}，年龄是${this.age}...`)
    }
  }
  var p1 = new Man('Jack', 32) //用new操作符来调用
  var p2 = new Man('Zhang', 30)
  p1.sayHi() // 姓名是Jack,年龄是32...
  p2.sayHi() // 姓名是Zhang,年龄是30...
  alert(p1 instanceof Object) //true,显然创建的对象都既是Object，也是Person
  alert(p1 instanceof Man) //true
  alert(p2 instanceof Object) //true
  alert(p2 instanceof Man) //true

  alert(p1.constructor == Person) //true
  alert(p1.constructor == Dog) //false，这样就能区分对象究竟是Person还是Dog了
  p1 === p2 // false  因为是同一个构造函数new出来的两个不同的实例，实例在内存中有不同的指针，也就是说，两个对象互相之间的属性和方法都是私有的，不能进行共享，但是实质上是一样的，但却不是公有的。两个实例内部都执行同一段代码，但是在内存中创建了两个内存地址。
  p1.sayHi === p2.sayHi // false 理由同上
  ```

工厂模式和构造函数模式，有以下不同：

1. 没有 var o = new Object();创建对象，自然最后也没有 return o;返回对象
2. 没有将属性和方法赋给 Object 对象，而是赋给 this 对象
3. 因为方式 2 中函数内部使用了 this 对象，因此必须用 new 操作符来创建对象：

   ```js
   var p = new Man('Jack', 32)
   p.sayHi() // 姓名是Jack,年龄是32...
   ```

- 如果方式 2 中，你忘记用 new 操作符来创建对象的话

  ```js
  var p = Man('Jack', 32)
  p //undefined,你相当于调用了这个Man函数，但是没有返回值，所以是undefined
  this.name //Jack 这时候的this指向的是window
  this.age //32
  // 构造函数与普通函数唯一的区别，就在于它们的调用方式不同，只要通过new操作符来调用，那它就可以作为构造函数。但构造函数毕竟也是函数，并不存在任何特殊的语法。
  ```

## 原型模式

- prototype

  每个函数都有个 prototype 属性，该属性其实是一个指针，指向一个对象，称为原型对象。原型对象中包含着可供所有实例共享的属性和方法。这样不用每次创建实例，实例中都会可以构造函数内的方法，可以在原型链上寻找。

  ```js
  function Person(name, age) {
    this.name = name
    this.age = age // /name和age没有放到原型对象中，而是仍旧留在构造函数内部，表示不希望每个实例都共享这两个属性
  }
  Person.prototype = {
    // 重写原型对象
    sayName: function () {
      console.log(`姓名是${this.name},年龄是${this.age}...`)
    },
  }
  var p1 = new Person('Jack', 32) // 用 new 操作符来调用
  var p2 = new Person('Zhang', 30)
  p1.sayName() // 姓名是Jack,年龄是32...
  p2.sayName() // 姓名是Zhang,年龄是30...
  p1.sayName == p2.sayName // true 都是指向的是原型对象上的方法，所以是true

  // 实例也有一个 constructor 属性了（从 prototype 那里获得的），每一个对象实例都可以通过 constrcutor 对象访问它的构造函数
  p1.constructor === Person // true
  p1.constructor === Person.prototype.constructor // true
  p1 instanceof Person // true
  ```

## 继承

一个子类对象可以获得其父类的所有属性和方法，称之为继承

- 为什么说 constructor 易变，因为函数的 prototype 属性容易被更改

  ```js
  function F() {}
  F.prototype = {
    _name: 'Eric',
    getName: function () {
      return this._name
    },
  }
  var f = new F()
  alert(f.constructor === F) //  false，本来实例的constructor属性是指向构造函数的，因为这里我们对构造函数的prototype进行了重写
  ```

- 实现继承的几种方式

  - 原型继承

    ```js
    function Parent() {
      this.name = '父亲' // 实例基本属性 (该属性，强调私有，不共享)
      this.arr = [1] // (该属性，强调私有)
    }
    Parent.prototype.say = function () {
      // -- 将需要复用、共享的方法定义在父类原型上
      console.log('hello')
    }
    function Child(like) {
      this.like = like
    }
    Child.prototype = new Parent() // 核心

    let boy1 = new Child()
    let boy2 = new Child()

    // 优点：共享了父类构造函数的say方法
    console.log(boy1.say(), boy2.say(), boy1.say === boy2.say) // hello , hello , true

    // 缺点1：不能传参数
    // 缺点2：属性不是私有的，重写会被覆盖
    console.log(boy1.name, boy2.name, boy1.name === boy2.name)
    // 父亲，父亲，true

    boy1.arr.push(2)
    // 修改了boy1的arr属性，boy2的arr属性，也会变化，因为两个实例的原型上(Child.prototype)有了父类构造函数的实例属性arr；所以只要修改了boy1.arr,boy2.arr的属性也会变化。  ----  原型上的arr属性是共享的。
    console.log(boy2.arr) // [1,2]
    // 注意：修改boy1的name属性，是不会影响到boy2.name。因为name是基本属性，不是引用属性。
    ```

  - 组合继承

    ```js
    function Super(name, age) {
      this.name = name
      this.age = age
    }
    function Sub(name, age, sex) {
      Super.call(this, name, age)
      this.sex = sex
    }
    // 原型继承
    Sub.prototype = new Super()
    // 构造函数指向自己
    Sub.prototype.constructor = Sub
    // 这种方式的缺点就是会调用两次父类的构造函数
    ```

  - 组合寄生

    组合寄生就是为了避免调用两次父类构造函数的问题

    ```js
    function Super(name, age) {
      this.name = name
      this.age = age
    }
    function Sub(name, age, sex) {
      Super.call(this, name, age)
      this.sex = sex
    }

    function extend(superType, childType) {
      // constructor 也可以通过 create 第二个参数来指定
      let proto = Object.create(superType.prototype)
      childType.prototype = proto
      // 记得 constructor
      childType.prototype.constructor = childType
    }

    // 这种方法可以同时继承多个父类，缺点是父类的查找过程多了一层 __proto__
    extend(Super, Sub)
    ```

- ES6 继承

  ES6 继承通过原生 api extends 完成，参考[阮老师的文档](https://es6.ruanyifeng.com/?search=extends&x=0&y=0#docs/class-extends)

## 总结

原型对象，继承机制是基于原型，要理解 JavaScript 的继承机制，需要更深入了解原型对象。
