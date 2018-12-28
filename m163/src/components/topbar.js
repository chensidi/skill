import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/topbar.css';
import {Input,Dropdown} from 'element-react';

class Topbar extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='topbar'>
                <div className='top_main clearfix'>
                    <h2 className='logo'>
                        <Link to='/' className='logo'>网易云音乐</Link>
                    </h2>
                    <ul className='top_nav'>
                        <li>
                            <Link to='' className='on'>发现音乐</Link>
                            <sub className='cor'></sub>
                        </li>
                        <li>
                            <Link to=''>我的音乐</Link>
                        </li>
                        <li>
                            <Link to=''>朋友</Link>
                        </li>
                        <li>
                            <Link to=''>商城</Link>
                        </li>
                        <li>
                            <Link to=''>音乐人</Link>
                        </li>
                        <li>
                            <Link to=''>下载客户端</Link>
                            <sup className='hot'></sup>
                        </li>
                    </ul>
                    <div className='top_ser'>
                        <Input  placeholder='音乐/视频/电台/用户'/>
                    </div>
                    <div className='login_drop'>
                        <Dropdown menu={(
                            <Dropdown.Menu>
                                <Dropdown.Item><i className='phone'></i>手机号登录</Dropdown.Item>
                                <Dropdown.Item><i className='wx'></i>微信登录</Dropdown.Item>
                                <Dropdown.Item><i className='qq'></i>QQ登录</Dropdown.Item>
                            </Dropdown.Menu>
                            )}
                            >
                            <Link to='/login' className="el-dropdown-link">
                                登录<i className="el-icon-caret-bottom el-icon--right"></i>
                            </Link>
                        </Dropdown>
                    </div>
                </div>
            </div>
        )
    }
}

export default Topbar;