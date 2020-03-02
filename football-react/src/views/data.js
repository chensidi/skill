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

import { Tabs ,Skeleton,Row, Col } from 'antd';
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
            menuErr: false,
            seasonId: '',
            playerTypes: [],
            playerGolasArr: [],
            playerDataArr: []
        }
    }

    componentWillMount(){
        this.props.changeView(3);
        this.loadAllData();
    }

    componentDidMount(){
        console.log(window.innerHeight,
           
        )
    }

    callback = (key) => {
        console.log(key);
        let temp = key.split('_');
        this.setState({
            index: temp[0],
            seasonId: temp[2]
        })
        if(this.state.scoreArr[temp[0]].length > 0){
            this.setState({rankLoading:false});  
            return
        };
        this.loadRanking(temp[2]);
    }

    changeData = (tab,index) => {
        console.log(this.state.seasonId);
        if(index == 1){
            if(this.state.playerTypes.length > 0){
                this.changeType(this.state.playerTypes[0].type);
                return;
            }
            axios({
                url: `${this.props.api}/player?id=${this.state.seasonId}`,
                timeout: 15000
            }).then(res=>{
                console.log(res);
                if(res.status === 200){
                    let types = res.data.content.data;
                    types.map((obj)=>{
                        obj.title = obj.name
                    })
                    this.setState({
                        playerTypes: types
                    },()=>{
                        
                        let tempArr = this.state.playerDataArr;
                        tempArr.map((obj,i)=>{
                            let object = {}
                            types.map((item,j)=>{
                                object[item.type] = [];
                            })
                            obj.push(object);
                        })
                        this.setState({
                            playerDataArr: tempArr
                        },()=>{
                            // console.log(this.state.playerDataArr);
                            this.changeType(types[0].type);
                        })
                    })
                }
            })
        }
    }

    changeType = (type) => {
        // console.log(this.state.playerDataArr[this.state.index])
        if(this.state.playerDataArr[this.state.index][0][type].length > 0)return;
        axios({
            url: `${this.props.api}/playerdata?type=${type}&id=${this.state.seasonId}`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            if(res.status === 200){
                this.setState({
                    playerGolasArr: res.data.content.data
                })

                let tempObj = this.state.playerDataArr;
                tempObj[this.state.index][0][type] = res.data.content.data;
                this.setState({
                    playerDataArr: tempObj
                },()=>{
                    console.log(this.state.playerDataArr[this.state.index][0])
                })
            }
        })
    }

    loadRanking = (id) => {
        this.setState({rankLoading:true});  
        axios({
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
        axios({
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
                    let tempArr = [],
                        temp1Arr = [];
                    this.state.rankArr.map((obj,i)=>{
                        tempArr.push([]);
                        temp1Arr.push([]);
                    })
                    this.setState({
                        scoreArr: tempArr,
                        seasonId: this.state.rankArr[0].season_id,
                        playerDataArr: temp1Arr
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

    handleClick = e => {
        console.log('click ', e);
    };

    render(){
        
        const tabs = [
            { title: '积分榜' },
            { title: '球员榜' },
            { title: '球队榜' },
            { title: '赛程' },
          ];
        
        const tabss = [
            { title: '射门次数', key: 't1' },
            { title: '2 Tab', key: 't2' },
            { title: '3 Tab', key: 't3' },
            { title: '4 Tab', key: 't4' },
        ];

        return (
            <div className="main">
                <Top />
                <div className="data">
                <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            resolve();
                        }}
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
                                                    <Tabsm tabs={tabs} onChange={this.changeData}>
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
                                                        <div className="vertab">
                                                        <Row gutter={16}>
                                                            <Col span={7}>
                                                                <div className="leftbar ranktable">
                                                                {
                                                                    this.state.playerTypes.map((item,i)=>{
                                                                        return (
                                                                            <div className={["elp",i==-0?'on':''].join(' ')} key={`t${i}`}>
                                                                                {item.title}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                </div>
                                                            </Col>
                                                            <Col span={17}>
                                                                    <div className="match-table-list ranking-view ranktable">
                                                                        <table className="cell_data">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th >排名</th>
                                                                                    <th className="player">球员</th>
                                                                                    <th >球队</th>
                                                                                    <th >进球数</th>
                                                                                </tr>
                                                                                {
                                                                                    this.state.playerDataArr[this.state.index]&&
                                                                                    this.state.playerDataArr[this.state.index][0]&&
                                                                                    this.state.playerDataArr[this.state.index][0]['goals']&&
                                                                                    this.state.playerDataArr[this.state.index][0]['goals'].map((item,i)=>{
                                                                                        return (
                                                                                            <tr key={`goal${i}`}>
                                                                                                <td>{i+1}</td>
                                                                                                <td className="player">
                                                                                                    <img src={item.person_logo} />
                                                                                                    &nbsp;{item.person_name}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {item.team_name}
                                                                                                </td>
                                                                                                <td>{item.count}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                            </Col>
                                                        </Row>
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