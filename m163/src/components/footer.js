import React, { Component } from 'react';
import {Breadcrumb} from 'element-react';
import {Link} from 'react-router-dom';

class Footer extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='footer'>
                <div className='main_ft'>
                    <div className='copy f-left'>
                        <div>
                            <Breadcrumb separator="|" className='link'>
                                <Breadcrumb.Item>关于网易</Breadcrumb.Item>
                                <Breadcrumb.Item>客户服务</Breadcrumb.Item>
                                <Breadcrumb.Item>服务条款</Breadcrumb.Item>
                                <Breadcrumb.Item>网站导航</Breadcrumb.Item>
                                <Breadcrumb.Item>意见反馈</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <p>
                            <span style={{'marginRight':'14px'}}>网易公司版权所有©1997-2018</span>
                            <span>杭州乐读科技有限公司运营：</span>
                            <span>浙网文[2018]3506-263号</span>
                        </p>
                        <p>
                            <span style={{'marginRight':'14px'}}>违法和不良信息举报电话：0571-89853516-2018</span>
                            <span>举报邮箱：</span>
                            <span>ncm5990@163.com</span>
                        </p>
                    </div>
                    <ul className='enter'>
                        <li>
                            <Link to=''></Link>
                            <span>用户认证</span>
                        </li>
                        <li>
                            <Link to='' className='musician'></Link>
                            <span>音乐人</span>
                        </li>
                        <li>
                            <Link to='' className='reward'></Link>
                            <span>赞赏</span>
                        </li>
                        <li>
                            <Link to='' className='cash'></Link>
                            <span>视频奖励</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Footer;