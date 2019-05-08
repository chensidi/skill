import {combineReducers} from 'redux'
import defaultState from './state.js'

function tabbar(state = defaultState.tabbar,action){
    switch(action.type){
        case 'setTabbatState':
            return action.data;
        default: 
            return state
    }
}

function myApi(state = defaultState.myApi,action){
    switch(action.type){
        case 'setMyApi':
            return action.data;
        default: 
            return state;
    }
}

function homeflag(state = defaultState.homeflag,action){
    switch(action.type){
        case 'setFlag':
            return action.data;
        default:
            return state;
    }
}

export default combineReducers({
    tabbar,
    myApi,
    homeflag
})