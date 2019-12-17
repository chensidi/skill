import React,{Component} from 'react'
import '../static/css/home.css'
import { WingBlank,Grid, PullToRefresh, Toast,NavBar,Tabs,Icon as MIcon,Carousel} from 'antd-mobile';
import {Icon,Skeleton,Divider} from 'antd';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';
import axios from 'axios';
import {Link,withRouter} from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {InfiniteLoader, Dialog,Cells,
    CellsTitle,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Panel,
    PanelHeader,
    PanelBody,
    PanelFooter,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    MediaBoxInfo,
    MediaBoxInfoMeta} from 'react-weui';
import Ripples from 'react-touch-ripple';
const lazy = '/favicon.ico';



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

class VideoList extends Component {

    constructor(){
        super();
        this.state = {
            pyList: [],
            record: [],
            showRec: false,
            loadPy: true,
            loadRec: true,
            items: [...Array(20).keys()],
            kw: 'album',
            albumArr: [],
            artistArr: [],
            mvArr: []
        }
    }

    componentWillMount(){
        this.loadPyList();
        axios({
            url: `${this.props.api}/login/cellphone?phone=18782071589&password=woshichensidi666`
        })
    }

    loadPyList = () => {
        axios({
            url: `${this.props.api}/user/playlist?uid=536075590`
        }).then(res=>{
            if(res.status == 200){
                this.setState({
                    pyList: res.data.playlist,
                    loadPy: false
                })
            }
        }).catch(err=>{
            
        })
    }

    loadRecord = () => {
        axios({
            url: `${this.props.api}/user/record?uid=536075590`
        }).then(res=>{
            if(res.status == 200){
                this.setState({
                    record: res.data.weekData,
                    loadRec: false
                })
            }
        }).catch(err=>{

        })
    }

    play(info){
        // console.log(info);
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

    showRec = () => {
        this.setState({
            showRec: true
        },()=>{
            if(this.state.record.length == 0){
                this.loadRecord();
            }
        })
    }

    changeTab = (tab) => {
        if(this.state.kw != tab.kw){
            this.setState({
                kw: tab.kw
            },()=>{
                if(this.state.kw == 'album'){
                    if(this.state.albumArr.length == 0){
                        this.loadSub();
                    }
                }
                else if(this.state.kw == 'artist'){
                    if(this.state.artistArr.length == 0){
                        this.loadSub();
                    }
                }
                else{
                    if(this.state.mvArr.length == 0){
                        this.loadSub();
                    }
                }
            })
        }
    }

    loadSub = (resolve, finish) => {
        let len;
        if(this.state.kw == 'album'){
            len = this.state.albumArr.length;
        }else if(this.state.kw == 'artist'){
            len = this.state.artistArr.length;
        }else{
            len = this.state.mvArr.length;
        }
        axios({
            url: `${this.props.api}/${this.state.kw}/sublist?offset=${len}`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            if(res.status == 200){
                if(resolve){
                    resolve()
                }
                if(res.data.data.length){
                    this.setState({
                        [this.state.kw+'Arr']: this.state[this.state.kw+'Arr'].concat(res.data.data)
                    })
                }else{
                    if(finish){
                        finish();
                    }
                }
            }
        })
    }

    render(){
        const tabs = [
            {title: '专辑',kw: 'album'},
            {title: '歌手', kw: 'artist'},
            {title: '视频', kw: 'mv'},
        ]
        return (
            <div className="app-main">
                <Skeleton active avatar paragraph={{ rows: 4 }} loading={this.state.loadPy}>
                <Cell access>
                    <CellHeader>
                        <Icon type="play-square" style={{fontSize: 20,marginRight:10}} />
                    </CellHeader>
                    <CellBody onClick={this.showRec}>
                        最近播放
                    </CellBody>
                    <CellFooter>
                        Description
                    </CellFooter>
                </Cell>
                <Cell access>
                    <CellHeader>
                        <Icon type="bar-chart" style={{fontSize: 20,marginRight:10}} />
                    </CellHeader>
                    <CellBody>
                        我的电台
                    </CellBody>
                    <CellFooter>
                        Description
                    </CellFooter>
                </Cell>
                <Cell access>
                    <CellHeader>
                        <Icon type="user-add" style={{fontSize: 20,marginRight:10}} />
                    </CellHeader>
                    <CellBody>
                        我的收藏
                    </CellBody>
                    <CellFooter>
                        Description
                    </CellFooter>
                </Cell>
                <Divider>我的歌单</Divider>
                <Panel>
                <PanelBody>
                    {
                        this.state.pyList.map((item,id)=>{
                            return (
                                <Link to={`/playlist/${item.id}`} key={`py${id}`}>
                                <MediaBox type="appmsg">
                                    <MediaBoxHeader>
                                        <LazyLoadImage
                                            src={item.coverImgUrl} 
                                            placeholderSrc={lazy}
                                            height="100%"
                                            width="100%"
                                        />   
                                    </MediaBoxHeader>
                                    <MediaBoxBody>
                                    <MediaBoxTitle>{item.name}</MediaBoxTitle>
                                        <MediaBoxDescription>
                                            {item.trackCount}首
                                        </MediaBoxDescription>
                                    </MediaBoxBody>
                                </MediaBox>
                                </Link>
                            )
                        })
                    }
                </PanelBody>
                </Panel>
                <div className={this.state.showRec?"play-history play-history-show":"play-history"}>
                        <NavBar
                            mode="light"
                            icon={<MIcon type="left" />}
                            onLeftClick={() => {this.setState({showRec:false})}}
                            style={{position:'fixed',top:0,width:'100%',background:'#fff',zIndex:100}}
                        >
                            <h4 className="" style={{margin: 0}}>记录</h4>
                        </NavBar>
                    <div style={{marginTop: 50}}>
                        <Skeleton active avatar paragraph={{ rows: 4 }} loading={this.state.loadRec}>
                        {
                            this.state.record.map((item,i)=>{
                                return (
                                    <Ripples style={{display:'block'}} key={`rc${i}`}>
                                        <div className="search-cell"  onClick={this.play.bind(this,
                                            {id:item.song.id,name:item.song.name,art:item.song.ar[0].name})
                                        }>
                                            <div className="res-info">
                                                <h4>{item.song.name}</h4>
                                                <p>{item.song.ar[0].name}-{item.song.al.name}</p>
                                            </div>
                                            <span>
                                                <Icon type="play-circle" theme="filled" />
                                            </span>
                                        </div>
                                    </Ripples>
                                )
                            })
                        }
                        </Skeleton>
                    </div>
                </div>
                <div className="my-sub my-sub-show">
                    <NavBar
                        mode="light"
                        icon={<MIcon type="left" />}
                        onLeftClick={() => {this.setState({showRec:false})}}
                        style={{position:'fixed',top:0,width:'100%',background:'#fff',zIndex:100}}
                    >
                        <h4 className="" style={{margin: 0}}>记录</h4>
                    </NavBar>
                    <div style={{marginTop: 50}}>
                        <Tabs tabs={tabs}
                            onTabClick={(tab, index) => {this.changeTab(tab)}}
                            swipeable={false}
                        >
                            <div>
                            <InfiniteLoader
                                    onLoadMore={ (resolve, finish) => {
                                        //mock request
                                        this.loadSub(resolve, finish)
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
                                                    <Ripples key={`sa${i}`} style={{display:'block'}}>
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
                                                            <MediaBoxTitle>{item.name}{item.alias?`(${item.alias[0]})`:''}</MediaBoxTitle>
                                                            <MediaBoxDescription>
                                                                {item.artists[0].name},{item.size}首
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
                            <div>1</div>
                            <div>1</div>
                        </Tabs>
                    </div>
                </div>
                </Skeleton>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapActionToProps)(VideoList));