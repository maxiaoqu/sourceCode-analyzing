/* @flow */

/*
作用：全局工具函数，整个代码库通用的代码
时间：2020-04-17
作者：码小趣
联系：www.maxiaoqu.com  ||  maxiaoqu@gmail.com
*/

// 生成一个被冻结的新对象，此对象不可被修改
export const emptyObject = Object.freeze({})

// 判断未定义
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

// 判断已定义
export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

/**
 * These helpers produce better VM code in JS engines due to their
 * explicitness and function inlining.
 */
// 判断值为true
export function isTrue (v: any): boolean %checks {
  return v === true
}

// 判断值为false
export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 * Check if value is primitive.
 */
// 判断值是简单的原始的数据类型
export function isPrimitive (value: any): boolean %checks {
  return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
// 用于判断是不是一个json类型的object
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
//  获取值的原始类型字符串
// Object.prototype.toString：精确判断对象的类型
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  // 截取'[object '、']',得到正确的数据类型
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
// 严格的对象类型检查，只返回true，
// 针对简单的javascript对象，
// 使用上面的toRawType也可以判断
export function isPlainObject (obj: any): boolean {
  // 可以用toRawType: return toRawType(obj) === 'Object'
  return _toString.call(obj) === '[object Object]'
}

// 判断是不是正则表达式
export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
// 检查值是不是一个有效的数组索引
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  // isFinite： 判断数值是不是一个有限数值
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 判断是否返回一个promise
export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
// 将值转化成它实际显示的字符串
// 如果值为null，则转化成字符串
// 如果是数组及对象，就使用JSON.strinify
// 其他都使用String
// 注意字面量对象不能直接使用{}.toString()这样写，会报错。可换成({}.toString())
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
// 将输入的字符串值转换成一个数字，以实现持久性
// 如果输入的值不能转换成数字，则返回输入的原始字符串
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
// @param {*} str 字符串，会以逗号分隔拆分成数组，数组的每个值是map的key，值全是true
// @param {*} expectsLowerCase 是否转换成小写
// @return 返回一个方法，方法接收一个val参数
// eg: var map = makeMap('a,b,c,D,e');
// console.log(map('a')) // true
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  // Object.create()：创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  const map = Object.create(null)
  // str.split(',')：把一个字符串分割成字符串数组
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 */
// 检查标签是不是内置的标签，不区分大小写
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 */
// 检查属性是否是保留属性，区分大小写
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array.
 */
// 删除数组中的某一项（如果有重复的字，只会删除第一个）
// @param {*} arr 数组
// @param {*} item 要删除的数组值
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    // arr.indexOf(): 返回数组中某个指定的元素位置，不存在时返回 -1
    const index = arr.indexOf(item)
    if (index > -1) {
      // arr.splice():向/从数组中添加/删除项目，然后返回被删除的项目
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
// 检查对象是否具有某个属性
// @param {*} obj 对象可以是任意Object或Array数组
// @param {*} key 必须是字符串
// Object.prototype.hasOwnProperty:判断一个属性是定义在对象本身而不是继承自原型链
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
// 对纯函数创建一个缓存版本
// 这个函数是不是觉得有点不好理解?它的作用是什么?
// 理解：缓存一个函数执行的结果，下次再执行相同的函数时，如果key相同，则不再执行原函数，直接从cache中通过key取值即可
// 可把下面test代码复制到浏览器console里执行
/**
 // 举例说明
 function cached(fn) {
    const cache = Object.create(null)
    return (function cachedFn(str) {
    console.log(cache)
      const hit = cache[str]
    var cc = hit || (cache[str] = fn(str))
      return cc
    })
  }
 var test = function(){
    console.log('执行计算');
    return 1+2;
  }
 var testCache = cached(test);
 console.log(testCache)
 console.log(testCache('sum1'))
 console.log(testCache('sum2'))
 console.log(testCache('sum1'))

 // 执行后打印结果:
 {}
 执行计算
 3
 {sum1: 3}
 执行计算
 3
 {sum1: 3, sum2: 3}
 3
 // 从上面打印可以看出，执行两次计算，在第二次调用testCache('sum1')时，没有再执行计算，直接从缓存中取的结果 *
*/
export function cached<F: Function> (fn: F): F {
  // Object.create()：创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * Camelize a hyphen-delimited string.
 */
// 把通过"-"连接符连接的字符串，转化成驼峰格式，第一个词不做处理
// 如 'an-great-boy' => 'anGreatBoy','An-great-boy' => 'AnGreatBoy','An-_great-_boy' => 'An_great_boy'
// 匹配连接符(-)后面的 A-Za-z0-9_
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  // str.replace():在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
  // str.toUpperCase(): 把字符串转换为大写
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
// 转化字符串的首字母大写
export const capitalize = cached((str: string): string => {
  // str.charAt():返回指定位置的字符
  // str.toUpperCase(): 把字符串转换为大写
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 */
// 将驼峰字符串转换成连接符连接（-）
// 如：anGreatBoy => an-great-boy
// 匹配非单词边界后面的大写字母（\B:非单词边界 \b:单词边界）
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  // str.replace():在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
  // str.toLowerCase():把字符串转换为小写
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */
/* istanbul ignore next */
// 为不支持bind方法的环境，提供简单的bind polyfill
// 例如:PhantomJS 1.x。从技术上讲，我们不再需要这个了
// 因为原生的bind 在大多数浏览器中性能已经足够用了
// 但是删除它意味着破坏能够运行的代码
// PhantomJS 1。为了向后兼容，这个必须保留
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
            // Function.apply():调用一个函数, 其具有一个指定的this值, 作为一个数组（或类似数组的对象arguments）的形式整体传入
        ? fn.apply(ctx, arguments)
            // Function.call():调用一个函数, 其具有一个指定的this值, 提供的参数(参数的列表)一个个分别传入
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

// 原生的bind方法
function nativeBind (fn: Function, ctx: Object): Function {
  // Function.bind():创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列
  return fn.bind(ctx)
}

// 判断bind，兼容的bind方法
export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * Convert an Array-like object to a real Array.
 */
// 转化一个类数组为真正的数组
// @param {*} list 传入的类数组
// @param {*} start 开始转化的index序号
// @return {Array} 返回一个新数组
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 */
// 将属性混合到目标对象中
// @param {*} to 目标对象
// @param {*} _from 需要混合的对象
// @return {Object} 返回一个新对象
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
// 将对象数组(类似[{color:'red'},{width:'230px'}])合并为单个对象
// eg: toObject([{color:'red'},{width:'230px'}]) => {color: "red", width: "230px"}
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https:////flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
// 定义空操作
export function noop (a?: any, b?: any, c?: any) {}

/**
 * Always return false.
 */
// 始终返回false
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
// 传入什么参数，最后总是返回当前参数
export const identity = (_: any) => _

/**
 * Generate a string containing static keys from compiler modules.
 */
// 生成一个包含编译器模块静态键值的字符串
/*
// eg:
var test = genStaticKeys([{
  staticKeys:'a'
},{
  staticKeys:'b'
},{
  staticKeys:'c'
}])

console.log(test) // a,b,c
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  // Array.reduce():计算数组元素相加后的总和
  return modules.reduce((keys, m) => {
    // Array.concat():合并、连接两个或多个数组得到一个新的数组
    return keys.concat(m.staticKeys || [])
    // Array.join():把数组中的所有元素放入一个字符串
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
// 判断两个对象内部结构是否相同（严格上来说两个对象是不相等，所以叫loose equal(松散相等？))
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  // A和B都是对象
  if (isObjectA && isObjectB) {
    try {
      // Array.isArray():判断对象是否为数组
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      // A和B都是数组
      if (isArrayA && isArrayB) {
        // Array.every():检测数组中的所有元素是否都大于等于某个值
        // 两个数组长度相等，循环递归
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
        // instanceof: 用来判断一个构造函数的prototype属性所指向的对象是否存在另外一个要检测对象的原型链上
        // A和B是时间对象，则比较毫秒值
      } else if (a instanceof Date && b instanceof Date) {
        // Date.getTime():// 可返回距1970年1月1日之间的毫秒数
        return a.getTime() === b.getTime()
        // A和B都不是数组
      } else if (!isArrayA && !isArrayB) {
        // Object.keys():返回一个由一个给定对象的自身可枚举属性组成的数组
        // eg: var a = { name: {age:34}};
        // console.log(Object.keys(a)) // ['name']
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        // Array.every():检测数组中的所有元素是否都大于等于某个值
        // 两个对象一级key长度相等，循环递归
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
    // A 和B 都不是对象，则转换成字符串比较
  } else if (!isObjectA && !isObjectB) {
    // String():把对象的值转换为字符串
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
// 返回松散相等的两个值的第一个索引，如果找不到则返回-1
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
// 确保一个函数只被调用了一次
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
