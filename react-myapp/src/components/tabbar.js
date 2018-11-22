import React ,{ Component } from 'react';
import store from '../store';

class Tabbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            num: 0
        }
    }
    componentWillMount(){
        var num = store.getState().number;
        this.setState({
            num: num
        })
        console.log(num)
    }
    render(){

        return (
            <nav className="mui-bar mui-bar-tab">
                <a id="defaultTab" className="mui-tab-items mui-active" href="/">
                    <span className="mui-icon mui-icon-home"></span>
                    <span className="mui-tab-label">{store.getState().number}</span>
                </a>
                <a  className="mui-tab-items" href="/book">
                    <span className="mui-icon mui-icon-checkbox"></span>
                    <span className="mui-tab-label">控件</span>
                </a>
                <a className="mui-tab-items" href="/about">
                        <span className="mui-icon mui-icon-email"><span className="mui-badge">5</span></span>
                        <span className="mui-tab-label">列表</span>
                </a>
                <a className="mui-tab-items" href="template/contact.html">
                        <span className="mui-icon mui-icon-contact"></span>
                        <span className="mui-tab-label">通讯录</span>
                </a>
                <a className="mui-tab-items" href="template/my.html">
                    <span className="mui-icon mui-icon-person"></span>
                    <span className="mui-tab-label">我的</span>
                </a>
            </nav>
        );
    }
}

export default Tabbar;