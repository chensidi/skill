import React, { Component } from 'react';
import RouterIndex from './route/index'
import 'antd/dist/antd.css';
import './assets/mui.css';
import Tabbar from './components/tabbar';
import Store from './store'
class App extends Component{
    render() {
        return (
            <div>
                <RouterIndex tag={1} />
                <Tabbar />
            </div>
        );
    }
}

export default App;
