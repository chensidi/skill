import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {Input,Icon,Button,message} from 'antd'
import $ from 'jquery'
import { func } from 'prop-types';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            tel: '',
            pwd: '',
            showWarn: true
        }
    }

    handleTel = (e)=>{
        this.setState({
            tel: e.target.value
        })
    }

    handlePwd = (e)=>{
        this.setState({
            pwd: e.target.value
        })
    }

    login = ()=>{
        if(this.state.tel == ''||this.state.tel == null){
            message.error('the phone number can not be empty');
            return;
        }
        if(this.state.pwd == ''|| this.state.pwd == null){
            message.error('the password can not be empty');
            return;
        }

        this.setState({
            loading: true
        })
        // $.get(`${this.props.myApi}/login/cellphone?phone=${this.state.tel}&password=${this.state.pwd}`).then(dt=>{

        //     console.log(dt);
        //     this.setState({
        //         loading: false
        //     })
        // }) 

        $.ajax({
            url: `${this.props.myApi}/login/cellphone?phone=${this.state.tel}&password=${this.state.pwd}`,
            timeout: 10000,
            error: (XMLHttpRequest, textStatus, errorThrown)=>{
                message.error('password error');
                this.setState({
                    loading: false
                })
            },
            success: (dt)=>{
                if(dt.code!=200)return;
                localStorage.setItem('user',JSON.stringify({tel:this.state.tel,pwd:this.state.pwd,uid:dt.profile.userId}))
                this.setState({
                    loading: false
                },()=>{this.props.hideLogin(dt.profile.userId)})
            }
        })
    }

    render(){
        return (
            <div className={this.props.showLogin?'login':'login hide'}>
                <div className='input_box'>
                    <Input placeholder="input your phone number" 
                    allowClear
                    onChange = {this.handleTel}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                </div>
                <div className='input_box'>
                    <Input.Password placeholder="input your password" 
                    allowClear
                    onChange = {this.handlePwd}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                </div>
                <Button type="primary" block loading={this.state.loading} onClick={this.login}>Login</Button>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)
