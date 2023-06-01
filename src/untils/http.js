/*
 * @Desc: http
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-05-31 18:31:56
 * @LastEditTime: 2023-05-31 19:15:06
 */

import qs from "qs";
import { message } from "antd";
// 核心方法
const http = function http(config) {
  if (!isPlainObject(config)) config = {};
  config = Object.assign(
    {
      url: "",
      method: "GET",
      credentials: "include",
      headers: null,
      body: null,
      params: null,
      responseType: "json",
      signal: null,
    },
    config
  );
  if (!config.url) throw new TypeError("url must be required");
  if (!isPlainObject(config.headers)) config.headers = {};
  if (config.params !== null && !isPlainObject(config.params))
    config.params = null;
  // 细节处理
  let {
    url,
    method,
    credentials,
    headers,
    body,
    params,
    responseType,
    signal,
    cache,
  } = config;
  if (params) {
    url += `${url.includes("?") ? "&" : "?"}${qs.stringify(params)}`;
  }
  //发送请求
  method = method.toUpperCase();
  config = {
    method,
    credentials,
    headers,
    cache: "no-cache" || cache,
    signal,
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;
  return fetch(url, config)
    .then((response) => {
      let { status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        // 请求成功根据返回数据处理
        let result;
        switch (responseType.toLowerCase()) {
          case "text":
            result = response.text();
            break;
          case "arrayBuffer":
            result = response.arrayBuffer();
            break;
          case "blob":
            result = response.blob();
            break;
          default:
            result = response.json();
        }
        return result;
      }
      return Promise.reject({
        code: -100,
        status,
        statusText,
      });
    })
    .catch((err) => {
      if (err && typeof reason === "object") {
        let { code, status } = err;
        if (code === -100) {
          switch (+status) {
            case 400:
              message.error("请求参数出现问题！");
              break;
            // ...
            default:
          }
        } else if (code === 20) {
          message.error("请求被中断了～");
        } else {
          message.error("网络繁忙，请稍后再试！");
        }
      } else {
        message.error("网络繁忙，请稍后再试！");
      }

      return Promise.reject(err);
    });
};

// 快捷方法

// get 请求
["GET", "HEAD", "DELETE", "OPTIONS"].forEach((item) => {
  http[item.toLowerCase()] = function (url, config) {
    if (!isPlainObject(config)) config = {};
    config["url"] = url;
    config["method"] = item;
    return http(config);
  };
});

// post 请求
["POST", "PUT", "PATCH"].forEach((item) => {
  http[item.toLowerCase()] = function (url, body, config) {
    if (!isPlainObject(config)) config = {};
    config["url"] = url;
    config["method"] = item;
    config["body"] = body;
    return http(config);
  };
});

const isPlainObject = () => {};

export default http;
