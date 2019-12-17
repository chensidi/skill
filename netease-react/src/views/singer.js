import React ,{Component} from 'react';
import '../static/css/home.css';
import axios from 'axios';
import {connect} from 'react-redux';
import {Tabs,WingBlank,NavBar} from 'antd-mobile';
import Ripples from 'react-touch-ripple';
import {Icon} from 'antd';
import {Button,InfiniteLoader,Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    Dialog} from 'react-weui';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {Link} from 'react-router-dom';
import Mask from '../components/mask';
import { CSSTransition } from 'react-transition-group'
import { changeMp3,changePic } from "../store/actions";
 
function mapStateToProps(state){
    return {
        api: state.reducer.api
    }
}

function mapActionToProps(dispatch){
    return {
        changeMp3: (url)=>{dispatch(changeMp3(url))},
        changePic: (pic)=>{dispatch(changePic(pic))}
    }
}

class Singer extends Component {

    constructor(props){
        super(props);
        this.state = {
            tab: 0,
            singerInfo: {},
            hotSongs: [],
            intr: [],
            items: [...Array(20).keys()],
            album: [],
            mv: [],
            isLoading: true,
            showCover: false,
            playLogs: [],
            netErr: false,
            style1: {
                title: '网络错误',
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            showDia: false,
            alErr: false,
            mvErr: false
        }
    }

    componentWillMount(){
        let logs = localStorage.getItem('playLogs');
        if(logs != null){
            logs = JSON.parse(logs);
            this.setState({
                playLogs: logs
            })
        }
        this.loadArt();
        this.loadDesc();
        this.loadAlbum();
        this.loadMv();
    }

    hideDialog() {
        this.setState({
            showDia: false
        });
        this.loadArt()
    }

    loadArt = () => {
        this.setState({isLoading: true})
        axios({
            url: `${this.props.api}/artists?id=${this.props.match.params.id}`,
            timeout: 15000
        }).then(res=>{
            this.setState({
                isLoading: false,
                netErr: false
            })

            // console.log(res);
            if(res.status == 200){
                this.setState({
                    singerInfo: res.data.artist,
                    hotSongs: res.data.hotSongs
                })
            }
        }).catch(err=>{
            this.setState({
                isLoading: false,
                netErr: true,
                showDia: true
            })
        })
    }

    loadDesc = () => {
        axios({
            url: `${this.props.api}/artist/desc?id=${this.props.match.params.id}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status == 200){
                this.setState({
                    intr: res.data.introduction
                })
            }
        })
    }

    loadSimi = () => {
        axios({
            url: `${this.props.api}/simi/artist?id=${this.props.match.params.id}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res)
            if(res.status == 200){
                this.setState({
                    simi: res.data.artists
                })
            }
        })
    }

    loadAlbum = (resolve=null, finish=null) => {
        console.log(resolve,finish)
        axios({
            url: `${this.props.api}/artist/album?id=${this.props.match.params.id}&offset=${this.state.album.length}&limit=10`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            this.setState({
                alErr: false
            })
            if(res.status == 200){
                if(res.data.hotAlbums.length){
                    this.setState({
                        album: this.state.album.concat(res.data.hotAlbums)
                    },()=>{
                        if(resolve){  
                            resolve()
                        }
                    })
                }else{
                    if(finish){
                        finish();
                    }
                }
                
            }
        }).catch(err=>{
            this.setState({
                alErr: true
            })
            if(finish){
                finish();
            }
        })
    }

    loadMv = (resolve, finish) => {
        axios({
            url: `${this.props.api}/artist/mv?id=6460&offset=${this.state.mv.length}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            this.setState({
                mvErr: false
            })
            if(res.status == 200){
                if(res.data.mvs.length){
                    this.setState({
                        mv: this.state.mv.concat(res.data.mvs)
                    },()=>{
                        if(resolve){
                            resolve();
                        }
                    })
                }else{
                    if(finish){
                        finish();
                    }
                }
            }
        }).catch(err=>{
            this.setState({
                mvErr: true
            })
            if(finish){
                finish();
            }
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
                    art: info.art
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

    loadAny = (tab,index) => {
        this.setState({
            tab: index
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

    computedTime = (time) => {
        let t = new Date(time);
        return `${t.getFullYear()}.${t.getMonth()+1}.${t.getDate()}`;
    }

    computedDuration = (time) => {
        time = parseInt(time / 1000);
        return String(parseInt(time / 60)).padStart(2,'0') + ':' + String(parseInt(time % 60)).padStart(2,'0');
    }

    render() {

        const tabs = [
            { title: '主页', type:'1' },
            { title:  '歌曲',type:'10' },
            { title:  '专辑',type:'100' },
            { title:  '视频',type:'1014' },
        ];
        return (
            <div className="app-singer">
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showDia}>
                    网络错误重新加载
                </Dialog>
                <Mask isLoading={this.state.isLoading} />
                <CSSTransition
                    in={this.state.showCover}
                            timeout={200}
                            classNames='fade'
                    >
                    <div className="album-details">
                        <div className="cover">
                            <div className="bg" style={{backgroundImage:`url(${this.state.singerInfo.picUrl})`}}></div>
                            <div className="cbg"></div>
                        </div>
                        
                            <div className="details-content">
                                <i className="close">
                                    <Icon type="cross" onClick={()=>{this.setState({showCover: false})}}  />
                                </i>
                                <WingBlank>
                                    <h3>{this.state.singerInfo.name}简介</h3>
                                    <p style={{textIndent:'2em'}}>
                                        {this.state.singerInfo.briefDesc}
                                    </p>
                                    {
                                        this.state.intr.map((item,i)=>{
                                            return (
                                                <div key={`ti${i}`}>
                                                    <h3>{item.ti}</h3>
                                                    <p style={{textIndent:'2em'}}>{item.txt}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </WingBlank>
                            </div>
                    </div>
                </CSSTransition>
                <div className="album-top">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.go(-1)}
                        style={{background:'transparent',color:'#fff'}}
                    >
                        <h3 className="navbar-txt">歌手</h3>
                    </NavBar>
                </div>
                <div className="singer-cover" style={{backgroundImage:`url(${this.state.singerInfo.picUrl})`}}>
                    <div className="singer-name">
                        <h3>{this.state.singerInfo.name}</h3>
                        <h4>{this.state.singerInfo.alias?this.state.singerInfo.alias[0]:''}</h4>
                    </div>
                </div>
                <WingBlank>
                <Tabs tabs={tabs}
                    initialPage={this.state.tab}
                    onTabClick={(tab, index) => {this.loadAny(tab, index)}}
                    swipeable={false}
                    page={this.state.tab}
                >
                        <div>
                            {
                                this.state.hotSongs.slice(0,5).map((item,i)=>{
                                    return (
                                        <Ripples style={{display:'block'}} key={`h${i}`} onClick={()=>{this.play(item)}}>
                                            <a className="hot-search">
                                                <div className="hot-item">
                                                    <div className="item-info">
                                                    <div className={i<3?"item-num m-hot":"item-num"}>{i+1}</div>
                                                        <div>
                                                            <h4>{item.name}</h4>
                                                            <p>{item.al.name}</p>
                                                        </div>
                                                    </div>
                                                    <span className="item-count">
                                                        <Icon type="play-circle" theme="filled" />
                                                    </span>
                                                </div>
                                            </a>
                                        </Ripples>
                                    )
                                })
                            }
                            <Button onClick={()=>{this.setState({tab:1})}}>更多热歌</Button>
                            <h3>简介</h3>
                            <p className="singer-desc">{this.state.singerInfo.briefDesc}</p>
                            <Button  onClick={()=>{this.setState({showCover: true})}}>更多信息</Button>
                            {/* <h3>相似</h3>
                            <div className="simi-singer">
                                <div className="simi-wrap">
                                    {
                                        this.state.simi.map((item,i)=>{
                                            return (
                                                <div key={`sm${i}`}>
                                                    <img src={item.picUrl} />
                                                    <h4>{item.name}</h4>
                                                    <h4>{item.alias[0]}</h4>
                                                </div>
                                            )
                                        })
                                    }
                                    
                                </div>
                            </div> */}
                        </div>   
                        <div>
                            {
                                this.state.hotSongs.map((item,i)=>{
                                    return (
                                        <Ripples style={{display:'block'}} key={`h${i}`} onClick={()=>{this.play(item)}}>
                                            <a className="hot-search">
                                                <div className="hot-item">
                                                    <div className="item-info">
                                                    <div className={i<3?"item-num m-hot":"item-num"}>{i+1}</div>
                                                        <div>
                                                            <h4>{item.name}</h4>
                                                            <p>{item.al.name}</p>
                                                        </div>
                                                    </div>
                                                    <span className="item-count">
                                                        <Icon type="play-circle" theme="filled" />
                                                    </span>
                                                </div>
                                            </a>
                                        </Ripples>
                                    )
                                })
                            }
                        </div>   
                        <div>
                        <InfiniteLoader
                            onLoadMore={ (resolve, finish) => {
                                //mock request
                                this.loadAlbum(resolve, finish)
                            }}
                        >
                        <Panel>
                            <PanelHeader style={{display:this.state.alErr&&!this.state.album.length?'':'none'}}>
                                <Button onClick={()=>{this.loadAlbum(null,null)}}>reload</Button>
                            </PanelHeader>
                            <PanelBody>
                                {
                                    this.state.album.map((item,i)=>{
                                        return (
                                            <Ripples key={`al${i}`} style={{display:'block'}}>
                                            <Link to={`/album/${item.id}`}>
                                            <MediaBox type="appmsg">
                                                <MediaBoxHeader>
                                                    <LazyLoadImage
                                                        src={item.picUrl} 
                                                        height="60"
                                                    />
                                                </MediaBoxHeader>
                                                <MediaBoxBody>
                                                    <MediaBoxTitle>{item.name}</MediaBoxTitle>
                                                    <MediaBoxDescription>
                                                        {item.artists[0].name} {this.computedTime(item.publishTime)}
                                                    </MediaBoxDescription>
                                                </MediaBoxBody>
                                            </MediaBox>
                                            </Link>
                                            </Ripples>
                                        )
                                    })
                                }
                            </PanelBody>
                        </Panel>
                        </InfiniteLoader>
                        </div>   
                        <div className="ser-video">
                        <InfiniteLoader
                            onLoadMore={ (resolve, finish) => {
                                //mock request
                                this.loadMv(resolve, finish)
                            }}
                                >
                                    <Panel>
                                    <PanelHeader style={{display:this.state.mvErr&&!this.state.mv.length?'':'none'}}>
                                        <Button onClick={()=>{this.loadMv(null,null)}}>reload</Button>
                                    </PanelHeader>
                                        <PanelBody>
                                            {
                                                this.state.mv.map((item,i)=>{
                                                    return (
                                                            <Link to={`/mv/${item.id}`} key={`mv${i}`}>
                                                            <MediaBox type="appmsg">
                                                                <MediaBoxHeader>
                                                                    <LazyLoadImage
                                                                        src={item.imgurl} 
                                                                        height="60"
                                                                    >
                                                                    </LazyLoadImage>
                                                                    <span className="vdo-count">
                                                                        <Icon type="caret-right" />
                                                                        {this.computed(item.playCount)}
                                                                    </span>
                                                                </MediaBoxHeader>
                                                                <MediaBoxBody>
                                                                    <MediaBoxTitle>{item.name}</MediaBoxTitle>
                                                                    <MediaBoxDescription>
                                                                    {this.computedDuration(item.duration)}
                                                                    </MediaBoxDescription>
                                                                </MediaBoxBody>
                                                            </MediaBox>
                                                            </Link>
                                                    )
                                                })
                                            }
                                        </PanelBody>
                                    </Panel>
                                </InfiniteLoader>
                        </div>   
                </Tabs>
                <div>
                    
                </div>
                </WingBlank>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Singer);