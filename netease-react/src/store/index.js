import {createStore,combineReducers} from 'redux';
import reducer from './reducer.js';

const myReducer = combineReducers({reducer});

const initState = {}

const store = createStore(myReducer,initState);

export default store;