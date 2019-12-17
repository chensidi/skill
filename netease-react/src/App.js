import React from 'react';
import Router from './router/index';
import PlayBar from './components/playbar';
import {Provider} from 'react-redux';
import Store from './store/index';
import 'weui';
import 'react-weui/build/packages/react-weui.css';

function App() {
  return (
    <Provider store={Store}>
      <div className="App">
          <Router></Router>
          <PlayBar />
      </div>
    </Provider>
  );
}

export default App;
