<!--
 * @Desc: 
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-14 10:06:25
 * @LastEditTime: 2023-02-20 10:51:29
-->
# Getting Started with Create React App

## 配置修改

- 修改端口号/域名
- 修改环境变量
  - cross-env：
      - npm i cross-env
      - 通过cross-env修改端口
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
  - 对postcss-loader生效：控制css3的前缀
  - 对bable-loader生效：控制es6的妆换
  - 无法处理es6内置api的兼容：使用@babel/polyfill对常见内置API进行重写
- 处理跨域
  - 在src目录下新建setupProxy.js文件
  - 安装依赖：npm i http-proxy-middleware
    - http-proxy-middleware：实现跨域代理模块，[webpack-dev-server的跨域代理原理，也是基于它完成]
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
