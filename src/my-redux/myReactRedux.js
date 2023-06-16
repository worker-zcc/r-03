/*
 * @Desc:
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-06-05 10:07:11
 * @LastEditTime: 2023-06-06 10:12:00
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { bindActionCreators } from "redux";
const ThemeContext = createContext();

// Provider 把传递进来的store 放在跟组件的上下文中
export function Provider(props) {
  let { store, children } = props;
  return (
    <ThemeContext.Provider value={{ store }}>{children}</ThemeContext.Provider>
  );
}
// connect 获取上下文组件中的store，然后把公共状态，要派发的方法等，都基于属性传递给需要渲染的组件，把让组件更新的方法放在redux事件池中
export function connect(mapStateToProps, mapDispatchToProps) {
  // 处理默认值
  if (!mapStateToProps) {
    mapStateToProps = () => {
      return {};
    };
  }
  if (!mapDispatchToProps) {
    mapDispatchToProps = (dispatch) => {
      return {
        dispatch,
      };
    };
  }
  return function currying(Component) {
    // Component是要最终渲染的组件
    // HOC：我们最后基于export default导出的组件
    return function HOC(props) {
      // 我们需要获取上下文中的store
      let { store } = useContext(ThemeContext),
        { getState, dispatch, subscribe } = store;
      let [, forceUpdate] = useState(0);
      useEffect(() => {
        let unsubscribe = subscribe(() => {
          forceUpdate(+new Date());
        });
        return () => {
          // 在组件释放的时候执行,把放在事件池中的函数移除掉
          unsubscribe();
        };
      }, []);
      // 把mapStateToProps和mapDispatchToProps执行，把执行的返回值作为属性传递给组件
      let state = getState(),
        // nextState = mapStateToProps(state);
        // 优化：如果state中的值没变就直接取原来的数
        nextState = useMemo(() => {
          return mapStateToProps(state);
        }, [state]);
      let dispatchProps = {};
      if (typeof mapDispatchToProps === "function") {
        // 是函数直接执行即可
        dispatchProps = mapDispatchToProps(dispatch);
      } else {
        // 是actionCreator对象，需要经过bindActionCreator处理
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
      }

      return <Component {...props} {...nextState} {...dispatchProps} />;
    };
  };
}
