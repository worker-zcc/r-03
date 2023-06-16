/*
 * @Desc:App
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-06-15 17:54:24
 * @LastEditTime: 2023-06-16 15:52:46
 */

import React from "react";

import { HashRouter } from "react-router-dom";
import Nav from "./pages/router/nav";
import RouterView from "./router";
const App = () => {
  return (
    <HashRouter>
      <Nav />
      <div className="content">
        <RouterView />
      </div>
    </HashRouter>
  );
};
// 方法1
// import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
// import Nav from "./pages/router/nav";
// import A from "./pages/router/A";
// import A1 from "./pages/router/A1";
// import B from "./pages/router/B";
// const App = () => {
//   return (
//     <HashRouter>
//       {/* 导航部分 */}
//       <Nav />
//       <div className="content">
//         {/*
//          *  所有的路有匹配规则放在<Routes></Routes>
//          *  每一条规则的匹配，还是基于<Route>;
//          *    - 路由匹配成功，不再基于 component/ render控制渲染的组件，而是基于element，语法格式是<Component/>
//          *    - 不再需要Switch，默认就是一个匹配成功，就不在匹配下面的了
//          *    - 不再需要exact，默认每一项匹配都是精准匹配
//          *    - 原有的<Redirect>操作，被 sNavigate to="/" /＞代替！！
//          *    - 遇到 <Navigate/＞组件，路由就会跳转，跳转到to指定的路由地址
//          *      - <Navigate to={{…}/＞to的值可以是一个对象：pathname需要跳转的地址、search问号传参信息
//          *      - 设置replace 属性，则不会新增立即记录，而是替换现有记录
//          */}
//         <Routes>
//           {/* <Route path="/" element={<Navigate to="/b" />} /> */}
//           <Route path="/a" element={<A />}>
//             {/* 在内部搭建二级路由 */}
//             <Route path="/a" element={<Navigate to="/a/a1" />} />
//             <Route path="/a/a1" element={<A1 />} />
//           </Route>
//           <Route path="/b" element={<B />} />
//           <Route
//             path="*"
//             element={
//               <Navigate
//                 to={{
//                   pathname: "/a",
//                   search: "?lx=404",
//                 }}
//               />
//             }
//           />
//         </Routes>
//       </div>
//     </HashRouter>
//   );
// };
export default App;
