import React ,{ Component } from 'react'
import {Switch,Route,Redirect,BrowserRouter as Router} from 'react-router-dom'
import Index from '../view/index'
import About from '../view/about'
import Book from '../view/book'
class RouterIndex extends Component {
    render(){
        return(
            <Router>
                <Switch>
                    <Route path='/' exact render={()=>(//exact是用于精准匹配，这里是定义了路由重定向，意思是当我们进入"/"时会重定向到“/index”
                        <Redirect to='/index'/>
                    )}/>
                    <Route path='/index' component={Index}/>
                    <Route path='/about' component={About}/>
                    <Route path='/book' component={Book} />
                </Switch>
            </Router>
        );
    }
}

export default RouterIndex;