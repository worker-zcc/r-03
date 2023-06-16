import React, { Suspense } from "react";
import myRoutes from "./routes";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

// 统一渲染的组件：在这里可以做一些事情「例如：权限/登录态校验，传递属性•…•」
const Element = (props) => {
  let { component: Component } = props;
  //把路由信息先获取到，最后基于属性传递给组件：只要是基于<Route>匹配渲染的组件，都可以基于属性获取路由信息
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();
  //最后要把Component进行渲染
  return (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
  );
};
// 递归创建Route
const createRoute = (routes) => {
  return (
    <>
      {routes.map((item, index) => {
        let { path, children } = item;
        return (
          // 每一次路由匹配成功，不直接渲染我们设定的组件，而是渲染Element;在Element做一些特殊处理后，再去渲染我们真实要渲染的组件！！
          <Route key={index} path={path} element={<Element {...item} />}>
            {/* 基于递归绑定子路由 */}
            {Array.isArray(children) ? createRoute(children) : null}
          </Route>
        );
      })}
    </>
  );
};
// 路由容器

export default function RouterView() {
  return (
    // Suspense 处理路由懒加载
    <Suspense fallback={<>正在处理中</>}>
      <Routes>{createRoute(myRoutes)}</Routes>
    </Suspense>
  );
}

export const withRouter = function withRouter(Component) {
  // Component是真实要创建的组件
  return function HOC(props) {
    // 提前获取路由信息，传递给Component
    const navigate = useNavigate(),
      location = useLocation(),
      params = useParams(),
      [usp] = useSearchParams();
    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
        usp={usp}
      />
    );
  };
};
