import React, {Component} from 'react';
import "video-react/dist/video-react.css";
import { Player } from 'video-react';
import '../static/css/home.css'
import {NavBar,Icon,WingBlank} from 'antd-mobile';
import {Icon as Aicon} from 'antd';
import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import axios from 'axios';
import {PanelHeader,
    Panel,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    InfiniteLoader,
    Button
    } from 'react-weui';
import Ripples from 'react-touch-ripple';
import { changeMp3,changePic } from "../store/actions";
import Mask from '../components/mask';
import {Link} from 'react-keeper';
import { LazyLoadImage } from 'react-lazy-load-image-component';



const lazy = '/favicon.ico';

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

class Video extends Component {

    constructor(props){
        super(props);
        this.state = {
            videoInfo: {
                creator: {}
            },
            url: '',
            related: [],
            hotComments: [],
            allComments: [],
            isLoading: true,
            netErr: true
        }
    }

    componentWillMount(){
       this.init();
    }

    init = () => {
        this.setState({
            isLoading: true,
            netErr: false
        })
        axios.all([this.loadVideoData(),this.loadVideoUrl(),this.loadRelated(),this.loadComments()])
        .then(axios.spread((res1,res2,res3,res4)=>{
            this.setState({
                isLoading: false,
                netErr: false
            })
            // console.log(res1,res2,res3,res4);
            if(res1.status == 200){
                this.setState({
                    videoInfo: res1.data.data
                })
            }

            if(res2.status == 200){
                this.setState({
                    url: res2.data.urls[0].url
                })
            }

            if(res3.status == 200){
                this.setState({
                    related: res3.data.data
                })
            }

            if(res4.status == 200){
                this.setState({
                    hotComments: res4.data.hotComments,
                    allComments: res4.data.comments
                })
            }

        })).catch(err=>{
            console.log('err:'+err);
            this.setState({
                isLoading: false,
                netErr: true
            })
        })
    }

    loadVideoData = () => {
        this.setState({
            isLoading: true
        })
        return axios({
            url: `${this.props.api}/video/detail?id=${this.props.match.params.id}`,
            timeout: 15000,
        })
        
    }

    loadVideoUrl = () => {
        return axios({
            url: `${this.props.api}/video/url?id=${this.props.match.params.id}`,
            timeout: 15000
        })
       
    }

    loadRelated = () => {
        return axios({
            url: `${this.props.api}/related/allvideo?id=${this.props.match.params.id}`,
            timeout: 15000
        })
      
    }

    loadComments = () => {
        return axios({
            url: `${this.props.api}/comment/video?id=${this.props.match.params.id}`,
            timeout: 15000
        })
    }

    loadMoreComt = (resolve,finish) => {
        axios({
            url: `${this.props.api}/comment/video?id=${this.props.match.params.id}&offset=${this.state.allComments.length}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status == 200){
                if(res.data.comments.length){
                    this.setState({
                        allComments: this.state.allComments.concat(res.data.comments)
                    },()=>{
                        resolve()
                    })
                }else{
                    finish();
                }
            }
        })
    }

    computed = (num)=>{
        if(num/100000000 >= 1){
            return parseInt(num / 100000000) + '亿'
        }else if(num/10000 >= 1){
            return parseInt(num / 10000) + '万'
        }else{
            return num;
        }
    }

    computedDuration = (time) => {
        time = parseInt(time / 1000);
        return String(parseInt(time / 60)).padStart(2,'0') + ':' + String(parseInt(time % 60)).padStart(2,'0');
    }

    render() {

        return (
            <div className="video-box">
                <Mask isLoading={this.state.isLoading} />
                <InfiniteLoader
                    onLoadMore={ (resolve, finish) => {
                        //mock request
                        this.loadMoreComt(resolve, finish)
                    }}
                >   
                     
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.go(-1)}
                        style={{background:'#000',color:'#fff',zIndex:101}}
                    >
                        <h3 className="navbar-txt">视频</h3>
                    </NavBar>
                    <Player
                        poster={this.state.videoInfo.coverUrl}
                        src={this.state.url}
                    />
                    <WingBlank style={{display:this.state.netErr?'none':''}}>
                    <div className="video-info-wrap">
                        <h3 className="video-title">{this.state.videoInfo.title}</h3>
                        <div className="video-intr">
                        <div className="video-creator">
                            <img src={this.state.videoInfo.creator.avatarUrl} />
                            <span>{this.state.videoInfo.creator.nickname}</span>
                        </div>
                        <div className="play-info">
                            <span>
                                <Aicon type="play-circle" />
                                {this.state.videoInfo.praisedCount}
                            </span>
                            <span>
                                <Aicon type="file-text" />
                                {this.state.videoInfo.commentCount}
                            </span>
                        </div>
                    </div>
                    </div>
                    
                    </WingBlank>
                    <WingBlank style={{display:!this.state.netErr?'none':''}}>
                    <Button onClick={this.init}>reload</Button>
                    </WingBlank>
                    <div className="video-related" style={{display:this.state.netErr?'none':''}}>
                            <Panel>
                                <PanelHeader>
                                    相关视频
                                </PanelHeader>
                                <PanelBody>
                                    {
                                        this.state.related.map((item,i)=>{
                                            return (
                                                <Link to={`/video/${item.vid}`} key={`vid${i}`}>
                                                    <MediaBox type="appmsg">
                                                        <MediaBoxHeader>
                                                            <LazyLoadImage
                                                                src={item.coverUrl} 
                                                                placeholderSrc={lazy}
                                                                height="60"
                                                            >
                                                            </LazyLoadImage>
                                                            <span className="vdo-count">
                                                                <Icon type="caret-right" />
                                                                {this.computed(item.playTime)}
                                                            </span>
                                                        </MediaBoxHeader>
                                                        <MediaBoxBody>
                                                            <MediaBoxTitle>{item.title}</MediaBoxTitle>
                                                            <MediaBoxDescription>
                                                            {this.computedDuration(item.durationms)} {'by'} {item.creator[0].userName}
                                                            </MediaBoxDescription>
                                                        </MediaBoxBody>
                                                    </MediaBox>
                                                </Link>
                                            )
                                        })
                                    }
                            
                            </PanelBody>
                            </Panel>
                    </div>

                    <WingBlank style={{display:this.state.netErr?'none':''}}>
                        <h3>热门评论</h3>
                    {
                        this.state.hotComments.map((item,i)=>{
                            return (
                                <Comment
                                key={`hc${i}`}
                                    actions={[
                                        <span key="comment-basic-like">
                                        <Tooltip title="Like">
                                            <Aicon
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
                        this.state.allComments.map((item,i)=>{
                            return (
                                <Comment
                                key={`hc${i}`}
                                    actions={[
                                        <span key="comment-basic-like">
                                        <Tooltip title="Like">
                                            <Aicon
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
                                                        <Aicon
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
                </WingBlank>
                </InfiniteLoader>     
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Video);