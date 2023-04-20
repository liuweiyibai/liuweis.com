/**
 * 将多个相同参数的函数串联执行
 * redux 中增强 store
 */

function compose(...args) {
  if (args.length === 0) {
    return (arg) => arg;
  }

  if (args.length === 1) {
    return () => args[0]();
  }

  return args.reduce((a, b) => (arg2) => a(b(arg2)));
}

let x = 10;
function fn1(x) {
  return x + 1;
}
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}

// 假设我这里想求得这样的值
let a = fn1(fn2(fn3(fn4(x)))); // 10 + 4 + 3 + 2 + 1 = 20

// 根据compose的功能，我们可以把上面的这条式子改成如下：
let composeFn = compose(fn1, fn2, fn3, fn4);
let b = composeFn(x); // 理论上也应该得到20

console.log(a,b)
