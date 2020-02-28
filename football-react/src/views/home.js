import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeActive} from '../store/actions';
import Top from '../components/top';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    PullToRefresh,
    InfiniteLoader,
} from 'react-weui';

import LazyLoad from 'react-lazy-load';

import { Tabs,Skeleton,Avatar } from 'antd';

import {Toast,Button} from 'antd-mobile';

const { TabPane } = Tabs;
const lazy = '/favicon.ico';
function mapStateToProps(state){
    return {
        count: state.reducer.active,
        api: state.reducer.api,
    }
}

function mapActionToProps(dispatch){
    return {
        changeView: (num)=>{dispatch(changeActive(num))},
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
        this.props.changeView(1);
        this.loadAllData();
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
            if(this.state[`news${index}Arr`].length == 0){
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
            if(res.status == 200){
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
            if(res.status == 200){
                if(this.state.newId == 104){
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
            if(res.status == 200){
                if(this.state.newId == 104){
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
            if(res.status == 200){
                if(this.state.newId == 104){
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
                                                                    <a>
                                                                    <div className="news-list-img-side">
                                                                        <LazyLoadImage
                                                                            src={obj.thumb} 
                                                                            placeholderSrc={lazy}
                                                                        />
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
                                                                                
                                                                            </span>
                                                                        </div>
                                                                        </div>
                                                                </a>
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