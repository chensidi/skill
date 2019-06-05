<template>
    <div class="list">
        <Head :isArt='true' :total='total' v-show="!showAll" />
        <header class="art-hd" v-show="!showAll">
            <h1>{{h1}}</h1>
            <h2>
                <span>{{h2}}</span>
                <time>{{time}}</time>
            </h2>
        </header>
        <article v-show="!showAll">
            <p v-for="(item,i) of domArr" :key="i">
                <img v-if="item.img" v-lazy="item.img" alt="">
                {{item.text?item.text:''}}
            </p>
        </article>
        <div class="cmt" v-show="!showAll">
            <div class="cell" v-for="(item,i) of topCmt" :key="i">
                <dl>
                    <dl>
                        <dt class="info">
                            <ul>
                                <li>
                                    <img :src='item.user.avatar'>
                                </li>
                                <li>
                                    <dl>
                                        <dt class="username">{{item.user.username}} <img :src="item.user.team_icon" class="teamicon" /></dt>
                                        <dd class="times">{{item.created_at}}</dd>
                                    </dl>
                                </li>
                                <span class="up">{{item.up}}</span>
                            </ul>
                        </dt>
                        <dd class="quote" v-if="item.quote">
                            <ul>
                                <li>
                                    <dl>
                                        <dt class="username">{{item.quote.user.username}} <img :src="item.quote.user.team_icon" class="teamicon" /></dt>
                                    </dl>
                                </li>
                                <span class="up">{{item.quote.up}}</span>
                            </ul>
                            <p v-html="item.quote.content"></p>
                        </dd>
                        <dd class="content">
                            <p v-html="item.content"></p>
                        </dd>
                    </dl>
                </dl>
            </div>
            <div style="margin: 0 15px">
                <wv-button type="primary" @click="showAll=true">look all</wv-button>
            </div>
            
        </div>
        <van-nav-bar
                fixed
                title="评论"
                :z-index='1001'
                v-show="showAll"
            >
                <van-icon name="arrow-left" slot="left" color='#399e5c' @click="showAll=false"  />
        </van-nav-bar>
        <div :class="['allcmt',{'fdin':showAll}]">
            <div class="cmtlist">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    >
                    <div class="cell" v-for="(item,i) of cmt" :key="i">
                        <dl>
                            <dl>
                                <dt class="info">
                                    <ul>
                                        <li>
                                            <img :src='item.user.avatar'>
                                        </li>
                                        <li>
                                            <dl>
                                                <dt class="username">{{item.user.username}} <img :src="item.user.team_icon" class="teamicon" /></dt>
                                                <dd class="times">{{item.created_at}}</dd>
                                            </dl>
                                        </li>
                                        <span class="up" v-if="item.recommend">{{item.up}}</span>
                                    </ul>
                                </dt>
                                <dd class="quote" v-if="item.quote">
                                    <ul>
                                        <li>
                                            <dl>
                                                <dt class="username">{{item.quote.user.username}} <img :src="item.quote.user.team_icon" class="teamicon" /></dt>
                                            </dl>
                                        </li>
                                        <span class="up">{{item.quote.up}}</span>
                                    </ul>
                                    <p v-html="item.quote.content"></p>
                                </dd>
                                <dd class="content">
                                    <p v-html="item.content"></p>
                                </dd>
                            </dl>
                        </dl>
                    </div>
                </van-list>
            </div>
        </div>
        <Loading :loaded='loadover' />
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex'
import Head from '../components/head'
import Loading from '../components/loading'
import $ from 'jquery'
const api = 'https://api.dongqiudi.com/article/';
export default {
    name: 'List',
    data(){
        return{
            id: this.$route.query.id,
            total: this.$route.query.total,
            domArr: [],
            h1: '',
            h2: '',
            time: '',
            topCmt: [],
            cmt: [],
            showAll: false,
            loading: false,
            finished: false,
            page: 1,
            loadover: false
        }
    },
    created(){
        // this.getCon();
        // this.getCmt();
        $.when(this.getCon(),this.getCmt()).then(()=>{
            setTimeout(()=>{
                this.loadover = true;
            },1000)
        })
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        ...mapActions(['setState']),
        getCon(){
            $.post(`${this.getMyApi}/article`,{url:api+this.id+'.html'}).then(dt=>{
                if(dt.code == 200){
                    this.domArr = dt.con;
                    this.h1 = dt.h1;
                    this.h2 = dt.h2;
                    this.time = dt.time;
                }
            })
        },
        getRcmt(){
            $.post(`${this.getMyApi}/rcmt`,{id:this.id}).then(dt=>{
                console.log(dt);
                if(dt.code==200){
                    let res = JSON.parse(dt.result);
                    console.log(res);
                    this.topCmt = res.recommends.slice(0,3);
                }
            })
        },
        getCmt(){
            $.post(`${this.getMyApi}/cmt`,{id:this.id,size:20*this.page}).then(dt=>{
                console.log(dt);
                if(dt.code==200){
                    let res = JSON.parse(dt.result);
                    console.log(res);
                    this.topCmt = res.recommends.slice(0,3);
                    if(res.comments.length + res.recommends.length == this.cmt.length){
                        this.finished = true;
                        this.loading = false;
                    }
                    this.cmt = res.recommends.concat(res.comments);
                    this.page += 1;
                    this.loading = false;
                }
            })
        },
        onLoad() {
            // 异步更新数据
            if(this.page==1)return;
            this.getCmt();
        }
    },
    components: {Head,Loading}
}
</script>
<style scoped>
    .list{
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .art-hd{
        margin: 50px 15px 0 15px;
    }
    .art-hd h1{
        font-size: 20px;
        padding: 0;
        margin: 0;
        line-height: 1.5;
    }
    .art-hd h2{
        line-height: 20px;
        font-size: 14px !important;
        padding: 5px 0 0 0;
        font-weight: normal;
        margin: 0;
    }
    .art-hd span{
        color: #399e5c;
        text-decoration: none;
    }
    .art-hd time{
        color: #999;
        font-size: 14px;
        display: inline-block;
        padding: 0;
        vertical-align: top;
        margin-left: 6px;
    }
    article{
        margin-left: 15px;
        margin-right: 15px;
        margin: 0 15px 50px 15px;
    }
    article p{
        line-height: 1.6 !important;
        text-align: justify;
        word-wrap: break-word;
        word-break: normal;
        margin: 20px 0 !important;
    }
    article img{
        width: 100%;
    }
    .cmt{
        margin-bottom: 100px;
        font-size: 14px;
        line-height: 20px;
        color: #aaa;
    }
    .allcmt{
        color: #aaa;
    }
    .cell{
        padding: 15px 0;
        margin: 0 15px;
        border-bottom: solid 1px #e9e9e9;
    }
    .cell .info{
        height: 36px;
        position: relative;
        font-size: 14px;
    }
    .info ul,.info ul li{
        display: inline-block;
        vertical-align: top;
    }
    .cmt img,.allcmt img{
        height: 36px;
        width: 36px;
        margin: 0 6px 0 0;
        padding: 0;
        border-radius: 3px;
    }
    .cmt .username,.allcmt .username{
        color: #399e5c;
        display: flex;
        align-items: center;
    }
    .cmt .times,.allcmt .times{
        font-size: 11px;
    }
    .cmt .up,.allcmt .up{
        position: absolute;
        background: url(../../static/img/up-h.png) no-repeat right center;
        background-size: 20px 20px;
        padding-right: 20px;
        top: 0;
        right: 0;
    }
    .cmt .conten,.allcmt .conten{
        padding: 11px 0 0 0;
        color: #3e3e3e;
    }
    .cmt .content,.allcmt .content{
        margin-top: 10px;
    }
    .cmt .content p,.allcmt .content p{
        text-indent: 0;
        line-height: 22px;
        font-size: 15px;
        margin: 0;
        padding: 0;
        color: #2b2b2b;
        text-align: left;
    }
    .allcmt{
        position: fixed;
        z-index: 1000;
        width: 100%;
        top: 0;
        /* left: 100%; */
        transform: translateX(100%);
        bottom: 0;
        background: #fff;
        overflow: auto;
        transition: all .5s;
    }
    .fdin{
       transform: translateX(0%); 
       /* width: 100%; */
    }
    .cmtlist{
        margin-top: 46px;
    }
    .teamicon{
        width: 14px !important;
        height: 14px !important;
        margin-left: 5px !important;
    }
    .quote{
        background: #eee;
        padding: 10px;
        margin-top: 10px;
        font-size: 12px;
    }
</style>