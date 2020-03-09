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
import {Tabs as Tabsm,Button,Picker, List} from 'antd-mobile';



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
            teamTypes: [],
            playerGolasArr: [],
            playerDataArr: [],
            teamDataArr: [],
            scheduleArr: [],
            roundArr: [],
            typeIndex: 0,
            typeTeamIndex: 0,
            rankTypeLoading: true,
            rankTeamLoading: true,
            playerKey: false,
            teamKey: false,
            scheduleLoading: true,
            historrySeason: [],
            lastSeason: 'xxx',
            keyP: true,
            keyT: true,
            keyS: true
        }
    }

    componentWillMount(){
        this.props.changeView(3);
        this.loadAllData();
    }

    componentDidMount(){
        
    }

    callback = (key) => {
        console.log(key);
        let temp = key.split('_');
        this.setState({
            index: temp[0],
            seasonId: temp[2],
            lastSeason: temp[2],
            typeIndex: 0,
            keyP: true,
            keyT: true,
            keyS: true
        },()=>{
            this.loadHistory();
        })
        
        if(this.state.scoreArr[temp[0]].length > 0){
            this.setState({rankLoading:false});  
            return
        };
        this.loadRanking(temp[2]);
    }

    changeData = (tab,index) => {
        // console.log(this.state.seasonId);
        if(index === 1){
            // if(!this.state.keyP){
            //     this.changeType(this.state.playerTypes[0].type);
            //     return;
            // }
            axios({
                url: `${this.props.api}/player?id=${this.state.seasonId}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                if(res.status === 200){
                    let types = res.data.content.data;
                    types.map((obj)=>{
                        obj.title = obj.name
                    })
                    this.setState({
                        playerTypes: types,
                        // keyP: false
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
        }else if(index === 2){
            // if(!this.state.keyS){
            //     this.changeType(this.state.teamTypes[0].type);
            //     return;
            // }
            axios({
                url: `${this.props.api}/team?id=${this.state.seasonId}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                if(res.status === 200){
                    let types = res.data.content.data;
                    types.map((obj)=>{
                        obj.title = obj.name
                    })
                    this.setState({
                        teamTypes: types,
                        keyT: false
                    },()=>{
                        let tempArr = this.state.teamDataArr;
                        tempArr.map((obj,i)=>{
                            let object = {}
                            types.map((item,j)=>{
                                object[item.type] = [];
                            })
                            obj.push(object);
                        })
                        this.setState({
                            teamDataArr: tempArr
                        },()=>{
                            // console.log(this.state.teamDataArr)
                            this.changeTeamType(types[0].type);
                        })
                    })
                }
            })
        }else if(index === 3){
            this.loadSchedule();
        }
    }

    changeTeamType = (type) => {
        // if(!this.state.keyT){
        //     this.setState({rankTeamLoading: false,teamKey:true});
        //     return;
        // }
        this.setState({rankTeamLoading: true,teamKey:false});
        axios({
            url: `${this.props.api}/teamdata?type=${type}&id=${this.state.seasonId}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status === 200){
                this.setState({
                    rankTeamLoading: false
                })

                let tempObj = this.state.teamDataArr;
                tempObj[this.state.index][0][type] = res.data.content.data;
                this.setState({
                    teamDataArr: tempObj,
                    teamKey: true
                })
            }
        })
    }

    changeType = (type) => {
        // console.log(this.state.playerDataArr[this.state.index])
        // if(this.state.playerDataArr[this.state.index][0][type].length > 0 && !this.state.keyP){
        //     this.setState({rankTypeLoading: false,playerKey:true});
        //     return false;
        // }
        this.setState({rankTypeLoading: true,playerKey:false});
        axios({
            url: `${this.props.api}/playerdata?type=${type}&id=${this.state.seasonId}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status === 200){
                this.setState({
                    playerGolasArr: res.data.content.data,
                    rankTypeLoading: false,
                    keyP: false
                })

                let tempObj = this.state.playerDataArr;
                tempObj[this.state.index][0][type] = res.data.content.data;
                this.setState({
                    playerDataArr: tempObj,
                    playerKey: true
                })
            }
        })
    }

    changeDataType = (index) => {
        // let index = e.target.getAttribute('data-index');
        this.setState({
            typeIndex: parseInt(index)
        },()=>{
            let type = this.state.playerTypes[index].type;
            this.changeType(type);
        })
    }

    changeTeamDataType = (e) => {
        let index = e.target.getAttribute('data-index');
        this.setState({
            typeTeamIndex: parseInt(index)
        },()=>{
            let type = this.state.teamTypes[index].type;
            this.changeTeamType(type);
        })
    }

    loadHistory = () => {
        this.setState({
            historrySeason: []
        })
        axios({
            url: `${this.props.api}/noparams?url=${this.state.rankArr[this.state.index].season.url}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            if(res.status === 200){
                let arr = [];
                res.data.map((obj,i)=>{
                    obj.label = obj.season_name;
                    obj.value = i;
                    arr.push(obj);
                })
                this.setState({
                    historrySeason: arr
                })
            }
        })
    }

    loadRanking = (id) => {
        this.setState({rankLoading:true});  
        axios({
            url: `${this.props.api}/score?id=${id}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            this.setState({rankLoading:false});  
            if(res.status === 200){
                let prevScoreArr = this.state.scoreArr;
                prevScoreArr[this.state.index] = res.data.content.rounds[0].content.data
                this.setState({
                    scoreArr: prevScoreArr
                })
                this.loadHistory();
            }
            
        }).catch(err=>{
            this.setState({rankLoading:false});  
        })
        
        
    }

    loadSchedule = () => {
        // if(!this.state.keyS){
        //     this.setState({
        //         scheduleLoading: false
        //     })
        //     return false;
        // }
        this.setState({
            scheduleLoading: true
        })
        axios({
            url: `${this.props.api}/schedule?id=${this.state.seasonId}`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            this.setState({
                scheduleLoading: false,
                keyS: false
            })
            if(res.status === 200){
                let prevScheduleArr = this.state.scheduleArr;
                prevScheduleArr[this.state.index] = res.data.content.matches;
                let prevRound = this.state.roundArr;
                let arr = []
                res.data.content.rounds.map((obj,i)=>{
                    obj.label = obj.name;
                    obj.value = i;
                    arr.push(obj);
                })
                prevRound[this.state.index] = arr;
                this.setState({
                    scheduleArr: prevScheduleArr,
                    roundArr: prevRound
                })
            }
        })
    }

    loadRound = (params) => {
        let {gameweek,round_id,season_id} = params;
        axios({
            url: `${this.props.api}/round?gameweek=${gameweek}&roundId=${round_id}&seasonId=${season_id}`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            if(res.status === 200){
                let prevScheduleArr = this.state.scheduleArr;
                prevScheduleArr[this.state.index] = res.data.content.matches;
                let prevRound = this.state.roundArr;
                let arr = []
                res.data.content.rounds.map((obj,i)=>{
                    obj.label = obj.name;
                    obj.value = i;
                    arr.push(obj);
                })
                prevRound[this.state.index] = arr;
                this.setState({
                    scheduleArr: prevScheduleArr,
                    roundArr: prevRound
                })
            }
        })
    }

    changeSeason = (x) => {
        // console.log(x,this.state.historrySeason[x]);
        let lastSeason = this.state.seasonId;
        this.setState({
            lastSeason: lastSeason,
            seasonId: this.state.historrySeason[x].season_id,
            typeIndex: 0,
            typeTeamIndex: 0
        },()=>{
            this.loadRanking(this.state.seasonId);
        })
    }

    loadAllData = () => {
        axios({
            url: `${this.props.api}/home`,
            timeout: 15000
        }).then(res=>{
            // console.log(res);
            this.setState({
                menuLoading: false,
                menuErr: false
            })
            if(res.status === 200){
                this.setState({
                    rankArr: res.data.menus.ranking_new
                },()=>{
                    let tempArr = [],
                        temp1Arr = [],
                        temp2Arr = [],
                        temp3Arr = [],
                        temp4Arr = [];
                    this.state.rankArr.map((obj,i)=>{
                        tempArr.push([]);
                        temp1Arr.push([]);
                        temp2Arr.push([]);
                        temp3Arr.push([]);
                        temp4Arr.push([]);
                    })
                    this.setState({
                        scoreArr: tempArr,
                        seasonId: this.state.rankArr[0].season_id,
                        playerDataArr: temp1Arr,
                        teamDataArr: temp2Arr,
                        scheduleArr: temp3Arr,
                        roundArr: temp4Arr
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


    render(){
        
        const tabs = [
            { title: '积分榜' },
            { title: '球员榜' },
            { title: '球队榜' },
            { title: '赛程' },
          ];

        let playerDataArr = this.state.playerDataArr,
            stateIndex = this.state.index,
            playerTypes = this.state.playerTypes,
            typeIndex = this.state.typeIndex;
        
        let teamDataArr = this.state.teamDataArr,
            teamTypes = this.state.teamTypes,
            typeTeamIndex = this.state.typeTeamIndex;

        let pickers = [this.state.roundArr[stateIndex]];

        let curRound = 0;
        if(this.state.roundArr[stateIndex]&&this.state.roundArr[stateIndex].length > 0){
            for(let i = 0;i < this.state.roundArr[stateIndex].length; i ++){
                let r = this.state.roundArr[stateIndex][i];
                if(r.current === true){
                    curRound = [i];
                    break;
                }
            }
        }

        let pickersSeason = [this.state.historrySeason];
        const seasons = [
            [
              {
                label: '2013',
                value: '2013',
              },
              {
                label: '2014',
                value: '2014',
              },
            ],
            [
              {
                label: '春',
                value: '春',
              },
              {
                label: '夏',
                value: '夏',
              },
            ],
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
                                                    <Tabsm tabs={tabs} onChange={this.changeData} animated={false} initialPage={0}>
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
                                                            <Picker
                                                                data={pickersSeason}
                                                                title="选择赛季"
                                                                cascade={false}
                                                                extra="请选择(可选)"
                                                                value={this.state.sValue}
                                                                onOk={v => this.changeSeason(v[0])}
                                                            >
                                                                <List.Item arrow="horizontal">Multiple</List.Item>
                                                            </Picker>
                                                        </Skeleton>
                                                        </div>
                                                        <div className="vertab">
                                                        <Row gutter={4}>
                                                            <Col span={7}>
                                                                <div className="leftbar ranktable">
                                                                {
                                                                    this.state.playerTypes.map((item,i)=>{
                                                                        return (
                                                                            <div onClick={()=>{this.changeDataType(i)}} data-index={i} className={["elp",i===this.state.typeIndex?'on':''].join(' ')} key={`t${i}`}>
                                                                                {item.title}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                </div>
                                                            </Col>
                                                            <Col span={17}>
                                                                <Skeleton loading={this.state.rankTypeLoading} active avatar paragraph={{ rows: 9 }}>
                                                                <div className="match-table-list ranking-view ranktable">
                                                                    <table className="cell_data">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th >排名</th>
                                                                                <th className="player">球员</th>
                                                                                <th >球队</th>
                                                                                <th >总计</th>
                                                                            </tr>
                                                                            {
                                                                                this.state.playerKey?
                                                                                playerDataArr[stateIndex][0][playerTypes[typeIndex].type].map((item,i)=>{
                                                                                    return (
                                                                                        <tr key={`goal${i}`}>
                                                                                            <td>{item.rank}</td>
                                                                                            <td className="player">
                                                                                                <LazyLoadImage
                                                                                                    src={item.person_logo} 
                                                                                                    placeholderSrc={lazy}
                                                                                                />
                                                                                                &nbsp;{item.person_name}
                                                                                            </td>
                                                                                            <td>
                                                                                                {item.team_name}
                                                                                            </td>
                                                                                            <td>{item.count}</td>
                                                                                        </tr>
                                                                                    )
                                                                                }):<tr></tr>

                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                </Skeleton>
                                                            </Col>
                                                        </Row>
                                                        </div>
                                                        <div className="vertab">
                                                        <Row gutter={16}>
                                                            <Col span={7}>
                                                                <div className="leftbar ranktable">
                                                                {
                                                                    this.state.teamTypes.map((item,i)=>{
                                                                        return (
                                                                            <div onClick={this.changeTeamDataType} data-index={i} className={["elp",i===this.state.typeTeamIndex?'on':''].join(' ')} key={`team${i}`}>
                                                                                {item.title}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                </div>
                                                            </Col>
                                                            <Col span={17}>
                                                                <Skeleton loading={this.state.rankTeamLoading} active avatar paragraph={{ rows: 9 }}>
                                                                <div className="match-table-list ranking-view ranktable">
                                                                    <table className="cell_data">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th className="teamrank">排名</th>
                                                                                <th>球队</th>
                                                                                <th >总计</th>
                                                                            </tr>
                                                                            {
                                                                                this.state.teamKey&&
                                                                                teamDataArr[stateIndex][0][teamTypes[typeTeamIndex].type].map((item,i)=>{
                                                                                    return (
                                                                                        <tr key={`team${i}`}>
                                                                                            <td>{item.rank}</td>
                                                                                            <td className="team">
                                                                                                <LazyLoadImage
                                                                                                    src={item.team_logo} 
                                                                                                    placeholderSrc={lazy}
                                                                                                />
                                                                                                &nbsp;{item.team_name}
                                                                                            </td>
                                                                                            <td>{item.count}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                </Skeleton>
                                                            </Col>
                                                        </Row>
                                                        </div>
                                                        <div>
                                                        <Skeleton loading={this.state.scheduleLoading} active avatar paragraph={{ rows: 9 }}>
                                                            <div className="ranking-view">
                                                                <div className="schedule-table">
                                                                <ul className="activeRound">
                                                                    <li>
                                                                        <a href="#" className="prev">上一轮</a>
                                                                    </li>
                                                                        <li className="name">第{curRound[0]+1}轮</li>
                                                                    <li>
                                                                        <a href="#" className="next">下一轮</a>
                                                                    </li>
                                                                </ul>
                                                                <table className="cell_data">
                                                                    <tbody>
                                                                        {
                                                                            this.state.scheduleArr[stateIndex]&&
                                                                            this.state.scheduleArr[stateIndex].map((item,i)=>{
                                                                                return (
                                                                                    <tr key={`schedule${i}`}>
                                                                                        <td>{item.start_play}</td>
                                                                                        <td className="name_r">
                                                                                            {item.team_A_name}<img src={item.team_A_logo} />
                                                                                        </td>
                                                                                        <td>{item.status==='Played'?(item.score_A + ':' + item.score_B):'VS'}</td>
                                                                                        <td className="name_l" >
                                                                                            <img src={item.team_B_logo} />
                                                                                            {item.team_B_name}
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                                </div>
                                                            </div>
                                                            <Picker
                                                            data={pickers}
                                                            title="选择季节"
                                                            cascade={false}
                                                            extra="请选择(可选)"
                                                            value={curRound}
                                                            onOk={v => {
                                                                let tempRound = this.state.scheduleArr;
                                                                tempRound[stateIndex] = this.state.roundArr[stateIndex][v[0]]
                                                                let params = this.state.roundArr[stateIndex][v[0]].params;
                                                                this.loadRound(params)
                                                                // this.setState({
                                                                //     scheduleArr: tempRound
                                                                // })
                                                            }}
                                                            >
                                                            <List.Item arrow="horizontal">选择比赛周</List.Item>
                                                            </Picker>
                                                        </Skeleton>
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