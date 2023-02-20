/*
 * @Desc: 代理配置
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-20 10:20:43
 * @LastEditTime: 2023-02-20 10:53:48
 */
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/jian", {
      target: "https://www.jianshu.com/asimov", //代理地址
      changeOrigin: true,
      ws: true,
      pathRewrite: { "^/jian": "" },
    })
  );
};
