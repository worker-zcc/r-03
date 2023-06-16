
import React from "react"
const DemoFather = function Demo(props){
  
  return <Demo>
    <span slot="fisrt">1</span>
    <span slot="second">2</span>
    <span>3</span>
  </Demo>
}


const Demo = function Demo(props){
  let {children} = props
  children = React.Children.toArray(children)
  let fisrt, second,defaultSlot;
  children.forEach(a => {
    const { slot } =a.props
    if(slot === "fisrt"){
      fisrt.push(a)
    } else if(slot === "second"){
      second.push(a)
    } else {
      defaultSlot.push(a)
    }
    
  });
  return <div>
    {fisrt}
    <p>1</p>
    {second}
  </div>
}

class Dome extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
      // nextState:存储需要修改的最新状态
      // this.state:存储的还是修改之前的状态[此时状态还没有改变]
      console.log(this.state,nextState)
      // 此周期函数需要返回true/false
        // true：允许更新，会执行下一操作
        // false：不允许更新，接下来啥都不处理
      return true
    }
    com
}