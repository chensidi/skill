<template>
    <div class="data_wrap">
        <Head />
        <Menu :menu='menu' @newapi='reload' />
        <div class="ranking-view">
            <div class="data_box">
                <van-tabs type="card"
                    background='#000'
                    title-active-color='#fff'
                    title-inactive-color='#999'
                    color='#000'
                    @click="switchData"
                    v-model="index"
                    :offset-top="80"
                    animated
                >
                    <van-tab title="积分">
                        <div class="data_tab">
                            <table  class="cell_data">
                                <tbody >
                                    <tr >
                                        <th >
                                        </th>
                                        <th v-for="(item,i) of header" :key="'s'+item" :class="{'team':i==0}">{{item}}</th>
                                    </tr>
                                    <tr v-for="item of ranks" :key="'s'+item.rank">
                                        <td :class="{'top':item.rank<=4}">{{item.rank}}</td>
                                        <td class="team">
                                            <img :src="item.team_logo">
                                            {{item.team_name}}
                                        </td>
                                        <td >{{item.matches_total}}</td>
                                        <td >{{item.matches_won}}</td>
                                        <td >{{item.matches_draw}}</td>
                                        <td >{{item.matches_lost}}</td>
                                        <td >{{item.goals_pro}}/{{item.goals_against}}</td>
                                        <td >{{item.points}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        <Loading :loaded='loadover' />
                        </div>

                    </van-tab>
                    <van-tab title="球员榜">
                        <div class="data_tab clearfix">
                            <div class="aside">
                                <Imenu theme="dark" width='110px' @on-select='changeType'>
                                        <MenuItem :name="i" v-for="(item,i) of sideMenu" :key="'p'+item.name">
                                            {{item.name}}
                                        </MenuItem>
                                </Imenu>
                            </div>
                            <div class="rank_rable">

                                <div class="">
                                    <table class="cell_data">
                                        <tbody >
                                            <tr >
                                                <th>球员</th>
                                                <th>球队</th>
                                            </tr>
                                            <tr v-for="item of ranks2" :key="item.person_logo">
                                                <!-- <td :class="{'top':item.rank<=4}">{{item.rank}}</td> -->
                                                <td class="team">
                                                    {{item.rank}}
                                                    <img :src="item.person_logo"><span>{{item.person_name}}</span>
                                                    <em>{{item.count}}</em>
                                                </td>
                                                <td class="team_name">{{item.team_name}}</td>
                                                <!-- <td >{{item.count}}</td> -->
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Loading :loaded='loadover' />
                        </div>
                    </van-tab>
                    <van-tab title="球队榜">
                        <div class="data_tab clearfix">
                            <div class="aside">
                                <Imenu theme="dark" width='110px' @on-select='changeType'>
                                        <MenuItem :name="i" v-for="(item,i) of sideMenu" :key="'c-'+i">
                                            {{item.name}}
                                        </MenuItem>
                                </Imenu>
                            </div>
                            <div class="rank_rable">

                                <div class="">
                                    <table class="cell_data">
                                        <tbody >
                                            <tr>
                                                <th></th>
                                                <th v-for="(item,i) of header2" :key="item" :class="{'team':i==0}">{{item}}</th>
                                            </tr>
                                            <tr v-for="(item,i) of ranks2" :key="'t-'+i">
                                                <td>{{item.rank}}</td>
                                                <td class="team">
                                                    <img :src="item.team_logo">
                                                    {{item.team_name}}
                                                </td>
                                                <td>{{item.count}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Loading :loaded='loadover' />
                        </div>
                    </van-tab>
                    <van-tab title="赛程">
                        <div class="data_tab">
                            <div class="activeRound">
                                <div>prev</div>
                                <div @click="fruitPickerShow = true">{{roundsName}}</div>
                                <div></div>
                            </div>
                            <table  class="cell_data">
                                <tbody >
                                    
                                    <tr v-for="item of schedule_list" :key="'m'+item.match_id">
                                        <td>{{item.start_play}}</td>
                                        <td>
                                            <img :src="item.team_A_logo">
                                            <span class="schedule_team">{{item.team_A_name}}</span>
                                        </td>
                                        <td>{{item.status=='Played'?item.fs_A+':'+item.fs_B:'vs'}}</td>
                                        <td>
                                            <img :src="item.team_B_logo">
                                            <span class="schedule_team">{{item.team_B_name}}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        
                            <wv-picker
                                :visible.sync="fruitPickerShow"
                                :columns="fruitColumns"
                                value-key="name"
                                @confirm="confirmPerson"
                                @change="changeSchedule"
                            />
                            <Loading :loaded='loadover' />
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>


    </div>
</template>
<script>
import 'iview/dist/styles/iview.css'
import {mapActions,mapGetters} from 'vuex'
import Head from '../components/head'
import Menu from '../components/menu'
import $ from 'jquery'
import {Menu as Imenu,MenuGroup,MenuItem,Icon} from 'iview'
import Loading from '../components/loading'

// import Vue from 'vue'
// Vue.use(iview)

export default {
    name: 'Data',
   
    created(){
        this.score_rank();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    components: {Head,Menu,Imenu,MenuGroup,MenuItem,Icon,Loading},
    methods: {
        ...mapActions(['setState']),
        reload(api,idx){
            console.log(api);
            this.changeLeague = true;
            this.league = api;
            this.index = 0;
            this.score_rank();
        },
        onChange(key) {
            this.activeKey = key;
        },
        changeSchedule(picker, value){
            this.$nextTick(() => {
                console.log(picker.getValues())
                this.schedule_url = picker.getValues()[0].url;
                this.schedule_name = picker.getValues()[0].name;
            })
        },
        confirmPerson(){
            this.loadover = false;
            this.roundsName = this.schedule_name;
            $.post(`${this.getMyApi}/data_ranking`,{url:this.schedule_url}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    this.schedule_list = [];
                    this.schedule_list = result.content.matches;
                    setTimeout(()=>{
                        this.loadover = true;
                    },1000)
                }
            })
        },
        score_rank(){
            this.loadover = false;
            $.post(`${this.getMyApi}/ranking`,{league_id:this.league}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    this.header = [];
                    this.ranks = [];
                    this.header = result.content.rounds[0].content.header;
                    this.ranks = result.content.rounds[0].content.data;
                    setTimeout(()=>{
                        this.loadover = true;
                    },1000)
                }
            })
        },
        person_rank(){
            this.loadover = false;
            $.post(`${this.getMyApi}/person_ranking`,{league_id:this.league}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    // console.log(result);
                    this.sideMenu = result.content.data;
                    $.post(`${this.getMyApi}/data_ranking`,{url:result.content.data[0].url}).then(dt=>{
                        if(dt.code == 200){
                            let result = JSON.parse(dt.result);
                            console.log(result);
                            this.header2 = [];
                            this.ranks2 = [];
                            this.header2 = result.content.header;
                            this.ranks2 = result.content.data;
                            setTimeout(()=>{
                                this.loadover = true;
                            },1000)
                        }
                    })
                }
            }) 
        },
        team_ranking(){
            this.loadover = false;
            $.post(`${this.getMyApi}/team_ranking`,{league_id:this.league}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    // console.log(result);
                    this.sideMenu = result.content.data;
                    $.post(`${this.getMyApi}/data_ranking`,{url:result.content.data[0].url}).then(dt=>{
                        if(dt.code == 200){
                            let result = JSON.parse(dt.result);
                            console.log(result);
                            this.header2 = [];
                            this.ranks2 = [];
                            this.header2 = result.content.header;
                            this.ranks2 = result.content.data;
                            setTimeout(()=>{
                                this.loadover = true;
                            },1000)
                        }
                    })
                }
            }) 
        },
        schedule_ranking(){
            this.loadover = false;
            $.post(`${this.getMyApi}/schedule`,{league_id:this.league}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    console.log(result)
                    this.schedule_list = [];
                    this.all_schedule = [];
                    this.schedule_list = result.content.matches;
                    // this.all_schedule = result.content.rounds;
                    let temp = []
                    for(let i = 0; i < result.content.rounds.length; i ++){
                        let obj = result.content.rounds[i];
                        temp.push({name:obj.name,round_id:obj.params.round_id,url:obj.url})
                        if(obj.current){
                            this.roundsName = obj.name;
                            // this.fruitColumns[0].defaultIndex = i;
                        }
                    }
                    this.fruitColumns[0].values = [];
                    this.fruitColumns[0].values = temp;
                    

                    setTimeout(()=>{
                        this.loadover = true;
                    },1000)
                    // result.content.rounds.map((obj,i)=>{
                    //     console.log(obj)
                    //     this.fruitColumns.values.push({name:obj.name,round_id:obj.params.round_id,url:obj.url})
                    // })
                }
            })
        },
        switchData(index,title){
            if(this.last == index && !this.changeLeague)return;
            this.last = index;
            this.changeLeague = false;
            if(index == 0){
                this.score_rank();
            }else if(index == 1){
                this.person_rank();
            }else if(index == 2){
                this.team_ranking();
            }else{
                this.schedule_ranking();
            }
        },
        changeType(key){
            console.log(this.sideMenu[key].url);
            this.loadover = false;
            $.post(`${this.getMyApi}/data_ranking`,{url:this.sideMenu[key].url}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    console.log(result);
                    this.header2 = [];
                    this.ranks2 = [];
                    this.header2 = result.content.header;
                    this.ranks2 = result.content.data;
                    setTimeout(()=>{
                        this.loadover = true;
                    },1000)
                }
            })

        }
    },
    data(){
        return{
            header: [],
            header2: [],
            ranks: [],
            ranks2: [],
            index: 0,
            last:0,
            activeKey: 0,
            sideMenu: [],
            league: 'yc',
            changeLeague: false,
            loadover: false,
            schedule_list: [],
            schedule_url: '',
            schedule_name: '',
            roundsName: '',
            fruitPickerShow: false,
            fruitColumns: [
                {
                    values: [],
                    defaultIndex: 37
                }
            ],
            menu: [
                {label:'中超',api:'zc'},
                {label:'英超',api:'yc'},
                {label:'西甲',api:'xj'},
                {label:'意甲',api:'yj'},
                {label:'德甲',api:'dj'},
                {label:'欧冠',api:'og'},
                {label:'欧联',api:'ol'},
                {label:'亚冠',api:'yg'},
                {label:'法甲',api:'fj'},
                {label:'足总杯',api:'zzb'},
                {label:'国王杯',api:'gwb'},
                {label:'德国杯',api:'dgb'},
                {label:'英联杯',api:'ylb'},
                {label:'意大利杯',api:'ydlb'},
                {label:'世界杯',api:'sjb'},
                {label:'欧洲杯',api:'ozb'},
            ]
        }
    },

}
</script>
<style scoped>
.data_wrap{
    width: 100%;
    overflow: hidden;
}
    .data_box{
        padding-top: 2rem;
        margin: 50px 0px;
        box-sizing: border-box;
    }
    .data_tab{
        margin: 0 15px;
    }
    .ranking-view{
        margin: 0 -15px;
    }
    .ranking-view .cell_data {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border-top: 1px solid #ddd;
}
.ranking-view .cell_data td, .ranking-view .cell_data th {
    height: 30px;
    font-size: .75rem;
    line-height: 30px;
    text-align: center;
    font-weight: 400;
    padding: 3px 5px;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ddd;
}
.ranking-view .cell_data .team {
    text-align: left;
    width: 30%;
    white-space: nowrap;
}
.ranking-view .cell_data .top {
    color: #ff9000;
}
.ranking-view .cell_data td img {
    vertical-align: middle;
    height: 20px;
    display: inline-block;
    width: auto;
}
.aside{
    position: fixed;
    top: 80px;
    bottom: 50px;
    overflow: scroll;
    padding-top: 2rem;
    background: #515a6e;
}
.rank_rable{
    padding-left: 110px;
}
.ib{
    width: 50% !important;
}
td.team{
    /* display: flex; */
}
td.team>span,.team_name{
    width: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
td.team>span+em{
    vertical-align: middle;
}
.schedule_team{
    width: 4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
.activeRound{
    display: flex;
}
.activeRound div{
    flex: 1;
    text-align: center;
    line-height: 30px;
}
</style>