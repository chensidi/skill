import React,{Component} from 'react'
import '../static/css/home.css'
import { WingBlank,Grid, PullToRefresh, Toast,NavBar,Tabs,Icon as MIcon,Carousel} from 'antd-mobile';
import {Icon,Skeleton} from 'antd';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';
import axios from 'axios';
import {Link,withRouter} from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {InfiniteLoader, Dialog} from 'react-weui';
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

class Cate extends Component {

    constructor(){
        super();
        this.state = {
            cat: '全部',
            data: [1,2,3],
            all: [],
            hy: [],
            qyy: [],
            lx: [],
            dz: [],
            hj: [],
            loadings: true,
            showIOS1: false,
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            netErr: false
        }
    }

    hideDialog() {
        this.setState({
            showIOS1: false,
        });
        this.loadList();
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);

        this.loadList();
    }

    loadList = (resolve,finish) => {
        let url,attr,len;
        if(this.state.cat == '全部'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.all.length}`;
            attr = 'all';
            len = this.state.all.length;
        }else if(this.state.cat == '华语'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.hy.length}`;
            attr = 'hy';
            len = this.state.hy.length;
        }else if(this.state.cat == '轻音乐'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.qyy.length}`;
            attr = 'qyy';
            len = this.state.qyy.length;
        }else if(this.state.cat == '流行'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.lx.length}`;
            attr = 'lx';
            len = this.state.lx.length;
        }else if(this.state.cat == '电子'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.dz.length}`;
            attr = 'dz';
            len = this.state.dz.length;
        }else if(this.state.cat == '摇滚'){
            url = `${this.props.api}/top/playlist/highquality?cat=${this.state.cat}&offset=${this.state.hj.length}`;
            attr = 'hj';
            len = this.state.hj.length;
        }
        axios({
            url: url,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status == 200){
                this.setState({
                    loadings: false,
                    netErr: false,
                    showIOS1: false
                })
                if(res.data.playlists.length){
                    this.setState({
                        [attr]: this.state[attr].concat(res.data.playlists)
                    })
                    if(resolve){
                        resolve();
                    }
                }else{
                    if(finish){
                        finish();
                    }
                }
            }
        }).catch(err=>{
            if(resolve){
                resolve();
            }
            console.log(err);
            if(len == 0){
                this.setState({
                    netErr: true,
                    showIOS1: true
                })
            }else{
                this.setState({
                    netErr: true,
                    showIOS1: false
                })
            }
            
        })
    }

    change(tab){
        
        if(tab.title != this.state.cat){
            this.setState({
                cat: tab.title
            },()=>{
                if(this.state.cat=='全部'){
                    if(this.state.all.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }

                if(this.state.cat=='华语'){
                    if(this.state.hy.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }

                if(this.state.cat=='轻音乐'){
                    if(this.state.qyy.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }

                if(this.state.cat=='流行'){
                    if(this.state.lx.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }

                if(this.state.cat=='电子'){
                    if(this.state.dz.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }

                if(this.state.cat=='摇滚'){
                    if(this.state.hj.length == 0){
                        this.setState({
                            loadings: true,
                        })
                        this.loadList();
                    }
                }
            })
        }
        
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

    render(){
        const tabs = [
            { title:  '全部'},
            { title:  '华语'},
            { title:  '轻音乐'},
            { title:  '流行'},
            { title:  '电子'},
            { title:  '摇滚'},
          ];
        return (
            <div className="app-album" 
                style={{overflow:'hidden'}}
            >
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    网络请求超时
            </Dialog>
                <div>
                    <div className="cmt-bar">
                        <NavBar
                            mode="light"
                            icon={<MIcon type="left" />}
                            onLeftClick={() => {this.props.history.go(-1)}}
                        >
                            <h3 className="" style={{margin: 0}}>歌单</h3>
                        </NavBar>
                    </div>
                    <div 
                        style={{position:'absolute',top:60,width:'100%'}}
                    >
                        <Tabs tabs={tabs}
                            onTabClick={(tab, index) => {this.change(tab)}}
                            swipeable={false}
                            style={{marginTop:'50px'}}
                        >
                            <div>
                            <InfiniteLoader
                                    onLoadMore={ (resolve, finish) => {
                                        //mock request
                                        this.loadList(resolve, finish);
                                    }}
                            >
                                <WingBlank>
                                <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                    <Carousel className="space-carousel"
                                        frameOverflow="hidden"
                                        cellSpacing={10}
                                        slideWidth={.5}
                                        autoplay
                                        infinite
                                        afterChange={index => this.setState({ slideIndex: index })}
                                        >
                                        {this.state.all.slice(0,5).map((val, index) => (
                                            <Link to={`/playlist/${val.id}`}
                                            key={`py${index}`}
                                            style={{
                                                display: 'block',
                                                position: 'relative',
                                                top: this.state.slideIndex === index ? -10 : 0,
                                                height: '100px',
                                                boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                                            }}
                                            >
                                            <img
                                                height={100}
                                                width={100}
                                                src={val.coverImgUrl}
                                                alt=""
                                                style={{ width: '100%', verticalAlign: 'top' }}
                                                onLoad={() => {
                                                // fire window resize event to change height
                                                window.dispatchEvent(new Event('resize'));
                                                this.setState({ imgHeight: 'auto' });
                                                }}
                                            />
                                            </Link>
                                        ))}
                                    </Carousel>
                                    <Grid data={this.state.all.slice(5,)} hasLine={false} activeStyle={false} columnNum={3}
                                        square={false}
                                        renderItem={dataItem => (
                                            <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                            <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                            <LazyLoadImage
                                                src={dataItem.coverImgUrl} 
                                                placeholderSrc={lazy}
                                                height="100"
                                                width="100%"
                                            />
                                            <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                <span className="grid-title">{dataItem.name}</span>
                                            </div>
                                            </Link>
                                        )}
                                    /> 
                                    </Skeleton>                 
                                </WingBlank>
                            </InfiniteLoader>
                            </div>
                            <div>
                                <InfiniteLoader
                                        onLoadMore={ (resolve, finish) => {
                                            //mock request
                                            this.loadList(resolve, finish);
                                        }}
                                >
                                    <WingBlank>
                                    <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                        <Grid data={this.state.hy} hasLine={false} activeStyle={false} columnNum={3}
                                            square={false}
                                            renderItem={dataItem => (
                                                <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                                <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                                <LazyLoadImage
                                                    src={dataItem.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    height="100"
                                                    width="100%"
                                                />
                                                <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                    <span className="grid-title">{dataItem.name}</span>
                                                </div>
                                                </Link>
                                            )}
                                        />  
                                        </Skeleton>                
                                    </WingBlank>
                                </InfiniteLoader>
                            </div>
                            <div>
                            <InfiniteLoader
                                        onLoadMore={ (resolve, finish) => {
                                            //mock request
                                            this.loadList(resolve, finish);
                                        }}
                                >
                                    <WingBlank>
                                    <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                        <Grid data={this.state.qyy} hasLine={false} activeStyle={false} columnNum={3}
                                            square={false}
                                            renderItem={dataItem => (
                                                <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                                <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                                <LazyLoadImage
                                                    src={dataItem.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    height="100"
                                                    width="100%"
                                                />
                                                <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                    <span className="grid-title">{dataItem.name}</span>
                                                </div>
                                                </Link>
                                            )}
                                        />   
                                        </Skeleton>               
                                    </WingBlank>
                                </InfiniteLoader>
                            </div>
                            <div>
                            <InfiniteLoader
                                        onLoadMore={ (resolve, finish) => {
                                            //mock request
                                            this.loadList(resolve, finish);
                                        }}
                                >
                                    <WingBlank>
                                        <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                        <Grid data={this.state.lx} hasLine={false} activeStyle={false} columnNum={3}
                                            square={false}
                                            renderItem={dataItem => (
                                                <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                                <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                                <LazyLoadImage
                                                    src={dataItem.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    height="100"
                                                    width="100%"
                                                />
                                                <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                    <span className="grid-title">{dataItem.name}</span>
                                                </div>
                                                </Link>
                                            )}
                                        />    
                                        </Skeleton>              
                                    </WingBlank>
                                </InfiniteLoader>
                            </div>
                            <div>
                            <InfiniteLoader
                                        onLoadMore={ (resolve, finish) => {
                                            //mock request
                                            this.loadList(resolve, finish);
                                        }}
                                >
                                    <WingBlank>
                                        <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                        <Grid data={this.state.dz} hasLine={false} activeStyle={false} columnNum={3}
                                            square={false}
                                            renderItem={dataItem => (
                                                <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                                <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                                <LazyLoadImage
                                                    src={dataItem.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    height="100"
                                                    width="100%"
                                                />
                                                <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                    <span className="grid-title">{dataItem.name}</span>
                                                </div>
                                                </Link>
                                            )}
                                        />      
                                        </Skeleton>            
                                    </WingBlank>
                                </InfiniteLoader>
                            </div>
                            <div>
                            <InfiniteLoader
                                        onLoadMore={ (resolve, finish) => {
                                            //mock request
                                            this.loadList(resolve, finish);
                                        }}
                                >
                                    <WingBlank>
                                        <Skeleton loading={this.state.loadings} active avatar paragraph={{ rows: 4 }}>
                                        <Grid data={this.state.hj} hasLine={false} activeStyle={false} columnNum={3}
                                            square={false}
                                            renderItem={dataItem => (
                                                <Link to={`/playlist/${dataItem.id}`} style={{display: 'block', padding: '4px',position:'relative' }}>
                                                <span className="play-count"><Icon type="caret-right" />{this.computed(dataItem.playCount)}</span>
                                                <LazyLoadImage
                                                    src={dataItem.coverImgUrl} 
                                                    placeholderSrc={lazy}
                                                    height="100"
                                                    width="100%"
                                                />
                                                <div style={{ color: '#888', fontSize: '14px', marginTop: '0px' }}>
                                                    <span className="grid-title">{dataItem.name}</span>
                                                </div>
                                                </Link>
                                            )}
                                        />  
                                        </Skeleton>                
                                    </WingBlank>
                                </InfiniteLoader>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapActionToProps)(Cate));
