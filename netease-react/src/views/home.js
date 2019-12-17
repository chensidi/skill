import React,{Component} from 'react'
import '../static/css/home.css'
import { WingBlank,Grid, PullToRefresh, Toast,Drawer} from 'antd-mobile';
import {Icon,Skeleton} from 'antd';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';
import axios from 'axios';
import Banners from '../components/banner';
import {Link} from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { LazyLoadImage } from 'react-lazy-load-image-component';
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


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            banners: [1,2,3,4,5,6,7,8],
            recommend: [1,2,3,4,5,6],
            refreshing: false,
            isLoading: false,
            arr: [1,2,3,4,5,6,7,7,7,8,9],
            down:true,
            newDesc: [1,2,3],
            newSong: [1,2,3],
            descOrSong: false,
            items: [...Array(20).keys()],
            mv: [],
            bannerKey: false,
            recommendKey: false,
            newDescKey: false,
            newSongKey: false,
            mvKey: false,
            playLogs: [],
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

        this.loadBanner();
        this.loadRecommend();
        this.loadNewDesc();
        this.loadNewSong();
        this.loadMv();

        axios({
            url: `${this.props.api}/login/cellphone?phone=18782071589&password=woshichensidi666`
        })
    }

    loadBanner = ()=>{
        axios({
            url: `${this.props.api}/banner?type=3`,
            method: 'get',
            timeout: 15000
        }).then((res)=>{
            if(res.status == 200){
                setTimeout(()=>{
                    this.setState({
                        banners: res.data.banners,
                        bannerKey: true
                    })
                },100)
            }
        }).catch(err=>{
            Toast.fail('Network connection failed !!!', 1);
            this.setState({
                bannerKey: false
            })
        })
    }

    loadRecommend = ()=>{
        axios({
            url: `${this.props.api}/personalized`,
            timeout: 15000,
            method: 'get'
        }).then(res=>{
            if(res.status == 200){
                let recommend = res.data.result.slice(0,6),
                    arr = [];
                recommend.map(item=>{
                    let obj = {
                        icon: item.picUrl,
                        text: item.name,
                        count: item.playCount,
                        id: item.id
                    }
                    arr.push(obj);
                })
                this.setState({
                    recommend: arr,
                    recommendKey: true
                })
            }
        }).catch(err=>{
            Toast.fail('Network connection failed !!!', 1);
            this.setState({
                recommendKey: false
            })
        })
    }

    loadNewDesc = ()=> {
        axios({
            url: `${this.props.api}/top/album?offset=0&limit=3`,
            timeout: 15000,
            method: 'get'
        }).then(res=>{
            if(res.status == 200){
                let desc = res.data.albums,
                    arr = [];
                    desc.map(item=>{
                    let obj = {
                        icon: item.picUrl,
                        text: item.name,
                        count: item.playCount,
                        art: item.artist.name,
                        id: item.id
                    }
                    arr.push(obj); 
                })
                this.setState({
                    newDesc: arr,
                    newDescKey: true
                })
            }
        }).catch(err=>{
            Toast.fail('Network connection failed !!!', 1);
            this.setState({
                newDescKey: false
            })
        })
    }

    loadNewSong = ()=> {
        axios({
            url: `${this.props.api}/top/song`,
            timeout: 15000,
            method: 'get'
        }).then(res=>{
            if(res.status == 200){
                let song = res.data.data.slice(0,3),
                    arr = [];
                    song.map(item=>{
                    let obj = {
                        icon: item.album.picUrl,
                        text: item.name,
                        count: item.playedNum,
                        art: item.artists[0].name,
                        id: item.id,
                        name: item.name
                    }
                    arr.push(obj);
                })
                this.setState({
                    newSong: arr,
                    newSongKey: true
                })
            }
        }).catch(err=>{
            Toast.fail('Network connection failed !!!', 1);
            this.setState({
                newSongKey: false
            })
        })
    }

    loadMv = ()=> {
        axios({
            url: `${this.props.api}/mv/first?limit=50`,
            timeout: 15000,
            method: 'get'
        }).then(res=>{
            if(res.status == 200){
                let mv = res.data.data;
                // console.log(mv)
                this.setState({
                    mv: mv,
                    mvKey: true
                })
            }
        }).catch(err=>{
            Toast.fail('Network connection failed !!!', 1);
            this.setState({
                mvKey: false
            })
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

    changeSongorDesc = ()=> {
        this.setState(prev=>({
            descOrSong: !prev.descOrSong
        }))
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
        let {bannerKey,recommend,newSongKey,newDescKey,mvKey} = this.state;
        return (
            <div className="app-main">
                <PullToRefresh
                    damping={60}
                    ref={el => this.ptr = el}
                    style={{
                      height: '100%',
                      overflow: 'auto',
                    }}
                    indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                    direction={this.state.down ? 'down' : 'up'}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      this.setState({ refreshing: true });
                      setTimeout(() => {
                        this.setState({ refreshing: false });
                      }, 1000);
                    }}
                >
                <Skeleton loading={!(bannerKey&&recommend&&newSongKey&&newDescKey&&mvKey)} active avatar paragraph={{ rows: 4 }}>
                
                    <Banners banners={this.state.banners}  />
                    <WingBlank>
                        <div className="home-menu">
                            <div className="home-menu-block">
                                <span >
                                    <Icon type="calendar" style={{fontSize:20,color:'#fff',marginTop:10}} />
                                </span>
                                <em>每日推荐</em>
                            </div>
                            <div className="home-menu-block">
                                <span>
                                    <Icon type="file-text" style={{fontSize:20,color:'#fff',marginTop:10}} />
                                </span>
                                <em>歌单</em>
                            </div>
                            <Link to="/toplist" className="home-menu-block">
                                <span>
                                    <Icon type="fund" style={{fontSize:20,color:'#fff',marginTop:10}} />
                                </span>
                                <em>排行榜</em>
                            </Link>
                            <div className="home-menu-block">
                                <span>
                                    <Icon type="customer-service" style={{fontSize:20,color:'#fff',marginTop:10}} />
                                </span>
                                <em>电台</em>
                            </div>
                        </div>
                        <div>
                            <h3 className="home-title">
                                <span>推荐歌单</span>
                                <Link to="/cate" className="morelink">
                                    歌单广场
                                </Link>
                            </h3>
                            <Grid data={this.state.recommend} hasLine={false} activeStyle={false} columnNum={3}
                                square={false}
                                renderItem={dataItem => (
                                    <Link to={`/playlist/${dataItem.id}`} style={{ padding: '4px',position:'relative' }}>
                                    <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.count)}</span>
                                    {/* <img src={dataItem.icon} style={{ width: '100px', height: '100px' }} alt="" /> */}
                                    <LazyLoadImage
                                            src={dataItem.icon} 
                                            placeholderSrc={lazy}
                                            height="100"
                                            width="100"
                                        />
                                    <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                        <span className="grid-title">{dataItem.text}</span>
                                    </div>
                                    </Link>
                                )}
                            />
                            <h3 className="home-title">
                                <span>
                                    <em onClick={this.changeSongorDesc} className={!this.state.descOrSong?'on':''}>新碟</em>
                                    <em onClick={this.changeSongorDesc} className={this.state.descOrSong?'on':''}>新歌</em>
                                </span>
                                <Link to="" className="morelink" style={{display:this.state.descOrSong?'none':''}}>
                                    更多新碟
                                </Link>
                                <Link to="" className="morelink" style={{display:!this.state.descOrSong?'none':''}}>
                                    更多新歌
                                </Link>
                            </h3>
                            <div className={this.state.descOrSong?"songdeschd":"songdesc"}>
                                <Grid data={this.state.newDesc} hasLine={false} activeStyle={false} columnNum={3}
                                    square={false}
                                    renderItem={dataItem => (
                                        <Link to={`/album/${dataItem.id}`} style={{ padding: '4px',position:'relative' }}>
                                        {/* <LazyLoad height={100}>
                                            <img src={dataItem.icon} style={{ width: '100px', height: '100px' }} alt="" />
                                        </LazyLoad> */}
                                        <LazyLoadImage
                                            src={dataItem.icon} 
                                            placeholderSrc={lazy}
                                            height="100"
                                            width="100"
                                        />
                                        <div style={{ color: '#888', fontSize: '14px', marginTop: '2px' }}>
                                            <span className="grid-title-1">{dataItem.text}</span>
                                            <span className="grid-title-1">{dataItem.art}</span>
                                        </div>
                                        </Link>
                                    )}
                                />
                            </div>
                            <div className={!this.state.descOrSong?"songdeschd":"songdesc"}>
                                <Grid data={this.state.newSong} hasLine={false} activeStyle={false} columnNum={3}
                                    square={false}
                                    renderItem={dataItem => (
                                        <div style={{ padding: '4px',position:'relative' }}>
                                        {/* <LazyLoad height={100}>
                                        <img src={dataItem.icon} style={{ width: '100px', height: '100px' }} alt="" />
                                        </LazyLoad> */}
                                        <LazyLoadImage
                                            src={dataItem.icon} 
                                            placeholderSrc={lazy}
                                            height="100"
                                            width="100"
                                        />
                                        <div style={{ color: '#888', fontSize: '14px', marginTop: '2px' }}>
                                            <span className="grid-title-1">{dataItem.text}</span>
                                            <span className="grid-title-1">{dataItem.art}</span>
                                        </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <h3 className="home-title">
                            <span>最新MV</span>
                        </h3>
                            {
                                this.state.mv.map((item,i)=>{
                                    return (
                                        <Link to={`/mv/${item.id}`} className="home-mv" key={`m${i}`}>
                                            <div className="mv-cover">
                                                <LazyLoad offsetVertical={50} height={200}>
                                                    <img src={item.cover} />
                                                </LazyLoad>
                                                <div className="mv-mask">
                                                    <i>
                                                        <Icon type="caret-right" />
                                                    </i>
                                                    <span>
                                                        <Icon type="play-circle" />&nbsp;
                                                        {this.computed(item.playCount)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="home-mv-info">
                                                <p>{item.artistName} -《{item.name}》</p>
                                                <p>{item.briefDesc}</p>
                                            </div>
                                        </Link>
                                    )
                                })
                                
                            }
                        
                        </WingBlank>
                </Skeleton>
                </PullToRefresh>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Home);