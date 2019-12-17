import React,{Component} from 'react';
import { WingBlank,Tabs,} from 'antd-mobile';
import {SearchBar,
    InfiniteLoader,Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    Dialog
    } from 'react-weui';
import axios from 'axios';
import {connect} from 'react-redux';
import {Icon} from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Mask from '../components/mask';
import { changeMp3,changePic } from "../store/actions";
import Ripples from 'react-touch-ripple';
import {Link} from 'react-router-dom';

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

class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            refreshing: false,
            down: true,
            searchText: '蓝雨',
            items: [...Array(20).keys()],
            hots: [],
            searchKey: false,
            tab: 0,
            type: 1,
            songArr: [],
            albumArr: [],
            singerArr: [],
            videoArr: [],
            isLoading: true,
            playLogs: [],
            style1: {
                title: '网络错误',
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialogH.bind(this)
                    }
                ]
            },
            style2: {
                title: '网络错误',
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            netErr: false,
            showDiaH: false,
            showDia: false
        }
    }

    hideDialog() {
        this.setState({
            showDia: false
        });
        this.loadSongs(this.state.type,this.state.tab)
    }

    hideDialogH() {
        this.setState({
            showDiaH: false
        });
        this.loadHots();
    }

    componentWillMount(){
        this.loadHots();
        let logs = localStorage.getItem('playLogs');
        if(logs != null){
            logs = JSON.parse(logs);
            this.setState({
                playLogs: logs
            })
        }
    }

    loadHots = () => {
        this.setState({isLoading:true});
        axios({
            url: `${this.props.api}/search/hot/detail`,
            method: 'get',
            timeout: 15000
        }).then((res)=>{
            this.setState({
                isLoading:false,
                netErr: false
            });
            if(res.status == 200){
                let arr = res.data.data;
                this.setState({
                    hots: arr
                })
            }
        }).catch(err=>{
            this.setState({
                isLoading:false,
                netErr: true,
                showDiaH: true
            });
        })
    }

    computedTime = (time) => {
        let t = new Date(time);
        return `${t.getFullYear()}.${t.getMonth()+1}.${t.getDate()}`;
    }

    handleChange(text, e){
        this.setState({
            searchText:text,
        });
    }

    submit = () => {
        this.setState({
            searchKey: true,
            songArr: [],
            albumArr: [],
            singerArr: [],
            videoArr: []
        },()=>{
            this.loadSongs(this.state.type,this.state.tab);
        })
        
    }

    cancel = () => {
        this.setState({
            searchKey: false
        })
    }

    computedDuration = (time) => {
        time = parseInt(time / 1000);
        return String(parseInt(time / 60)).padStart(2,'0') + ':' + String(parseInt(time % 60)).padStart(2,'0');
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

    loadSongs = (index,tab) => {
        if(tab != this.state.tab){
            this.setState({
                tab,
                type: index
            })
        }
        
        if(tab == 0){
            if(this.state.songArr.length == 0){
                this.setState({isLoading:true});
                this.pubLoad(this.state.searchText,'1');
            }
        }else if(tab == 1){
            if(this.state.albumArr.length == 0){
                this.setState({isLoading:true});
                this.pubLoad(this.state.searchText,'10');
            }
        }else if(tab == 2){
            if(this.state.singerArr.length == 0){
                this.setState({isLoading:true});
                this.pubLoad(this.state.searchText,'100');
            }
        }else{
            if(this.state.videoArr.length == 0){
                this.setState({isLoading:true});
                this.pubLoad(this.state.searchText,'1014');
            }
        }
    }

    pubLoad = (kw,type,resolve,finish) => {
        let url = '';
        if(type == 1){
            url = `${this.props.api}/search?keywords=${kw}&type=${type}&offset=${this.state.songArr.length}`
        }else if(type == 10){
            url = `${this.props.api}/search?keywords=${kw}&type=${type}&offset=${this.state.albumArr.length}`
        }else if(type == 100){
            url = `${this.props.api}/search?keywords=${kw}&type=${type}&offset=${this.state.singerArr.length}`
        }else{
            url = `${this.props.api}/search?keywords=${kw}&type=${type}&offset=${this.state.videoArr.length}`
        }
        axios({
            url: url,
            timeout: 15000,
            method: 'get'
        }).then(res=>{
            this.setState({
                isLoading:false,
                netErr: false
            });
            if(res.status == 200){
                let arr;
                if(type == 1){
                    arr = res.data.result.songs;
                    if(arr != null){
                        this.setState({
                            songArr: this.state.songArr.concat(arr)
                        },()=>{
                            if(resolve){
                                resolve()
                            }
                        })
                    }else{
                        if(finish){
                            finish()
                        }
                    }
                    
                }else if(type == 10){
                    arr = res.data.result.albums;
                    if(arr != null){
                        this.setState({
                            albumArr: this.state.albumArr.concat(arr)
                        },()=>{
                            if(resolve){
                                resolve()
                            }
                        })
                    }else{
                        if(finish){
                            finish()
                        } 
                    }
                    
                }else if(type == 100){
                    arr = res.data.result.artists;
                    if(arr != null){
                        this.setState({
                            singerArr: this.state.singerArr.concat(arr)
                        },()=>{
                            if(resolve){
                                resolve()
                            }
                        })
                    }else{
                        if(finish){
                            finish()
                        } 
                    }
                    
                }else{
                    arr = res.data.result.videos;
                    if(arr != null){
                        this.setState({
                            videoArr: this.state.videoArr.concat(arr)
                        },()=>{
                            if(resolve){
                                resolve()
                            }
                        })
                    }else{
                        if(finish){
                            finish()
                        } 
                    }
                    
                }
                
            }
        }).catch(err=>{
            if(resolve){
                resolve();
            }
            this.setState({
                isLoading: false,
                netErr: true,
                showDia: true
            });
        })
    }

    play(info){
        // console.log(info);
        let logs = this.state.playLogs;
        for(var i = 0; i < logs.length; i ++){
            if(logs[i].id == info.id){
                break;
            }
        }
        if(i == logs.length){
            logs.unshift(info);
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

    render() {
        const tabs = [
            { title: '单曲', type:'1' },
            { title:  '专辑',type:'10' },
            { title:  '歌手',type:'100' },
            { title:  '视频',type:'1014' },
          ];
        return (
            <div className="app-search">
                    <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showDia}>
                        网络错误重新加载
                    </Dialog>
                    <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showDiaH}>
                        网络错误重新加载
                    </Dialog>
                    <Mask isLoading={this.state.isLoading} />
                    <div className="serbar">
                    <span>
                        <Link to="/home">
                        <Icon type="arrow-left" />
                        </Link>
                    </span>
                    <SearchBar
                        onChange={this.handleChange.bind(this)}
                        defaultValue={this.state.searchText}
                        placeholder="Female Name Search"
                        width="80%"
                        lang={{
                            cancel: 'Cancel'
                        }}
                        onSubmit={this.submit}
                        onCancel={this.cancel}
                        onClear={this.cancel}
                    />
                    </div>
                    <WingBlank>
                        <div style={{display:this.state.searchKey?'none':''}}>
                            <h3 className="home-title">
                                <span>热搜榜</span>
                            </h3>
                            {
                                this.state.hots.map((item,i)=>{
                                    return (
                                        <Ripples style={{display:'block'}} key={`h${i}`}>
                                        <a className="hot-search">
                                            <div className="hot-item">
                                                <div className="item-info">
                                                <div className={i<3?"item-num m-hot":"item-num"}>{i+1}</div>
                                                    <div>
                                                        <h4>{item.searchWord}</h4>
                                                        <p>{item.content}</p>
                                                    </div>
                                                </div>
                                                <span className="item-count">
                                                    {item.score}
                                                </span>
                                            </div>
                                        </a>
                                        </Ripples>
                                    )
                                })
                            }
                        </div>
                        <div style={{display:!this.state.searchKey?'none':''}} className="ser-block">
                            <Tabs tabs={tabs}
                                initialPage={this.state.tab}
                                onTabClick={(tab, index) => {this.loadSongs(tab.type,index)}}
                                swipeable={false}
                                >
                                <div>
                                    <InfiniteLoader
                                            onLoadMore={ (resolve, finish) => {
                                                //mock request
                                                this.pubLoad(this.state.searchText,'1',resolve,finish)
                                            }}
                                    >
                                    {
                                        this.state.songArr.map((item,i)=>{
                                            return (
                                                <Ripples style={{display:'block'}} key={`s${i}`}>
                                                <div className="search-cell"  onClick={this.play.bind(this,
                                                    {id:item.id,name:item.name,art:item.artists[0].name,duration:item.duration})
                                                }>
                                                    <div className="res-info">
                                                        <h4>{item.name}</h4>
                                                        <p>{item.artists[0].name}</p>
                                                    </div>
                                                    <span>
                                                        <Icon type="play-circle" theme="filled" />
                                                    </span>
                                                </div>
                                                </Ripples>
                                            )
                                        })
                                    }
                                    </InfiniteLoader>
                                    
                                </div>
                                <div className="ser-album">
                                <InfiniteLoader
                                            onLoadMore={ (resolve, finish) => {
                                                //mock request
                                                this.pubLoad(this.state.searchText,'10',resolve,finish)
                                            }}
                                >
                                    <Panel>
                                        <PanelHeader>
                                            Media with image
                                        </PanelHeader>
                                        <PanelBody>
                                            {
                                                this.state.albumArr.map((item,i)=>{
                                                    return (
                                                        <Ripples key={`a${i}`} style={{display:'block'}}>
                                                        <Link to={`/album/${item.id}`}>
                                                        <MediaBox type="appmsg">
                                                            <MediaBoxHeader>
                                                                <LazyLoadImage
                                                                    src={item.picUrl} 
                                                                    placeholderSrc={lazy}
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
                                <div>
                                <InfiniteLoader
                                            onLoadMore={ (resolve, finish) => {
                                                //mock request
                                                this.pubLoad(this.state.searchText,'100',resolve,finish)
                                            }}
                                >
                                    {
                                        this.state.singerArr.map((item,i)=>{
                                            return (
                                                <Link to={`/singer/${item.id}`} className="ser-singer" key={`s${i}`}>
                                                    <LazyLoadImage
                                                        src={item.picUrl} 
                                                        placeholderSrc={lazy}
                                                    />
                                                    <p>
                                                        {item.name} {item.alia?`(${item.alia[0]})`:''}
                                                    </p>
                                                </Link>

                                            )
                                        })
                                    }
                                </InfiniteLoader>
                                </div>
                                <div className="ser-video">
                                <InfiniteLoader
                                            onLoadMore={ (resolve, finish) => {
                                                //mock request
                                                this.pubLoad(this.state.searchText,'1014',resolve,finish)
                                            }}
                                >
                                    <Panel>
                                        <PanelHeader>
                                            Media with image
                                        </PanelHeader>
                                        <PanelBody>
                                            {
                                                this.state.videoArr.map((item,i)=>{
                                                    return (
                                                            <Link to={`/video/${item.vid}`} key={`v${i}`}>
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
                                </InfiniteLoader>
                                </div>
                            </Tabs>
                        </div>
                    </WingBlank>

            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Search);