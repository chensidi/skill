import React ,{ Component } from 'react'
import {Switch,Route,Redirect,BrowserRouter as Router} from 'react-router-dom'
import Index from '../view/index'
import About from '../view/about'
import Book from '../view/book'
class RouterIndex extends Component {
    constructor(props){
        super(props)
    }
    componentWillMount(){
        console.log(this.props);
    }
    componentDidCatch(){
        console.log(666);
    }
    componentDidMount(){
        console.log(777);
    }
    componentDidUpdate(){
        console.log(888);
    }
    componentWillMount(){
        console.log(999)
    }
    render(){
        return(
            <Router>
                <Switch tag={1}>
                    <Route exact path='/' tag={1} component={Index}/>
                    <Route path='/about' component={About}/>
                    <Route path='/book' component={Book} />
                </Switch>
            </Router>
        );
    }
}

export default RouterIndex;