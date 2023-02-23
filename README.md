<!--
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-14 10:06:25
 * @LastEditTime: 2023-02-22 16:48:55
-->

# Getting Started with Create React App

## 配置修改

- 修改端口号/域名
- 修改环境变量
  - cross-env：
    - npm i cross-env
    - 通过 cross-env 修改端口
      ```json
        //package.json
        "scripts": {
          "start": "cross-env PORT=8080 node scripts/start.js",
          "build": "node scripts/build.js",
          "test": "node scripts/test.js"
        },
      ```
- 修改浏览器兼容，实现浏览器兼容
  ```json
    //package.json
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
  ```
  - 对 postcss-loader 生效：控制 css3 的前缀
  - 对 bable-loader 生效：控制 es6 的妆换
  - 无法处理 es6 内置 api 的兼容：使用@babel/polyfill 对常见内置 API 进行重写
- 处理跨域
  - 在 src 目录下新建 setupProxy.js 文件
  - 安装依赖：npm i http-proxy-middleware
    - http-proxy-middleware：实现跨域代理模块，[webpack-dev-server 的跨域代理原理，也是基于它完成]
  ```javascript
  const { createProxyMiddleware } = require("http-proxy-middleware");
  module.exports = function (app) {
    app.use(
      createProxyMiddleware("/api", {
        target: "", //代理地址
        changeOrigin: true,
        ws: true,
        pathRewrite: { "^/api": "" },
      })
    );
  };
  ```

## react 基础

- 不直接操作 DOM，而是数据操作
  - 操作 DOM：想操作 A，要先获取 A
    - 缺点：消耗性能 主要原因：可能导致 DOM 回流/重绘
    - 操作前要先获取 DOM，相对麻烦
  - 数据驱动
    - 修改数据后，框架会按照相关数据，让页面重新渲染。
    - 不直接操作 DOM：而是操作虚拟 DOM
      - 从而实现了「虚拟 DOM->真实 DOM」的渲染体系
      - 有效避免 DOM 的回流/重绘，性能相对较好
- 视图
  - react：MVC 模式---数据驱动视图渲染
    - 构建视图层
    - 构建数据层：凡事要在视图中动态获取的，都需要有对应的数据模型
    - 控制层：修改相关数据，react 重新渲染视图
    - 单向驱动
  - vue：MVVM 模式---数据驱动视图渲染，而且可以监听视图修改数据（如表单数据）
    - modle,view,viewmodle
    - 双向驱动
- JSX 基础知识
  1. JS 表达式
  - 变量/值
  - 数字运算
  - 判断：三元表达式
  - 循环：数组方法（map）
  2. ReactDOM.createRoot 的时候不能把 HTML/BODY 作为根容器
  3. 只能有一个根节点
  4. react 提供特殊标签[<></>]空文档标记标签:React.Fragment
  - 既保证的既有一个根节点，又不新增一个 HTML 层级结构
  5. {} 胡子语法中嵌入不同的值，所量现出来的特点
  - number/string：值是啥，就渲染出来啥
  - boolean/null/undefined/Symbol/BigInt：渲染的内容是空
  - 除数组对象外，其余对象一般都不支持在{}中进行渲染，但是也有特殊情况：
    - JSx 虚拟 DOM 对象
    - 给元素设置 style 行内样式，要求必须写成一个对象格式
  - 数组对象：把数组的每一项都分别拿出来渲染「井不是变为宇符串渲染，中间没有逗号」
  - 函数对象：不支持在{}中渲染，但是可以作为函数组件，用 <Component/＞ 方式渲染！！
  6. 数组 tip
  - 稀疏数组：创建长度为 N 的数组，其每一项都是 empty
    - new Array(5)
    - 稀疏数组不可循环
    - 基于数组的 fill 方法进行数据填充，把稀疏数组变为密集数组
    ```javascript
    const arr1 = new Array(5); // 稀疏数组
    let arr2 = arr1.fill(null); // 密集数组
    ```
  - 密集数组：每一项都不是 empty
  - for/in 缺点：性能消耗大
    - 既可以迭代共有属性，也可以迭代私有属性
    - 只能迭代“可枚举，非 symbol 类型”的属性
  - 枚举：可以被列举，例如被 for/in,Object.keys 等列举出来
    - 一般来说，内置属性都是不可被枚举的
    - 自定义属性都是可以被枚举的
    - 修改成员的枚举属性：Object.defineProperty()
  - 获取所有私有属性：包括私有属性，不可枚举属性，且不论类型
    - Object.getOwnPropertyNames(arr).concat(Object.getOwnPropertySymbols(arr))
      - Object.getOwnPropertyNames()：获取对象非 symbol 类型的私有属性（无关是否可枚举）
      - Object.getOwnPropertySymbols()：获取对象 symbol 类型的私有属性
    - Reflect.ownKeys(arr)
      - 缺点：ES6 方法，不兼容 IE
  7. JSX 底层处理机制
  - 第一步：把我们编写的 JSX 语法，编译为虛拟 DOM 对象 「virtualDoMj
    - 虚拟 DOM 对象：框架自己内部构建的一套对象体系（对象的相关成员都是 React 内部规定的），基于这些属性描述出，我们所构建视圈中的，DOM 节点的相关特征！！
    - 1. 基于 babel-preset-react-app 把 JSX 编译为 React.createElement（）这种格式
      - 只要是元素节点，必然会基于 createElement 进行处理！
      - React.createElement (ele, props, . . .children)
        - ele：元素标签名「或组件」
        - props：元素的属性集合(对象）「如果没有设置过任何的属性，则此值是 null
        - children：第三个及以后的参数，都是当前元素的子节点
    - 2. 再把 createElement 方法执行，创建出 virtualDOM 虚拟 DOM 对象「也有称之为：JSX 元素、JSX 对象、ReactChild 对象。。」！
      ```javascript
        virtualDOM = {
          $$typeof: Symbol(react.element) ,
          ref: null,
          kev: null
          type： 标签名「或组件」
          // 存储了元素的相关属性 8& 子节点信息
          props: {
            元素的相关属性
            children:子节点信息「没有子节点则没有这个属性、属性值可能是一个值、也可能是一个数组
          }
        }
      ```
  - 第二步：把构建的 virtua1DOM 渲染为真实 DOM
    - 真实 DOM：浏览器页面中，最后渲染出来，让用户看见的 DOM 元素！！
    - 基于 ReactDOM 中的 render 方法
      ```javascript
      // react v16
      ReactDOM.render(<>...</>, document.getElementById("root"));
      ```
      ```javascript
      // react v18
      const root = ReactDOM.createRoot(document.getElementById("root"));
      // 基于render方法渲染视图
      root.render(<>...</>);
      ```
  - 补充说明：第一次渲染页面是直接从 virtualDOM->真实 DOM；但是后期视图更新的时候，需要经过一个 DOM-DIFF 的对比，计算出补丁包 PATCH(两次视图差昇的部分），把 PATCH 补丁包进行渲染！！
  8. 为元素设置属性[自定义/内置]，有两种方式
  - 元素.属性 = 属性值
    - 原理：对于内置属性，是设置在元素标签上；对于自定义属性来讲，是给对象的堆内存空间中新增成员（不会设置到标签上）
    - 获取：元素.属性
    - 删除：delete 元素.属性
  - 元素.setAttribute(属性，属性值)
    - 原理直接写在元素标签上
    - 获取：getAttribute
    - 删除：removeAttribute
      > 二者不能混淆使用
  9. 组件
  - ## 函数组件
  - 类组件
  - hooks 组件
