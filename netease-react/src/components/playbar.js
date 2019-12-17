import React,{Component} from 'react';
import '../static/css/home.css';
import {Icon,Progress,Comment,Tooltip, Avatar,Skeleton} from 'antd';
import {connect} from 'react-redux';
import { changeMp3 ,changePic} from "../store/actions";
import {  ActionSheet,InfiniteLoader } from "react-weui";
import axios from 'axios';
import {NavBar,Icon as MIcon,WingBlank} from 'antd-mobile';
import moment from 'moment';

const play = <Icon type="caret-right" style={{fontSize:'18px'}} />;
const pause = <Icon type="pause" style={{fontSize:'18px'}} />
let playtime;

function mapStateToProps(state){
    return {
        api: state.reducer.api,
        mp3: state.reducer.mp3,
        pic: state.reducer.pic
    }
}

function mapActionToProps(dispatch){
    return {
        changeMp3: (url)=>{dispatch(changeMp3(url))},
        changePic: (pic)=>{dispatch(changePic(pic))}
    }
}

class PlayBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            play: false,
            currentTime: 0,
            duration: 0,
            timer: null,
            showAction: false,
            oldUrl: this.props.mp3.url,
            menus: [{
                label: <div className="play-log">
                    <p>xxx</p>
                    <Icon type="delete" theme="filled" />
                </div>,
                onClick: ()=> {}
            }, {
                label: 'Option 2',
                onClick: ()=> {}
            }],
            actions: [
                {
                    label: 'Cancel',
                    onClick: this.hide.bind(this)
                }
            ],
            showCmt: false,
            hotCmts: [],
            allCmts: [],
            loadings: true
        }
    }

    componentWillMount(){
        this.computedPlayLogs();
    }

    del(index,e){
        // console.log(index,e);
        e.stopPropagation();
        let logs = localStorage.getItem('playLogs');
        if(logs != null){
            logs = JSON.parse(logs);
            logs.splice(index,1);
            localStorage.setItem('playLogs',JSON.stringify(logs));
            this.computedPlayLogs();
        }
    }

    computedPlayLogs = ()=>{
        let logs = localStorage.getItem('playLogs');
        if(logs != null){
            logs = JSON.parse(logs);
            let arr = [];
            logs.map((item,i)=>{
                let obj = {
                    label: <div className="play-log" onClick={(e)=>{this.loadSong(e,item)}}>
                        <p>{item.name} - {item.art}</p>
                        <Icon type="delete" theme="filled" onClick={this.del.bind(this,i)} />
                    </div>
                }
                arr.push(obj);
            })
            this.setState({
                menus: arr
            })
        }
    }

    playHandle = (e) => {
        e.stopPropagation();
        this.setState((prev)=>({
            play: !prev.play
        }),()=>{
            if(this.state.play){
                this.mp3.play();
                this.timer();
            }else{
                this.mp3.pause();
                clearTimeout(playtime);
            }
        })
    }

    showCmt = () => {
        this.setState({
            showCmt: true
        })
        if(this.state.allCmts.length == 0){
            this.setState({
                loadings: true
            })
            this.loadCmt();
        }
    }

    loadCmt = (resolve,finish) => {
        axios({
            url: `${this.props.api}/comment/music?id=${this.props.mp3.id}&offset=${this.state.allCmts.length}`,
            timeout: 15000
        }).then(res=>{
            this.setState({
                loadings: false
            })
            // console.log(res);
            if(res.status == 200){

                if(res.data.comments.length){
                    let tempArr = this.state.allCmts.concat(res.data.comments);
                    this.setState({
                        allCmts: tempArr
                    })
                    if(resolve){
                        resolve();
                    }
                }else{
                    if(finish){
                        finish();
                    }
                }
                if(res.data.hotComments.length){
                    this.setState({
                        hotCmts: res.data.hotComments
                    })
                }
            }
        }).catch(err=>{
            this.setState({
                loadings: false
            })
            if(resolve){
                resolve();
            }
        })
    }

    timer = () => {
        clearTimeout(playtime);
        timer(this);
        function timer(This){
            // console.log(This.mp3.currentTime,This.mp3.duration)
            if(This.mp3.currentTime < This.mp3.duration){
                // console.log(This.mp3.currentTime/This.mp3.duration)
                This.setState({
                    currentTime: This.mp3.currentTime/This.mp3.duration*100
                })
            }else{
                clearTimeout(playtime);
                This.mp3.pause(); //暂时暂停
            }
             
            playtime = setTimeout(function(){timer(This)},1000)
             
        }
    }

    hide(e){
        e.stopPropagation();
        this.setState({
            showAction: false
        });
    }

    loadSong(e,info){
        e.stopPropagation();
        this.setState({
            showAction: false,
            allCmts: [],
            hotCmts: [],
            loadings: true
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
                if(this.state.showCmt){
                    this.loadCmt();
                }
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

    componentWillReceiveProps(props){
        // console.log(props,this.state.oldUrl);
        this.computedPlayLogs();
        if(this.state.oldUrl != props.mp3.url){
            this.mp3.addEventListener('canplaythrough',()=>{
                this.mp3.play();
                this.setState({
                    play: true,
                    currentTime: 0,
                    duration: this.mp3.duration
                })
                this.timer();
            })
            this.mp3.load();
            this.setState({
                oldUrl: props.mp3.url
            })
        }
        
    }
    render() {
        return (
            <div>
            <section className="app-playbar" onClick={this.showCmt}>
                <div className="playbar-img">
                    <img src={this.props.pic} className={this.state.play?"playing":""} />
                </div>
                <div className="playbar-info">
                    <p className="playbar-name">{this.props.mp3.name}</p>
                    <p className="playbar-singer">{this.props.mp3.art}</p>
                </div>
                <div className="playbar-ctrl">
                    <Progress 
                    type="circle" 
                    percent={this.state.currentTime} 
                    width={30} 
                    size="small" 
                    format={() => !this.state.play?play:pause}
                    onClick={this.playHandle}
                    strokeColor="#f40"
                    >
                    </Progress>
                    <Icon type="bars" style={{fontSize:'30px',marginLeft:'10px'}} onClick={(e)=>{e.stopPropagation();this.setState({showAction: true})}} />
                </div>
                <audio src={this.props.mp3.url} ref={mp3=>{this.mp3 = mp3}}></audio>
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.showAction}
                    type="ios"
                    onRequestClose={e=>{console.log(66);e.stopPropagation();this.setState({showAction: false})}}
                >
                </ActionSheet>   
            </section>
            <div className={this.state.showCmt?"cmts cmt-show":"cmts"}>
                <div className="cmt-bar">
                    <NavBar
                        mode="light"
                        icon={<MIcon type="left" />}
                        onLeftClick={() => {this.setState({showCmt: false})}}
                    >
                        <h3 className="" style={{margin: 0}}>comments</h3>
                    </NavBar>
                </div>
                <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            //mock request
                            this.loadCmt(resolve, finish)
                        }}
                        style={{marginTop: '50px',maxHeight:'100%'}}
                >
                
                <WingBlank>
                <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                    <h3>热门评论</h3>
                    {
                        this.state.hotCmts.map((item,i)=>{
                            return (
                                <Comment
                                key={`hc${i}`}
                                    actions={[
                                        <span key="comment-basic-like">
                                        <Tooltip title="Like">
                                            <Icon
                                            type="like"
                                            theme="filled"
                                            />
                                        </Tooltip>
                                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.likedCount}</span>
                                        </span>
                                    ]}
                                author={<a>{item.user.nickname}</a>}
                                    avatar={
                                    <Avatar
                                        src={item.user.avatarUrl}
                                        alt={item.user.nickname}
                                    />
                                    }
                                    content={
                                    <p>
                                        {item.content}
                                    </p>
                                    }
                                    datetime={
                                        <Tooltip title={moment(item.time).format('YYYY-MM-DD HH:mm:ss')}>
                                            <span>{moment(item.time).format('YYYY-MM-DD')}</span>
                                        </Tooltip>
                                    }
                                >
                                </Comment>
                            )
                        })
                    }
                    <h3>全部评论</h3>
                    {
                        this.state.allCmts.map((item,i)=>{
                            return (
                                <Comment
                                key={`hc${i}`}
                                    actions={[
                                        <span key="comment-basic-like">
                                        <Tooltip title="Like">
                                            <Icon
                                            type="like"
                                            theme="filled"
                                            />
                                        </Tooltip>
                                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.likedCount}</span>
                                        </span>
                                    ]}
                                author={<a>{item.user.nickname}</a>}
                                    avatar={
                                    <Avatar
                                        src={item.user.avatarUrl}
                                        alt={item.user.nickname}
                                    />
                                    }
                                    content={
                                    <p>
                                        {item.content}
                                    </p>
                                    }
                                    datetime={
                                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                            <span>{moment(item.time).fromNow()}</span>
                                        </Tooltip>
                                    }
                                >
                                    {
                                        item.beReplied[0]?(
                                            <Comment
                                                actions={[
                                                    <span key="comment-basic-like">
                                                    <Tooltip title="Like">
                                                        <Icon
                                                        type="like"
                                                        theme="filled"
                                                        />
                                                    </Tooltip>
                                                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.beReplied[0].likedCount}</span>
                                                    </span>
                                                ]}
                                            author={<a>{item.beReplied[0].user.nickname}</a>}
                                                avatar={
                                                <Avatar
                                                    src={item.beReplied[0].user.avatarUrl}
                                                    alt={item.beReplied[0].user.nickname}
                                                />
                                                }
                                                content={
                                                <p>
                                                    {item.beReplied[0].content}
                                                </p>
                                                }
                                                datetime={
                                                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                        <span>{moment(item.beReplied[0].time).fromNow()}</span>
                                                    </Tooltip>
                                                }
                                            >
                                        </Comment>
                                        ):null
                                    }
                                </Comment>
                            )
                        }) 
                    }
                </Skeleton>
                </WingBlank>

                </InfiniteLoader>
            </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(PlayBar);