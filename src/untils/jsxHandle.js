/*
 * @Desc: jsx中的的方法
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2023-02-20 15:34:37
 * @LastEditTime: 2023-02-22 10:14:18
 */

// 封装对象迭代方法
export function objIteration(obj, callback) {
  if (obj === null || typeof obj !== "object")
    throw new TypeError("Obj is not Object");
  if (typeof callback !== "function")
    throw new TypeError("callback is not function");
  const keysArr = Reflect.ownKeys(obj);
  keysArr.forEach((key) => {
    callback(obj[key], key);
  });
}

// 创建虚拟DOM对象
export function createElement(ele, props, ...children) {
  let virtualDOM = {
    $$typeof: Symbol(`react.element`),
    ref: null,
    kev: null,
    type: null,
    props: {},
  };
  let len = children.length;
  virtualDOM.type = ele;
  if (props !== null) {
    virtualDOM.props = { ...props };
  }
  if (len === 1) virtualDOM.props.children = children[0];
  if (len > 1) virtualDOM.props.children = children;
  return virtualDOM;
}
