import React,{Component} from 'react'
import {Switch,Route,Redirect,BrowserRouter as Router} from 'react-router-dom';
import Home from '../views/home';
import List from '../views/list';

class RouterIndex extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home}></Route>
                    <Route exact path='/list' component={List}></Route>
                </Switch>
            </Router>
        )
    }
}

export default RouterIndex;
