/*
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-06-16 15:12:35
 * @LastEditTime: 2023-06-16 15:55:54
 */

import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
const routes = [
  {
    path: "/",
    component: () => <Navigate to="/a" />,
  },
  {
    path: "/a",
    name: "a",
    component: lazy(() => import("../pages/router/A")),
    meta: {},
    children: [],
  },
  {
    path: "/b/:id?/:name?",
    name: "b",
    component: lazy(() => import("../pages/router/B")),
    meta: {},
    children: [],
  },
];
export default routes;
