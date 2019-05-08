import React, {Component} from 'react'
import Tabbar from '../components/tabbar'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import Head from '../components/head'
import Login from '../components/login'
import User from '../components/user'
import {Mask} from 'react-weui'
import $ from 'jquery'
import Imask from '../components/mask'

class My extends Component {

    constructor(){
        super();
        this.state = {
            showLogin: true,
            showMask: true,
            uid: null
        }
    }

    componentWillMount(){
        let user = localStorage.getItem('user'),
            {myApi} = this.props;
        if(user!=null&&user!=''){
            user = JSON.parse(user);
            if(user.tel!=undefined&&user.pwd!=undefined&&user.uid!=undefined){
                $.ajax({
                    url: `${myApi}/login/cellphone?phone=${user.tel}&password=${user.pwd}`,
                    timeout: 10000,
                    error: (XMLHttpRequest, textStatus, errorThrown)=>{
                        this.setState({
                            showLogin: true,
                            showMask: false
                        })
                    },
                    success: (dt)=>{
                        if(dt.code == 200){
                            if(dt.profile.userId == user.uid){
                                this.setState({
                                    showLogin: false,
                                    showMask: false,
                                    uid: user.uid
                                })
                            }else{
                                this.setState({
                                    showLogin: true,
                                    showMask: false
                                })
                            }
                        }
                    }
                })
            }else{
                this.setState({
                    showLogin: true,
                    showMask: false
                })
            }
        }else{
            this.setState({
                showLogin: true,
                showMask: false
            })
        }
    }

    componentDidMount(){
        let {setTabbarState} = this.props;
        setTabbarState('2');
    }

    hideLogin = (uid)=>{
        this.setState({
            showLogin: false,
            showMask: false,
            uid: uid
        })
    }

    logout = ()=>{
        this.setState({
            showLogin: true,
            uid: null
        })
    }

    showMask = ()=>{
        this.setState({
            showMask: true
        })
    }

    render(){
        return (
            <div>
                <Head />
                    <div className='main'>
                        <Login showLogin={this.state.showLogin}  hideLogin={this.hideLogin} />
                        <div className={this.state.showLogin?'hide':'show user'}>
                           <User uid={this.state.uid} logout={this.logout} />
                        </div>
                    </div>
                <Tabbar />
                <Imask showMask={this.state.showMask} />
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(My);

/*
    1.检查localStorage的tel,pwd是否存在
    2.存在则发送请求验证，通过则显示user界面获取数据，不通过则到login界面
    3.不存tel或者pwd，显示login界面
*/