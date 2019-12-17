import React, {Component} from 'react';
import { Modal, WingBlank, WhiteSpace, Toast,Button } from 'antd-mobile';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';
import axios from 'axios';
// import {Button} from 'antd';

function mapStateToProps(state){
    return {
        count: state.reducer.active,
        api: state.reducer.api,
        mp3: state.reducer.mp3
    }
}

function mapActionToProps(dispatch){
    return {
        changeView: (num)=>{dispatch(changeActive(num))},
        changeMp3: (url)=>{dispatch(changeMp3(url))},
        changePic: (pic)=>{dispatch(changePic(pic))}
    }
}

class Start extends Component {
    constructor(){
        super();
        this.state = {
            prompt: Modal.prompt,
            count: 5,
            loginStatus: false,
            loading: false,
            showBtn: false
        }
    }

    timer = () => {
        if(this.state.count > 0){
            setTimeout(()=>{
                this.setState(prev=>({
                    count: prev.count - 1
                }),()=>{
                    this.timer();
                })
            },1000)
        }else{
            this.login();
        }
    }

    login = () => {
        this.state.prompt(
            'Login',
            'Please input login information',
            [
                {
                    text: '取消',
                    onPress: (val,val2)=>{
                        // console.log(val,val2)
                        this.setState({showBtn: true})
                    }
                },
                {
                    text: '确定',
                    onPress: (val,val2)=>{
                        console.log(val,val2);
                        this.setState({showBtn: true})
                        this.loginAjax(val,val2);
                    }
                },
            ],
            'login-password',
            null,
            ['Please input name', 'Please input password'],
          )
    }

    refresh = () => {
        axios({
            url: `${this.props.api}/login/refresh`
        }).then(res=>{
            console.log(res);
        })
    }

    loginAjax = (user,pass) => {
        this.setState({
            loading: true
        })
        axios({
            url: `${this.props.api}/login/cellphone?phone=${user}&password=${pass}`,
            timeout: 15000
        }).then(res=>{
            console.log(res.status == 200)
            this.setState({
                loading: false
            })
            if(res.status == 200){
                Toast.success('登录成功 !!!', 1);
                let user = {
                    uid: res.data.profile.userId,
                    user: user,
                    pass: pass
                }
                localStorage.setItem('user',JSON.stringify(user));
                setTimeout(()=>{
                    this.props.history.push('/home');
                },1000)
            }
        }).catch(err=>{
            console.log(err)
            Toast.fail('登录失败 !!!', 1);
            this.setState({
                loading: false
            })
        })
    }

    componentWillMount(){
        this.timer();
        this.refresh();
    }

    render() {
        return (
            <div className="start-bg">
                <div className="last-time">
                    倒计时 {this.state.count} 秒
                </div>
                <div className="login-btn" style={{display: this.state.showBtn?'':'none'}}>
                    <Button type="primary" block loading={this.state.loading} onClick={this.login}>
                        登录
                    </Button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Start)