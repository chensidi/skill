import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import store from '../store';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class Book extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false
        }
    }
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }
    componentWillMount(){
        store.dispatch({type: 'no2'})
        var newstate = store.getState();
        console.log(newstate)
    }
    render(){
        
        return(
            <div>
                book
                <Link to='/about'>to about</Link>
            </div>
        );
    }
}

export default Book;