<template>
    <div class="playview">
        <van-nav-bar
            :title="getInfo.name"
            left-arrow
            :fixed='true'
            :z-index='10'
            @click-left="back"
        />
        <div class="p_singer">
            <div class="p_name">{{getInfo.singer}}</div>
        </div>
        <div class="p_mid">
            <div class="singer-img">
                <img :src="getCover" :class="{cover_rot:playState}" alt="">
            </div>
        </div>
        <div class="singer-bottom">
            <div class="progress_bar">
                <time>{{parseInt(Math.ceil(curTime)/60)+':'+((Math.ceil(curTime)%60<10)?'0'+Math.ceil(curTime)%60:Math.ceil(curTime)%60)}}</time>
                <van-slider
                    v-model="value"
                    bar-height="3px"
                    active-color="#f44"
                    @change='change'
                />
                <time>{{parseInt(Math.ceil(duration)/60)+':'+((Math.ceil(duration)%60<10)?'0'+Math.ceil(duration)%60:Math.ceil(duration)%60)}}</time>
            </div>
            <div class="play-wrapper">
                <div>
                    <van-icon @click="goCmt" name="comment-o" :info="getCmt||0" />      
                </div>
                <div class="lasts"><van-icon name="play" @click="switchPlay(0)" /></div>
                <div><van-icon :name="getPlay?'pause':'stop'" @click="play" /></div>
                <div><van-icon name="play" @click="switchPlay(1)" /></div>

                <div class="actions"><van-icon name="bars" @click="show=true" /></div>                
            </div>
            <van-actionsheet v-model="show" title="播放列表">
                <div class="actionsheets" @click="goPlay(obj,i)" v-for="(obj,i) of hist" :key="i">
                    <div class="item_left">{{i+1}}</div>
                    <div class="item-right">
                        <p class="list_name elp">{{obj.name}}</p>
                        <p class="list_singer elp">{{obj.singer}}</p>
                    </div>
                    <div class="deletes"><van-icon name="delete" @click="deletes($event,i)" /></div>
                </div>
            </van-actionsheet>
        </div>
        <div class="drop" :style="{'background-image':`url(${getCover})`}"></div>
        <div class="cmt" v-show="showCmt" :style="{'background-image':`url(${getCover})`}">
            <van-nav-bar
            title="评论"
            left-arrow
            :fixed='true'
            :z-index='10'
            @click-left="backs"
            />
            <!-- <div id="cmt" class="mui-content mui-scroll-wrapper">
                <div class="mui-scroll">
                    <div>
                        <h4 class="cmt_title">热门评论({{hotCmts.length}})</h4>
                    </div>
                    <div class="mui-table-view mui-table-view-chevron">
                        <div class="cmt_item" v-for="(obj,i) in hotCmts" >
                            <div class="cmt_hd">
                                <img v-lazy='obj.user.avatarUrl' alt="">
                            </div>
                            <div class="cmt_wrap">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <div class="user">{{obj.user.nickname}}</div>
                                        <time class="cmt_time">{{trTime(obj.time)}}</time>
                                    </div>
                                    <div class="like">
                                        <van-icon name="thumb-circle-o" size="20px" :info="obj.likedCount" />
                                    </div>
                                </div>
                                <div class="cmt_txt">
                                    <span v-if='obj.beReplied.length'>回复<em class="replied_name">@{{obj.beReplied[0].user.nickname}}</em>:</span>
                                    {{obj.content}}
                                </div>
                                <div class="cmt_replied" v-if='obj.beReplied.length'>
                                    <span>@{{obj.beReplied[0].user.nickname}}:{{obj.beReplied[0].content}}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 class="cmt_title">最新评论</h4>
                        </div>
                        <div class="cmt_item" v-for="(itme,j) in cmtArr">
                            <div class="cmt_hd">
                                <img v-lazy='itme.user.avatarUrl' alt="">
                            </div>
                            <div class="cmt_wrap">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <div class="user">{{itme.user.nickname}}</div>
                                        <time class="cmt_time">{{trTime(itme.time)}}</time>
                                    </div>
                                    <div class="like">
                                        <van-icon name="thumb-circle-o" size="20px" :info="itme.likedCount" />
                                    </div>
                                </div>
                                <div class="cmt_txt">
                                    <span v-if='itme.beReplied.length'>回复<em class="replied_name">@{{itme.beReplied[0].user.nickname}}</em>:</span>
                                    {{itme.content}}
                                </div>
                                <div class="cmt_replied" v-if='itme.beReplied.length'>
                                    <span>@{{itme.beReplied[0].user.nickname}}:{{itme.beReplied[0].content}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div> -->
            <div class="list-content" id="list-contents">
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        @load="onLoad"
                        :offset="10"
                    >
                        <div class="list-item">
                            <!-- <van-cell v-for="item in list" :key="item" :title="item + ''" /> -->
                            <div>
                        <h4 class="cmt_title">热门评论({{hotCmts.length}})</h4>
                    </div>
                        <div class="cmt_item" v-for="(obj,i) in hotCmts" >
                            <div class="cmt_hd">
                                <img v-lazy='obj.user.avatarUrl' alt="">
                            </div>
                            <div class="cmt_wrap">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <div class="user">{{obj.user.nickname}}</div>
                                        <time class="cmt_time">{{trTime(obj.time)}}</time>
                                    </div>
                                    <div class="like">
                                        <van-icon name="thumb-circle-o" size="20px" :info="obj.likedCount" />
                                    </div>
                                </div>
                                <div class="cmt_txt">
                                    <span v-if='obj.beReplied.length'>回复<em class="replied_name">@{{obj.beReplied[0].user.nickname}}</em>:</span>
                                    {{obj.content}}
                                </div>
                                <div class="cmt_replied" v-if='obj.beReplied.length'>
                                    <span>@{{obj.beReplied[0].user.nickname}}:{{obj.beReplied[0].content}}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 class="cmt_title">最新评论</h4>
                        </div>
                        <div class="cmt_item" v-for="(itme,j) in cmtArr">
                            <div class="cmt_hd">
                                <img v-lazy='itme.user.avatarUrl' alt="">
                            </div>
                            <div class="cmt_wrap">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <div class="user">{{itme.user.nickname}}</div>
                                        <time class="cmt_time">{{trTime(itme.time)}}</time>
                                    </div>
                                    <div class="like">
                                        <van-icon name="thumb-circle-o" size="20px" :info="itme.likedCount" />
                                    </div>
                                </div>
                                <div class="cmt_txt">
                                    <span v-if='itme.beReplied.length'>回复<em class="replied_name">@{{itme.beReplied[0].user.nickname}}</em>:</span>
                                    {{itme.content}}
                                </div>
                                <div class="cmt_replied" v-if='itme.beReplied.length'>
                                    <span>@{{itme.beReplied[0].user.nickname}}:{{itme.beReplied[0].content}}</span>
                                </div>
                            </div>
                        </div>
                        </div>
    
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>
<script>
let time1;
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Play',
    data(){
        return {
            value: 0,
            show: false,
            curTime: 0,
            playState: this.getPlay,
            hist: [],
            duration: document.getElementById('mp3').duration,
            cmt: 0,
            sid: '',
            showCmt: false,
            cmtArr: [],
            hotCmts: [],
            mp3: this.getMp3,
            page: 1,
            total: '',
            list: [],
            loading: false,   //是否处于加载状态
            finished: false,  //是否已加载完所有数据
            isLoading: false,   //是否处于下拉刷新状态
        }
    },
    created(){
        // console.log($('#mp3').attr('src'))
        this.delNoEffect();
        this.value = $('#mp3')[0].currentTime/this.duration*100;
        this.playState = this.getPlay;
        this.curTime = $('#mp3')[0].currentTime;
        this.hist = JSON.parse(localStorage.getItem('hist'))||[];
        this.getCmts();
        this.total = Math.ceil(this.getCmt/30);
    },
    computed: {
        ...mapGetters(['getMyApi','getPlay','getMp3','getInfo','getCover','getDuration','getIndex','getCmt','getSid','getSwitched'])
    },
    methods: {
        ...mapActions(['setShowPlay','setKey','setPlay','setMp3','setCover','setInfo','setIndex','setCmt','setSid','setSwitched']),
        back(){
            this.setShowPlay(false);
        },
        backs(){
            this.showCmt = false;
        },
        change(){
            // console.log(this.value);
            $('#mp3')[0].currentTime = this.curTime = this.value*this.duration/100;
        },
        play(){
            if(this.getMp3){
                this.setPlay(!this.getPlay);
                this.setKey(false);
                if(this.getCmt==null){
                    this.getCmts(true);
                }
                if(this.getPlay){
                    clearInterval(time1);
                    time1 = setInterval(()=>{
                        this.value= $('#mp3')[0].currentTime/this.duration*100;
                        this.curTime = $('#mp3')[0].currentTime;
                        this.playState = true;
                    },1000)
                }else{
                    this.playState = false;
                    clearInterval(time1);
                }
            }
        },
        goPlay(obj,index){
            this.show = false;
            this.setIndex(index);
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                this.setKey(false);
                this.setPlay(false);
                this.setMp3(dt.data[0].url);
                this.setCover(obj.cover);
                this.setInfo({m:obj.name,n:obj.singer});
                this.playState = true;
                this.play();
                this.getCmts(true);
                this.setSid(obj.id);
                this.finished = false;
            })
        },
        deletes(e,i){
            e.stopPropagation();
            this.hist.splice(i,1); 
            localStorage.setItem('hist',JSON.stringify(this.hist));
            
        },
        switchPlay(flag){
            if(!this.hist.length)return;
            var index = this.getIndex;
            if(flag){
                if(index < this.hist.length - 1){
                    index ++;
                    this.setIndex(index);
                }else{
                    index = 0;
                    this.setIndex(0);
                }
            }else{
                if(index > 0){
                    index --;
                    this.setIndex(index);
                }else{
                    index = this.hist.length - 1;
                    this.setIndex(index);
                }
            }
            
            var obj = this.hist[index];
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                this.setKey(false);
                this.setPlay(false);
                this.setMp3(dt.data[0].url);
                this.setCover(obj.cover);
                this.setInfo({m:obj.name,n:obj.singer});
                this.playState = true;
                this.play();
                this.getCmts(true);
                this.setSid(obj.id);
                this.finished = false;
            })
        },
        getCmts(key){
            if(this.getMp3||key){
                var obj = this.hist[this.getIndex];
                $.get(`${this.getMyApi}/comment/music?id=${obj.id}&limit=30`).then(dt=>{
                    this.setCmt(dt.total);
                    this.sid = obj.id;
                    this.cmtArr = dt.comments;
                    this.hotCmts = dt.hotComments;
                })
            }
        },
        goCmt(){
            if(this.getSid){
                this.showCmt = true;
                // mui('#cmt').scroll().scrollTo(0,0,10);//100毫秒滚动到顶
                this.delNoEffect();
            }
        },
        delNoEffect(){
            for(var i = mui.hooks.inits.length-1,item;i >= 0;i --){//解决mui上拉加载后scroll失效
				item = mui.hooks.inits[i];
				if(item.name=="pullrefresh"){
				    item.repeat = true;
				}
			}
        },
        trTime(time){
            return new Date(time).getFullYear() + '年' + Number(new Date(time).getMonth()+1) + '月' + new Date(time).getDate() + '日';
        },
        updateCmt(){
            var obj = this.hist[this.getIndex];
            $.get(`${this.getMyApi}/comment/music?id=${obj.id}&limit=30&offset=${(this.page-1)*30}`).then(dt=>{
                this.cmtArr = this.cmtArr.concat(dt.comments);
            })
        },
        onLoad() {      //上拉加载
            // setTimeout(() => {
            //     for (let i = 0; i < 15; i++) {
            //         this.list.push(this.list.length + 1);
            //     }
            //     this.loading = false;
            //     if (this.list.length >= 60) {
            //         this.finished = true;
            //     }
            // }, 500);
            if(this.page >= this.total){
                this.finished = true;
                return;
            }
            this.page += 1;
            this.updateCmt();
        },
        onRefresh() {       //下拉刷新
            setTimeout(() => {
                this.finished = false;
                this.isLoading = false;
                this.onLoad()
            }, 500);
            // this.finished = false;
            // this.isLoading = false;
            // this.onLoad()
        }
    },
    mounted(){
        if(this.getPlay){
            clearInterval(time1);
            time1 = setInterval(()=>{
                this.value = $('#mp3')[0].currentTime/this.duration*100;
                this.curTime = $('#mp3')[0].currentTime;
                if(document.getElementById('mp3').paused){
                    this.playState = false;
                    clearInterval(time1);
                }
            },1000)
        }else{
            this.playState = false;            
            clearInterval(time1);
        }

        // mui.init({
        //     pullRefresh : {
        //         container: '#cmt',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        //         indicators: false,
        //         up: {
        //             height: 50,//可选.默认50.触发上拉加载拖动距离
        //             auto: false,//可选,默认false.自动上拉加载一次
        //             callback: ()=>{
        //                 if(this.page >= this.total){
        //                     mui('#cmt').pullRefresh().endPullupToRefresh();                        
        //                     return;
        //                 }
        //                 this.page += 1;
        //                 this.updateCmt();
        //             } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        //         }
        //     }
        // });
        let winHeights = document.documentElement.clientHeight                          //视口大小
        document.getElementById('list-contents').style.height = (winHeights - 46) +'px'  //调整上拉加载框高度
    },
    updated(){
        this.duration = document.getElementById('mp3').duration;
        this.total = Math.ceil(this.getCmt/30);

        if(this.getSwitched){
            if(!this.showCmt){
                this.getCmts(true);
                this.setSwitched(false);
                this.page = 1;
            }
        }
    }
}
</script>
<style scoped>
    .playview{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1001;
        color: #fff;
        background-color: #212121;
    }
    .p_singer{
        text-align: center;
        margin-top: 69px;
    }
    .p_name{
        display: inline-block;
        position: relative;
        font-size: 16px;
    }
    .p_name::before,.p_name::after{
        content: "";
        width: 15px;
        position: absolute;
        top: 50%;
        border-top: 1px solid #fff;
    }
    .p_name::before{
        left: -20px;
    }
    .p_name::after{
        right: -20px;
    }
    .drop{
        background-image: url(http://y.gtimg.cn/music/photo_new/T002R300x300M000001ihx410QzSq3.jpg?max_age=2592000);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        filter: blur(20px);
        opacity: .6;
        transform: translateZ(0);
        transition: background-image .3s;
    }
    .p_mid{
        position: absolute;
        top: 100px;
        bottom: 120px;
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .singer-img{
        width: 260px;
        height: 260px;
        border-radius: 50%;
        border: 10px solid hsla(0,0%,87%,.3);
    }
    .singer-img>img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .cover_rot{
        animation: rot 10s linear infinite;
        animation-fill-mode: forwards;
    }
    .singer-bottom{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 120px;
        padding: 0 15px;
    }
    .progress_bar{
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .progress_bar time{
        color: #fff;
        font-size: 12px;
    }
    .van-slider{
        flex: 1;
        margin: 0 12px;
    }
    .play-wrapper{
        display: flex;
        margin-top: 10px;
        color: gold;
        font-size: 36px;
        text-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .play-wrapper>div{
        flex: 1;
        -ms-flex: 1;
        text-align: center;
    }
    .lasts{
        transform: rotate(180deg);
    }
    .actions{
        text-align: right;
    }
    .actionsheets{
        transition-property: transform;
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        transition-duration: 0ms;
        transform: translate(0px, 0px) translateZ(0px);
    }
    .item_left{
        float: left;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .van-actionsheet--withtitle{
        font-size: 16px;
        color: #fff;
        background: url(https://code-mcx.github.io/vue-mango-music/static/img/play_bg.473725c.jpg) no-repeat 50%;
        background-size: cover;
        transform: translateZ(0);
    }
    .van-actionsheet--withtitle::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background-color: rgba(0,0,0,.5);
    }
    .item-right{
        position: relative;
        height: 50px;
        margin-left: 50px;
        padding-top: 2px;
        margin-right: 50px;
    }
    .list_name,.list_singer{
        color: #fff68f;
        margin: 0;
        font-size: 16px;
    }
    .list_singer{
        font-size: 14px;
    }
    .deletes{
        position: absolute;
        right: 18px;
        top: 16px;
        font-size: 14px;
    }
    @keyframes rot {
        from{
            transform: rotate(0deg);
        }to{
            transform: rotate(360deg);
        }
    }
    .cmt{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1002;
        color: #333;
        overflow: auto;
        color: #fff;
        background-color: rgba(0,0,0,.5);
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
    }
    #cmt{
        top: 46px;
        background-color: transparent;
        position: absolute;
        width: 100%;
    }
    #cmt div{
        background-color: transparent;
    }
    #cmt .mui-scroll{
        background:  rgba(0,0,0,.5);
    }
    #cmt ul{
        background:  rgba(0,0,0,.2);
    }
    .cmt_title{
        position: relative;
        padding: 0 0 0 10px;
        line-height: 25px;
        color: #fff;
        font-size: 16px;
        background-color: transparent;
    }
    .cmt_title::after{
        content: "";
        display: block;
        width: 2px;
        height: 16px;
        position: absolute;
        top: 4px;
        left: 0;
        background: #d33a31;
    }
    .cmt_item{
        padding-top: 10px;
        display: flex;
    }
    .cmt_hd{
        height: 35px;
        margin: 0 10px;
    }
    .cmt_hd img{
        display: block;
        border-radius: 50%;
        width: 30px;
        height: 30px;
    }
    .cmt_wrap{
        padding-right: 22px;
        padding-bottom: 11px;
        /* padding-left: 10px; */
        -ms-flex: auto;
        flex: auto;
        width: 0;
    }
    .cmt_wrap div{
        background: transparent;

    }
    .cmt_header{
        display: flex;
    }
    .cmt_meta{
        flex: auto;
    }
    .user{
        font-size: 14px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -ms-flex: auto;
        flex: auto;
        color: hsla(0,0%,100%,.7);
    }
    .cmt_time{
        color: hsla(0,0%,100%,.3);
    }
    .like{
        width: 65px;
        height: 22px;
        line-height: 22px;
        font-size: 11px;
        color: #999;
        -ms-flex: none;
        flex: none;
        text-align: right;
    }
    .zan{
        line-height: 22px;
        font-size: 11px;
        color: #999;
    }
    .cmt_txt{
        color: #fff;
        font-size: 15px;
    }
    .cmt_replied{
        color: hsla(0,0%,100%,.6);
        background-color: hsla(0,0%,100%,.05) !important;
        margin: 5px 0;
        padding: 10px;
        font-size: 14px;
        line-height: 21px;
    }
    .replied_name{
        color: #507daf;
    }
    #list-contents{
        margin-top: 46px !important;
        background: rgba(0,0,0,.3)
    }
</style>
