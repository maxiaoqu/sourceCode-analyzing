/*
作用：在原型上添加了各种属性和方法
时间：2020-04-18
作者：码小趣
联系：www.maxiaoqu.com  ||  maxiaoqu@gmail.com
*/

import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 定义Vue构造函数
function Vue (options) {
  // 判断是生产环境或开发环境：production（生产环境）、development（开发环境）
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // _init():在'./init.js'里被数组设置全局变量
  this._init(options)
}

// 在vue的原型上添加了_init方法。在执行new Vue()的时候，this._init(options)被执行
initMixin(Vue)
// 在vue的原型上定义了属性: $data、$props，方法：$set、$delete、$watch
stateMixin(Vue)
// 在原型上添加了四个方法: $on $once $off $emit
eventsMixin(Vue)
// 在Vue.prototye上添加了三个方法：_update $forceUpdate $destory
lifecycleMixin(Vue)
// 在原型上添加了方法：$nextTick _render _o _n _s _l _t _q _i _m _f _k _b _v _e _u _g _d _p
renderMixin(Vue)

export default Vue
