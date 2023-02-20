/*
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-14 10:06:25
 * @LastEditTime: 2023-02-20 10:59:36
 */
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>111</div>
  </React.StrictMode>
);
fetch("/jian/subscriptions/recommended_collections")
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
