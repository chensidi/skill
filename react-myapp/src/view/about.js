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
    onShowSizeChange = (current, pageSize)=>{
        console.log(current, pageSize);
    }
    onChange = (pageNumber)=>{
        console.log(pageNumber)
    }
    render(){
        let menu = (<Menu>
            <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
            </Menu.Item>
            <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item disabled>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
            </Menu.Item>
        </Menu>);
        return(
            <div>
                About
                <Link to='/'>to home</Link>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="javascript:void(0)">
                    Hover me <Icon type="down" />
                    </a>
                </Dropdown>
                <Dropdown.Button overlay={menu}>
                    Dropdown
                </Dropdown.Button>
                <Pagination showQuickJumper defaultCurrent={6} total={500} onChange={this.onChange} showSizeChanger onShowSizeChange={this.onShowSizeChange} />
            </div>
        );
    }
}

export default About;