import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import { Breadcrumb,Menu, Dropdown, Icon ,Pagination} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
class About extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            
            <Link to='/'>to home</Link>
        )
    }
}

export default About;