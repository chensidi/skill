import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeActive} from '../store/actions';
import Top from '../components/top';
import {
    PullToRefresh,
    InfiniteLoader,
} from 'react-weui';

import { Tabs ,Skeleton} from 'antd';

import axois from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {Button} from 'antd-mobile';
const lazy = '/favicon.ico';
const { TabPane } = Tabs;

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
class News extends Component {
    constructor(props){
        super(props);
        this.state = {
            menus: [],
            league_id: 4,
            index: 0,

            match0Arr: [],
            match1Arr: [],
            match2Arr: [],
            match3Arr: [],
            match4Arr: [],
            match5Arr: [],

            match0Next: '',
            match1Next: '',
            match2Next: '',
            match3Next: '',
            match4Next: '',
            match5Next: '',

            match0Prev: '',
            match1Prev: '',
            match2Prev: '',
            match3Prev: '',
            match4Prev: '',
            match5Prev: '',

            match0Loading: true,
            match1Loading: true,
            match2Loading: true,
            match3Loading: true,
            match4Loading: true,
            match5Loading: true,

            menuLoading: true,
            menuErr: false
        }
    }

    callback = (key) => {
        console.log(key);
        let temp = key.split('_');
        this.setState({
            league_id: temp[0],
            index: temp[1]
        },()=>{
            this.loadOneLeague();
        })
    }

    componentWillMount(){
        this.props.changeView(2);
        this.loadAllData();
    }

    loadAllData = () => {
        axois({
            url: `${this.props.api}/home`,
            timeout: 15000
        }).then(res=>{
            this.loadOneLeague();
            if(res.status === 200 && res.data.menus){
                let menus = []
                res.data.menus.match_tab.map((item,i)=>{
                    if(item.label === '英超'
                        || item.label === '德甲'
                        || item.label === '西甲'
                        || item.label === '意甲'
                        || item.label === '法甲'
                        || item.label === '欧冠'
                    ){
                        menus.push({
                            league_id: item.league_id,
                            label: item.label
                        })
                    }
                })
                this.setState({
                    menus: menus,
                    menuLoading: false,
                    menuErr: false
                },()=>{
                    console.log(this.state)
                });
            }
        }).catch(err=>{
            this.setState({
                menuErr: true,
                menuLoading: false
            })
        })
    }

    loadOneLeague = () => {
        if(this.state[`match${this.state.index}Arr`].length>0){return;}
        let timeDate = new Date();
        let time = timeDate.getFullYear() + '-' + String(timeDate.getMonth()+1).padStart(2,0) + '-' + String(timeDate.getDate()).padStart(2,0);
        axois({
            url: `${this.props.api}/match?league=${this.state.league_id}&time=${time}%2000:00:00`,
            timeout: 15000
        }).then(res=>{
            this.setState({
                [`match${this.state.index}Loading`]: false
            })
            if(res.status === 200){
                this.setState({
                    [`match${this.state.index}Arr`]: this.state[`match${this.state.index}Arr`].concat(res.data.list),
                    [`match${this.state.index}Next`]: res.data.nextDate,
                    [`match${this.state.index}Prev`]: res.data.prevDate,
                })
            }
        })
    }

    loadMoreMatch = (resolve, finish) => {
        if(this.state[`match${this.state.index}Next`] === '00000'){
            resolve();
            return;
        }

        axois({
            url: `${this.props.api}/match?league=${this.state.league_id}&time=${this.state[`match${this.state.index}Next`]}`,
            timeout: 15000
        }).then(res=>{
            resolve();
            if(res.status === 200){
                this.setState({
                    [`match${this.state.index}Arr`]: this.state[`match${this.state.index}Arr`].concat(res.data.list),
                })
                if(res.data.nextDate){
                    this.setState({
                        [`match${this.state.index}Next`]: res.data.nextDate
                    })
                }else{
                    this.setState({
                        [`match${this.state.index}Next`]: '00000'
                    })
                }
            }
        })
    }

    loadPrevMatch = (resolve) => {
        if(this.state[`match${this.state.index}Prev`] === '00000'){
            resolve();
            return;
        }

        axois({
            url: `${this.props.api}/match?league=${this.state.league_id}&time=${this.state[`match${this.state.index}Prev`]}`,
            timeout: 15000
        }).then(res=>{
            resolve();
            if(res.status === 200){
                if(res.data.prevDate === this.state[`match${this.state.index}Prev`]){
                    return;
                }
                this.setState({
                    [`match${this.state.index}Arr`]: res.data.list.concat(this.state[`match${this.state.index}Arr`]),
                })
                if(res.data.prevDate){
                    this.setState({
                        [`match${this.state.index}Prev`]: res.data.prevDate
                    })
                }else{
                    this.setState({
                        [`match${this.state.index}Prev`]: '00000'
                    })
                }
            }
        }).catch(err=>{
            resolve();
        })
    }
    
    render(){
        return (
            <div className="main">
                <Top />
                <div>
                <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            this.loadMoreMatch(resolve, finish);
                        }}
                    >
                        <PullToRefresh
                            onRefresh={
                                resolve => {
                                    // setTimeout(()=>{resolve()},1000)
                                    this.loadPrevMatch(resolve)
                                }
                            }
                            loaderHeight={100}
                        >
                        <Skeleton loading={this.state.menuLoading} active avatar paragraph={{ rows: 9 }}>
                            <div className="topmenu">
                                <Tabs defaultActiveKey="1" onChange={this.callback}>
                                    {
                                        this.state.menus.map((item,i)=>{
                                            return (
                                                <TabPane tab={item.label} key={`${item.league_id}_${i}`}>
                                                    <ul className="match-list">
                                                    <Skeleton loading={this.state[`match${i}Loading`]} active avatar paragraph={{ rows: 9 }}>
                                                    {
                                                        this.state[`match${i}Arr`].map((obj,j)=>{
                                                            return (
                                                                <li className="match-calendar-item" key={`${i}_${j}`}>
                                                                    <a className="match-list-item">
                                                                        <div className="match-item-a">
                                                                            <LazyLoadImage
                                                                                src={obj.team_A_logo} 
                                                                                placeholderSrc={lazy}
                                                                            />
                                                                            <p>{obj.team_A_name}</p>
                                                                        </div>
                                                                        <div className="match-item-c">
                                                                            <p>
                                                                                {obj.start_play} {obj.competition_name}
                                                                            </p>
                                                                            {
                                                                                obj.status === 'Played'?
                                                                                <p className="spec">{obj.as_A} - {obj.as_B}</p>:
                                                                                <p className="spec spec-vs">vs</p>
                                                                            }
                                                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAoBAMAAAClR805AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUxpcQCzMQCzLwCyMQSyMACzMQCzMAWwMQCxLwiyMwiyNACyMQCyLxaxOQCzMRaxOp6G9rMAAAAOdFJOUwCAQL8n5pgPYK9wz07xtx2fbQAAAmpJREFUSMftl89rE0EUx7/ZpN0UZM1UbRAlrKOIpxKdFg+FJRXxIpaGpUUQQoONB4XSQymiKJEi6MVD1UvBHMQiXkQo6EVELx48C+Jt82OjpGHxP9A3s0lJrNgkZUEwb3fezkzgs7PfeW8mg8iTn4HY1xQuPEcgduMz1hCQvcCXoNC38CMo9N4++j9BR0y/+I1T/lOL46pfm5e9j3pDhxy/kGeMXaISA8KvkPPfVSIX/dYJek/GU+a+3442NoQrMmKCGqO2eLchxByidW6ujNsiuTN6wGvY9B/QJopIQHOgzzCWyDKWx5DnOYc4P+7sjDaaaAeD7egUwlPql0oSQ5ucjz7lHLidB/Y1390pWi+0oY/WZUOOGtBzDdmAl4tAQo2kC/RNr4EuCxGqrJdpeFGlNVXeCiUPmc15qltBKplWtDebkuHAq3yBy9q4EBZNI/SC58W6FUR97pYgFVk7wliZWYwNAxNNrWHEuhakHe346EKWHay2oE2FPsNr3NwdGpPfyR2Ik7OaYXQncZIyqNRJyvwNfd9V3Rl/z7un/GXLTsrOYk/TuIUe4Q7OwhjOStUZZY2UhgSpkSDdoJ3zv6FHIPMwLVlq4hpjpWaJruIuUgYPJZpWI4mm6kVxNw/0hm5J9I+ThH5NcZ0MTc+HJTGSywvNlmFhxOc6RG9fngZrj91PdX5CRoee2F9IU8pct8YgsLz5DJiaOU3oa/VeFtUBdy0Vod430JiVhr5eXcTCKgiNc7PAg1WMofQh38tWoMnE1vgxUkEcpsUIK8ASPa7Ir1A3CN7f0fvofwod4F/3AA8cAR6Tgjvc/QIJZyVcRvsrLwAAAABJRU5ErkJggg==" className="icon-highlights" />
                                                                        </div>
                                                                        <div className="match-item-b">
                                                                        <LazyLoadImage
                                                                                src={obj.team_B_logo} 
                                                                                placeholderSrc={lazy}
                                                                        />
                                                                        <p>{obj.team_B_name}</p>
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

export default connect(mapStateToProps,mapActionToProps)(News);