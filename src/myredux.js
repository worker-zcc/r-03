/*
 * @Desc:实现redux源码
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-05-29 14:44:07
 * @LastEditTime: 2023-05-29 15:28:07
 */

export const createStore = function createStore(reducer) {
  let state, // 存放公共状态
    listeners = []; // 事件池
  // 获取公共状态的方法
  const getState = function getState() {
    return state;
  };
  // 向事件池中加入组件更新的方法
  const subscribe = function subscribe(listener) {
    // 规则校验
    if (typeof listener !== "function") throw new Error("必须是个函数");
    // 把传入的方法（让组件更新的办法）加入到事件池中 ，[注意：需要做去重处理]
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
    // 返回一个从事件池中，移除方法的函数
    return function unsubscribe() {
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };
  // 派发任务通知reducer执行
  const dispatch = function dispatch(action) {
    // 规则校验
    if (!isPlainObject) throw new TypeError("action must be plain object");
    // action 必须有type字段
    if (typeof action.type === "undefined")
      throw new TypeError("action may not have an undefined type");

    // 把reducer执行，传递：公共状态，行为对象，接收执行的结果，替换公共状态
    state = reducer(state, action);

    // 当状态更改，我们还需要把事件池的方法执行
    listeners.forEach((listener) => {
      listener();
    });

    // 当状态更改，我们还需把事件池中的方法执行
  };

  // 校验是不是obj
  const isPlainObject = function isPlainObject(object) { };
  // 生成随机数
  const randomString = () => Math.random().toString(36).substring(7).split('').join('.')
    =
    // redux内部会默认进行一次dispatch派发，目的：给公共容器中的状态赋值初始值
    dispatch({
      // type: Symbol()
      type: '@@redux/INIT' + randomString()

    });
  // 返回 创建的 store 对象
  return {
    getState,
    subscribe,
    dispatch,
  };
};
