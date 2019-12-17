import React,{Component} from 'react'
import '../static/css/home.css'
import {NavBar,Icon,WingBlank} from 'antd-mobile';
import {Icon as Aicon,Skeleton} from 'antd';
import {connect} from 'react-redux';
import axios from 'axios';
import {PullToRefresh, Button} from 'react-weui';
import Ripples from 'react-touch-ripple';
import { changeMp3,changePic } from "../store/actions";
import { CSSTransition } from 'react-transition-group'
import {withRouter} from 'react-router-dom';

function mapStateToProps(state){
    return {
        api: state.reducer.api,
        mp3: state.reducer.mp3
    }
}

function mapActionToProps(dispatch){
    return {
        changeMp3: (url)=>{dispatch(changeMp3(url))},
        changePic: (pic)=>{dispatch(changePic(pic))}
    }
}

class PlayList extends Component {
    constructor(props){
        super(props);
        this.state = {
            albumInfo: {},
            albunContent: [],
            playLogs: [],
            isLoading: true,
            netErr: false,
            showCover: false,
        }
    }

    componentWillMount(){
        this.loadAlbumInfo();
        let logs = localStorage.getItem('playLogs');
        if(logs != null){
            logs = JSON.parse(logs);
            this.setState({
                playLogs: logs
            })
        }
    }

    loadAlbumInfo = ()=> {
        this.setState({
            isLoading: true
        },()=>{
            axios({
                url: `${this.props.api}/playlist/detail?id=${this.props.match.params.id}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res)
                this.setState({
                    isLoading: false
                })
                if(res.status == 200){
                    this.setState({
                        albumInfo: res.data.playlist,
                        albunContent: res.data.playlist.tracks,
                        netErr: false
                    })
                }
            }).catch(err=>{
                this.setState({
                    netErr: true,
                    isLoading: false
                })
            })
        })
        
    }

    play = (info) => {
        // console.log(info);
        let logs = this.state.playLogs;
        for(var i = 0; i < logs.length; i ++){
            if(logs[i].id == info.id){
                break;
            }
        }
        if(i == logs.length){
            logs.unshift({id:info.id,name:info.name,art:info.ar[0].name});
        }
        
        localStorage.setItem('playLogs',JSON.stringify(logs));
        this.setState({
            playLogs: logs
        })
        axios({
            url: `${this.props.api}/song/url?id=${info.id}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status == 200){
                this.props.changeMp3({
                    url: res.data.data[0].url,
                    name: info.name,
                    art: info.art,
                    id: info.id
                });
            }
        })

        axios({
            url: `${this.props.api}/song/detail?ids=${info.id}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res.data);
            if(res.status == 200){
                this.props.changePic(res.data.songs[0].al.picUrl)
            }
            
        })
    }

    computedTime = (time) => {
        let t = new Date(time);
        return `${t.getFullYear()}.${t.getMonth()+1}.${t.getDate()}`;
    }

    render() {
        return (
            <div className="app-album">
                <CSSTransition
                in={this.state.showCover}
                        timeout={200}
                        classNames='fade'
                >
                <div className="album-details">
                    <div className="cover">
                        <div className="bg" style={{backgroundImage:`url(${this.state.albumInfo.coverImgUrl})`}}></div>
                        <div className="cbg"></div>
                    </div>
                    
                        <div className="details-content">
                            <i className="close">
                                <Icon type="cross" onClick={()=>{this.setState({showCover: false})}}  />
                            </i>
                            <WingBlank>
                            <img src={this.state.albumInfo.coverImgUrl} />
                            <h3>
                                {this.state.albumInfo.name}
                            </h3>
                            <hr />
                            
                            <p>{this.state.albumInfo.description}</p>
                            <Button size="small">保存</Button>
                            </WingBlank>
                        </div>
                </div>
                </CSSTransition>
                <PullToRefresh
                    onRefresh={
                        resolve => {
                            resolve()
                        }
                    }
                >
                    <Skeleton loading={this.state.isLoading} active avatar paragraph={{ rows: 4 }}>
                    <section className="album-title">
                    <div className="album-top">
                        <NavBar
                            mode="light"
                            icon={<Icon type="left" />}
                            onLeftClick={() => this.props.history.go(-1)}
                            style={{background:'transparent',color:'#fff'}}
                        >
                            <h3 className="navbar-txt">歌单</h3>
                        </NavBar>
                    </div>
                        <div className="album-bg" style={{backgroundImage:`url(${this.state.albumInfo.coverImgUrl})`}}></div>
                        <div className="album-info">
                            <div className="album-img">
                                <img src={this.state.albumInfo.coverImgUrl} />
                            </div>
                            <div className="album-txt">
                                <h3 className="album-name">{this.state.albumInfo.name}</h3>
                                <h4 className="album-art">
                                    <img src={this.state.albumInfo.creator?this.state.albumInfo.creator.avatarUrl:''} />
                                    {this.state.albumInfo.creator?this.state.albumInfo.creator.nickname:''}
                                </h4>
                                <p className="album-desc">
                                    {this.state.albumInfo.description}
                                    <i><Icon type="right" onClick={()=>{this.setState({showCover: true})}} /></i>
                                </p>
                            </div>
                        </div>
                    </section>
                    <div className="album-content">
                    <div className="button-sp-area" style={{display:!this.state.netErr?'none':''}}>
                        <Button onClick={this.loadAlbumInfo}>重新加载</Button>
                    </div>
                        {
                            this.state.albunContent.map((item,i)=>{
                                return (
                                <Ripples style={{display:'block'}} key={`al${i}`}>
                                    <div className="search-cell" onClick={()=>{this.play(item)}}>
                                        <div className="res-info">
                                        <h4>{i+1} {item.name}</h4>
                                        </div>
                                        <span>
                                            <Aicon type="play-circle" theme="filled" />
                                        </span>
                                    </div>
                                </Ripples>
                                )
                            })
                        }
                        
                    </div>
                    </Skeleton>
                </PullToRefresh>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapActionToProps)(PlayList));