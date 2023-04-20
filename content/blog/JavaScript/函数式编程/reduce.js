//reduce函数
function reduce(actionFunction, list, initial) {
  var accumulate;
  var temp;
  if (initial) {
    accumulate = initial;
  } else {
    accumulate = list.shfit();
  }
  temp = list.shift();
  while (temp) {
    accumulate = actionFunction(accumulate, temp);
    temp = list.shift();
  }
  return accumulate;
}
