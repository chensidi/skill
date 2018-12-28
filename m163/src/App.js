import React, { Component } from 'react';
import RouterIndex from '../src/router';
import 'element-theme-default';
import './css/public.css'

class App extends Component {
  render() {
    return (
      <div className="App">
          <RouterIndex></RouterIndex>
      </div>
    );
  }
}

export default App;
