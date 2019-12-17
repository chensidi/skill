import React,{Component} from 'react';
import '../static/css/home.css';
import {Icon,Drawer,Divider} from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';

const mapStatetoProps = (state) => {
    return {
        active: state.reducer.active,
        api: state.reducer.api
    }
}


class Top extends Component {
    constructor(props){
        super(props);
        this.state = {
            on: 0,
            open: false,
            user: null
        }
    }
    componentDidMount(){
        this.loadUser();
    }

    loadUser = () => {
        axios({
            url: `${this.props.api}/user/detail?uid=536075590`,
            timeout: 15000
        }).then(res=>{
            console.log(res.data);
            if(res.status == 200){
                this.setState({
                    user: res.data
                })
            }
        })
    }

    changeTable(num){
        this.setState({
            on: num
        })
    }
    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
    }

    computedTime = (time) => {
        let now = new Date();
        let year = parseInt((now.getTime() - time) / (365*24*3600*1000)),
            createTime = new Date(time).getFullYear() + '年' + (new Date(time).getMonth() + 1) + '月';
        return [year,createTime];
    }

    computedOld = (time) => {
        let year = new Date(time).getFullYear();
        year = year.toString();
        let year1 = year[2];
        let year2 = year[3] >= 5 ? '5' : '0';
        return `${year1}${year2}后`;
    }

    render() {
        return (
            <header className="app-head">
                <span>
                    <Icon type="menu" style={{fontSize:'22px'}} onClick={this.onOpenChange} />
                </span>
                <div className="app-main-menu">
                    <Link to="" className={this.props.active===0?'on':''} onClick={this.changeTable.bind(this,0)}>我的</Link>
                    <Link to="/home" className={this.props.active===1?'on':''} onClick={this.changeTable.bind(this,1,'/home')}>发现</Link>
                    <Link to="" className={this.props.active===2?'on':''} onClick={this.changeTable.bind(this,2)}>云村</Link>
                    <Link to="/video" className={this.props.active===3?'on':''} onClick={this.changeTable.bind(this,3,'/video')}>视频</Link>
                </div>
                <span>
                    <Link to="/search">
                        <Icon type="search" style={{fontSize:'22px'}} />
                    </Link>
                </span>
                <Drawer
                title="我的信息"
                placement="left"
                closable={false}
                onClose={this.onOpenChange}
                visible={this.state.open}
                >
                    <div className="drawer" >
                        <div>
                            <img className="userImg" src={this.state.user?this.state.user.profile.avatarUrl:''} />
                        </div>
                        <p className="username">{this.state.user?this.state.user.profile.nickname:''}
                        </p>
                        <p>
                            关注 {this.state.user?this.state.user.profile.follows:''} <Divider type="vertical" />
                            粉丝 {this.state.user?this.state.user.profile.followeds:''}
                        </p>
                        
                        <div>
                            <h3>个人信息</h3>
                              <p>
                                  等级：<em>Lv.{this.state.user?this.state.user.level:''}</em>
                              </p>  
                            {
                                this.state.user?
                                <p>
                                    村龄：{this.computedTime(this.state.user.profile.createTime)[0]+'年'}
                                    ({this.computedTime(this.state.user.profile.createTime)[1]+'注册'})
                                </p>:''
                            }
                            
                            {
                               this.state.user?
                               <p>
                                   年龄：{this.computedOld(this.state.user.profile.birthday)}
                               </p>:'' 
                            }
                            {
                                this.state.user?
                                <p>
                                    性别：{this.state.user.profile.gender==1?'男':'女'}
                                </p>:''
                            }
                            
                        </div>
                        <div>
                            <h3>个人简介</h3>
                            {
                                this.state.user?<p>
                                    {this.state.user.profile.signature}
                                </p>:''
                            }
                        </div>
                    </div>
                </Drawer>
            </header>
        )
    }
}

export default connect(mapStatetoProps)(Top);