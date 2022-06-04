//map函数
var map = function (mappingFunction, list) {
  var result = [];
  forEach(list, function (item) {
    result.push(mappingFunction(item));
  });
  return result;
};
