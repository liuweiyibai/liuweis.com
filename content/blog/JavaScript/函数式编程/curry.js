const { curry, map } = require('lodash');

const _map = curry(function (f, xs) {
  return xs.map(f);
});
const _split = curry(function (what, x) {
  return x.split(what);
});
// 练习 1
//==============
// 通过局部调用
var words = _split('');
console.log(words('hello world'));

// 练习 2
//==============
// 使用 `map` 创建一个新的 `words` 函数，使之能够操作字符串数组

var sentences = map(words);

console.log(sentences);
