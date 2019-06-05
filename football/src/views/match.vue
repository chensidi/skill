<template>
    <div>
        <Head :isArt='false' />
        <Menu :menu='menu' @newapi='reload' />

        <div class="matchbox">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <router-link :to="'/matchdts/'+item.match_id" class="match-list-item" v-for="(item,i) of matchList" :key="i">
                        <div class="match-item-a">
                            <img v-lazy='item.team_A_logo' alt="">
                            <p>{{item.team_A_name}}</p>
                        </div>

                        <div class="match-item-c">
                            <p>{{item.match_title}} 
                            </p>
                            <p class="spec">{{item.as_A}} {{item.status=='Fixture'?'VS':'-'}} {{item.as_B}}</p>
                            <p>{{item.start_play}}</p>
                            </div>

                        <div class="match-item-b">
                            <img v-lazy='item.team_B_logo' alt="">
                            <p>{{item.team_B_name}}</p>
                        </div>
                    </router-link>
                </van-list>
            </van-pull-refresh>
            <Loading :loaded='loadover' />
        </div>


    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex'
import Head from '../components/head'
import Menu from '../components/menu'
import Loading from '../components/loading'
import $ from 'jquery'

export default {
    name: 'Match',
    
    created(){
        this.$store.dispatch('setState',1);
        let t = new Date().toLocaleDateString();
        t = t.split('/');
        for(let i = 1; i < 3; i ++){
                t[i] = t[i].padStart(2,'0');
        }
        t = t.join('-') + '%2000:00:00next';
        this.nextDate = t;
        this.getMatch();
    },
    beforeRouteEnter (to, from, next) {
        store.dispatch('setState',1);
        next();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        ...mapActions(['setState']),
        getMatch(){
            $.post(`${this.getMyApi}/match`,{type:this.type}).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    // console.log(result);
                    this.matchList = result.list;
                    result.nextDate&&(this.nextDate = result.nextDate);
                    this.prevDate = result.prevDate;
                    this.firstLoaded = true;
                    setTimeout(()=>{
                        this.loadover = true;
                    },500)
                }
            })
        },
        reload(api,idx){
            console.log(api,idx);
            this.type = api;
            this.matchList = [];
            this.loadover = false;
            this.getMatch();
        },
        onRefresh() {
           
            $.post(`${this.getMyApi}/matchmore`,{type:this.type,flagData:this.prevDate}).then(dt=>{
                this.loading = false;
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    // console.log(result);
                    this.matchList = result.list.concat(this.matchList)
                    result.nextDate&&(this.nextDate = result.nextDate);
                    this.prevDate = result.prevDate;
                    this.firstLoaded = true;
                    this.$toast('刷新成功');
                    this.isLoading = false;
                }
            })
        },
        onLoad() {
            // 异步更新数据
            if(!this.firstLoaded){
                this.loading = false;
                return;
            }
            $.post(`${this.getMyApi}/matchmore`,{type:this.type,flagData:this.nextDate}).then(dt=>{
                this.loading = false;
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    console.log(result);
                    if(result.list.length == 0){
                        this.finished = true;
                    }
                    this.matchList = this.matchList.concat(result.list);
                    this.nextDate = result.nextDate;
                    this.prevDate = result.prevDate;
                    this.firstLoaded = true;
                }
            })
            // setTimeout(() => {
            //     for (let i = 0; i < 10; i++) {
            //         this.list.push(this.list.length + 1);
            //     }
            //     // 加载状态结束
            //     this.loading = false;

            //     // 数据全部加载完成
            //     if (this.list.length >= 40) {
            //         this.finished = true;
            //     }
            // }, 500);
        }
    },
    components: {Head,Menu,Loading},
    data(){
        return{
            count: 0,
            isLoading: false,
            list: [],
            loading: false,
            finished: false,
            matchList: [],
            nextDate: '',
            prevDate: '',
            firstLoaded: false,
            type: 'important',
            loadover: false,
            menu: [
                {label:'中超',api:'zc'},
                {label:'重要',api:'important'},
                {label:'英超',api:'yc'},
                {label:'西甲',api:'xj'},
                {label:'意甲',api:'yj'},
                {label:'欧冠',api:'og'},
                {label:'德甲',api:'dj'},
                {label:'法甲',api:'fj'},
            ]
        }
    }
}
</script>
<style scoped>
    .matchbox{
        margin-top: 50px;
        padding-top: 2rem;
        margin-bottom: 50px;
    }
    .match-list-item{
        position: relative;
        display: block;
        width: auto;
        height: 5.9rem;
        padding: 0 1.9rem;
        border-bottom: 1px solid #e8e8e8;
        /* background: #e9e5e5; */
    }
    .match-item-a,.match-item-b{
        float: left;
        width: 4.7rem;
        padding-top: 1rem;
    }
    .match-item-b{
        float: right;
    }
    .match-item-c{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: .8rem;
    }
    .match-item-a img,.match-item-b img{
        display: block;
        width: 2.6rem;
        margin: 0 auto;
    }
    .match-item-a p,.match-item-b p{
        line-height: 1;
        margin-top: .6rem !important;
        font-size: .6rem;
        color: #333;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .match-item-c p{
        font-size: .6rem;
        line-height: 1rem;
        color: #999;
        text-align: center;
        display: block;
    }
    .match-item-c p:first-child{
        width: 10rem;
        line-height: .8rem;
        margin: 0 auto !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .match-item-c p.spec{
        font-size: 1.5rem;
        line-height: 1.5rem;
        margin: .6rem 0 !important;
        color: #333;
    }
    .icon-highlights{
        display: block;
        width: 5.8rem;
        margin: 0 auto;
        margin-top: -.3rem;
    }
</style>