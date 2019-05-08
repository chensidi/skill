import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    Dialog
    } from 'react-weui'
import $ from 'jquery'
import Imask from './mask'
import {Button,Icon} from 'antd'
import {Link} from 'react-router-dom'

class User extends Component {
    constructor(props){
        super(props);
        this.state = {
            playList: [],
            userinfo: null,
            showMask: true,
            style2: {
                title: 'Heading',
                buttons: [
                    {
                        type: 'default',
                        label: 'Cancel',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: 'Ok',
                        onClick: this.logout.bind(this)
                    }
                ]
            }
        }
    }

    componentWillMount(){
        let {myApi,uid} = this.props;
        if(uid){
            this.getUserInfo(myApi,uid);
            this.getPlayList(myApi,uid);
            
        }
    }


    componentWillReceiveProps(next){
        let {myApi} = this.props,
            uid = next.uid;
        if(uid){
            this.getUserInfo(myApi,uid);
            this.getPlayList(myApi,uid);
            $.get(`${myApi}/artist/sublist`).then(dt=>{
                if(dt.code!=200)return;
                this.setState({
                    singerList: dt.data
                })
            })
        }
    }

    getPlayList = (myApi,uid)=>{
        $.get(`${myApi}/user/playlist?uid=${uid}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                playList: dt.playlist
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        showMask: false
                    })
                },500)
            })
        })
    }

    getUserInfo = (myApi,uid)=>{
        $.get(`${myApi}/user/detail?uid=${uid}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                userinfo: dt
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        showMask: false
                    })
                },500)
            })
        })
    }

    
    
    logout = ()=>{
        localStorage.setItem('user','');
        this.props.logout();
        this.setState({
            playList: [],
            userinfo: null,
            showMask: true,
            showIOS2: false
        })
    }

    hideDialog() {
        this.setState({
            showIOS2: false,
        });
    }

    timeFormat(time){
        let date = new Date(time);
        return date.getFullYear() + '-' 
                + (date.getMonth()<9?'0'+(Number(date.getMonth())+1):Number(date.getMonth())+1) + '-'
                + (date.getDate()<10?'0'+date.getDate():date.getDate())
    }

    render(){
        return(
            <div>
                <div className='tops' style={{backgroundImage:this.state.userinfo?`url(${this.state.userinfo.profile.backgroundUrl})`:''}}>
                    <div className='uinfo'>
                        <img src={this.state.userinfo?this.state.userinfo.profile.avatarUrl:''} />
                        <p className='uname'>{this.state.userinfo?this.state.userinfo.profile.nickname:''}</p>
                        <p>
                            <span className='actions'>focus in</span>
                            <span className='actions'>focus in</span>
                        </p>
                    </div>
                </div>
                <Panel>
                    <PanelHeader>
                        Media with image
                    </PanelHeader>
                    <PanelBody>
                            <MediaBox type="appmsg" href="javascript:void(0);">
                                <MediaBoxHeader>
                                    <Icon type="heart" style={{fontSize:30}} />
                                </MediaBoxHeader>
                                <MediaBoxBody>
                                <Link to='/sublist'>
                                    <MediaBoxTitle>i love</MediaBoxTitle>
                                </Link>
                                </MediaBoxBody>
                            </MediaBox>
                            <MediaBox type="appmsg" href="javascript:void(0);">
                                <MediaBoxHeader>
                                    <Icon type="customer-service" style={{fontSize:30}} theme="filled" />
                                </MediaBoxHeader>
                                <MediaBoxBody>
                                <Link to='/history'>
                                    <MediaBoxTitle>my history</MediaBoxTitle>
                                </Link>
                                </MediaBoxBody>
                            </MediaBox>
                    </PanelBody>
                </Panel>              
                <Panel>
                    <PanelHeader>
                        Media with image
                    </PanelHeader>
                    <PanelBody>
                        {
                            this.state.playList.map((item,i)=>{
                                return (
                                    
                                        <MediaBox key={i} type="appmsg" href="javascript:void(0);">
                                            <MediaBoxHeader>
                                                <img src={item.coverImgUrl} />
                                            </MediaBoxHeader>
                                            <MediaBoxBody>
                                            <Link to={`/ulist/${item.id}`}>
                                                <MediaBoxTitle>{item.name}</MediaBoxTitle>
                                                <MediaBoxDescription>
                                                    {this.timeFormat(item.createTime)}
                                                </MediaBoxDescription>
                                            </Link>
                                            </MediaBoxBody>
                                        </MediaBox>
                                    
                                )
                            })
                        }
                    </PanelBody>
                </Panel>
                <div className='wrap'><Button block type="danger" onClick={ e=> this.setState({ showIOS2: true}) }>exit</Button></div>
                <Imask showMask={this.state.showMask} />
                <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showIOS2}>
                    This is iOS Style 2
                </Dialog>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(User);