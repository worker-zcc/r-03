/*
 * @Desc:nav
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-06-15 17:51:21
 * @LastEditTime: 2023-06-16 14:03:49
 */
import React from "react";
import { NavLink } from "react-router-dom";
const Nav = () => {
  return (
    <nav>
      <NavLink to="/a">A</NavLink>
      <NavLink to="/b">B</NavLink>
    </nav>
  );
};
export default Nav;
