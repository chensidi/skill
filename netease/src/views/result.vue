<template>
    <div>
        <Head :child='true' />
        <div class="wrap">
            <div class="search_wrap">
            <van-search
                v-model="svalue"
                placeholder="请输入搜索关键词"
                show-action
                @search="this.onSearch"
            />
            </div>
            <div class="wraper">
                <van-tabs animated swipeable sticky :offset-top='108' @change="change" v-model="on">
                    <van-tab v-for="(item,i) of kind" :title="item.name" :name="item.id" :key="'k'+i">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            finished-text="没有更多了"
                            @load="onLoad"
                            error-text="点击重新加载" 
                            :error.sync="netError"
                        >
                            
                            <div v-waves class="res_cell" v-for="(obj,i) of danquList.list" v-if="item.id=='1'" @click="play(obj.id)" :key="'s'+i">
                                <p class="elp s_name">{{obj.name}}</p>
                                <p class="elp s_owner">{{obj.artists[0].name}}</p>
                            </div>

                            <router-link :to="'/album/'+obj.id" class="res_cell flex" :key="'a'+index" v-for="(obj,index) of zhuanjiList.list" v-if="item.id=='10'" >
                                <div class="album_pic">
                                    <img v-lazy="obj.picUrl" alt="">
                                </div>
                                <div class="album_info elp">
                                    <p class="album_name elp">{{obj.name}}<span class="alias">{{obj.alias[0]?`(${obj.alias[0]})`:''}}</span></p>
                                    <p class="elp">
                                        <em class="album_owner">{{obj.artist.name}}</em>
                                        <time class="album_time">{{computedTime(obj.publishTime)}}</time>
                                    </p>
                                </div>
                            </router-link>

                            <router-link :to="'/singer/'+obj.id" class="res_cell flex" v-for="(obj,i) of geshouList.list" v-if="item.id=='100'" :key="'si'+i">
                                <div class="singer_pic">
                                    <img v-lazy="obj.img1v1Url" alt="">
                                </div>
                                <div class="elp">  
                                    <p class="singer elp">{{obj.name+(obj.alia?`(${obj.alia[0]})`:'')}}</p>
                                </div>
                            </router-link>

                            <router-link :to="'/pylist/'+obj.id" class="res_cell flex" v-for="(obj,i) of gedanList.list" v-if="item.id=='1000'" :key="'p'+i">
                                <div class="album_pic">
                                    <img v-lazy="obj.coverImgUrl" alt="">
                                </div>
                                <div class="album_info elp">
                                    <p class="album_name elp">{{obj.name}}</p>
                                    <p class="elp">
                                        <em class="gedan_owner">{{obj.trackCount+'首 by '+ obj.creator.nickname+'，播放'+(obj.playCount/10000).toFixed(1)+'万次'}}</em>
                                    </p>
                                </div>
                            </router-link>

                            <router-link :to="'/video/'+obj.id" class="res_cell flex" v-for="(obj,i) of mvList.list" v-if="item.id=='1004'" :key="'m'+i">
                                <div class="vedio_cover">
                                    <img v-lazy="obj.cover" alt="">
                                    <i class="play_sub">
                                        <van-icon name="play" color='#fff' />
                                        {{(obj.playCount/1000).toFixed(0)+'万'}}
                                    </i>
                                </div>
                                <div class="vedio_info">
                                    <p class="vedio_name">{{obj.name}}</p>
                                    <p class="vedio_owner">{{computedDuration(obj.duration)+computedArt(obj.artists)}}</p>
                                </div>
                            </router-link>

                            <router-link :to="'/videos/'+obj.vid" class="res_cell flex" v-for="(obj,i) of videoList.list" v-if="item.id=='1014'" :key="'v'+i">
                                <div class="vedio_cover">
                                    <img v-lazy="obj.coverUrl" alt="">
                                    <i class="play_sub">
                                        <van-icon name="play" color='#fff' />
                                        {{(obj.playTime/1000).toFixed(0)+'万'}}
                                    </i>
                                </div>
                                <div class="vedio_info">
                                    <p class="vedio_name">{{obj.title}}</p>
                                    <p class="vedio_owner">{{computedDuration(obj.durationms)+computedArt(obj.creator)}}</p>
                                </div>
                            </router-link>

                            <router-link :to="'/dj/'+obj.id" class="res_cell flex" v-for="(obj,i) of diantaiList.list" v-if="item.id=='1009'" :key="'d'+i">
                                <div class="album_pic">
                                    <img v-lazy="obj.picUrl" alt="">
                                </div>
                                <div class="album_info elp">
                                    <p class="album_name elp">{{obj.name}}</p>
                                    <p class="elp">
                                        <em class="album_owner">{{obj.dj.nickname}}</em>
                                    </p>
                                </div>
                            </router-link>
                        </van-list>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Head from '../components/head';
import Masks from '../components/mask'
import { Search } from 'vant';
import axios from 'axios';
import {mapGetters, mapActions} from 'vuex';
import { Tab, Tabs, Button, Toast, Lazyload, List, Icon } from 'vant';

Vue.use(Tab).use(Tabs).use(Search).use(List).use(Toast).use(Button).use(Lazyload).use(Icon);
export default {
    name: 'Result',
    components:{Head},
    data(){
        return {
            svalue: '',
            list: [],
            loading: false,
            finished: false,
            kind: [{name:'单曲',id:'1'},
            {name:'专辑',id:'10'},
            {name:'歌手',id:'100'},
            {name:'歌单',id:'1000'},
            {name:'MV',id:'1004'},
            {name:'电台',id:'1009'},
            {name:'视频',id:'1014'}],
            type: '1',
            danquList: {list:[],limit:30,offset:0,loading:false,finished:false},
            zhuanjiList: {list:[],limit:30,offset:0,loading:false,finished:false},
            geshouList: {list:[],limit:30,offset:0,loading:false,finished:false},
            gedanList: {list:[],limit:30,offset:0,loading:false,finished:false},
            mvList: {list:[],limit:30,offset:0,loading:false,finished:false},
            videoList: {list:[],limit:30,offset:0,loading:false,finished:false},
            diantaiList: {list:[],limit:30,offset:0,loading:false,finished:false},
            netError: false,
            wait: false,
            on: '1'
        }
    },
    created(){
        this.svalue = this.getKw;
        // this.loadDanqu();
        this.on = this.getOn;
        this.type = this.getOn;
    },
    methods:{
        ...mapActions(['setKw']),
        onSearch(){
            this.finished = false;
            if(this.svalue!=null && this.svalue != ''){
                this.setKw(this.svalue);
                switch(this.type){
                    case '1': 
                        this.danquList.list = [];
                        this.loadDanqu();
                        break;
                    case '10':
                        this.zhuanjiList.list = [];
                        this.loadZhuanji();
                        break;
                    case '100':
                        this.geshouList.list = [];
                        this.loadGeshou();
                        break;
                    case '1000':
                        this.gedanList.list = [];
                        this.loadGedan();
                        break;
                    case '1004':
                        this.mvList.list = [];
                        this.loadMv();
                        break;
                    case '1014':
                        this.videoList.list = [];
                        this.loadVideo();
                        break;
                    case '1009':
                        this.diantaiList.list = [];
                        this.loadDiantai();
                }
            }
        },
        change(name,title){
            console.log(name);
            this.setOn(name);
            this.type = name;
            this.finished = false;
            this.loading = false;
        },
        computedTime(time){
            return new Date(time).getFullYear() + '.' + (Number(new Date(time).getMonth()) + 1) + '.' + new Date(time).getDate();
        },
        computedDuration(duration){
            return (duration/60000<10?'0'+parseInt(duration/60000):parseInt(duration/60000)) + ':' + (duration/1000%60<10?'0'+parseInt(duration/1000%60):parseInt(duration/1000%60))
        },
        computedArt(art){
            let str = ' ';
            art.map(item=>{
                str += item.name||item.userName + '/'
            })
            return str.slice(0,-1);
        },
        getSongUrl(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/url?id=${id}`,
                timeout: 15000
            })
        },
        getAlbumInfo(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/detail?ids=${id}`,
                timeout: 15000
            })
        },
        play(id){
            let self = this;
            axios.all([this.getSongUrl(id), this.getAlbumInfo(id)])
                .then(axios.spread(function (url, info) {
                if(url.data.code == 200 && info.data.code == 200){
                    let songInfo = {
                        url: url.data.data[0].url,
                        name: info.data.songs[0].name,
                        pic: info.data.songs[0].al.picUrl,
                        artist: info.data.songs[0].ar[0].name,
                        id: id
                    }

                    self.$emit('playStart',songInfo)
                }
            })).catch(err=>{
                Toast.fail('网络错误请重试')
            })
        },
        onLoad() {
            // 异步更新数据
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
            if(this.wait)return;
            switch(this.type){
                case '1':
                    this.loadDanqu();
                    break;
                case '10':
                    this.loadZhuanji();
                    break;
                case '100':
                    this.loadGeshou();
                    break;
                case '1000':
                    this.loadGedan();
                    break;
                case '1004':
                    this.loadMv();
                    break;
                case '1014':
                    this.loadVideo();
                    break;
                case '1009':
                    this.loadDiantai();
            }
            
        },
        loadDanqu(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.danquList.limit}&offset=${this.danquList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(res.data.result.songs.length==0){
                        this.finished = true;
                    }else{
                        this.danquList.list = this.danquList.list.concat(res.data.result.songs);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
                this.netError = false;
            }).catch(err=>{
                this.danquList.loading = false;
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadZhuanji(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.zhuanjiList.limit}&offset=${this.zhuanjiList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(res.data.result.albums.length==0){
                       this.finished = true; 
                    }else{
                        this.zhuanjiList.list = this.zhuanjiList.list.concat(res.data.result.albums);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
            }).catch(err=>{
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadGeshou(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.geshouList.limit}&offset=${this.geshouList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(!res.data.result.artists||res.data.result.artists.length==0){
                        this.finished = true;
                        this.loading = false;
                    }else{
                        this.geshouList.list = this.geshouList.list.concat(res.data.result.artists);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
            }).catch(err=>{
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadGedan(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.gedanList.limit}&offset=${this.gedanList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(!res.data.result.playlists || res.data.result.playlists.length==0){
                        this.finished = true;
                        this.loading = false;
                    }else{
                        this.gedanList.list = this.gedanList.list.concat(res.data.result.playlists);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
            }).catch(err=>{
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadMv(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.mvList.limit}&offset=${this.mvList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(!res.data.result.mvs || res.data.result.mvs.length==0){
                        this.finished = true;
                        this.loading = false;
                    }else{
                        this.mvList.list = this.mvList.list.concat(res.data.result.mvs);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }
            }).catch(err=>{
                console.log(err)
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadVideo(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.videoList.limit}&offset=${this.videoList.list.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    if(!res.data.result.videos || res.data.result.videos.length==0){
                        this.finished = true;
                        this.loading = false;
                    }else{
                        this.videoList.list = this.videoList.list.concat(res.data.result.videos);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
            }).catch(err=>{
                console.log(err)
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },

        loadDiantai(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/search?keywords=${this.svalue}&type=${this.type}&limit=${this.diantaiList.limit}&offset=${this.diantaiList.list.length}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                if(res.data.code == 200){
                    if(!res.data.result.djRadios || res.data.result.djRadios.length==0){
                        this.finished = true;
                        this.loading = false;
                    }else{
                        this.diantaiList.list = this.diantaiList.list.concat(res.data.result.djRadios);
                        this.loading = false;
                        this.wait = true;
                        setTimeout(()=>{
                            this.wait = false;
                        },200)
                    }
                }else{
                    this.loading = false;
                    Toast.fail('网络错误请重试');
                    this.netError = true;
                }
            }).catch(err=>{
                console.log(err)
                this.loading = false;
                Toast.fail('网络错误请重试');
                this.netError = true;
            })
        },
        ...mapActions(['setOn'])
    },
    computed: {
        ...mapGetters(['getMyApi','getOn','getKw']),
    },
    // beforeRouteEnter (to, from, next) {
    //     console.log(from,to);
    //     if(from.name == "Home"){
    //         to.meta.keep = false;
    //     }
    //     next();
    // },
    beforeRouteLeave (to, from, next) {
        if(to.name == "Album"){
            from.meta.keep = true;
        }
        if(to.name == 'Home'){
            from.meta.keep = false;
        }
        next();
    }
}
</script>
<style scoped>
    .res_cell{
        padding: 10px 15px;
    }
    .s_name{
        color: #333;
        font-size: 1.1rem;
    }
    .s_owner{
        color: #999;
        font-size: 12px;
    }
    .wraper{
        position: fixed;
        top: 108px;
        width: 100%;
        bottom: 50px;
        overflow: auto;
        padding: 0;
    }
    .search_wrap{
        position: fixed;
        top: 50px;
        width: 100%;
    }
    .reload{
        margin: auto;
    }
    .reload_wraper{
        display: flex;
        width: 100%;
        height: 15rem;
    }
    .album_pic,.singer_pic{
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background: url(../../static/img/user.png) no-repeat;
        background-size: contain;
        background-position: center;
    }
    .album_pic img{
        border-radius: 5px;
        width: 100%;
        height: 100%;
    }
    .album_info{
        align-self: center;
        flex: auto;
    }
    .album_name{
        color: #333;
        font-size: 1.1rem;
    }
    .album_owner{
        color: #417bb3;
        font-size: 12px;
        vertical-align: bottom;
    }
    .album_time{
        color: #999;
        font-size: 12px;
    }
    /* .singer_pic{
        width: 40px;
        height: 40px;
        margin-right: 10px;
    } */
    .singer_pic>img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .singer{
        font-size: 1.2rem;
        color: #333;
        line-height: 40px;
    }
    .gedan_owner,.vedio_owner{
        font-size: 12px;
        color: #999;
        line-height: 12px;
    }
    .vedio_cover{
        position: relative;
        width: 100px !important;
        height: 60px !important;
        margin-right: 10px;
        background: url(../../static/img/blank.png) no-repeat;
        background-size: contain;
        background-position: center;
    }
    .vedio_cover>img{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
    .vedio_name{
        font-size: 1.2rem;
        color: #333;
        margin-bottom: 5px;
    }
    .vedio_info{
        align-self: center;
        flex: 1;
    }
    .play_sub{
        position: absolute;
        z-index: 1;
        right: 5px;
        top: 5px;
        font-size: 12px;
        color: #fff;
    }
    .alias{
        color: #999;
    }
</style>