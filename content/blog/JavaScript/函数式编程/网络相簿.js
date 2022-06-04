function curry(func) {
	return function curried(...args) {
		if (args.length >= func.length) {
			return func.apply(this, args)
		} else {
			// 否则返回另外一个包装器
			return function (...args2) {
				return curried.apply(this, [...args, ...args2])
			}
		}
	}
}

var trace = curry(function (tag, x) {
	console.log(tag, x)
	return x
})

// trace('tag','x') 测试 trace 函数
trace('tag')

var Impure = {
	getJSON: curry(function (callback, url) {
		$.getJSON(url, callback)
	}),

	setHtml: curry(function (sel, html) {
		$(sel).html(html)
	}),
}

// 构造一个 url 传给
var url = function (term) {
	return (
		'https://api.flickr.com/services/feeds/photos_public.gne?tags=' +
		term +
		'&format=json&jsoncallback=?'
	)
}

/**
 * app 是一个新函数
 * compose 返回一个新函数，compose 参数的执行顺序，从右到左
 * 所以 url 函数返回的值是 Impure.getJSON(trace('response')) 函数的参数1，
 * 所以 Impure.getJSON(url(), trace('response'))
 */
var app = compose(Impure.getJSON(trace('response')), url)

app('cats')
