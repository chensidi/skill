<template>
    <div>
        <van-nav-bar
            fixed
            :z-index='1001'
        >
            <van-icon name="arrow-left" slot="left" color='#399e5c' @click="$router.history.go(-1)"  />
        </van-nav-bar>
        <div class="matchwrap">
            <div class="matchd-head">
                <div class="head-a">
                    <img :src="highlight?highlight.match.team_A.logo:''" alt="">
                    <p>{{team_A.name}}</p>
                </div>
                <div class="head-c">
                    <p>
                    <!-- {{highlight?highlight.match.start_play:''}} -->
                    {{highlight?highlight.match.competition.short_name:''}}
                </p>
                <p class="spec">{{highlight?highlight.match.team_A.fs:''}} {{highlight?(highlight.match.status=='Played'?'-':'VS'):''}} {{highlight?highlight.match.team_B.fs:''}}</p><p>{{highlight?(highlight.match.status=='Played'?'已结束':'未开始'):''}}</p>
                </div>
                <div class="head-b">
                    <img :src="highlight?highlight.match.team_B.logo:''">
                    <p>{{team_B.name}}</p>
                </div>
            </div>
            <van-tabs v-model="active" sticky animated color='#16b13a' title-active-color='#16b13a' :offset-top='46'>
                <van-tab title="赛况">
                    <div class="match_tab" v-show="active=='0'">
                        <h3 class="matchd-title">事件</h3>
                        <van-steps direction="vertical" :active="90">
                            <van-step v-for="(item,key) in events" :key="key">
                                <p>{{item.minute+"'"}}<img :src="item.teamAEvents.length?team_A.logo:team_B.logo" class="ev_icon" /></p>
                                <p v-for="items of item.teamAEvents" :key="items.person_id">
                                    <span>{{items.person}}</span>
                                    <img :src="items.event_pic" alt="" class="ev_icon">
                                </p>
                                <p v-for="items of item.teamBEvents" :key="items.person_id">
                                    <span>{{items.person}}</span>
                                    <img :src="items.event_pic" alt="" class="ev_icon">
                                </p>
                            </van-step>
                        </van-steps>
                        <div class="icon_tips">
                            <div>
                                <img src="../../static/img/goal.png" alt="">
                                <span>进球</span>
                            </div>
                            <div>
                                <img src="../../static/img/point.png" alt="">
                                <span>点球</span>
                            </div>
                            <div>
                                <img src="../../static/img/lose.png" alt="">
                                <span>失点</span>
                            </div>
                            <div>
                                <img src="../../static/img/wulong.png" alt="">
                                <span>乌龙</span>
                            </div>
                            <div>
                                <img src="../../static/img/help.png" alt="">
                                <span>助攻</span>
                            </div>
                        </div>
                        <h3 class="matchd-title">技术统计</h3>
                        <div class="teamvs">
                            <div class="teamA">
                                <span>{{team_A.name}}</span>
                                <img :src="highlight?highlight.match.team_A.logo:''" alt="">
                            </div>
                            <div class="teamB">
                                <img :src="highlight?highlight.match.team_B.logo:''" alt="">
                                <span>{{team_B.name}}</span>
                            </div>
                        </div>
                        <div class="statics" v-for="item of statistics" :key="item.type">
                            <div class="teamA">
                                {{item.team_A.value}}
                                <div class="rot">
                                    <van-progress
                                        :percentage="item.team_A.per"
                                        color='#16b13a'
                                        :inactive='item.team_A.class!=""'
                                        :show-pivot='false'
                                    />
                                </div>
                            </div>
                            <div class="statics_type">{{item.type}}</div>
                            <div class="teamB">
                                {{item.team_B.value}}
                                <van-progress
                                        :percentage="item.team_B.per"
                                        color='#16b13a'
                                        :inactive='item.team_B.class!=""'
                                        :show-pivot='false'
                                />
                                
                            </div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="阵容">
                    <div class="match_tab" v-show="active=='1'">
                        <h3  class="matchd-title">首发</h3>
                        <div class="teamvs">
                            <div class="teamA">
                                <span>{{team_A.name}}</span>
                                <img :src="highlight?highlight.match.team_A.logo:''" alt="">
                            </div>
                            <div class="teamB">
                                <img :src="highlight?highlight.match.team_B.logo:''" alt="">
                                <span>{{team_B.name}}</span>
                            </div>
                        </div>
                        <div class="teamvs" v-for="(item,i) of lineup" :key="i">
                            <div class="teamA">
                                <span class="elp">{{item.team_A.person}}</span>
                                <img :src="item.team_A.person_logo" alt="">
                            </div>
                            <div class="teamB">
                                <img :src="item.team_B.person_logo" alt="">
                                <span class="elp">{{item.team_B.person}}</span>
                            </div>
                        </div>
                        <h3  class="matchd-title">替补</h3>
                        <div class="teamvs" v-for="(item,j) of sub" :key="'s'+j">
                            <div class="teamA">
                                <span class="elp">{{item.team_A.person}}</span>
                                <img :src="item.team_A.person_logo" alt="">
                            </div>
                            <div class="teamB">
                                <img :src="item.team_B.person_logo" alt="">
                                <span class="elp">{{item.team_B.person}}</span>
                            </div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="分析">
                    <div class="match_tab" v-show="active=='2'">
                        <h3 class="matchd-title">对往战绩</h3>
                        <div class="record-head">
                            <div class="record-title">
                                <span>{{team_A.name}}</span>
                                <span>近5场交锋记录</span>
                                <span>{{team_B.name}}</span>
                            </div>
                            <div class="record-line">
                                <span class="wins" :style="{flex:battle_history?(battle_history.team_A.win==0?1:battle_history.team_A.win):''}">{{battle_history?battle_history.team_A.win:''}}胜</span>
                                <span class="draws" :style="{flex:battle_history?(battle_history.team_A.draw==0?1:battle_history.team_A.draw):''}">{{battle_history?battle_history.team_A.draw:''}}平</span>
                                <span class="loses" :style="{flex:battle_history?(battle_history.team_B.win==0?1:battle_history.team_B.win):''}">{{battle_history?battle_history.team_B.win:''}}胜</span>
                            </div>
                        </div>
                        <table  class="table table-record">
                            <thead >
                                <tr  class="first">
                                    <th  width="15%">日期</th>
                                    <th  width="15%">赛事</th>
                                    <th  width="27.5%">主队</th>
                                    <th  width="15%">比分</th>
                                    <th  width="27.5%">客队</th>
                                    </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item) of battle_tab" :key="item.date">
                                    <td  class="first">
                                    {{item.date}} <br >
                                    {{item.year}}
                                    </td>
                                    <td  class="td-hide race">{{item.competition}}</td>
                                    <td  :class="['td-hide','name',item.main_team=='team_A'?item.color:'']">{{item.team_A_name}}
                                    </td>
                                    <td >
                                        <span :class="['table-score',item.color]">{{item.score}}
                                        </span>
                                    </td>
                                    <td  :class="['td-hide','name',item.main_team=='team_B'?item.color:'']">{{item.team_B_name}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div  class="analysis-team"><img :src="team_A.logo"><span >{{team_A.name}}</span></div>
                        <table  class="table table-record">
                            <thead >
                                <tr  class="first">
                                    <th  width="15%">日期</th>
                                    <th  width="15%">赛事</th>
                                    <th  width="27.5%">主队</th>
                                    <th  width="15%">比分</th>
                                    <th  width="27.5%">客队</th>
                                    </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item) of recent_A" :key="item.date">
                                    <td  class="first">
                                    {{item.date}} <br >
                                    {{item.year}}
                                    </td>
                                    <td  class="td-hide race">{{item.competition}}</td>
                                    <td  :class="['td-hide','name',item.main_team=='team_A'?item.color:'']">{{item.team_A_name}}
                                    </td>
                                    <td >
                                        <span :class="['table-score',item.color]">{{item.score}}
                                        </span>
                                    </td>
                                    <td  :class="['td-hide','name',item.main_team=='team_B'?item.color:'']">{{item.team_B_name}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div  class="analysis-team"><img :src="team_B.logo"><span >{{team_B.name}}</span></div>
                        <table  class="table table-record">
                            <thead >
                                <tr  class="first">
                                    <th  width="15%">日期</th>
                                    <th  width="15%">赛事</th>
                                    <th  width="27.5%">主队</th>
                                    <th  width="15%">比分</th>
                                    <th  width="27.5%">客队</th>
                                    </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item) of recent_B" :key="item.date">
                                    <td  class="first">
                                    {{item.date}} <br >
                                    {{item.year}}
                                    </td>
                                    <td  class="td-hide race">{{item.competition}}</td>
                                    <td  :class="['td-hide','name',item.main_team=='team_A'?item.color:'']">{{item.team_A_name}}
                                    </td>
                                    <td >
                                        <span :class="['table-score',item.color]">{{item.score}}
                                        </span>
                                    </td>
                                    <td  :class="['td-hide','name',item.main_team=='team_B'?item.color:'']">{{item.team_B_name}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>   
                        <div class="matchd-title">联赛积分榜</div>
                        <div  class="analysis-team"><img :src="team_A.logo"><span >{{team_A.name}}</span></div>
                        <table class="table table-color">
                            <thead>
                                <tr class="first">
                                    <th width="12%">全场</th>
                                    <th width="10%">赛</th>
                                    <th  width="9%">胜</th>
                                    <th  width="9%">平</th>
                                    <th  width="9%">负</th>
                                    <th  width="10%">得</th>
                                    <th  width="10%">失</th>
                                    <th  width="9%">积分</th>
                                    <th  width="10%">排名</th>
                                    <th  width="12%">胜率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item of league_table_A" :key="item.win_rate">
                                    <td >{{item.name}}</td>
                                    <td >{{item.matches_total}}</td>
                                    <td >{{item.matches_won}}</td>
                                    <td >{{item.matches_draw}}</td>
                                    <td >{{item.matches_lost}}</td>
                                    <td >{{item.goals_pro}}</td>
                                    <td >{{item.goals_against}}</td>
                                    <td >{{item.points}}</td>
                                    <td >{{item.rank}}</td>
                                    <td >{{item.win_rate}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div  class="analysis-team"><img :src="team_B.logo"><span >{{team_B.name}}</span></div>
                        <table class="table table-color">
                            <thead>
                                <tr class="first">
                                    <th width="12%">全场</th>
                                    <th width="10%">赛</th>
                                    <th  width="9%">胜</th>
                                    <th  width="9%">平</th>
                                    <th  width="9%">负</th>
                                    <th  width="10%">得</th>
                                    <th  width="10%">失</th>
                                    <th  width="9%">积分</th>
                                    <th  width="10%">排名</th>
                                    <th  width="12%">胜率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item of league_table_B" :key="item.win_rate">
                                    <td >{{item.name}}</td>
                                    <td >{{item.matches_total}}</td>
                                    <td >{{item.matches_won}}</td>
                                    <td >{{item.matches_draw}}</td>
                                    <td >{{item.matches_lost}}</td>
                                    <td >{{item.goals_pro}}</td>
                                    <td >{{item.goals_against}}</td>
                                    <td >{{item.points}}</td>
                                    <td >{{item.rank}}</td>
                                    <td >{{item.win_rate}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </van-tab>
                <van-tab title="集锦">
                    <div class="match_tab" v-show="active=='3'">
                        <h3  class="matchd-title">战报</h3>
                        <div class="hlights-report">
                            <p>{{highlight?highlight.info.content:''}}</p>
                        </div>
                        <h3  class="matchd-title">gif集合</h3>
                        <div class="hlights-gif clearfix">
                            <div class="gif-item" v-for="(item) of gifArr" :key="item.id">
                                <img :src="item.thumb" @click="readyView" alt="">
                                <p>{{item.title}}</p>
                                <div class="gif-foot clearfix">
                                    <span class="gif-left">{{item.time+"'"}}</span>
                                    <span class="gif-right">{{item.comments_total+'评论'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import {mapGetters} from 'vuex';
import { ImagePreview } from 'vant';
import Vue from 'vue';

Vue.use(ImagePreview);
export default {
    name: 'Details',
    data(){
        return{
            active: 3,
            mid: this.$route.params.mid,
            highlight: null,
            gifArr: [],
            imgArr: [],
            lineup: [],
            sub: [],
            battle_tab: [],
            recent_A: [],
            recent_B: [],
            team_A: {},
            team_B: {},
            battle_history: null,
            league_table_A: [],
            league_table_B: [],
            events: [],
            statistics: []
        }
    },
    created(){
        $.post(`${this.getMyApi}/highlight`,{match_id:this.mid}).then(dt=>{
            if(dt.code == 200){
                let result = JSON.parse(dt.result);
                // console.log(result);
                this.highlight = result;
                this.gifArr = result.info.gifCollection;
                result.info.gifCollection.map(obj=>{
                    this.imgArr.push(obj.thumb);
                })
            }
        })

        $.post(`${this.getMyApi}/lineup`,{match_id:this.mid}).then(dt=>{
            if(dt.code == 200){
                let result = JSON.parse(dt.result);
                // console.log(result);
                this.lineup = result.info.lineup;
                this.sub = result.info.sub;
            }
        })

        $.post(`${this.getMyApi}/analysis`,{match_id:this.mid}).then(dt=>{
            if(dt.code == 200){
                let result = JSON.parse(dt.result);
                this.battle_tab = result.info.battle_history.list;
                this.recent_A = result.info.recent_record.team_A;
                this.recent_B = result.info.recent_record.team_B;
                this.team_A = {name:result.info.team_A,logo:result.info.team_A_logo};
                this.team_B = {name:result.info.team_B,logo:result.info.team_B_logo};
                this.battle_history = result.info.battle_history;
                this.league_table_A = result.info.league_table.team_A;
                this.league_table_B = result.info.league_table.team_B;
            }
        })

        $.post(`${this.getMyApi}/situation`,{match_id:this.mid}).then(dt=>{
            if(dt.code == 200){
                let result = JSON.parse(dt.result);
                console.log(result);
                this.events = result.info.events;
                this.statistics = result.info.statistics.list;
            }
        })
    },
    methods: {
        readyView(){
            ImagePreview(this.imgArr);
        }
    },
    computed: {
        ...mapGetters(['getMyApi'])
    }
}
</script>
<style scoped>
    .matchwrap{
        margin-top: 46px;
        margin-bottom: 50px;
    }
    .matchd-head{
        position: relative;
        height: 8.75rem;
        background: url(../../static/img/mbg.jpg) no-repeat;
        background-size: 100% auto;
        color: #fff;
    }
    .head-a,.head-b{
        float: left;
        padding-left: 2.5rem;
        padding-top: 2.5rem;
    }
    .head-b{
        float: right;
        padding-right: 2.5rem;
        padding-left: 0;
    }
    .head-c{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: 3.25rem;
    }
    .head-a img,.head-b img{
        display: block;
        width: 3.4375rem;
        height: 3.4375rem;
        margin: 0 auto !important;
    }
    .head-a p, .head-b p{
        font-size: .75rem;
        line-height: 1;
        margin-top: .625rem !important;
        text-align: center;
    }
    .head-c p{
        font-size: .75rem;
        line-height: 1;
        text-align: center;
    }
    .head-c p.spec{
        font-size: 1.375rem;
        margin: .46875rem 0 .625rem !important;
    }
    .match_tab{
        padding: .78125rem .625rem 1.125rem;
    }
    .matchd-title {
        line-height: 1.875rem;
        height: 1.875rem;
        padding-left: .75rem;
        font-size: .875rem;
        background: #e8e8e8;
        font-weight: 700;
    }
    .hlights-report{
        /* background: #f5f5f5; */
        padding: .78125rem .625rem 1.125rem;
    }
    .hlights-report p{
        line-height: 1.5625rem;
        font-size: .9375rem;
    }
    .hlights-gif{
        padding: .625rem;
        padding-right: .3125rem;
        background: #f5f5f5;
    }
    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }   
    .gif-item{
        position: relative;
        display: block;
        float: left;
        width: 49%;
        margin: 0 1% .46875rem 0;
        background: #fff;
    }
    .gif-item img{
        display: block;
        width: 100%;
        height: 8.375rem;
    }
    .gif-item p{
        padding: 0 .9375rem 0 .5rem;
        height: 2rem;
        margin-top: .375rem;
        line-height: 1rem;
        font-size: .75rem;
        overflow: hidden;
        color: #333;
    }
    .gif-foot{
        padding: .5625rem .5rem;
        line-height: 1;
        font-size: .75rem;
    }
    .gif-foot .gif-left{
        float: left;
        color: #16ac3a;
    }
    .gif-foot .gif-right{
        float: right;
        color: #999;
    }
    .teamvs{
        display: flex;
        align-items: center;
        line-height: 2.5rem;
        font-size: .75rem;
        /* background: #f2f2f2; */
    }
    .teamA,.teamB{
        flex: 1;
        text-align: right;
        padding-right: 1.875rem;
    }
    .teamB{
        text-align: left;
        padding-left: 1.875rem;
        padding-right: 0;
    }
    .teamA span,.teamB span{
        margin: 0 .625rem;
    }
    .teamA img,.teamB img{
        display: inline-block;
        width: 1.5625rem;
        height: 1.5625rem;
        margin-top: .46875rem;
        vertical-align: top;
    }
    .record-title{
        position: relative;
        height: .75rem;
        margin-bottom: .625rem;
        font-size: .75rem;
        line-height: 1;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
    }
    .record-title span{
        /* flex: 1; */
        /* text-align: center; */
    }
    .record-head{
        padding: .9375rem .75rem;
        background: #f7f7f7;
    }
    .record-line{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .record-line span{
        line-height: 1.875rem;
        font-size: .75rem;
        box-sizing: border-box;
        color: #fff;
        /* padding-left: .625rem; */
        text-align: center;
    }
    .wins{
        background: #f12b2b;
    }
    .draws{
        background: #16ac3a;
    }
    .loses{
        background: #1d9ff9;
    }
    span.win{
        background: #f12b2b;
    }
    span.draw{
        background: #16ac3a;
    }
    span.lose{
        background: #1d9ff9;
    }
    .table{
        width: 100%;
        font-size: .75rem;
    }
    .table tr.first{
        border-top: 1px solid #e8e8e8;
    }
    .table tr.first{
        line-height: 2rem;
        border-top: none;
        color: #888;
    }
    .table tr{
        line-height: 2.25rem;
        background: #f7f7f7;
        border-top: 1px solid #e8e8e8;
    }
    .table td.first{
        line-height: .625rem;
        font-size: .5625rem;
        color: #888;
    }

    .table td, .table th{
        text-align: center;
        font-weight: 400;
    }

    .table td.td-hide.race{
        max-width: 3.51562rem;
    }

    .table td.td-hide{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .table td.td-hide.name{
        max-width: 6.44531rem;
    }

    .table td.win{
        color: #f12b2b;
    }

    .table-score.win[data-v-a72ef5ac] {
        background: #f12b2b;
    }

    .table-score {
        display: inline-block;
        width: 2.1875rem;
        line-height: 1.125rem;
        color: #fff;
        border-radius: .125rem;
    }
    .table-score.lose{
        background: #1d9ff9;
    }
    .table td.lose{
        color: #1d9ff9;
    }
    .table td.draw{
        color: #49c867;
    }
    .table-score.draw{
        background: #49c867;
    }
    .analysis-team{
        font-size: 0;
        padding-left: .75rem;
        background: #f2f2f2;
    }
    .analysis-team img{
        display: inline-block;
        width: 1.5625rem;
        height: 1.5625rem;
        margin-top: .46875rem;
        vertical-align: top;
    }
    .analysis-team span{
        line-height: 2.5rem;
        font-size: .75rem;
        margin-left: .625rem;
    }
    .ev_icon{
        display: inline-block;
        width: .875rem;
        height: .875rem;
    }  
    .icon_tips{
        display: flex;
        align-items: center;
    }
    .icon_tips div{
        flex: 1;
        line-height: 2.5rem;
        text-align: center;
        /* font-size: 0; */
        background: #f2f2f2;
    }
    .icon_tips img{
        width: .75rem;
        height: .75rem;
    }
    .rot{
        transform: rotate(180deg);
    }
    .statics{
        display: flex;
        align-items: center;
        margin-top: 1.25rem;
        justify-content: space-between;
    }
    .statics .teamA, .statics .teamB{
        flex: 3;
        padding: 0;
    }
    .statics_type{
        flex: 3;
        text-align: center;
    }
</style>