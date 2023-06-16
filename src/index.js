/*
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-14 10:06:25
 * @LastEditTime: 2023-06-15 18:04:43
 */
import React from "react"; // react核心语法
import ReactDOM from "react-dom/client"; // 构建HTML（WEBAPP）的核心
import App from "./App";
// antd 组件库
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
// root： 页面根容器
const root = ReactDOM.createRoot(document.getElementById("root"));

// 基于render方法渲染视图
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
// fetch("/jian/subscriptions/recommended_collections")
//   .then((response) => response.json())
//   .then((res) => {
//     console.log(res);
//   });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
