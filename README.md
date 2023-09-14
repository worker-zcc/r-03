<!--
 * @Desc: md
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-14 10:06:25
 * @LastEditTime: 2023-09-13 20:39:36
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

## js 基础

### 数组 tips

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

### 对象 tips

- 冻结 Object.freeze(obj)
  - 不能修改，不能新增，不能删除, 不能劫持（Object.defineProperty()）
  - 判断是否冻结 Object.isFrozen(obj) => flase/true
- 密封 Object.seal(obj)
  - 能修改，不能新增，不能删除, 不能劫持（Object.defineProperty()）
  - 判断是否密封 Object.isSeal(obj) => flase/true
- 不可扩展 Object.preventExtensions()
  - 除了不能新增，其他操作都可以
  - 判断是否可扩展 Object.isExtensible(obj) => flase/true

  > 被冻结的对象，既是不可扩展的，也是密封的；同理，被密封的对象，也是不可扩展的。

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

## JSX 基础知识

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
6. JSX 底层处理机制

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

7. 为元素设置属性[自定义/内置]，有两种方式

   - 元素.属性 = 属性值

     - 原理：对于内置属性，是设置在元素标签上；对于自定义属性来讲，是给对象的堆内存空间中新增成员（不会设置到标签上）
     - 获取：元素.属性
     - 删除：delete 元素.属性

   - 元素.setAttribute(属性，属性值)
     - 原理直接写在元素标签上
     - 获取：getAttribute
     - 删除：removeAttribute
       **二者不能混淆使用**

## 组件

### 函数组件

1. 渲染机制

- 基于 babel-preset-react-app 把调用的组件转化为 createElement 格式

  ```javascript
  React.createElement(Dome, {
    title: "xxx",
    x: 10,
    className: "box",
  });
  ```

- 把 createElement 方法执行，创建出一个 virtualDOM 对象

  ```javascript
    {
      $$typeof: Symbol(`react.element`),
      ref: null,
      kev: null,
      type: Dome,
      props: {
        title:'xxx',
        x:10,
        className:'box'
      },
    }
  ```

- 基于 root.render 把虚拟 dom 转变为真实 dom(type 值不再是一个字符串，而是一个函数了，此时)
  - 把函数执行-> Demo()
  - 把 virtualDOM 中的 props,作为实参传递给函数 -> Demo(props)
  - 接收函数执行的返回结果(也就是当前组件的 virtualDOM 对象)
  - 最后基于 render 把组件返回的虚拟 DOM 变为真实 DOM，插入到#root 容器中

2. 单闭合组件和双闭合组件的调用区别

   - 双闭合组件可以在 props 的 children 属性中传递子节点
   - 属性 props 的处理
     - 调用组件，传递进来的属性是"只读"的[原理:props 对象被冻结了]
     - Object.isFrozen(props) => true
     - 获取：props.xxx
     - 修改：props.xxx = aaa =>报错
     - 作用：父组件（index.jsx）调用子组件（demo.jsx）的时候，可以基于属性，把不同的信息传递给子组件,使其复用性更强
   - 属性的规则校验

     - 设置默认值
     - 把函数当作对象，设置静态的私有属性方法，来给其设置属性的校验规则

       ```javascript
       const Demo = function Demo(props) {
         let { title } = props;
         return <div>{title}</div>;
       };
       Demo.defaultProps = {
         title: "hello",
       };
       ```

     - 设置其他规则：依赖于官方插件[prop-types]

       - 传递进来的属性，首先会进行规则校验，不论校验成功失败，最后会把属性传递给 props，失败时会在控制台抛出错误

         ```javascript
         Demo.propTypes = {
           title: PropTypes.string.isRequired,
           title: PropTypes.oneOfType([
             // 多个类型中的一个
             PropTypes.bool,
             PropTypes.number,
           ]),
         };
         ```

   - 修改 Props 中的值
     - 把 props 中的某个属性赋值给其他内容，比如：变量，状态。。。
     - 然后修改变量值，状态值

3. 函数组件时静态组件:第一次渲染组件时
   - 执行函数
   - 产生一个私有上下文
   - 把解析出来的 props[包含 children]传递进来，但是被冻结了
   - 对函数返回的 jsx 元苏[virtualDOM]进行渲染
   - 当我们点击按钮时，会执行绑定函数
     - 修改上级上下文中的变量
     - 私有变量的值发生改变
     - 但是视图不会更新
   - 也就是说函数组件第一次渲染后，组建的内容，不会根据组件内的某些操作，再次进行更新，所以称之为静态组件

#### 函数组件总结
- 不具备“状态，ref，周期函数”等内容，第一次渲染完毕后，无法基于组件内部的操作来控制其更新，因此称之为静态组件
- 但是具备属性及插槽，父组件可以控制其重新渲染
- 渲染流程简单，速度快
- 基于FP（函数式编程）的思想设计，提供更细颗粒度的逻辑组织和复用。


#### Hook函数

> 函数组件的每一次渲染(或者是更新)，都是把函数(重新)执行，产生一个全新的“私有上下文”!(内部的代码也需要重新执)
> 函数组件的每一次更新，都是把函数重新执行 产生一个新的闭包，内部的代码也要重新执行一遍

1. useState : 目的是在函数中使用状态，并于后期基于状态修改，让组件更新
   - let [num,setNum] = useState(initialValue)
     - 执行useState,传递initialValue为初始值
     - 执行这个方法，返回结果是一个数组：[状态值，修改状态的方法]
       - num变量存储的是：获取的状态值
       - setNum变量存储的是：修改变量的方法
     - 执行 setNum（value）
       - 修改状态值为value
       - 通知视图更新
   - useState自带了性能优化的机制
     - 每一次修改状态值的时候，会拿最新要修改的值和之前的状态值做比较[基于0bject.is作比较]
     - 如果发现两次的值是一样的，则不会修改状态，也不会让视图更新(可以理解为: 类似于PureComponent，在shouldComponentUpdate中做了浅比较和优化)
     - ![性能优化渲染逻辑](./readmeIMG/useState-4.png)
   - 需求: 让函数只更新一次，但是最后的结果是20 
     - ![需求](./readmeIMG/useState-5.png)
   - useState 原理
      ``` JS
      var  state;
      function useState(initialValue) {
        if (typeof _state === "undefined") {
          if(typeof initialValue==="function"){
            _state = initialValue()
          } else {
            _state = initialValue
          }
        };
        var setState = function setState(value){
          if(Object.is(_state,value)) return;
          if(typeof value==="function"){
            _state = value(_state)
          } else {
            _state = value
          }
        }
        return [_state,setState]
      }
      ```

   > 函数组件[或者Hooks组件]不是类组件，所以没有实例的概念，【调用组件不再是创建类的实例，而是把函数执行，产生一个私有上下文而已，再所以，在函数组件中不涉及this的处理
  
     - 函数组件的每一次渲染(或者是更新)，都是把函数(重新)执行，产生一个全新的“私有上下文”!
    - 内部的代码也需要重新执
    - 涉及的函数需要重新的构建{这些函数的作用域(函数执行的上级上下文)，是每一次执行DEMO产生的闭包}
    - 每一次执行DEMO函数，也会把usestate重新执行，但是:
      - 执行usetate，只有第一次，设置的初始值会生效，其余以后再执行，获取的状态都是最新的状态值而不是初始值
      - 返回的修改状态的方法，每一次都是返回一个新的
    - ![函数组件渲染逻辑](./readmeIMG/useState-1.png)
     - 在React18中，我们基于useState创建出来的“修改状态的方法”，它们的执行也是异步的原理: 等同于类组件中的this.setState
    - 基于异步操作 & 更新队列，实现状态的批处理
    - 在任何地方修改状态，都是采用异步编程的
    - ![异步渲染逻辑](./readmeIMG/useState-2.png)
     - flushSync会立即刷新更新队列
      - ![flushSync渲染逻辑](./readmeIMG/useState-3.png)
  
2. useEffect: 在函数组件中，使用生命周期函数
   - useEffect(callback): 没设置依赖
     - 第一次渲染完毕后，执行callback，等价于 componentDidMount
     - 在组件每一次更新完毕后，也会执行callback，等价于 componentDidUpdate
   - useEffect(callback,[]): 设置了，但是无依赖
     - 只有第一次染完毕后，才会执行callback，每一次视图更新完毕后，callback不再执行
     - 类似于 componentDidMount
   - useEffect(callback,[依赖的状态(多个状态)]):
     - 第一次渲染完毕会执行callback
     - 当依赖的状态值(或者多个依赖状态中的一个)发生改变，也会触发callback执行
     - 但是依赖的状态如果没有变化，在组件更新的时候，callback是不会执行的
   - useEffect必须在函数的最外层上下文中调用，不能把其嵌入到条件判断、循环等操作语句中

      ``` js
        useEffect(()=>{
          return ()=>{
            // 返回的小函数，会在组件释放的时候执行
            // 如果组件更新，会把上一次返回的小函数执行 可以“理解为”上一次渲染的组件释放了
          }
        })
      ```
      ![useEffect渲染逻辑](./readmeIMG/useState-6.png)
   
   - useEffect 进行异步请求
     - ![useEffect 进行异步请求](./readmeIMG/useEffect.png)
   - useEffect如果设置返回值，则返回值必须是一个函数:代表组件销毁时触发
     - 诉求：第一次渲染完毕后，从服务器异步获取数据
     - ``` js
        useEffect(()=>{
          const next = async () => {
            let dath = await queryData();
            console.log('成功:data);
          }
          next():
        },[])
      ```
  
      
3. useLayoutEffect 
   - 如果链表中的callback执行又修改了状态值 [视图更新]
     - 对于 useEffect来讲: 第一次真实 DOM已经染，组件更亲会重新渲染真实的DOM; 所以频繁切换的时候，会出现样式内容闪烁!
     - 对于 useLavoutEffect来讲: 第-次真实 DOM还未染，遇到callback中修改了状态，视图立即更新，创建出新的virtualDOM然后和上一次的virtualDOM合并在一起染为真实DOM; 也就是此类需求下，真实DOM只渲染一次，不会出现内容/样式的闪烁
     - ![useEffect和useLayoutEffect渲染逻辑](./readmeIMG/useState-7.png)
   - 组件渲染
     1. 基于react-app编译
     2. 创建 virtualDOM
        - useLayoutEffect加入链表中的方法，会在第二步结束，就通知执行!
     3. DOM-DIFF 被渲染为 真实的DOM
        - useEffect加入链表中的方法是在第三步结束后，通知执行!
   - Effect链表中useLayoutEffect和useLayoutEffect的区别
     - useLayoutEffect会阻塞浏览器染真实DOM，优先执行Effect链表中的callback
     - useEffect不会阻塞浏览器渲染真实DOM，在渲染真实DOM的同时，去执行Effect链表中的callback;
   - 视图更新的步骤
     1. 基于babel-preset-react-app把JSX编译为createElement格式
     2. 把createElement执行，创建出virtualDOM
     3. 基于root.render方法把virtualDOM变为真实DOM对象  [DOM-DIFF]
        - useLavoutEffect阳塞第四步操作，先去执行Effect链表中的方法 同步操作
        - useEffect第四步操作和Effect链表中的方法执行，是同时进行的异步操作
     4. 浏览器染和绘制真实DOM对象
        ```js
          useLayoutEffect(() => {
            console.log('useLayoutEffect'); //第一个输出
          },[num] ) ;
          useEffect(() => {
            console.log('useEffect'); //第二个输出
          },[num] ) ;
        ```
4. useRef
   - 基于“ref=[函数}”的方式，可以把创建的DOM元素(或者子组件的实例)赋值给box变量
     - ```js
          import React,{useRef}from "react";
          
          const demo = function demo (){
            let box ;
            useEffect(() => {
              console.log(box):
            },[num] ) ;
            return <div className="demo">
              <span className="num" ref={x => box = x}>10</span>
            </div>;
          }
        ```
   - 也可与基于 React.createRef 创建ref对象来获取想要的内容
     - 既可在类组件中使用，也可以在函数组件中使用
     - ```js
          import React,{useRef}from "react";
          
          const demo = function demo (){
            let box = React.createRef()
            useEffect(() => {
              console.log(box.current):
            },[num] ) ;
            return <div className="demo">
              <span className="num" ref={box}>10</span>
            </div>;
          }
        ```
   - 函数组件中，还可以基于 useRef Hook函数，创建一个ref对象】
     - useRef 只能在函数组件中用所有的ReactHook函数，都只能在函数组件中时候用，在类组件中使用会报错
     - ```js
          import React,{useRef}from "react";
          
          const demo = function demo (){
            let box = useRef(null)
            useEffect(() => {
              console.log(box.current):
            },[num] ) ;
            return <div className="demo">
              <span className="num" ref={box}>10</span>
            </div>;
          }
        ```
   - createRef 和 useRef 在函数组件中的对比
     - useRef再每一次组件更新的时候(函数重新执行)，再次执行useRef方法的时候，不会创建新的REF对象了，获取到的还是第一次创建的那个REF对象!!
     - createRef在每一次组件更新的时候，都会创建一个全新的REF对象出来，比较浪费性能!!
     - 总结:在类组件中，创建REF对象，我们基于 ReactcreateRef 处理;但是在函数组件中，为了保证性能，我们应该使用专属的 useRef 处理! !
   - 获取子组件内部实例
     - ```js
          import React,{useRef}from "react";
          //方法1 基于ref获取子组件的实例，这样基于实例，可以调用子组件内部，挂载到实例上的东西
          class Child extends React.Component {
            state = { x: 1000 };
            render() {
              return <div className="child-box">
                {this.state.x}
              </div>
            }
          }
          // 基于forwardRef实现ref转发，目的: 获取子组件内部的某个元素
          const Child = React.forwardRef(function Child(props, ref) {
            // console.log(ref); //在DEMO中，调用Child的时候，传递的ref对象 x
            return <div className="child-box">
              <span ref={ref}>哈哈哈</span>
            </div>;
          })
          // 父组件
          const demo = function demo (){
            let box = useRef(null)
            useEffect(() => {
              console.log(box.current):
            },[num] ) ;
            return <div className="demo">
              <Child ref={box} />
            </div>;
          ≈
        ```
   
5. useImperativeHandle
   - 基于fowardRef实现ref转发的同时，获取函数子组件内部的状态或者方法
   - ```js
      const Child = React.forwardRef(function Child(props, ref) {
            let [text,setText] = useState('你好世界');
            const submit = () => {};
            useImperativeHandle( ref,() =>{
              //在这里返回的内容，都可以被父组件的REF对象获取到
              return {text,submit}
            })
            return <div className="child-box">
              <span ref={ref}>哈哈哈</span>
            </div>;
          })
      // 父组件
      const demo = function demo (){
        let box = useRef(null)
        useEffect(() => {
          console.log(box.current):
        },[num] ) ;
        return <div className="demo">
          <Child ref={box} />
        </div>;
      }
      ```
6. useMemo 相当于vue中的计算属性
   - let xxx = useMemo(callback, [dependencies])
     - 第一次渲染组件的时候，callback会执行
     - 后期只有依赖的状态值发生改变，callback才会再执行
     - 每一次会把callback执行的返回结果赋值给xxx
     - useMemo具备“计算缓存”，在依赖的状态值没有发生改变，callback没有触发执行的时候，xxx获取的是上一次计算属性得出的结果，和Vue中的汁算属性非常的类似
   - 优化的Hook函数
     - 如果函数组件中，有消耗性能/时间的计算操作，则尽可能用usevemo緩存起来，设置对应的依赖；
     - 这样可以保证，当非依赖的状态发生改变，不会去处理一些没必要的操作，提高组件更新的速度！！
7. usecallback 
   - 组件第一次渲染，useCallback执行，创建一个函数"callback"，賦值给xxx
   - 组件后续每一次更新，判断依赖的状态值是否改变，如果改变，则重新创建新的函数堆，赋值给xxx；但是如果，依赖的状态没有更新「或者没有设置依赖“[]〞」则xxx获取的一直是第一次创建的函数堆，不会创建新的函数出来！！
   - 或者说，基于useCallback，可以始终获取第一次创建函数的堆内存地址[或者说函数的引用]
   - ![useCallback多次执行对比](./readmeIMG/useState-8.png)
   - *** useCallback不要乱用！ *** 并不是所有組件内部的函数，都拿其处理会更好！ ！
     - 虽然减少了堆内存的开辟
     - 但是useCallback本身也有自己的处理逻银和緩存的机制，这个也消耗时间啊
     - 如果没有设置任何依赖，则函数永远是在第一次组件渲染，产生的闭包中创建的！
       - 函数中用到的信息「向上级上下文中找」，永远是第一次闭包中的信息！！
       - ![useCallback没有设置任何依赖的渲染](./readmeIMG/useState-9.png)
   - 场景：当父组件更新的时候，因为传递给子组件的属性仅仅是一个函数「特点：基本应该算是不变的」，所以不想再让子组件也跟着更新了！
     - 第一条：传进给子组件的属性（函数），每一次需要是相同的堆内存地址(是一致的） ．基于useCa11back处理！！
     - 第二条：在子组件内部也要做一个处理，验证父组件传递的属性是否发生改变，如果没有变化，则让子组件不能更新，有变化才需要更新 。
       - 继承React.Purecomponent即可「在shouldcomponentupdate中对新老属性做了浅比较」！！
       - 函数组件是基于 React.memo 函数，对新老传递的属性做比较，如果不一致，才会把函数组件执行，如果一致，则不让子组件更新！！
    ```js
      // 子组件使用React.Purecomponent
      class Child extends React. PureComponent {
        render(){
          console.log('child render')
          return <div>子组件</div>
        }
      }
      // 子组使用React.memo
      const Child = React. memo(function Child(props) {
        render(){
          console.log('child render')
          return <div>子组件</div>
        }
      })
      // 父组件
      const Demo = function Demo (){
        let [x, setX] = useState(0);
        // const handle =()=>{}：//第一次：0x001 第二次：0x101 第三次：0x201 ...
        const handle = usecal1back(() ={},[])；//第一次：9x001 第二次：0x001 第三次：0x001 . . .
      }
    ``` 

8. 自定义hook
   - setPartial：我们期望这个方法可以支持部分状态的更改（setstate：不支持部分状态更改的）
    ```js 
      const usePartialState = function usePartialState (initialValue) {
        let [state, setState] = useState(initialValue);
        const setPartial = function setPartial (partialState) {
          setState({
            ...state,
            ...partialState
          })
        }
        return [state, setPartial];
      }
      const Demo = function Demo () {
        let [state, setPartial] = usePartialState({
          supNum: 10,
          oppNum: 5
        })
        const handle = (type) => {
          if (type === 'sup') {
            setPartiall({
              supNum: state.supNum + 1
            })
            return;
          }
          setPartiall({
              oppNum: state.oppNum + 1
            })
        }
        render(){
          return <div>{supNum+oppNum}</div>
        }
      }
    ```
9. useStyles
### 类组件

#### 类 tips

  ```jsx
  class Parent{
    // new 的时候，执行构造函数[可写可不写，需要接受传递进来的实参信息，才需要设置constructor]
    constructor(x,y){
      // this -> 创建的实例
      this.total = x+y
    }
    // 等价于 this.num = 200 给实例设置私有属性
    num = 200
    getNum = ()=>{
      // 箭头函数没有自己的this,所用到的this是宿主环境中的
      // 当前this->当前创建的实例
      console.log(this)
    }
    sum()
      // 类似于sum=function sum(){} 不是箭头函数
      // 它是给Parent.prototype上设置的公共方法[sum函数是不可枚举]
    }
    // 把构造函数当作普通对象，为其设置静态的私有属性发发 Parent.xxx
    static avg = 100
  }

  // 在外部手动给构造函数原生上设置公共属性
  Parent.prototype.y =2000

  let p = new Parent(10,20)
  ```

#### setState 

this.setState([partialstate], [callback])

- [partialstate] :支持部分状态更改

  ```jsx
  this. setState(
    ×：100 //不论总共有多少状态，我们只修改了x，其余的状态不动
  ) :
  ```

- [callback]：在状态更改/视图更新完毕后触发执行「也可以说只要执行了setstate, callback一定会执行」
  - 发生在componentDidUpdate周期函数之后 「Didupdate会在任何状态更改后都触发执行；而回调函数方式，可以在指定状态更新后处理-些事情；』
  - 特殊：即便我们基于shouldComponentupdate阻止了状态/视图的更新，Didupdate周期函数肯定不会执行了，但是我们设置的这个callback回调函数依然会被触发执行！
  - 类似于Vue中的$nextTick

##### setState底层处理机制

- 在react18中，setState在任何地方执行都是异步操作
- 原因
  - r18有一套更新队列的机制
  - 基于异步操作，实现状态的“批处理”
- 好处
  - 减少视图更新次数，降低渲染消耗的性能
  - 让更新的逻辑和流程清晰稳健
- 处理机制
  - 在产生的私有上下文中，代码自上而下执行
    1. 会把所有的setstate 操作，先加入到更新队列「只对当前上下文，** 同步 ** 要做的事情做处理」
    2. 当上下文中的代码都处理完毕后，会让更新队列中的任务，统一渲染/ 更新一次「批处理」
  - 把当前相同时间段内【浏览器此时可以处理的事情中】，遇到setState会立即放入到更新队列中

- flushSync 刷新队列

#### 创建类组件

- 创建一个构造函数（类）
  - 要求必须继承 React.Component/PureComponent 这个类
  - 我们习惯于使用 es5 中的 class 创建类【因为方便】
  - 必须给当前类设置一个 render 方法[放在其原型上]：在 render 方法中，返回需要渲染的视图

#### 第一次渲染逻辑

> 从调用类组件[new Vote({...})]开始，类组件内部发生的事情

  1. 初始化属性&&校验规则

     - 方案一

      ``` javascript
      constructor(props){
        super(props) // 会把传递进来的属性挂载到this实例上
        console.log(this.props) // 获取传递的属性
      }
      ```

     - 方案二：即使我们不在constructor中处理[或者不写constructor]，在constructor处理完毕后，React内部也会把传递的props挂载到实例上：所以在其他函数中，只要保证this是实例，就可以基于this.props获取到传递的属性
       - 同样this.props获取属性对象也是被冻结的{只读}：Object.isFrozen(this.props)->true
  2. 初始化状态
     - 状态：后期修改状态，可以触发视图更新
     - 需要手动初始化，如果我们没有去做相关处理，则默认会往实例上挂载一个state，初始值是null => this.state = null
     - 修改状态，控制试图更新
       - this.state.xxx = xxx 这种方法无法让视图更新
       - 需要根据React.Component.proptotype提供的方法操作：
          1. this.setState(partialState) 既可以修改状态，也可以让视图更新
             - partialState 部分是状态 this.setState({xxx:xxx})
          2. this.forceUpdate() 强制更新（不推荐）
  3. 触发 componentWillMount 周期函数（钩子函数）：组件第一次渲染之前
     - 钩子函数：在程序运行到某个阶段，提供的处理函数，让开发者在这个阶段做一些自定义的事情
       - componentWillMount这个周期函数：目前可以使用，但是未来要被移除了，所以不建议使用[浏览器控制台会进行warning警告]-可以使用UNSAFE_componentWillMount消除警告
       - 如果开启了React.StrictMode[React严格模式]：即使使用UNSAFE_componentWillMount也会抛出红色错误警告
         - React.StrictMode[React严格模式]：会检查React中的不规范语法，或者是一些不建议使用的api等
         - "use strict":JS严格模式
  4. 触发 render 周期函数：渲染
  5. 触发 componentDidMount 周期函数：第一次渲染完毕
     - 可以获取真实DOM ：已经把virtualDOM转变为真实DOM了

##### 第一次渲染 流程图

  ```mermaid
      graph

      start --> getDefaultProps
      getDefaultProps --> getInitialState
      getInitialState --> componentWillMount
      componentWillMount --> render
      render --> componentDidMount

      开始 --> 初始化props
      初始化props --> 初始化state
      初始化state --> 第一次渲染之前
      第一次渲染之前 --> 第一次渲染
      第一次渲染 --> 第一次渲染完毕

  ```

#### 组件更新

##### 组件更新逻辑[组件内部更改]

1. 触发 shouldComponentUpdate 是否允许更新

   ```jsx
   shouldComponentUpdate(nextProps,nextState){
      // nextState:存储需要修改的最新状态
      // this.state:存储的还是修改之前的状态[此时状态还没有改变]
      console.log(this.state,nextState)
      // 此周期函数需要返回true/false
        // true：允许更新，会执行下一操作
        // false：不允许更新，接下来啥都不处理
      return true
    }
   ```

2. 触发 componentWillUpdate 更新之前
   - 此周期函数不安全
   - 这个阶段，状态还没有修改
3. 修改状态值/属性值 [让 this.state.xxx 更改为最新的值]
4. 触发 render 周期函数：组件更新
   - 按照最新的状态/属性，把返回的 JSX 编译为 virtualDOM
   - 和上次渲染出来的 virtualDOM 做对比[DOM-DIFF]
   - 把差异的部分进行渲染[渲染为真实 DOM]
5. 触发 componentDidUpdate 周期函数：第一次渲染完毕
6. 特殊说明：如果是基于 this.forceUpdate()强制更新视图，会跳过 shouldComponentUpdate 周期函数的校验，直接从 componentWillUpdate 开始更新[也就是：视图一定会触发更新]

##### 组件更新逻辑[父组件更新触发子组件更新]

1. 触发 componentWillReceiveProps 周期函数：接收最新属性之前
   - 此周期函数是不安全的
2. 触发shouldComponentUpdate周期函数
... 其他同组件更新逻辑[组件内部更改]

##### 父子组件更新流程

- 深度优先原则：父组件在操作过程中，遇到子组件，一定是把子组件处理完，父组件才能继续处理

  ```mermaid
      graph

      父组件第一次渲染 --> 父willMount
      父willMount --> 父render1
      父render1 --> 子willMount
      子willMount --> 子render1
      子render1 --> 子didMount
      子didMount --> 父didMount

      父组件更新 --> 父shouldUpdate
      父shouldUpdate --> 父willUpdate
      父willUpdate --> 父render2
      父render2 --> 子shouldUpdate
      子shouldUpdate --> 子willUpdate
      子willUpdate --> 子render2
      子render2 --> 子didUpdate
      子didUpdate --> 父didUpdate

  ```

#### 组件销毁

1. 触发componentWillUnmount周期函数：组件销毁之前
2. 销毁

#### 类组件总结
- 具备“状态，ref，周期函数”等内容，灵活控制组件更新，基于钩子函数也可以灵活掌控不同阶段的不同事情
- 渲染流程复杂繁琐，渲染速度相对较慢
- 基于OOP（面向对象）的思想设计，更方便实现继承。

#### 类组件中ref

- 我们基于ref可以做的事情
  1. 赋值给一个标签: 获取DOM元素
  2. 赋值给一个类子组件:获取子组件实例可以基于实例调用子组件中的属性和方法等
  3. 赋值给一个函数子组件: 报错[需要配合React.forwardRef实现ref转发获取子组件中的摸一个DOM元素]
- re的使用方法
  - ref='box' | this.refs.box 获取(不推荐使用)
  - ref = {x=>this.box=x}  |  this.box 获取
  - this.box=React.createRef() 创建一个ref对象 <h2 ref={this.box}> | this.box.current 获取DOM元素

#### PureComponent和Component的区别：

- PureComponent会给类组件默认加一个shouldComponentupdate周期函数
  - 在此周期函数中，它对新老的属性/状态 会做一个钱浅比较
  - 如果经过浅比较，发现属性和状态井没有改变，则返回false 「也就是不继续更新组建」；有变化才会去更新！！

```js
// 检查是否为对象
const isObject = (obj) => {
  return obj !== null && /^(object|function)$/.test(typeof obj);
};
// 对象的 浅比较（只比较一层）
const shalldowEqual = (objA, objB) => {
  // 如果不是对象的话，直接返回false
  if (!isObject(objA) || !isObject(objB)) return false;
  // 判断是否是同一个对象，是的话直接返回true
  if (objA === objB) return true;
  // 比较成员数量
  /**
   * Object.keys()返回属性key，但不包括不可枚举的属性
   * Reflect.ownKeys()返回所有属性key 相当于Object.getOwnPropertyNames(target) concat(Object.getOwnPropertySymbols(target)
   * * getOwnPropertyNames(): 返回所有属性的数组
   * * Object.getOwnPropertySymbols(): 返回所有符号属性直接发现在给定的对象
   */
  let keysA = Reflect.ownKeys(objA),
    keysB = Reflect.ownKeys(objB);
  // 如果成员数量不相等，肯定不相等，直接false
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    // 比较对象中的成员是否相同，再比较成员的值是否一样
    // NAN 不等于 NAN 但是Object.is(NAN）===Object.is(NAN）
    if (!objB.hasOwnProperty(key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }
  // 以上没有不同的成员，就直接相等
  return true;
};
```



### 静态组件与动态组件

- 函数组件是“静态组件"：
  - 组件第一次渲染完毕后，无法基于“内部的某些操作”让组件更新「无法实现“自更新”」；但是，如果调用它的父组件更新了，那么相关的子组件也-定会更新「可能传递最新的属性值进来」；
  - 函数组件只具备属性，所以无法实现自更新
  - 函数组件优势：比类组件的机制简单，渲染速度快
- 类组件是“动态组件”：
  - 组件在第一渲染完毕后，除了父组件更新可以触发其更新外，我们还可以通过：this.setstate修改状态 或者 this.forceupdate 等方式.让组件实现“自重新"！
  - 类组件具备：属性、状态、周期函数、ref... 「几平组件应该有的东西它都具备」
  - 优势：功能强大
- hooks组件：具备了函数组件和类组件的各自优势，在函数组件的基础上，基于hooks函数，让函数组件也可以拥有状态，周期函数等，让函数组件也可以实现自更新

### 父子组件通信

#### 渲染顺序
> 依赖于深度优先原则
- 父组件第一次渲染：父willMount -> 父render -> 子 willMount -> 子 render -> 子 didMount -> 父 didMount
- 父组件更新：
  - 父shouldUpdate -> 父willUpdate-＞父render  -> [子willReciveProps  -> 子 shouldUpdate -> 子willUpdate ->  子render-＞子didUpdate] -> 父 didUpdate
  - 我们完全可以在子组件内部做优化处理，验证传递的属性值有没有变化，如果没有变化，则禁止更新
- 父组件释放 
  - 父wilUnmount->父释放中「子wilUnaMount->子释放」＞父释放
#### 单向数据流
1. 属性的传递方向是单向的
   - 父组件可基于属性把信息传给子组件
   - 子组件无法基于属性给父组件传信息：但可以把父组件专递的方法执行，从而实现子改父！
2. 关于生命周期函数的延续
   - 组件第一次渲染
     - 父 willMount -> 父render
     - 子 willMount -> 子 render -> 子 didMount
     - 父 didMount
   - 组件更新
     - 父 shouldUpdate -> 父 willUpdate -> 父 render
     - 子willReciveProps  -> 子 shouldUpdate -> 子willUpdate ->  子render-＞子didUpdate
     - 父 didUpdate

#### 类组件父子通信

```js
class Vote extends React.Component{
  state = {
    supNum: 10,
    oppNum: 0
  }
  //设置为箭头函数：不论方法在哪执行的，方法中的this永远都是Vote父组件的实例
  change = (type) => {
    let { supNum, oppNum } = this.state;
    if (type === 'sup') {
      this.setState({ supNum: supNum + 1 });
      return;
    }
    this.setState({ oppNum: oppNum + 1 }) ;
  }
  render() {
    let { supNum, oppNum } = this.state;
    return <div className="vote-box">
      <span>{ suoNum + oppNum }</span>
      {/*把状态信息基于“属性”传递给儿子 父传子*/}
      <VoteMain supNum={supNum} oppNum={oppNum}/>
      {/*父组件把“修改自己状态”的方法，基于“属性”传递给儿子 儿子就以把传递的方法执行 实现子改父*/}
      <VoteFooter change={this.change}/>
    </div>
  }
}

```
```js
import React from "react";
import PropTypes from 'prop-types';
class VoteMain extends React.Component{
  static defaultProps = { 
    supNum: 0,
    oppNum: 0
  }
  static propTypes = {
    supNum: PropTypes.number,
    oppNum: PropTypes.number,
  }
  //  接收父组件传递的屬性值,然后渲染即可！
  render() {
    let { supNum, oppNum } = this.props;
    let ratio = '--',
        total = supNum + oppNum;
    return <div className="main">
      <p>支持人数：{total}人</p>
    </div>
  }
}
```

```js
import React from "react";
import PropTypes from 'prop-types';
class VoteFooter extends React.Component{
  // 接收父组件基于属性传递过来的函数
  static defaultProps = {};
  static propTypes = {
    change: PropTypes.func.isRequired
  }
  // 点击支持反对的时候，把传递进来的函数执行
  // 可以传递一些实参 子传父
  // 这个方法是修改父组件状态的 子改父
  render() {
    let { change } = this.props;
    return <div className="main">
      <Button type="'primary" onclick={change. bind (null, "sup")}>支持</Button>
      <Button type="'primary" onclick={change. bind (null, "opp")}>反对</Button>
    </div>
  }
}
export default VoteFooter;
```
#### 函数父子组件通信

``` js
import React from "react";
import PropTypes from 'prop-types';
const VoteMain = function VoteMain (props) {
  let { supNum, oppNum } = this.props;
  let ratio = '--',
      total = supNum + oppNum;
  return <div className="main">
    <p>支持人数：{total}人</p>
  </div>
}
VoteMain.defaultProps = { 
  supNum: 0,
  oppNum: 0
}
VoteMain.propTypes = {
  supNum: PropTypes.number,
  oppNum: PropTypes.number,
}
export default VoteMain;
```
```js
import React from "react";
import PropTypes from 'prop-types';
const VoteFooter = function VoteFooter (props){

    let { change } = props;
    return <div className="main">
      <Button type="'primary" onclick={change. bind (null, "sup")}>支持</Button>
      <Button type="'primary" onclick={change. bind (null, "opp")}>反对</Button>
    </div>
}
VoteFooter.defaultProps = ();
VoteFooter.propTypes = {
  change: PropTypes. func. isRequired
}
export default VoteFooter;
```

#### 上下文对象
![上下文的需求](./readmeIMG/useState-10.png)
```js
  // ThemeContext.js
  import React from "react"
  const ThemeContext = React.createContext () ;
  export default ThemeContext;
```
- 基于上下文对象中，提供的Provider组件，用来
  - 向上下文中存储信息：value属性指定的值就是要存储的信息
  - 当祖先组件更新，render 重新执行，会把最新的状态值，再次存储到上下文对象中！！
  
  ```js
  import ThemeContext from "@/ThemeContext";
  class Vote extends React.Component{
    state = {
      supNum: 10,
      oppNum: 0
    }
    change = (type) => {
      let { supNum, oppNum } = this.state;
      if (type === 'sup') {
        this.setState({ supNum: supNum + 1 });
        return;
      }
      this.setState({ oppNum: oppNum + 1 }) ;
    }
    render() {
      let { supNum, oppNum } = this.state;
      return 
      <ThemeContext.Provider
        value = {{
          supNum,oppNum,change:this.change
        }}
      >
        <div className="vote-box">
          <span>{ suoNum + oppNum }</span>
          <VoteMain />
          <VoteFooter />
        </div>
      </ThemeContext.Provider>
    }
  }

  ```

  ```js
    // 函数 父组件 
    import React from "react";
    import ThemeContext from "@/ThemeContext":
    const Vote = function Vote(){
      let [supNum, setSupNum] = useState (10),
          [oppNum, setOppNum] = useState (5);
      const change = type => {
        if (type === 'sup') {
          setSupNum (supNum + 1);
          return;
        }
        setOppNum (oppNum + 1);
      }
      
      return <ThemeContext.Provider
          value = {{
            supNum,oppNum,change:this.change
          }}
        >
          <div className="vote-box">
            <span>{ suoNum + oppNum }</span>
            <VoteMain />
            <VoteFooter />
          </div>
      </ThemeContext.Provider>
    }
    ```
- 后代组件 （类组件）获取上下文信息
  - 方案一
    1. 导入创建的上下文对象
    2. 给类组件设置静态私有属性，contextType =上下文对象，在this.context属性上，存储了上下文中的所有信息！！
    3. 从this.context中荻取需要的信息即可
    ```js
    import React from "react";
    import ThemeContext from "@/ThemeContext":
    class VoteMain extends React.Component{
      static contextType = ThemeContext;
      render() {
        let { supNum, oppNum } = this.context;
        let ratio = '--',
            total = supNum + oppNum;
        return <div className="main">
          <p>支持人数：{total}人</p>
        </div>
      }
    }
    ```
    ```js
    import React from "react";
    import ThemeContext from "@/ThemeContext":
    const VoteMain = function VoteMain(){
      let { supNum, oppNum } = useContext (ThemeContext);
      let ratio = '--',
          total = supNum + oppNum;
      return <div className="main">
        <p>支持人数：{total}人</p>
      </div>
    }
    ```

  - 方案二
    - <ThemeContext.Consumer>{context=>return 要渲染的视图}</ThemeContext.Consumer>
    - context中，存储了上下文中的所有信息
    ```js
      import React from "react";
      import ThemeContext from "@/ThemeContext":
      class VoteFooter extends React.Component{
        render() {
          return <ThemeContext.Consumer>
            {
              context =>{
                let { change } = context;
                return <div className="main">
                  <Button type="'primary" onclick={change. bind (null, "sup")}>支持</Button>
                  <Button type="'primary" onclick={change. bind (null, "opp")}>反对</Button>
                </div>
              }
            }
            
          </hemeContext.Consumer>
        }
      }
      export default VoteFooter;
      ```
      ```js
      import React from "react";
      import ThemeContext from "@/ThemeContext":
      const VoteFooter = function VoteFooter{
          return <ThemeContext.Consumer>
            {
              context =>{
                let { change } = context;
                return <div className="main">
                  <Button type="'primary" onclick={change. bind (null, "sup")}>支持</Button>
                  <Button type="'primary" onclick={change. bind (null, "opp")}>反对</Button>
                </div>
              }
            }
            
          </hemeContext.Consumer>
      }
      export default VoteFooter;
      ```

### 高阶组件
> React高阶组件：利用JS中的闭包「柯理化函数」实现的组件代理,我们可以在代理组件中，经过业务逻辑的处理，获取一些信息，最后基于属性等方案，传递给我们最终要渲染的组件！！[相当于Vue中的动态组件？]

```jsx
const App = function App() {
  return <Demo x={10} y={20} enable={true} />
}
```
```jsx
const Demo = function Demo (props) {
  console.log ('Demo:', props);
  return <div className="demo">demo</div>
}
// 执行ProxyTest方法，传递一个组件进来 「Component」
const ProxyTest = function ProxyTest (Component) {
  return function HOC (props) {
    // console. log (props); //=>{x:10,:20,enable:true}
    // 真实要渲染的是Demo组件：把获取的props要传递给Demo
    /* let { x, y, enable } = props;
      return <Component ×={x} y={y} enable={enable} />; */
    return <Component {...props} />
  }
}

export default ProxyTest(Demo)
//把函数执行的返回结果「应该是一个组件」，基于ES6Module规范导出，供App导入使用！！
//当前案例中，我㝵出的是HOC 「HOC：higher-order-components」
```

## 插槽

1. 封装组件时，预留插槽位置

  ```jsx
  const Demo = function Demo(props) {
    let { children } = props;
    return <div>{children}</div>;
  };
  ```

2. 多个插槽

```jsx
import React from "react";
const Demo = function Demo(props) {
  let { children } = props;
  children = React.Children.toArray(children);
  // 由于props中的children返回数据格式的不确定性，可以利用React.Children中提供的方法对props.children数据做处理
  return (
    <div>
      {children[0]}
      <a>1</a>
      {children[1]}
    </div>
  );
};
```

3. 具名插槽

```jsx
import React from "react";
const DemoFather = function Demo(props) {
  return (
    <Demo>
      <span slot="fisrt">1</span>
      <span slot="second">2</span>
      <span>3</span>
    </Demo>
  );
};

const Demo = function Demo(props) {
  let { children } = props;
  children = React.Children.toArray(children);
  let fisrt, second, defaultSlot;
  children.forEach((a) => {
    const { slot } = a.props;
    if (slot === "fisrt") {
      fisrt.push(a);
    } else if (slot === "second") {
      second.push(a);
    } else {
      defaultSlot.push(a);
    }
  });
  return (
    <div>
      {fisrt}
      <p>1</p>
      {second}
    </div>
  );
};
```

## render 函数

- 如果 type 是
  - 字符串：创建一个标签
  - 普通函数：把函数执行，并把 Props 传递给函数
  - 构造函数：把构造函数基于 new 执行[也就是创建类的一个实例]，也会把解析出来的 props 传递过去
    - 每调用一次类组件都会创建一个单独的实例
    - 把类组件中编写的 render 函数执行，把返回的 jsx[virtualDOM]当作组件视图进行渲染！！

## DOM相关

- componentDidMount :第一次渲染完毕[virtualDOM已经变为真实DOM]：此时我们可以获取所需操作的DOM元素

### 受控组件与非受控组件

- 受控组件：基于修改数据/状态，让视图更新，达到需要效果
- 非受控组件：基于ref获取DOM元素，我们操作DOM元素，来实现需求和效果

### 基于ref获取DOM元素的语法

1. 给需要获取的元素设置ref=’xxx’，后期基于this.refs.xxx去获取相应的DOM元素「不推荐使用」
  - <h2 ref="titleBox">...</h2> 
  - 获取：this.refs.titleBox
2. 把ref属性值设置为一个函数
  - ref={x=>this.xxx=x}
    - x是函数的形参：存储的就是当前DOM元素
    - 然后我们获取的DOM元素“x"直接挂在到实例的某个属性上（例如：box2）
    - 获取：this.xxx
3. 基于React.createRef()方法创建一个REF对象
  - this.xxx=React.createRef(); //=> this.xxx={current:null}
  - ref={REF对象(this.xxx)}
  - 获取：this.xxx.current
> 原理：在render渲染的时候，会获取virtualDOM的ref属性
>- 如果属性值是一个字符串，则会给this.refs增加这样的一个成员，成员值就是当前的DOM元素
>- 如果属性值是一个函数，则会把函数执行，把当前DOM元素传递给这个函数「x->DOM元素」，而在函数执行的内部，我们一般都会把DOM元素直接挂在到实例的某个属性上
>- 如果属性值是一个REF对象，则会把DOM元素赋值给对象的current属性

#### 设置ref，目的

- 元素标签：获取对应的DOM元素
- 类组件：获取当前组件的实例对象
  - 后续可以根据实例，获取子组件中的相关信息
- 函数组件设置ref，**报错** ：Function components cannot be given refs. Attempts to access this ref will fail.
  - 但是我们让其配合 React. forwardRef 实现ref的转发
  - 目的：获取函数组件内部的某个元素

  ```jsx
  const Child2 = React.forwardRef(function Child(props, ref) {
  // console. log(ref);//我们调用child2的时候，设置ref属性值[函数]
  // -> x=> this.child2 = x
  return <div>
      <button ref={ref}>按钮</button>
  </div>
  })
  ```

## 合成事件

  解决浏览器的兼容性：onXxxx={函数}

- bind在React事件绑定的中运用
  - 绑定的方法是一个普通函数，需要改变函数中的this是实例，此时需要用到bind「一般都是绑定箭头函数」
  - 想给函数传递指定的实参，可以基于bind预先处理 「bind会把事件对象以最后一个实参传递给函数」

### react中合成事件的处理原理

- “绝对不是”给当前元素基于addEventListener单独做的事件鄉定，React中的合成事件，都是基于“事件委托”处理的！
  - 在React17及以后版本，都是委托给＃root这个容器「捕获和冒泡都做了委托」；
  - 在17版本以前，都是为委托给document容器的「而且只做了冒泡阶段的委托」；
  - 对于没有实现事件传播机制的事件，才是单独做的事件鄉定「例如：onMouseEnter/onMouseLeave...」
- 在组件渲染的时候，如果发现JSX元素属性中有 onxxx/onxxxCapture 这样的属性，不会给当前元素直接做事件绑定，只是把绑定的方法赋值给元素的相关属性！！例如：
  - outer.onclick=(）=>{console. log('outer 冒泡「合成」，）;了 //这不是DOMO级事件鄉定「这样的才是 outer.onclick
  - outer.onclickcapture=(）= {console. log ('outer 捕获「合成」，）;}
  - inner.onclick=()=>{console. 1og ('inner 冒泡「合成」，);}
  - inner.onclickcapture=()=>{console . log("inner 捕获「合成」，）;}
- 然后对＃root这个容器做了事件绑定「捕获和胃泡都做了」
  - 原因：因为组件中所渲染的内容，最后都会插入到＃root容器中，这样点击页面中任何一个元素，最后都会把＃root的点击行为触发！！
  - 而在给＃root绑定的方法中，把之前给元素设置的onxxx/onxxxCapture属性，在相应的阶段执行！！

  ```jsx
  //给#root做事件绑定
  root.addEventListener( 'click', (ev) => {
    let path = ev.path; // path：[事件源->...->window】所有祖先元素
    [...path].reverse().forEach(ele=>{
      let handle = ele.onClickCapture;
      if (handle) handle():
    }):
  }, true);
  // 冒泡阶段
  root.addEventListener('click', (ev) =>{
    let path = ev.path;
    path. forEach(ele=>{
      let handle = ele.onClick;
      if (handle) handle();
    }) :
  }, false);
  ```

## 服务器请求

### 失败
- 请求失败(网络层失败)：服务器返回的不是200状态码
- 服务器返回信息code：200，但是最终不是我们想要的
### Post请求
需要基于请求主体把信息传递给服务器
格式要求：
- 普通对象：变为'[object,object]'字符串传递给服务器
  - 把普通对象作为json传递给服务器
  - formdata 用于文件上传 multipart/form-data
    - let fm = new FormData() fm.append('file',file)
  - buffer或者进制格式
- 字符串
  - json字符串 application/json
  - urlencoded 格式字符串  application/x-www-urlencoded :'x=10&b=ss'
  - 普通字符串 text/plain

## 样式表
1. 行内样式
   - 优：这样确实可以保证组件和组件之间，元素和元素之间的样式不会冲突！
   - 缺：
     - 不利于样式的复用，如果提取为一个通用样式对象，则没有代码提示！！
     - 不能使用伪类
     - 编译后的样式和结构混潘在一起，也不利于优化！！
   - 使用情况
     - 样式是基于程序动态计算出来的，我们可以基于 style 方式，动态设置样式！
     - 偶尔有一些标签，需要设置一个权重较高特殊样式，可以基于style的方式「原理：行内样式的优先级会高一些」
2. 基于样式表、样式类名这样的方式，但是需要 人为有意识的、有规范的 規避样式冲突问题
   - 首先保证每个组件最外层样式类名是不不冲突的
   - 命名方案：路径+组件名 作为组件外层容器的名字！！
   - 后期组件内部的元素，其样式，都基于less/sass/stylus嵌入到指定
   - 优点
     - 结构样式分离：实现了样式和JavaScript的分离
     - 使用css所有功能：此方法允许我们使用CSS的任何语法，包括伪类、媒体查询等
     - 使用缓存：可对样式文件进行强缓存或协商缓存
     - 昜编写：CSS样式表在书写时会有代码提示
   - 缺点
     - 产生冲突：cSS选择器都具有相同的全局作用域，很容易造成样式冲突
     - 性能低：预编译语言的嵌套，可能带来的就是超长的 选择器前缓，性能低！
     - 没有真正的动态样式：在CSS表中难以实现动态设置样式
3. xxx.module.css
   - 这样的文件是CSS文件，不能在使用less/sass/stylus这样的预编译语言了
   - 我们在组件中，基于ES6Module模块规范导入进来
     - import sty from "./xxx.module.css"
     - sty存储的是一个对象,对象中包含多组键值对
       - 键：我们之前才css中编写的样式类名 .box{}
       - 值：经过webpack编译后的样式类名 .Nav_bo__cEW30{}
     - 我们编写的CSS样式也会被编译，所有之前的样式，也都编译为混淆后的类名了「和上述对象中编译后的值一样」
     - 我们在組件中，所有元素的样式类，基于 sty xxx 去探作
       ```js  
        import sty from './Nav.module.css';
        import common from './common.module.css';
        <h2 className={`${sty.title} ${$icommon.hovercolor}`}>外购物商城</h2> 
        ```
     - 样式类名不会经过编译,或以此设置全局样式
        ```css  
          :global(.clearfix) {
            clear: both;
          }
        ```
     - 组合 && 继承
        ```css  
          .list {
            width: 100px;
          }
          .link{
            composes:list;
            color:red;
          }
        ```
        ``` html
        <span class="list"></span>
        ```
   - CSS Modules 的原理
     - 把各个组件中，编写的样式「不经过处理之前，是全局都生效样式」进行私有化处理
     - 把所有样式类名，进行编译混淆，保证唯一性
4. CSS-IN-JS
   - 把csS写在Js中，这样可以基于JS運辑安现 样式的动态管理、实现通用样式的封裝！！
   - React-JSS
   - styled-components 要简单了

## redux

- 复合组件通信：
  - 父子组件[具备相同的父亲的兄弟组件]：props属性[基于ref]
  - 祖先和后代[具备相同祖先的平行组件]：context上下文


### 基础

1. 创建全局的公共容器，用来存储各个组件需要的公共信息 
  1. 在创建的store容器中，存储两部分内容
    - 公共状态：各个组件组要共享/通信的信息
    - 事件池：存放组件可以更新的方法
    - 特点：当公共状态一旦发生改变，会默认立即通知时间池中的方法执行，让指定组件更新，组件更新就会拿到最新的公共状态信息进行渲染。
  2. 修改公共容器中的状态，不能去修改？
    - 基于dispatch派发，通知reducer执行
    - 在reducer中去实现状态的更新
2. 在组件内部获取公用状态信息，然后渲染 store.getState()
3. 把让组件可以更新的方法放在公共容器的事件池中
  - 后期状态改变了，事件池中的方法会按照顺序，依次执行，让对应组件更新，组件更新就会拿到最新的公共状态信息进行渲染。 
  - store.subscribe(函数)
4. 创建容器的时候需要传递reducer 
5. 派发任务，通知reducer执行修改状态 store.dispatch({type:xxx,...})
```js
  // 1
  const store = createState([reducer]) // 创建
  // 4
  let initial = {...} //初始的状态值
  const reducer = function reducer(state= initial,action){
    // state 容器中的状态
    // action 派发的行为对象，必须具备type属性
    switch(action.type){
      // 根据传递的type值的不同，修改不同状态信息
    }
    return state; // 返回的信息会替换store容器中的公共状态
  }
```
### redux工程化

> 把状态和reducer的管理，按照模块进行划分
1. 按照模块，把reducer进行单独管理，每个模块都有自己的reducer：最后，我们还要把所有的reducer进行合井，合井为一个，赋值给我们创建的store！ ！
2. 每一次dispatch派发的时候，都会去每个模块的reducer中找一追，把所有和派发行为标识匹配的逻辑执行！！
   - 可能存在的问题：团队协作开发的时候，因为开发的人多，最后很可能派发的行为标识会有冲突！！
   - 所以我们一定要保证，不管哪个模块，哪个組件，我们派发的行为标识，必须是唯一的！！
   - 基于"宏管理 （統一管理），让所 有派发的行为标识，唯一性！！
3. 创建actionCreator 对象，按模块管理我们需要派发的行为对象

### 在组件中使用redux

1. 我们需要创建上下文对象，基于其 Provider 把创建的store放在根組件的上下文信息中；后代组件需要基于上下文对象，获取到上下文中的store
2. 需要用到公共状态的组件 
   - store.getState()获取公共状态
   - store.subscribe(让组件更新的函数)放在事件池中
3. 需要派发的组件
   - store.dispatch (actionCreator)

### 在组件中使用redux+react-redux

1. 提供的Provider组件，可以自己在内部创建上下文对象，把store放在根组
件的上下文中！！
2. 提供的connect函数，在  函数内部，可以获取到上下文中的store，然后快速的把公共状态，
以及需要派发的操作，基于屬性传递给组件！！
connect(mapStateToProps,mapDispatchToProps)(渲染的组件)


## fetch

### 向服务器发送数据请求的方案：
- XMLHttpRequest
  - 自己编写请求的逻辑和步骤
  - 第三方库，对XMLHttpRequest进行封装「基于promise进行封装」
- fetch 
  - ES6内置的API， 本身即使基于promise，用全新的方案实现客户端和服务器端的数据请求
  - 不兼容ie
  - 机制完善度不如XMLHttpRequest
    - 无法设置超时时间
    - 没有内置的请求中断处理
- 其它方案，主要是跨域为主
  - jsonp
  - postMessage
  - 利用img的src发送请求，实现数据埋点和上报
  - 。。。

- 服务器返回的response对象 「Response类的实例」
  - 私有属性
    - body 响应主体信息「它是一个Readablestream可读流」
    - headers 响应头信息「它是Headers类的实例』
    - status/statusText 返回的HTTP状态码及描述
      - 2xx：成功
      - 301：永久重定向 ；302：临时重定向；304: 协商缓存的一种机制
      - 400：参数错误； 401：无权限访问； 403: ；404:地址有问题；405:请求方式不被允许；408:超时
      - 500:服务器错误


### 实际使用

- let promise = fetch(请求地址，配置项)
  - 当请求成功，p的状态是fulfi1led，值是请求回来的内容；如果请求失败，p的状态是rejected，值是失败原因！
  - 只要服务器有反馈信息，无论状态码是多少，都说明网络请求成功，最后实例p的状态都是fulfilled
    - 只有服务器没有任何反馈（例如：请求中断、请求超时、断网等），实例p才是rejected!
  - 在axios中，只有返回的状态码是以2开始的，才会让实例是成功态！
- fetch的配置项
  - method 请求的方式，默认是GET 「GET、HEAD、DELETE、OPTIONS; POST、PUT、PATCH: 」
  - mode 请求模式 「no-cors, *cors, same-originj
  - cache 缓存模式「*default, no-cache, reload, force-cache, only-if-cached」
  - credentials 资源凭证（例如cookie) 「include, *same-origin, omit」
    - fetch默认情况下，跨域请求中，是不允许携带资源凭证的，只有同源下才允许！！
    - include：同源和跨域下都可以
    - same-origin：只有同源才可以
    - omit：都不可以
    - headers :普通对象{}/Headers实例   自定义请求头信息
    - body：设置请求信息
      - 只适用于POST系列请求，在GET系列请求中设置body会报错{让返回的实例变为失败态}
      - body设置的格式有要求的
        - JSON字符串 application/json
          - ’{"name":" xxx"" , "age":14, ...}‘
        - URLENCODED宇符串 application/x-www-form-urlencoded
          - ’xxx=txx&xxx=xxx‘
        - 普通字符串 text/plain
        - FormData对象 multipart/form-data
          - 主要运用在文件上传（或者表单提交）的操作中！
          - tet fm=new FormData(); fm.append（'file'，文件）；
        - 二进制或者Buffer等格式
- get请求时，fetch需要把传参的信息做处理，然后拼接到url地址后面
- Headers类 头处理类「请求头或者响应头」 
  - Headers.prototype
    - append 新增头信息
    - delete 删除头信息
    - forEach 迭代荻取所有头信息
    - get 获取某一项的信息
    - has 验证是季包含某一项
    - 。。。
- 服务器返回的response对象「Response类的实例」
   - 私有属性：
     - body响应主体信息「它是一个Readablestream可读流」
     - headers 响应头信息「它是Headers类的实例」
     - status/statusText 返回的HTTP状态码及描述
   - Response.prototype
     - arrayBuffer
     - blob
     - formData
     - json
     - text
     - ...
   - 这些方法就是用来处理body可读流信息的，把可读流信息转换为我们自己需要的格式！
   - 返回值是一个promise实例，这样可以避免，服务器返回的信息在转换中出现问题（例如：服务器返回的是一个流信息，我们转换为json对象肯定是不对的，此时可以让其返回失败的实例即可）
  ```js
    let p = fetch('/api')
    p.then(res=>{
      // 进入THEN中的时候，不一定是请求成功「因为状态码可能是各种情况」
      let {headers, status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        console.1og (`成功：`，response.json());
        // console.1og("服务器时间：“，headers. get("Date"));
        return response.json();
      }
      return Promise. reject({
        code: -100,
        status,
        statusText
      })
      console.log(res,'请求成功')
    }).then(val=>{
      console.1og (`最终处理结果`，val);
    })
    .catch(err=>{
      //会有不同的失败情况
      //1.服务器没有返回
      //2.状态码不对
      //3.数据转换失败
      console.log(err,'请求失败')
    })
  ```
 - fetch的请求中断
  
  ```js
    let ctrol = new AbortController();
    fetch('/api',{signal: ctrol.signal}).then(response=>{
      let {headers, status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        console.1og (`成功：`，response.json());
        return response.json();
      }
      return Promise. reject({
        code: -100,
        status,
        statusText
      })
      console.log(res,'请求成功')
    })
    .catch(err=>{
      // (code: 20, message: "The user aborted a request.", name: "AbortError")
      console.log(err,'请求失败')
    })
    //立即中断请求
    ctrol.abort();
  ```

## Object.defineProperty(obj,key,descriptors)
> 对象本身的规则限制：1. 冻结，2. 密封，3.扩展
- Object.defineProperty(obj,key,descriptors)
  1. 设置对象中某个成员的规则
     - 如果成员已经存在，则修改其规则
     - 如果成员不存在，则新增这个成员，并设置规则「默认所有规则都是false」
  2. 数据劫持
    ```js
      Object.defineProperty(obj，'x',{
        get(){
          // 后期获取obj.x成员信息的时候，就会触发GET函数执行
          // 返回内容是成员值
          return 'xx'
        },
        set(val){
          // 设置成员值的时候，会触发setter函数，val就是我们设置的值
          
        }
      })
    ```
- 对象“成员”的规则限制
  -  object.getownPropertyDescriptor(对象，成员)：获取对象中某个成员的规则
  -  0bject.getownPropertyDescriptors(对象)：获取对象所有成员的规则
  -  规则
     -  configurable: 是否可以刪除
     -  writable: 是否可以更
     -  enumerable: 是否可枚挙「可以被for/in或者Object.keys列挙出来的属性是可枚挙的」
     -  value：𢦓员值
## JS装饰器 decorator
> Javascript中的装饰器：就是对类、类属性、类方法之类的一种装饰，可以理解为在原有代码外层又包装了一层处理逻辑。这样就可以做到不直接修改代码，就实现某些功能。
```js
  const test = ()=>{}

  // test 是装饰器
  @test 
  class Demo {}
```
- 需要安装依赖
  - yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
  - yarn add roadhog@2.5.0-beta.1 来解决babel语法包和播件之问版本兼容的问题
- 修改babel配置项
  ```json
    // package.json
    {
      "babe1":{
        "presets": ["react-app"],
        "plugins":[
          [
            // 支持装饰器语法
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
              // 让装饰器的语法以“遗留版”为主
            }
          ],
          [
            // 编译class插件
            "@babel/plugin-proposal-class-properties",
            {
              "loose":true
              // 如果值是false ，基于Object.defineProperty设置属性和方法
              // true的话是直接设置
            }
          ]
        ]
      }
    }
  ```

## react-router-dom

### SPA与MAP
|  | `SPA` single page application | `MAP` multi page application |
| :---: | :--- | :--- |
| `组织结构` | 一个主页面＋许多组件 | 许多完整的页面 |
| `地址模式` | www.xxx.com/#/login | www.xxx.com/#/home |
| `跳转方式` | 主页面不刷新，只是组件之间的切换「一个组件渲染/显示，一个组件销毀/隐藏」 | 从一个页面跳转到另外一个页面 |
| `内容更新` | 只是相关组件的切换，即局部更新 | 整体HTML页面的切换，既全局刷新 |
| `公共资源` | 公用资源只需要加载一次 | 公用资源需要重新加载 |
| `操作体验` | 组件切换流畅、操作体验好，容易实现过渡动画 | 操作体验差、页面切换不流畅，实现不了过渡动画 |
| `数据传递` | 方式很多「本地存储、全局变量、组件通信等等」 | 方法有限，可基于本地存储、URL问号传参等方案 |
| `开发成本` | 需要基于特定的框架开发，维护起来非常方便 | 直接开发即可，但后期维护很麻烦 |
| `搜索引擎` | 不利于SEO优化「可基于SSR服务器渲染解决」 | 可以直接做SEO优化 |
| `适用场景` | 目前主流模式。对体验度和流畅度要求较高的 | 非主流模式，适用于对SEO要求较高的应用，例如：传统PC官网等 |

### 路由的设计模式
 1. hash 路由
   - 原理：每一次路由跳转，都是改变页面的hash值：并且监听hashchange事件，渲染不同的内容！
   - 改变页面的哈希值（#/xxx），主页面是不会刷新的
   - 根据不同的哈希值，让容器中渲染不同的内容「组件」
  ```js
    ` 
      <nav class="nav-box">...</nav><div class="view-box'></div>
    `
    //荻取渲染内容的容器
    const viewBox = document. queryselector(".view-box")
    const navBox = document. queryselector(".nav-box")
    // 点击A实现页面地址切换，但是不能刷新页面
    navBox.onclick = function (ev){
      let target = ev.target;
      if (target. tagName === 'A'){
        ev.preventDefault();// 阻止A标签页面跳转&刷新的默认行为
        history.pushState((), "", target.href);
        // 去路由匹配
        routerMatch ();
      }
    }
    //路由匹配的办法
    const routerMatch = function routerMatch() {
      let hash = location.hash.substring(1),
      text = "";
      routes. forEach(item => {
        if (item.path === hash) {
          text = item.component:
        }
      })
      viewBox. innerHTML = text;
    }
    
    // 默认展示首页
    history.pushState({}, '', "/");
    routerMatch ();

    // 监听popstate地址变化事件，此事件：执行go/forward/back可以触发，但是执行pushState/repalceState等方法无法触发。
    window.onpopstate = routerMatch;
  ``` 
2. history 路由
   - 利用了H5中的HistoryAPI来实现页面地址的切换「可以不刷新页面」
   - 问题：我们切换的地址，在页面不刷新的情况下是没有问题的，但是如果页面刷新，这个地址是不存在的，会报404错误！！此时我们需要服务器的配合：在地址不存在的情况下，也可以把主页面内容返回！！   
  ```js
    //荻取渲染内容的容器
    const viewBox = document. queryselector('.view-box"）；
    // 构建一个路由匹配表：每当我们重新加载页面、或者路由切换(切换哈希值)，都先到这个路由表中进行匹配；根据当前页面的哈希值，匹配出要渲染的内容（组件)！！
    const routes = [{
      path: '/',
      component: '首页的内容'
    },{
      path: '/product',
      component: '产品中心的内容'
    },{
      path: '/personal',
      component: '个人中心的内容'
    },]
    //路由匹配的办法
    const routerMatch = function routerMatch() {
      let hash = location.hash.substring(1),
      text = "";
      routes. forEach(item => {
        if (item.path === hash) {
          text = item.component:
        }
      })
      viewBox. innerHTML = text;
    }
    //一进来要展示的是首页的信息，所以默认改变一下HASH值
    location.hash ='/';
    routerMatch();
    // 监测HASH值的变化，重新进行路由匹配
    window. onhashchange = routerMatch;
  ``` 

###  react-router-dom v5
11

###  react-router-dom v6
- 在react-router-dom V6版本中，移除了
  - Switch
  - Redirect 替代方案 Navigate
  - withRouter 替代方案 自己写一个withRouter
- 在react-router-dom V6中，即便当前组件是基于<Route>匹配渲染的，也不会基于属性，把history/location/match
传递给组件！！想获取相关的信息，我们只能基于Hook函数处理！！
  - 首先要确保，需要使用路由Hook的组件，是在Router 「HashRouter或BrowserRouter」内部包着的，否则使用这些
  Hook会报错！！
  - 只要在<Router>内部包裹的组件，不论是否是基于<Route>匹配渲染的
    - 默认都不可能再基于props获取相关的对象信息了
    - 只能基于“路由Hook"去获取！！
- 为了在类组件中也可以获取路由的相关信息：
  - 稍后我们构建路由表的时候，我们会想办法：继续让基于<Route>匹配渲染的组件，可以基于属性获取需要的信息
  - 不是基于<Route>匹配渲染的组件，我们需要自己重写withRouter 「v6中干掉了这个API」，让其和基于<Route>匹配渲染的组件，具备相同的属性！！
- 在react-router-dom v6中，实现路由跳转的方式：
  - <Link/NavLink to="/a" /＞点击跳转路由
  - <Navigate to=" /a" /＞遇到这个组件就会跳转
  - 编程式导航
    - 取消了history对象，基于navigate函数实现路由跳转
    ```js
      import { useNavigate } from ' react-router-dom’;
      const navigate = useNavigate();
      navigate('/c');
      navigate('/c', { replace: true });
      navigate({ pathname: '/c'})
      // 问号传参
      navigate({ pathname: '/c',search: '?id=100&name=zhufeng'  })
      // 路径传参
      navigate({ pathname: '/c/:id?/:name?',search: '?id=100&name=zhufeng'  })
      // 隐式传参
      navigate('/c',{
        // 历史记录池替换现有地址
        replace:true,
        // 隐式传参信息
        state:{
          id: 100,
          name: '珠峰'
        }
      })
    ```
    ```js
      // 问号传参接收------
      // 方案一
      import { useLocation } from ' react-router-dom’;
      const location = useLocation();
      // location.search:"?id=100&name=zhufeng"
      const usp = new URLSearchParams (location. search) ;
      console.log(usp.get ('id'), usp.get ('name'));  
      // 方案二  
      import { useSearchParams } from ' react-router-dom’;
      let [usp] = useSearchParams();
      console.log(usp.get ('id'), usp.get ('name'));  
      // 路径传参接收------
      import { useParams } from ' react-router-dom’;
      let params = useParams();
      console.log(params); 
        //=>{id: 100, name: 'zhufeng')
      // 隐式传参接收------
      import { useLocation } from ' react-router-dom’;
      const location = useLocation();
      console.log(location.state);  
    ```

#### 在react-router-dom v6中，常用的路由Hook
- useNaviqate-＞代替5中的 useHistory：实现编程式导航
- useLocation「5中也有」：获取location对象信息 pathname/search/state...
- useSearchParams「新增的」：获取问号传参信息，取到的结果是一个URLSearchParams对像
- useParams 「5中也有」：获取路径参数匹配的信息
- useMatch(pathname)一＞代替5中的 usoRouteMatch 「5中的这个Hook有用，可以基于params获取路径参数匹配的信息，但是在6中，这个Hook需要我们自己传递地址，而且params中也没有获取匹配的信息，用的就比较少了
#### 获取路由信息
- 函数组件＆ 基于Aoute匹配渲染的：可以基于props获取路由信息、也可以自己使用Hook函致获取
- 类组件＆ 基于Route匹配渲染的：只能基手屬性获取，或者使用withRouter「自己写的」
- 函数组件＆ 不是Route匹配的：可以基于Hook自己处理、也可以使用withRouter
- 类组件＆ 不是Route匹配的：只使用withRouter「自己写的」
> 都需要放在<HashRouter> 内部



## 移动端
### 移动端响应式布局开发
- 一定要设置的 <meta name="viewport" content="width=device-width , initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  - width=device-width HTML的濱染宽度和设各宽度保特一致
  - initial-scale=1.0 初始縮放比例：既不放大也不缩小
  - maximum-scale=1.0 最大缩放比例
  - minimum-scale=1.0 最小缩放比例
  - user-scalable=no 是否与许用户手动缩放
- 如果不设置，浏览器会按照980的宽度渲染页面：手机宽度不足9B0，整个页面就会整体缩小！！
### 实现响应式布局开发步骤
- 找参照的比例（例如设计稿的比例 一＞一般都是750px），在这个比例下，基于html.fontsize一个初始值
  - html {font-size: 100px;}
  - 1/ 750Px的设计稿中，1REM=100PX
  - 未来我们需要把从设计稿中测量出来的尺寸 (Px单位）转换为REM单位去设置样式
- 我们需要根据当前设备的宽度，计算相对于设计稿750来讲，缩放的比例；从而让REM的转换比例，也跟着缩放「REM和PX的换算比例一改，则所有之前以REM为单位的样式也会跟着缩放」
### 计算当前设备下，REM和PX的换算比例
```js
  (function(){
    const computed = () => {
      let html = document.documentElement,
          deviceW = html.clientWidth,
          designW = 750;
          if(designW>=designW){
            html.style.fontSize = ratio + 'px'
            return;
          }
      let ratio = deviceW * 100 / designW
      html.style.fontSize = ratio + 'px'
    }
    computed();
    window.addEventListener('resize',computed)
  })
```
### 相关依赖
- 1ib-flexible 设置REM和PX换算比例的
  - 根据设备宽度的变化自动计算
  - html.style.fontsize=设备的宽度/10+'px’;
  - 750设计稿中 1REM=75PX：初始换算比例
  - 375设备上 1REM=37.5Px
- postcss-pxtorem 
  - 可以把我们写的PX单位，按照当时的换算比例，自动转换为REM，不需要我们自己算了
  - 井且不需要手动转换为REM「我们在  webpack中，针对postcss-pxtorem做配置，让插件帮我们自动转换」
  ```js
    // 导入插件
    const px2rem = require('postcss-pxtorem');

    px2rem({
      rootValue: 75,
      propList:['*'] // 哪些文件生效；所有文件生效
    })
  ```
  ![postcss-pxtorem在webpack中的位置](./readmeIMG/postcss-pxtorem.png) 