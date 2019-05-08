import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Tabbar from '../components/tabbar'
import {Slider,Icon,List} from 'antd'
import Comment from '../components/comments'
import $ from 'jquery'
import {Button,Toast} from 'react-weui'

const picUrl = 'https://y.gtimg.cn/music/photo_new/T002R150x150M000000lNpTa36zgP0.jpg?n=1',
      coverUrl = 'https://y.gtimg.cn/music/photo_new/T002R150x150M000000lNpTa36zgP0.jpg?n=1';

let timer;

class Play extends Component {
    constructor(){
        super();
        this.state = {
            sid: null,
            song: undefined,
            mp3: '',
            audio: document.getElementById('mp3'),
            play: true,
            duration: 'NaN',
            curTime: '0:00',
            pc: 0,
            showCmt: false,
            cmtObj: null,
            showSheet: false,
            historySongs: [],
            getMoreKey: false,
            leave: false,
            index: 0,
            showLoading: false
        }
        this.timer = null;
    }

    hide(){
        this.setState({
            auto_show: false,
            ios_show: false
        });
    }

    pubAjax = (myApi,sid)=>{
        $.get(`${myApi}/song/detail?ids=${sid}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                song: dt
            })
        })

        $.get(`${myApi}/song/url?id=${sid}`).then(dt=>{
            if(dt.code!=200)return;
            
            this.setState({
                mp3: dt.data[0].url
            })
        })

        this.getCmt(myApi,sid);
    }

    componentWillMount(){
        let sid = localStorage.getItem('sid'),
            {myApi} = this.props,
            historySongs = localStorage.getItem('historySongs');
        if(sid != null){
            this.pubAjax(myApi,sid);
        }

        if(historySongs != null){
            historySongs = JSON.parse(historySongs);
            this.setState({
                historySongs: historySongs
            })

            if(sid != null){
                for(let i = 0; i < historySongs.length; i ++){
                    if(sid == historySongs[i].sid){
                        this.setState({
                            index: i
                        })
                        break;
                    }
                }
            }
        }

    }

    componentDidMount(){
        let {setTabbarState} = this.props;
        setTabbarState('1');
        this.setState({
            audio: document.getElementById('mp3')
        })
    }

    shouldComponentUpdate(nextProps,nextStates){
        // console.log(nextStates);
        return true;
    }

    componentDidUpdate(){
        if(this.state.mp3&&this.state.audio){
            if(this.state.play){
                this.state.audio.play();
                this.beginTime()
            }
        }
    }

    beginTime = ()=>{
        clearInterval(timer);
        timer = setInterval(()=>{
            if(parseInt(this.state.audio.currentTime)>=parseInt(this.state.audio.duration)){
                clearInterval(timer);
                this.setState({
                    play: false
                })
            }
            this.setState({
                curTime: this.trTime(this.state.audio.currentTime),
                pc: parseInt(this.state.audio.currentTime/this.state.audio.duration*100)
            })
        },1000)
    }

    goPlay = ()=>{
        
        if(this.state.mp3&&this.state.audio){
            
            if(this.state.play){
                this.state.audio.pause();
                clearInterval(timer)
            }else{
                this.state.audio.play();
            }
            this.setState({
                play: !this.state.play
            })
            
        }
    }

    trTime = (time)=>{
        time = Math.floor(time);
        return Math.floor(time/60) + ':' + (time%60<10?'0'+time%60:time%60)
    }

    changeCur = (v)=>{
        this.setState({
            pc: v,
            curTime: this.trTime(v/100*this.state.audio.duration)
        })
        this.state.audio.currentTime = v/100*this.state.audio.duration;
    }

    goCmt = ()=>{
        this.setState({
            showCmt: true,
            leave:false
        })
    }

    getCmt = (myApi,sid)=>{
        $.get(`${myApi}/comment/music?id=${sid}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                cmtObj: dt
            })
        })
    }

    hideCmt = ()=>{
        this.setState({
            leave: true,
            showCmt: false
        })
    }

    handleCancel = ()=>{
        this.setState({
            showSheet: false
        })
    }

    clear = (e,i)=>{
        e.stopPropagation();        
        let tempArr = [];
        $.extend(tempArr,this.state.historySongs);
        tempArr.splice(i,1);
        localStorage.setItem('historySongs',JSON.stringify(tempArr));
        //调整当前下标
        // [0,1,2,3,4,5]
        if(this.state.index > i){
            this.setState(prev=>({
                index: prev.index - 1
            }))
        }
        this.setState({
            historySongs: tempArr
        })
        if(this.state.index == i){
            if(tempArr.length == 0)return;
            let sid;
            if(i < tempArr.length){
                sid = tempArr[this.state.index].sid;
            }else{
                sid = tempArr[0].sid;
            }
            
            localStorage.setItem('sid',sid);
            this.pubAjax(this.props.myApi,sid);
            this.setState({
                getMoreKey: false,
                pc: 0
            })
        }
        
    }

    cut = (flag) => {
        let historySongs = localStorage.getItem('historySongs');
        if(historySongs == null)return;
        historySongs = JSON.parse(historySongs);
        if(historySongs.length == 0){
            this.setState({
                showLoading: true
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        showLoading: false
                    })
                },1000)
            })
            return;
        };

        let callback = ()=>{
            let sid = historySongs[this.state.index].sid;
            localStorage.setItem('sid',sid);
            this.pubAjax(this.props.myApi,sid);
        }

        if(flag){
            if(this.state.index < historySongs.length - 1){
                this.setState(prev=>({
                    index: prev.index + 1,
                    play: true,
                    getMoreKey: false,
                    pc: 0
                }),()=>{
                    callback();
                })
            }else{
                this.setState(prev=>({
                    index: 0,
                    play: true,
                    getMoreKey: false,
                    pc: 0
                }),()=>{
                    callback();
                })
            }
        }else{
            if(this.state.index > 0){
                this.setState(prev=>({
                    index: prev.index - 1,
                    play: true,
                    getMoreKey: false,
                    pc: 0
                }),()=>{
                    callback();
                })
            }else{
                this.setState(prev=>({
                    index: historySongs.length - 1,
                    play: true,
                    getMoreKey: false,
                    pc: 0
                }),()=>{
                    callback();
                })
            }
        }
    }

    changePlay = (sid,i)=>{
        localStorage.setItem('sid',sid);
        this.pubAjax(this.props.myApi,sid);
        this.setState({
            play: true,
            showSheet: false,
            getMoreKey: false,
            index: i,
            pc: 0
        })
    }

    allowGetMore = ()=>{
        this.setState({
            getMoreKey: true
        })
    }

    render(){
        return (
            <div className='playbox'>
                <div className="playview">
                    <div className="p_singer">
                        <div className="p_name">{this.state.song?this.state.song.songs[0].name:''}</div>
                    </div>
                    <div className="p_mid">
                        <div className="singer-img">
                            <img src={this.state.song?this.state.song.songs[0].al.picUrl:picUrl} className={this.state.play?"cover_rot":''} alt="" />
                        </div>
                    </div>
                    <div className="singer-bottom">
                        <div className="progress_bar">
                                <time>{this.state.curTime}</time>
                                <div className='sliderbar'><Slider value={this.state.pc} onChange={this.changeCur} /></div>
                                <time>{this.state.audio?this.trTime(this.state.audio.duration):''}</time>
                        </div>
                        <div className="play-wrapper s-between">
                            <Icon type="form" style={{ fontSize: '25px'}} onClick={this.goCmt.bind(this)} />
                            <Icon type="step-backward" theme="filled" onClick={this.cut.bind(this,false)} />
                            <Icon type={this.state.play?'pause-circle':'play-circle'} onClick={this.goPlay.bind(this)} theme="filled" />
                            <Icon type="step-forward" theme="filled" onClick={this.cut.bind(this,true)} />
                            <Icon type="ordered-list" style={{ fontSize: '25px'}} onClick={()=>{this.setState({showSheet:true})}} />
                        </div>
                    </div>
                    <div className="drop" style={{backgroundImage:this.state.song?`url(${this.state.song.songs[0].al.picUrl})`:coverUrl}}></div>
                    <div className={this.state.showCmt?"cmt":'hidecmt'} style={{backgroundImage:this.state.song?`url(${this.state.song.songs[0].al.picUrl})`:coverUrl}}>
                        <Comment cmtObj={this.state.cmtObj} hideCmt={this.hideCmt} getMoreKey={this.state.getMoreKey} allowGetMore={this.allowGetMore} leave={this.state.leave} />
                    </div>
                </div>
                <audio src={this.state.mp3} id='mp3'></audio>
                <div className={this.state.showSheet?'sheetWrap':'hidesheet'}>
                    <div className='sheetchild'>
                        <List
                            size="small"
                            header={<div>history</div>}
                            footer={<div>Footer</div>}
                            split
                            dataSource={this.state.historySongs}
                            renderItem={(item,i) => (<List.Item>{<p className='s-between' onClick={this.changePlay.bind(this,item.sid,i)} style={{'width':'100%'}}><span className='elp' style={{'width':'80%'}}>{item.name}-{item.singer}</span><Icon onClick={(e)=>{this.clear(e,i)}} type="close" /></p>}</List.Item>)}
                        />
                    </div>
                    <div className='sheetbtn'><Button type="default" onClick={this.handleCancel}>cancel</Button></div>
                </div>
                <Tabbar />
                <Toast icon="warn" show={this.state.showLoading}>no more</Toast>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Play));