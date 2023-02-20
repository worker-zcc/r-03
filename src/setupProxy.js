/*
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-20 10:20:43
 * @LastEditTime: 2023-02-20 10:48:31
 */
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
