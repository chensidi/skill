import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/topbar.css';
import {Input,Dropdown,MessageBox,Message,Form,Button,Checkbox} from 'element-react';
import $ from 'jquery';
var key = true;
class Topbar extends Component {
    constructor(props){
        super(props);
        this.loginbox = this.loginbox.bind(this);
        this.state = {
            msg: false
        };
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        this.setState((prevState) => ({
            msg: !prevState.msg
        }))
        console.log(this.state.msg)
    }
    onChange() {
        this.setState((prevState) => ({
            msg: !prevState.msg
        }))
        key = !key;
        // console.log(this.state.msg)
        $('.el-message-box__headerbtn').trigger('click');
        this.loginbox();
    }
    loginbox(){
        var tip = key?'没有帐号？免费注册 >':'< 返回登录'
        MessageBox.msgbox({
            title: '登录',
            message: <div className='login_cnt'>
                <Form className="demo-ruleForm" labelWidth="40">
                    <Form.Item label="用户">
                        <Input type="password" />
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input type="password" />
                    </Form.Item>
                    <Checkbox label="自动登录" name="type"></Checkbox>
                    <Button type="primary" className='m-auto' style={{'display':'block','padding':'11px 66px','marginTop':'20px'}}>登录</Button>
                    <a href='#' className='change' onClick={this.onChange}>{tip}</a>
                </Form>
            </div>,
            showConfirmButton: false,
            showCancelButton: false
        })
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
                        <i className='el-icon-search ser_icon'></i>
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
                            <Link to='#' className="el-dropdown-link" onClick={this.loginbox}>
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