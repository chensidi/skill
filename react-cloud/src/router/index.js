import React, {Component} from 'react'
import {Switch,Route,BrowserRouter as Router,withRouter,Redirect} from 'react-router-dom';
import {TransitionGroup,CSSTransition} from 'react-transition-group'
import Home from '../views/home'
import Play from '../views/play'
import My from '../views/my'
import Album from '../views/album'
import {connect} from 'react-redux'
import UserList from '../views/userlist'
import History from '../views/history'
import Sublist from '../views/sublist'
import Start from '../views/start'
const ANIMATION_MAP = {
    PUSH: 'forward',
    POP: 'back'
}

class Routers extends Component {
    render(){
        return(
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/start" />
                        </Route>
                        <Route path='/start' component={Start}></Route>                        
                        <Route path='/home' component={Home}></Route>
                        <Route path='/play' component={Play}></Route>
                        <Route path='/my' component={My}></Route>
                        <Route path='/album/:idx' component={Album}></Route>
                        <Route path='/ulist/:id' component={UserList}></Route>
                        <Route path='/history' component={History}></Route>
                        <Route path='/sublist' component={Sublist}></Route>
                    </Switch>
        )
    }
}


const Routes = withRouter(({location, history}) => (
    
        <TransitionGroup
        className={'router-wrapper'}
        childFactory={child => React.cloneElement(
            child,
            {classNames: ANIMATION_MAP[history.action]}
        )}
        >
        <CSSTransition
            timeout={500}
            key={location.pathname}
        >
            <Switch location={location}>
                <Route path='/home' component={Home}></Route>
                <Route path='/play' component={Play}></Route>
                <Route path='/my' component={My}></Route>
            </Switch>
        </CSSTransition>
        </TransitionGroup>
  ));
export default withRouter(connect()(Routers));
// export default Routes;