/*
 * @Desc:A
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-06-15 17:51:21
 * @LastEditTime: 2023-06-16 14:06:00
 */
import React from "react";
import { Link, Outlet } from "react-router-dom";
const A = () => {
  return (
    <>
      <Link to="/a/a1">A1</Link>
      <div className="view">
        {/* Outlet路由容器：用来渲染二级或者多级路由匹配 */}
        <Outlet />
      </div>
    </>
  );
};
export default A;
