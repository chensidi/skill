import React from 'react';
import {ADD, MINUS} from '../store/actions-type'
import store from '../store'

export default class Counter extends React.Component {
  // 拿到一个store对象，并挂载到当前对象上
  state = store.getState()
  componentDidMount() {
    // 组件挂载完成以后，订阅state的事件
    store.subscribe(() => this.setState({
      number: store.getState().number
    }))
  }
  render () {
    return (
      <div>
        <p>Counter: {this.state.number}</p>
        <button onClick={() => store.dispatch({ type: ADD })}>+</button>
        <button onClick={() => store.dispatch({ type: MINUS })}>-</button>
      </div>
    )
  }
  
}
