import React,{Component} from 'react'
import '../static/css/home.css'
import { WingBlank,Grid, Toast,NavBar,Icon as MIcon} from 'antd-mobile';
import {Skeleton} from 'antd';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';
import axios from 'axios';
import {Link,withRouter} from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {PullToRefresh} from 'react-weui';
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

class TopList extends Component {

    constructor(){
        super();
        this.state = {
            topList: [],
            loading: true
        }
    }

    componentWillMount(){
        this.loadTopList();
    }

    loadTopList = (resolve) => {
        this.setState({
            loading: true
        })
        axios({
            url: `${this.props.api}/toplist/detail`,
            timeout: 15000
        }).then(res=>{
            if(res.status == 200){
                this.setState({
                    topList: res.data.list,
                    loading: false
                })
                if(resolve){
                    resolve();
                }
            }
        }).catch(err=>{
            // console.log(err)
            Toast.fail('网络请求超时', 1);
            this.setState({
                loading: true
            })
            if(resolve){
                resolve();
            }
        })
    }

    render() {
        return (
                <div className="app-album">
                    <div className="cmt-bar" style={{background:'#fff',zIndex:100}}>
                        <NavBar
                            mode="light"
                            icon={<MIcon type="left" />}
                            onLeftClick={() => {this.props.history.go(-1)}}
                        >
                            <h3 className="" style={{margin: 0}}>Toplist</h3>
                        </NavBar>
                    </div>
                    <PullToRefresh
                        onRefresh={
                            resolve => {
                                this.loadTopList(resolve)
                            }
                        }
                    >
                    <WingBlank>
                        <Skeleton loading={this.state.loading} active avatar paragraph={{ rows: 7 }}>
                    <div className="top-content">
                        <h3>官方榜</h3>
                        {
                            this.state.topList.slice(0,4).map((item,i)=>{
                                return (
                                    <Link to={`/playlist/${item.id}`} className="top-block" key={`tp${i}`}>
                                        <div className="toplist">
                                            <div className="top-cover">
                                                {/* <img src={item.coverImgUrl} /> */}
                                                <LazyLoadImage
                                                    src={item.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    width={'100%'}
                                                    height={'100%'}
                                                />
                                                <p className="top-update">{item.updateFrequency}</p>
                                            </div>
                                            <div className="top-track">
                                                {
                                                    item.tracks.map((obj,i)=>{
                                                        return (
                                                            <p key={item.name+i}>
                                                                {i+1}.{obj.first}-{obj.second}
                                                            </p>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div className="top-content">
                        <h3>推荐榜</h3>
                        <Grid data={this.state.topList.slice(4,10)} hasLine={false} activeStyle={false} columnNum={3}
                            square={false}
                            renderItem={dataItem => (
                                <Link to={`/playlist/${dataItem.id}`} style={{ padding: '4px',position:'relative',display:'block' }}>
                                    <LazyLoadImage
                                        src={dataItem.coverImgUrl} 
                                        placeholderSrc={lazy}
                                        height="100"
                                        width="100%"
                                    />
                                    <div style={{ color: '#888', fontSize: '12px', marginTop: '0px' }}>
                                        <span className="grid-title">{dataItem.name}</span>
                                    </div>
                                    <span style={{position:'absolute',top: '5px',right:'10px',color:'#fff',fontSize:12}}>
                                        {dataItem.updateFrequency}
                                    </span>
                                </Link>
                            )}
                        />
                    </div>

                    <div className="top-content">
                        <h3>全球榜</h3>
                        <Grid data={this.state.topList.slice(10,16)} hasLine={false} activeStyle={false} columnNum={3}
                            square={false}
                            renderItem={dataItem => (
                                <Link to={`/playlist/${dataItem.id}`} style={{ padding: '4px',position:'relative',display:'block' }}>
                                    <LazyLoadImage
                                        src={dataItem.coverImgUrl} 
                                        placeholderSrc={lazy}
                                        height="100"
                                        width="100%"
                                    />
                                    <div style={{ color: '#888', fontSize: '12px', marginTop: '0px' }}>
                                        <span className="grid-title">{dataItem.name}</span>
                                    </div>
                                    <span style={{position:'absolute',top: '5px',right:'10px',color:'#fff',fontSize:12}}>
                                        {dataItem.updateFrequency}
                                    </span>
                                </Link>
                            )}
                        />
                    </div>
                    <div className="top-content">
                        <h3>更多榜单</h3>
                        <Grid data={this.state.topList.slice(16,)} hasLine={false} activeStyle={false} columnNum={3}
                            square={false}
                            renderItem={dataItem => (
                                <Link to={`/playlist/${dataItem.id}`} style={{ padding: '4px',position:'relative',display:'block' }}>
                                    <LazyLoadImage
                                        src={dataItem.coverImgUrl} 
                                        placeholderSrc={lazy}
                                        height="100"
                                        width="100%"
                                    />
                                    <div style={{ color: '#888', fontSize: '12px', marginTop: '0px' }}>
                                        <span className="grid-title">{dataItem.name}</span>
                                    </div>
                                    <span style={{position:'absolute',top: '5px',right:'10px',color:'#fff',fontSize:12}}>
                                        {dataItem.updateFrequency}
                                    </span>
                                </Link>
                            )}
                        />
                    </div>
                    </Skeleton>
                    </WingBlank>
                    </PullToRefresh>

                </div>

        )
    }
}

export default withRouter(connect(mapStateToProps,mapActionToProps)(TopList));