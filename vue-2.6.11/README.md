<p align="center">
    <a href="http://www.maxiaoqu.com/">
        <img width="300" src="http://www.maxiaoqu.com/maxiaoqu.png">
    </a>
</p>

<h2>
    vue源代码解析
    <h4>Vue 源码注释版 及 Vue 源码详细解析</h4>
</h2>

## 相关链接
- [gitHub地址](https://github.com/maxiaoqu/sourceCode-analyzing)

## 主要维护人员
|人员|github账号|头像|作者博客|作者网站|联系邮箱|
|---|---|---|---|---|---|
|码小趣|[maxiaoqu](https://github.com/maxiaoqu) |  ![](https://avatars1.githubusercontent.com/u/25891598?s=60&v=4)|http://blog.maxiaoqu.com|http://www.maxiaoqu.com|maxiaoqu@gmail.com

## 阅读前需要准备的知识
- [需要准备的知识](https://www.jianshu.com/p/c914ccd498e7)
在这里列举几个比较重要的
### 一、flow
做为了解
- [flow官方](https://flow.org/en/docs/getting-started/)是 facebook 出品的 JavaScript 静态类型检查工具。Vue.js 的源码利用了 Flow 做了静态类型检查，所以了解 Flow 有助于我们阅读源码。

#### Vue为什么用 Flow
- **做为类型检查**：类型检查是当前动态类型语言的发展趋势，所谓类型检查，就是在编译期尽早发现（由类型错误引起的）bug，又不影响代码运行（不需要运行时动态检查类型），使编写 JavaScript 具有和编写 Java 等强类型语言相近的体验。
- **保证项目的维护性和增强代码的可读性**：Vue.js 在做 2.0 重构的时候，在 ES2015 的基础上，除了 ESLint 保证代码风格之外，也引入了 Flow 做静态类型检查。之所以选择 Flow，主要是因为 Babel 和 ESLint 都有对应的 Flow 插件以支持语法，可以完全沿用现有的构建配置，非常小成本的改动就可以拥有静态类型检查的能力。

#### Flow 的工作方式
- **类型推断**：通过变量的使用上下文来推断出变量类型，然后根据这些推断来检查类型。
- **类型注释**：事先注释好我们期待的类型，Flow 会基于这些注释来判断。

#### Flow 在 Vue.js 源码中的应用
在 Vue.js 的主目录下有 .flowconfig 文件， 它是 Flow 的配置文件，感兴趣的可以看官方文档。这其中的 [libs] 部分用来描述包含指定库定义的目录，默认是名为 flow-typed 的目录。
这里 [libs] 配置的是 flow，表示指定的库定义都在 flow 文件夹内。我们打开这个目录，会发现文件如下：
```shell
【注意：flow目录在此并没有引进来，想要看的话自己下载vue.js的原始代码查看】
flow
├── compiler.js        # 编译相关
├── component.js       # 组件数据结构
├── global-api.js      # Global API 结构
├── modules.js         # 第三方库定义
├── options.js         # 选项相关
├── ssr.js             # 服务端渲染相关
├── vnode.js           # 虚拟 node 相关
```
从这个目录可以看到，Vue.js 有很多自定义类型的定义，在阅读源码的时候，如果遇到某个类型并想了解它完整的数据结构的时候，可以回来翻阅这些数据结构的定义。 

#### Flow书写案例
```js
//【注意：/*@flow*/是他的标准声明方式】
/*@flow*/
function split(str) {
  return str.split(' ')
}
split(11)  
```

### 二、原生JavaScript
要有一定的原生 JavaScript 的功底，尤其对数组、对象的操作得特别清楚
- [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [w3school](https://www.w3school.com.cn/js/index.asp)


### 三、Vue
要有使用vue做过2个以上的项目，并且对vue的大部分知识、Api有一定的基础
- [vue教程](https://cn.vuejs.org/v2/guide/)
- [vue Api](https://cn.vuejs.org/v2/api/)

## Vue.js 源码目录设计
```shell
【注意：本目录主要是vue.js的原始代码文件中的'src'文件夹】
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

## 解析目录
- [首页](https://github.com/maxiaoqu/sourceCode-analyzing)
    - [vue源码解析（基于2.6.11版本）](/vue-2.6.11)
        - [compiler（编译相关）](/vue-2.6.11/compiler)
        - [core（核心代码）](/vue-2.6.11/core)
        - [platforms（不同平台的支持）](/vue-2.6.11/platforms)
        - [server（服务端渲染）](/vue-2.6.11/server)
        - [sfc（.vue 文件解析）](/vue-2.6.11/sfc)
        - [shared（共享代码）](/vue-2.6.11/shared)


## 源码目录详细说明
### compiler【编译相关】
* compiler 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。
* 编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

### core【核心代码】
* core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。
* 这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方

### platforms【不同平台的支持】
* Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。
* 我们会重点分析 web 入口打包后的 Vue.js，对于 weex 入口打包的 Vue.js，感兴趣的可以自行研究。

### server【服务端渲染】
* Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。
* 服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

### sfc【.vue 文件解析】
* 通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。
* 这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

### shared【共享代码】
* Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

## 总结
* 从 Vue.js 的目录设计可以看到，作者把功能模块拆分的非常清楚，相关的逻辑放在一个独立的目录下维护，并且把复用的代码也抽成一个独立目录。
* 这样的目录设计让代码的阅读性和可维护性都变强，是非常值得学习和推敲的。