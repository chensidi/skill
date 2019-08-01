<template>
    <div class="singer_wrap">
        <div class="singer_head">
            <img :src="pic" alt="">
            <h3 class="artist">{{`${artist} ${artistAlias}`}}</h3>
            <i class="back"><van-icon name="arrow-left" size="25" @click="$router.go(-1)"></van-icon></i>
        </div>
        <van-tabs v-model="active" animated swipeable sticky>
            <van-tab title="热门单曲">
                <div class="pylst_list">
                    <div class="list_item" v-waves v-for="(item,index) of sList" :key="item.id" @click="play(item.id)">
                        <div class="sgfl">{{index+1}}</div>
                        <div class="sgfr f-bd f-bd-btm">
                            <div class="sgchfl">
                                <div class="f-thide sgt1">{{item.name}}</div>
                                <div class="f-thide sginfo">{{item.ar[0].name}}</div>
                            </div>
                            <div class="sgchfr">
                                <van-icon name="play-circle-o"></van-icon>
                            </div>
                        </div>
                    </div>
                    <p class="text-center reloadbtn">
                        <van-button type="primary" plain v-show="songNetErr" @click="loadDesc">重新加载</van-button>
                    </p>
                </div>
            </van-tab>
            <van-tab title="热门专辑">
                <router-link :to="'/album/'+obj.id" class="res_cell flex" :key="index" v-for="(obj,index) of zhuanjiList">
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
                <p class="text-center reloadbtn">
                    <van-button type="primary" plain v-show="albumNetErr" @click="loadAlbum">重新加载</van-button>
                </p>
            </van-tab>
            <van-tab title="热门视频">
                <div class="res_cell flex" v-for="obj of mvList">
                    <div class="vedio_cover">
                        <img v-lazy="obj.imgurl16v9" alt="">
                        <i class="play_sub">
                            <van-icon name="play" color='#fff' />
                            {{(obj.playCount/1000).toFixed(0)+'万'}}
                        </i>
                    </div>
                    <div class="vedio_info">
                        <p class="vedio_name">{{obj.name}}</p>
                        <p class="vedio_owner">{{obj.publishTime}}</p>
                    </div>
                </div>
                <p class="text-center reloadbtn">
                    <van-button type="primary" plain v-show="mvNetErr" @click="loadMv">重新加载</van-button>
                </p>
            </van-tab>
            <van-tab title="艺人信息">
                <div class="intr_block">
                    <h4 class="intr_title">{{artist}}简介</h4>
                    <p class="intr_txt">{{briefDesc}}</p>
                </div>
                <div class="intr_block" v-for="intr of introduction">
                    <h4 class="intr_title">{{intr.ti}}</h4>
                    <p class="intr_txt">{{intr.txt}}</p>
                </div>
                <p class="text-center reloadbtn">
                    <van-button type="primary" plain v-show="intrNetErr" @click="loadDescInfo">重新加载</van-button>
                </p>
            </van-tab>
        </van-tabs>
        <Masks :loadover='loadover' />
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import {mapGetters} from 'vuex';
import { Tab, Tabs, Icon, Lazyload, Toast, Button } from 'vant';
import Masks from '../components/mask';
Vue.use(Tab)
    .use(Tabs)
    .use(Icon)
    .use(Lazyload)
    .use(Toast);
export default {
    name: 'Singer',
    data() {
        return {
            active: 0,
            sid: 6460,
            sList: [],
            zhuanjiList: [],
            mvList: [],
            briefDesc: '',
            introduction: [],
            artist: '',
            artistAlias: '',
            pic: '../../static/img/blank.png',

            songNetErr: false,
            albumNetErr: false,
            mvNetErr: false,
            intrNetErr: false,

            loadover: false
        }
    },
    created(){
        this.sid = this.$route.params.id;
        this.loadDesc();
        this.loadAlbum();
        this.loadMv();
        this.loadDescInfo();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        computedTime(time){
            return new Date(time).getFullYear() + '.' + (Number(new Date(time).getMonth()) + 1) + '.' + new Date(time).getDate();
        },
        loadDesc(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/artists/desc?id=${this.sid}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.songNetErr = false;
                    this.sList = res.data.hotSongs;
                    this.artist = res.data.artist.name;
                    if(res.data.artist.alias[0]){
                        this.artistAlias = res.data.artist.alias[0];
                    }
                    this.pic = res.data.artist.picUrl;
                }else{
                    Toast.fail('网络请求错误');
                    this.songNetErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.songNetErr = true;
            })
        },

        loadAlbum(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/artist/album?id=${this.sid}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.albumNetErr = false;
                    this.zhuanjiList = res.data.hotAlbums;
                }else{
                    Toast.fail('网络请求错误');
                    this.albumNetErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.albumNetErr = true;
            })
        },

        loadMv(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/artist/mv?id=${this.sid}&limit=50`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.mvList = res.data.mvs;
                    this.mvNetErr = false;
                }else{
                    Toast.fail('网络请求错误');
                    this.mvNetErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.mvNetErr = true;
            })
        },

        loadDescInfo(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/artist/desc?id=${this.sid}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.intrNetErr = false;
                    this.briefDesc = res.data.briefDesc;
                    this.introduction = res.data.introduction;
                }else{
                    Toast.fail('网络请求错误');
                    this.intrNetErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.intrNetErr = true;
            })
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
        }
    },
    components: {Masks}
}
</script>
<style scoped>
    .singer_wrap{
        margin-bottom: 40px;
    }
    .singer_head{
        position: relative;
        padding-top: 80%;
        overflow: hidden;
    }
    .singer_head>img{
        width: 100%;
        /* height: 100%; */
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(1.2);
    }
    .singer_head::after{
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.3);
    }

    .pylst_list{
        padding: 10px 0;
        /* margin-bottom: 50px; */
    }
    .list_item{
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        padding-left: 10px;
        margin: 10px 0;
    }
    .sgfl{
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 40px;
        font-size: 17px;
        color: #999;
        margin-left: -10px;

        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .sgfr {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;

        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
    }

    .sgchfl{
        padding: 6px 0;
        width: 0;

        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
    }

    .f-thide {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
    }

    .sginfo {
        font-size: 12px;
        color: #888;
    }

    .sgtl {
        font-size: 17px;
    }

    .sgchfr {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 10px;
    }

    .res_cell{
        padding: 10px 15px;
    }

    .album_pic{
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background: url('../../static/img/user.png') no-repeat;
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
    .alias{
        color: #999;
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
        background: url('../../static/img/blank.png') no-repeat;
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
    .intr_title{
        font-size: 1.3rem;
        /* font-weight: bold; */
        color: #333;
        /* padding-left: 5px; */
        line-height: 2rem;
        margin-bottom: 5px;
    }
    .intr_title::before{
        content: "";
        width: 2px;
        height: 1.3rem;
        line-height: 2rem;
        background: #D43C33;
        display: inline-block;
        margin-right: 5px;
    }
    .intr_txt{
        font-size: 12px;
        color: #999;
        line-height: 1.5em;
    }
    .intr_block{
        margin-top: 10px;
        padding: 10px;
    }
    .artist{
        position: relative;
        z-index: 1;
        color: #fff;
        font-size: 1.5rem;
        bottom: 10px;
        padding-left: 10px;
    }
    .back{
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 10px;
        color: #fff;
    }
    .reloadbtn{
        margin: 10px 0;
    }
</style>