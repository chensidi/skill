import React from 'react';
import Router from './router/index';
import 'weui';
import 'react-weui/build/packages/react-weui.css';

import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css'

import {Provider} from 'react-redux';
import Store from './store/index';
import './index.css';

function App() {
    return (
        <Provider store={Store}>
            <Router>
            </Router>
        </Provider>
    );
}

export default App;
