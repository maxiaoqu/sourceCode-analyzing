/*
作用：定义一些Api的名称
时间：2020-04-17
作者：码小趣
联系：www.maxiaoqu.com  ||  maxiaoqu@gmail.com
*/

// 定义某个SSR渲染部分的属性
// 如果某个DIV设置data-server-rendered属性为'true'，表示这一部分的内容由服务器端渲染完成
export const SSR_ATTR = 'data-server-rendered'

// 全局注册、获取（组件、指令、过滤器）的名称
// ASSET_TYPES在后续使用时，会用到很多forEach循环
// 【参考Api】:https://cn.vuejs.org/v2/api/#Vue-directive
export const ASSET_TYPES = [
    //注册或获取全局【组件】
    'component',
    //注册或获取全局【指令】
    'directive',
    //注册或获取全局【过滤器】
    'filter'
]


// 声明生命周期的名称
// 【参考Api】:https://cn.vuejs.org/v2/api/#beforeCreate
export const LIFECYCLE_HOOKS = [
    // 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
    'beforeCreate',
    // 在实例创建完成后被立即调用
    'created',
    // 在挂载开始之前被调用
    'beforeMount',
    // 实例被挂载后调用
    'mounted',
    // 数据更新时调用
    'beforeUpdate',
    // 数据更新后时调用
    'updated',
    // 实例销毁之前调用
    'beforeDestroy',
    // 实例销毁后调用
    'destroyed',
    // 被 keep-alive 缓存的组件激活时调用
    'activated',
    // 被 keep-alive 缓存的组件停用时调用
    'deactivated',
    // 当捕获一个来自子孙组件的错误时被调用【2.5.0+ 新增】
    'errorCaptured',
    // 允许服务器端渲染时，通过`serverPrefetch`预先进行数据获取。返回一个promise【2.6.0新增】todo:目前不明确
    'serverPrefetch'
]
