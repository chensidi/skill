import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {changeActive,changeScorll} from '../store/actions';
import Top from '../components/top';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    PullToRefresh,
    InfiniteLoader,
} from 'react-weui';


import { Tabs,Skeleton } from 'antd';

import {Toast,Button} from 'antd-mobile';

const { TabPane } = Tabs;
const lazy = '/favicon.ico';
function mapStateToProps(state){
    return {
        count: state.reducer.active,
        api: state.reducer.api,
        scroll: state.reducer.scroll
    }
}

function mapActionToProps(dispatch){
    return {
        changeView: (num)=>{dispatch(changeActive(num))},
        changeScorll: (num)=>{dispatch(changeScorll(num))},
    }
}

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            menus: [],
            items: [],
            newId: 104,
            index: 0,
            news0Arr: [],
            news1Arr: [],
            news2Arr: [],
            news3Arr: [],
            news4Arr: [],
            news5Arr: [],
            news6Arr: [],
            news7Arr: [],
            news8Arr: [],
            news9Arr: [],
            news10Arr: [],
            news11Arr: [],

            new0Url: '',
            new1Url: '',
            new2Url: '',
            new3Url: '',
            new4Url: '',
            new5Url: '',
            new6Url: '',
            new7Url: '',
            new8Url: '',
            new9Url: '',
            new10Url: '',
            new11Url: '',

            new0Loading: true,
            new1Loading: true,
            new2Loading: true,
            new3Loading: true,
            new4Loading: true,
            new5Loading: true,
            new6Loading: true,
            new7Loading: true,
            new8Loading: true,
            new9Loading: true,
            new10Loading: true,
            new11Loading: true,

            refresh0Url: '',
            refresh1Url: '',
            refresh2Url: '',
            refresh3Url: '',
            refresh4Url: '',
            refresh5Url: '',
            refresh6Url: '',
            refresh7Url: '',
            refresh8Url: '',
            refresh9Url: '',
            refresh10Url: '',
            refresh11Url: '',

            menuLoading: true,
            menuErr: false
        }
    }

    componentWillMount(){
        console.log(this.props.scroll)
        this.props.changeView(1);
        this.loadAllData();
    }

    // shouldComponentUpdate(props,states){
    //     console.log(props);
    //     document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTop = props.scroll;
    //     return true;
    // }
    
    remenberScroll = () => {
        let num = document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTop;
        this.props.changeScorll(num);
    }

    callback = (key) => {
        console.log(key);
        let temp = key.split('_');
        let newId = temp[1],
            index = temp[0];
        
        this.setState({
            newId: newId,
            index: index
        },()=>{
            if(this.state[`news${index}Arr`].length === 0){
                this.loadNews(index);
            }
        })
    }

    loadAllData = () => {
        axios({
            url: `${this.props.api}/home`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status === 200){
                this.setState({
                    menus: res.data.menus.news,
                    menuLoading: false,
                    menuErr: false
                })
                this.loadNews(0);
            }
        }).catch(err=>{
            Toast.fail('Load success !!!', 1);
            this.setState({
                menuLoading: false,
                menuErr: true
            })
        })
    }

    loadNews = (index) => {
        axios({
            url: `${this.props.api}/news?id=${this.state.newId}`,
            timeout: 15000
        }).then(res=>{
            if(res.status === 200){
                if(this.state.newId === 104){
                    let arr = [];
                    res.data.contents.map((obj)=>{
                        obj.articles.map((item)=>{
                            arr.push(item);
                        })
                    })
                    this.setState({
                        [`news${index}Arr`]: this.state[`news${index}Arr`].concat(arr)
                    })
                }else{
                    this.setState({
                        [`news${index}Arr`]: this.state[`news${index}Arr`].concat(res.data.articles)
                    })
                }
                this.setState({
                    [`new${index}Url`]: res.data.next,
                    [`refresh1${index}Url`]: res.data.fresh,
                    [`new${index}Loading`]: false
                })
            }
        })
    }

    loadNewsMore = (index,resolve,finish) => {
        axios({
            url: this.props.api + '/noparams?' + 'url=' + this.state[`new${index}Url`],
            timeout: 15000
        }).then(res=>{
            if(res.status === 200){
                if(this.state.newId === 104){
                    this.setState({
                        [`news${index}Arr`]: this.state[`news${index}Arr`].concat(res.data.contents)
                    })
                }else{
                    this.setState({
                        [`news${index}Arr`]: this.state[`news${index}Arr`].concat(res.data.articles)
                    })
                }
                this.setState({
                    [`new${index}Url`]: res.data.next
                })
                resolve();
            }else{
                resolve();
            }
        }).catch(err=>{
            resolve();
        })
    }

    refreshNewsMore = (resolve) => {
        let top = document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTop;
        if(top > 0){
            resolve();
            return;
        }
        axios({
            url: this.props.api + '/noparams?' + 'url=' + this.state[`refresh1${this.state.index}Url`],
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            // resolve();
            if(res.status === 200){
                if(this.state.newId === 104){
                    this.setState({
                        [`news${this.state.index}Arr`]: res.data.contents
                    })
                }else{
                    this.setState({
                        [`news${this.state.index}Arr`]: res.data.articles
                    })
                }
                this.setState({
                    [`new${this.state.index}Url`]: res.data.next
                })
                resolve();
            }else{
                resolve();
            }
        }).catch(err=>{
            resolve();
        })
    }

    refresh = (resolve) => {
        let top = document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTop;
        console.log(top);
        resolve();
    }

    render(){
        return (
            <div className="main">
                <Top />
                <div>
                <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            this.loadNewsMore(this.state.index,resolve,finish);
                        }}
                    >
                        <PullToRefresh
                            onRefresh={
                                resolve => {
                                    // setTimeout(()=>{resolve()},1000)
                                    this.refreshNewsMore(resolve)
                                }
                            }
                            loaderHeight={100}
                        >
                        <Skeleton loading={this.state.menuLoading} active avatar paragraph={{ rows: 9 }}>
                            <div className="topmenu">
                                <Tabs defaultActiveKey="1" onTabClick={this.callback}>
                                    {
                                        this.state.menus.map((items,x)=>{
                                            return (
                                                
                                                <TabPane tab={items.label} key={`${x}_${items.id}`}>
                                                    <ul className="news-list">
                                                    <Skeleton loading={this.state[`new${x}Loading`]} active avatar paragraph={{ rows: 9 }}>
                                                    {
                                                        this.state[`news${x}Arr`]&&this.state[`news${x}Arr`].map((obj,i)=>{
                                                            return (
                                                                <li className="news-list-item aa" key={`${i}_s`}>
                                                                    <Link onClick={this.remenberScroll} to={'/news/'+obj.click_from+'|'+obj.id+'|'+obj.comments_total}>
                                                                    <div className="news-list-img-side">
                                                                        <LazyLoadImage
                                                                            src={obj.thumb} 
                                                                            placeholderSrc={lazy}
                                                                        />
                                                                        {
                                                                            obj.is_video === true ? 
                                                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDY5RTI2NURDNDEyMTFFNzk3MjVCRjQwOUM1RjBCQjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDY5RTI2NUNDNDEyMTFFNzk3MjVCRjQwOUM1RjBCQjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQjNGQkY1MkFGODgxMUU3OTcwMEI5NTFBNThCMUE3NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQjNGQkY1M0FGODgxMUU3OTcwMEI5NTFBNThCMUE3NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PugaJB8AAAc5SURBVHja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" className="m-video" />
                                                                            : null
                                                                        }
                                                                    </div>
                                                                    <div className="news-list-info">
                                                                        <h3 >{obj.title}</h3>
                                                                        <div className="news-list-tag">
                                                                            <span className="news-list-comment">{obj.comments_total}评论</span>
                                                                            <span className="news-list-tags-collection">
                                                                                {
                                                                                    obj.label&&
                                                                                    <span className="news-list-tag-item news-list-tag-common">{obj.label}</span>
                                                                                }
                                                                                {
                                                                                    obj.top&&
                                                                                    <span className="news-list-tag-item news-list-tag-common">{obj.top?'置顶':''}</span>
                                                                                }
                                                                                {
                                                                                    obj.author&&
                                                                                    <span className="news-list-tag-item news-list-tag-hao">懂球号</span>
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        </div>
                                                                </Link>
                                                            </li>
                                                            )
                                                        })
                                                    }
                                                    </Skeleton>
                                                    </ul>
                                                    
                                                </TabPane>
                                            )
                                        })
                                    }
                                </Tabs>
                            </div>
                        </Skeleton> 
                        </PullToRefresh>
                    </InfiniteLoader>
                </div>
                <div className="reload_btn" style={{display: this.state.menuErr?'':'none'}}>
                    <Button type="primary" inline onClick={this.loadAllData}>网络错误</Button>
                </div>

            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(Home);