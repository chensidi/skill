import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import { Row, Col } from 'antd';
import '../assets/index.css';
import store from '../store';
class Home extends Component {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        store.dispatch({ type: 'no1' });
        var newstate = store.getState();
        console.log(newstate);
        console.log(this.props)
    }
    render(){
        
        return(
            <div>
                <Link to='/book' >to book</Link>
            </div>
        );
    }
}

export default Home;