import React, { Component } from 'react';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import Routers from './router/index'
import store from './store/index'
import {Provider} from 'react-redux'
import { BrowserRouter,HashRouter} from 'react-router-dom'
import 'antd/dist/antd.css'
import './static/style.css'
import './static/public.css'


class App extends Component {
    render() {
        return (
            <div className="App">
                <Provider store={store}>
                    <HashRouter>
                        <Routers></Routers>  
                    </HashRouter>
                </Provider>
            </div>
        );
    }
}

export default App;
