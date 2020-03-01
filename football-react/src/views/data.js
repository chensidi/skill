import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeActive} from '../store/actions';

import Top from '../components/top';
import axois from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
    PullToRefresh,
    InfiniteLoader,
} from 'react-weui';

import { Tabs ,Skeleton} from 'antd';
import {Tabs as Tabsm,Button} from 'antd-mobile';

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

class Data extends Component {
    constructor(props){
        super(props);
        this.state = {
            rankArr: [],
            scoreArr: [],
            index: 0,
            menuLoading: true,
            rankLoading: true,
            menuErr: false
        }
    }

    componentWillMount(){
        this.props.changeView(3);
        this.loadAllData();
    }

    callback = (key) => {
        console.log(key);
        let temp = key.split('_');
        this.setState({
            index: temp[0]
        })
        if(this.state.scoreArr[temp[0]].length > 0){
            this.setState({rankLoading:false});  
            return
        };
        this.loadRanking(temp[2]);
    }

    loadRanking = (id) => {
        this.setState({rankLoading:true});  
        axois({
            url: `${this.props.api}/score?id=${id}&r=${Math.random()}`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            this.setState({rankLoading:false});  
            if(res.status === 200){
                let prevScoreArr = this.state.scoreArr;
                prevScoreArr[this.state.index] = res.data.content.rounds[0].content.data
                this.setState({
                    scoreArr: prevScoreArr
                })
            }
        }).catch(err=>{
            this.setState({rankLoading:false});  
        })
    }

    loadAllData = () => {
        axois({
            url: `${this.props.api}/home`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            this.setState({
                menuLoading: false,
                menuErr: false
            })
            if(res.status === 200){
                this.setState({
                    rankArr: res.data.menus.ranking_new
                },()=>{
                    let tempArr = [];
                    this.state.rankArr.map((obj,i)=>{
                        tempArr.push([]);
                    })
                    this.setState({
                        scoreArr: tempArr
                    })
                    this.loadRanking(this.state.rankArr[0].season_id);
                })
            }
        }).catch(err=>[
            this.setState({
                menuLoading: false,
                menuErr: true
            })
        ])
    }
    renderContent = tab =>
    (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
      <p>Content of {tab.title}</p>
    </div>);

    render(){
        
        const tabs = [
            { title: '积分榜' },
            { title: '球员榜' },
            { title: '球队榜' },
            { title: '赛程' },
          ];
        
        return (
            <div className="main">
                <Top />
                <div>
                <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            resolve();
                        }}
                    >
                        <PullToRefresh
                            onRefresh={
                                resolve => {
                                    resolve()
                                }
                            }
                            loaderHeight={100}
                        >
                        <Skeleton loading={this.state.menuLoading} active avatar paragraph={{ rows: 9 }}>
                            <div className="topmenu">
                                <Tabs defaultActiveKey="1" 
                                onChange={this.callback} 
                                >
                                    {
                                        this.state.rankArr.length&&
                                        this.state.rankArr.map((menu,index)=>{
                                            return (
                                                <TabPane tab={menu.label} key={`${index}_${menu.id}_${menu.season_id}`}>
                                                    <Tabsm tabs={tabs}>
                                                        <div className="ranking-view match-table-list">
                                                        <Skeleton loading={this.state.rankLoading} active avatar paragraph={{ rows: 9 }}>
                                                            <table className="cell_data">
                                                                <tbody>
                                                                <tr>
                                                                    <th></th>
                                                                    <th className="team">球队</th>
                                                                    <th>场</th>
                                                                    <th>胜</th>
                                                                    <th>平</th>
                                                                    <th>负</th>
                                                                    <th>进/失</th>
                                                                    <th>积分</th>
                                                                </tr>
                                                                {
                                                                    this.state.scoreArr.length?
                                                                    this.state.scoreArr[this.state.index].map((team,j)=>{
                                                                        return (
                                                                            <tr key={`${team.rank}`}>
                                                                                <td>{j+1}</td>
                                                                                <td className="team">
                                                                                    <img src={team.team_logo} alt="" />
                                                                                    {team.team_name}
                                                                                </td>
                                                                                <td >{team.matches_total}</td>
                                                                                <td >{team.matches_won}</td>
                                                                                <td >{team.matches_draw}</td>
                                                                                <td >{team.matches_lost}</td>
                                                                                <td >{team.goals_pro}/{team.goals_against}</td>
                                                                                <td >{team.points}</td>
                                                                            </tr>
                                                                        )
                                                                    }):<tr></tr>
                                                                }
                                                                </tbody>
                                                            </table>
                                                        </Skeleton>
                                                        </div>
                                                        <div>
                                                            2
                                                        </div>
                                                        <div>
                                                            1
                                                        </div>
                                                        <div>
                                                            2
                                                        </div>
                                                    </Tabsm>
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

export default connect(mapStateToProps,mapActionToProps)(Data);