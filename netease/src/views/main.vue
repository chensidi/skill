<template>
    <div class="main_wrap">
        <Head>
            <span slot="hname">迪爷音乐</span>
        </Head>
        <div class="lunbo">
            <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="bannerItem of banner" :key="bannerItem.targetId" @click="bannerEvent(bannerItem.targetType,bannerItem.targetId)">
                    <img v-lazy="bannerItem.imageUrl" alt="">
                </van-swipe-item>
            </van-swipe>
            <p class="text-center" v-show="bannerErr">
                <van-button type="info" @click="getBanner">重新加载banner</van-button>
            </p>
        </div>
        <van-search placeholder="请输入搜索关键词" @focus="$router.push('/home')" />
        <div class="flex s-round typebar">
            <router-link :to="command[0]?'/pylist/'+command[0].id:''">
                <div class="text-center">
                    <van-icon name="calender-o" size="30" color="#d43737"></van-icon>
                </div>
                <p class="text-center">每日推荐</p>
            </router-link>
            <router-link to="/main/mainpys">
                <div class="text-center">
                    <van-icon name="records" size="30" color="#d43737"></van-icon>
                </div>
                <p class="text-center">歌单</p>
            </router-link>
            <router-link to="/main/toplists">
                <div class="text-center">
                    <van-icon name="chart-trending-o" size="30" color="#d43737"></van-icon>
                </div>
                <p class="text-center">排行榜</p>
            </router-link>
            <router-link to="/main/djmain">
                <div class="text-center">
                    <van-icon name="music-o" size="30" color="#d43737"></van-icon>
                </div>
                <p class="text-center">电台</p>
            </router-link>
        </div>
        <div class="main_block">
            <h3 class="flex mblock_title">
                <span>推荐歌单</span>
                <router-link :to="{name:'mainpys'}">
                    <van-button round size="mini">更多</van-button>
                </router-link>
            </h3>
            <van-grid :column-num="3" :gutter="0">
                <van-grid-item
                    v-for="item of command.slice(1)"
                    :key="item.id"
                    text="文字"
                    :to="'/pylist/'+item.id"
                >
                    <div class="cmd_box">
                        <!-- <van-image :src="item.picUrl" lazy-load /> -->
                        <img v-lazy="item.picUrl">
                        <p class="cmd_name">{{item.name}}</p>
                        <i class="play_sub">
                            <van-icon name="play" color='#fff' />
                            {{(item.playCount/10000).toFixed(0)+'万'}}
                        </i>
                    </div>
                </van-grid-item>
            </van-grid>
            <p class="text-center" v-show="cmdErr">
                <van-button type="info" @click="loadCommand">重新加载歌单</van-button>
            </p>
        </div>
        <div class="main_block">
            <h3 class="flex mblock_title">
                <span>新碟</span>
                <router-link :to="{name:'maindisks'}">
                    <van-button round size="mini">更多</van-button>
                </router-link>
            </h3>
            <van-grid :column-num="3" :gutter="1">
                <van-grid-item
                    v-for="item of disk"
                    :key="item.id"
                    text="文字"
                    :to="'/album/'+item.id"
                >
                    <div class="cmd_box">
                        <!-- <van-image :src="item.picUrl" lazy-load /> -->
                        <img v-lazy="item.picUrl">
                        <p class="disk_name">{{item.name}}<em v-if="item.alias.length>0">({{item.alias[0]}})</em></p>
                        <p class="disk_owner">{{item.artist.name}}</p>
                    </div>
                </van-grid-item>
            </van-grid>
            <p class="text-center" v-show="diskErr">
                <van-button type="info" @click="loadNewDisc">重新加载新碟</van-button>
            </p>
        </div>  
        <div class="main_block">
            <h3 class="flex mblock_title">
                <span>新歌</span>
                <router-link :to="{name:'mainsongs'}">
                    <van-button round size="mini">更多</van-button>
                </router-link>
            </h3>
            <van-grid :column-num="3" :gutter="1">
                <van-grid-item
                    v-for="item of newSong"
                    :key="item.id"
                    text="文字"
                    @click="play(item.id)"
                >
                    <div class="cmd_box">
                        <!-- <van-image :src="item.album.picUrl" lazy-load /> -->
                        <img v-lazy="item.album.picUrl">
                        <p class="disk_name">{{item.name}}<em v-if="item.alias.length>0">({{item.alias[0]}})</em></p>
                        <p class="disk_owner">{{item.artists[0].name}}</p>
                        <i class="ps_icon">
                            <van-icon name="play-circle"></van-icon>
                        </i>
                    </div>
                </van-grid-item>
            </van-grid>
            <p class="text-center" v-show="songErr">
                <van-button type="info" @click="loadNewSong">重新加载新歌</van-button>
            </p>
        </div>
        <div class="mv_wrap">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :error.sync="error"
                error-text="点击重新加载"
            >
                <router-link :to="'/video/'+item.id" class="main_block" v-for="item of rcmdMV" :key="'mvm'+item.id">
                    <div class="mvc">
                        <img v-lazy="item.cover" alt="">
                        <i class="play_sub">
                            <van-icon name="play" color='#fff' />
                            {{(item.playCount/10000).toFixed(0)+'万'}}
                        </i>
                        <i class="mvi">
                            <van-icon name="play"></van-icon>
                        </i>
                    </div>
                    <div class="mv_desc">
                        <p class="elp">{{item.name}}</p>
                    </div>
                </router-link>
            </van-list>
        </div>
        <Masks :loadover='loadover' />
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex';
import axios from 'axios';
import Vue from 'vue';
import Head from '../components/head';
import Masks from '../components/mask';
import { Swipe,SwipeItem,Lazyload,Toast,Grid,GridItem,Image,Icon,List,Button,Search} from 'vant';

Vue.use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(Toast)
    .use(Grid)
    .use(GridItem)
    .use(Image)
    .use(Icon)
    .use(List)
    .use(Button)
    .use(Search);
export default {
    name: 'Main',
    data(){
        return{
            banner: [],
            command: [],
            disk: [],
            newSong: [],
            rcmdMV: [],
            error: false,
            loading: false,
            finished: false,

            bannerErr: false,
            cmdErr: false,
            diskErr: false,
            songErr: false,

            loadover: false
        }
    },
    created(){
        this.getBanner();
        this.loadCommand();
        this.loadNewDisc();
        this.loadNewSong();
    },
    methods: {
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
        getBanner(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/banner`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.bannerErr = false;
                    this.banner = res.data.banners;
                }else{
                    this.bannerErr = true;
                    Toast.fail('网络请求失败');
                }
            }).catch(err=>{
                this.loadover = true;
                this.bannerErr = true;
                Toast.fail('网络请求失败');
            })
        },
        bannerEvent(type,id){
            switch(type){
                case 1:
                    this.play(id);
                    break;
                case 10:
                    this.$router.push(`/album/${id}`);
                    break;
                case 1004:
                    this.$router.push(`/video/${id}`);
                    break;
            }
        },
        loadCommand(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/personalized`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.cmdErr = false;
                    this.command = res.data.result.slice(0,7);
                }else{
                    this.cmdErr = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.loadover = true;
                this.cmdErr = true;
                Toast.fail('网络请求错误');
            })
        },
        loadNewDisc(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/album`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.diskErr = false;
                    this.disk = res.data.albums.slice(0,3);
                }else{
                    this.diskErr = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.loadover = true;
                this.diskErr = true;
                Toast.fail('网络请求错误');
            })
        },
        loadNewSong(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/song`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.songErr = false;
                    this.newSong = res.data.data.slice(0,3);
                }else{
                    this.songErr = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.loadover = true;
                this.songErr = true;
                Toast.fail('网络请求错误');
            })
        },
        onLoad(){
            if(this.rcmdMV.length < 30){
                axios({
                    method: 'get',
                    url: `${this.getMyApi}/mv/first?offset=${this.rcmdMV.length}&limit=10`,
                    timeout: 15000
                }).then(res=>{
                    if(res.data.code == 200){
                        this.error = false;
                        this.rcmdMV = this.rcmdMV.concat(res.data.data);
                        this.loading = false;
                    }else{
                        this.error = true;
                        this.loading = false;
                        Toast.fail('网络请求错误');
                    }
                }).catch(err=>{
                    this.error = true;
                    this.loading = false;
                    Toast.fail('网络请求错误');
                })
            }else{
                this.loading = false;
            }
        },
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    components: {Head,Masks}
}
</script>
<style scoped>
    .main_wrap{
        margin-bottom: 50px;        
    }
    .lunbo{
        margin-top: 50px;
        padding-top: 40%;
        position: relative;
    }
    .lunbo>.van-swipe{
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
    }
    .lunbo img{
        width: 100%;
        height: 100%;
    }
    .mblock_title{
        justify-content: space-between;
        line-height: 2em;
    }
    .main_block{
        padding: 10px;
        width: 100%;
    }
    .mblock_title>span{
        font-weight: bold;
    }
    .cmd_name,.disk_name,.disk_owner{
        color: #333;
        display: -webkit-box;             
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .cmd_box{
        position: relative;
    }
    .cmd_box>img{
        width: 100%;
    }
    .play_sub{
        position: absolute;
        z-index: 1;
        right: 5px;
        top: 5px;
        font-size: 12px;
        color: #fff;
    }
    .disk_name,.disk_owner{
        -webkit-line-clamp: 1;
    }
    .disk_owner{
        font-size: 12px;
        color: #999;
    }
    .ps_icon{
        position: absolute;
        top: 70px;
        right: 5px;
        font-size: 20px;
        color: #f40;
    }
    .mvc{
        position: relative;
        padding-top: 45%;
        display: flex;
    }
    .mvc>img{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px 5px 0 0;
    }
    .mv_desc{
        background: #eee;
        color: #333;
        font-size: 13px;
        line-height: 3em;
        padding: 0 1em;
    }
    .mvi{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -25px;
        margin-top: -25px;
        font-size: 50px;
        color: #fff;
    }
    .typebar a{
        color: #333;
    }
    .typebar p{
        font-size: 12px;
    }
</style>
