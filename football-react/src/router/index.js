import {BrowserRouter as Router,Route,Switch,withRouter} from 'react-router-dom';
import React from 'react';
import Home from '../views/home';
import Match from '../views/match';
import Data from '../views/data';
import News from '../views/news';
import Tabbar from '../components/tabbar';

import {KeepAlive,Provider} from 'react-keep-alive'

 
const ANIMATION_MAP = {
    PUSH: 'forward',
    POP: 'back'
  }

// const routes = () => {
//     return (
//           <Router>
//             <Provider include="Home,Search,CateList,TopList">
//             <Top />
//             <Switch>
//                 <Route path="/" exact component={Start}>
//                 </Route>
//                 <Route path="/home" exact>
//                     <KeepAlive name="Home">
//                         <Home />
//                     </KeepAlive>
//                 </Route>
//                 <Route path="/video/:id" exact component={Video}>
//                 </Route>
//                 <Route path="/search" exact>
//                     <KeepAlive name="Search">
//                         <Search />
//                     </KeepAlive>
//                 </Route>
//                 <Route path="/album/:id" exact component={Album}>
//                 </Route>
//                 <Route path="/singer/:id" exact component={Singer}>
//                 </Route>
//                 <Route path="/mv/:id" exact component={Mv}>
//                 </Route>
//                 <Route path="/playlist/:id" exact component={PlayList}>
//                 </Route>
//                 <Route path="/cate" exact>
//                     <KeepAlive name="CateList">
//                         <CateList />
//                     </KeepAlive>
//                 </Route>
//                 <Route path="/toplist" exact>
//                     <KeepAlive name="TopList">
//                         <TopList />
//                     </KeepAlive>
//                 </Route>
//                 <Route path="/my" exact>
//                     <KeepAlive name="VideoList">
//                         <VideoList />
//                     </KeepAlive>
//                 </Route>
//             </Switch>
//             </Provider>
//           </Router>
//     )
// }


// const Routes = withRouter(({location, history}) => (
//     <TransitionGroup
//       className={'router-wrapper'}
//       childFactory={child => React.cloneElement(
//         child,
//         {classNames: ANIMATION_MAP[history.action]}
//       )}
//     >
//       <CSSTransition
//         timeout={500}
//         key={location.pathname}
//       >
//             <Switch>
//               <Route path="/home" exact>
//                     <Home />
//               </Route>
//               <Route path="/video/:id" exact component={Video}>
//               </Route>
//               <Route path="/search" exact>
//                       <Search />
//               </Route>
//               <Route path="/Album/:id" exact component={Album}>
//               </Route>
//             </Switch>
//       </CSSTransition>
//     </TransitionGroup>
//   ));

// const newRouter = ()=>{
//     return (
//         <Router>
//             <Top />
//             <Routes />
//         </Router>
//     )
// }

const footballRoute = () => {
    return (
        <Router>
            <Provider include="Home,Match,Data,News">
                <Switch>
                    <Route path="/"  exact>
                        <KeepAlive name="Home">
                            <Home />
                        </KeepAlive>
                    </Route>
                    <Route path="/match"  exact component={Match}></Route>
                    <Route path="/data"  exact component={Data}></Route>
                    <Route path="/news/:id"  exact component={News}></Route>
                </Switch>
                <Tabbar />
            </Provider>
        </Router>

    )
}

export default footballRoute;