<template>
    <div class="singer_wrap">
        <div class="singer_head">
            <img :src="djInfo.picUrl" alt="">
            <h3 class="artist">{{djInfo.name}}</h3>
            <i class="back"><van-icon name="arrow-left" size="25" @click="$router.go(-1)"></van-icon></i>
        </div>
        <van-tabs v-model="active" animated swipeable sticky>
            <van-tab title="详情">
                <p class="text-center reloadbtn">
                    <van-button type="primary" plain v-show="infoNetErr" @click="loadDjInfo">重新加载</van-button>
                </p>
                <div class="dj_wrap">
                    <h4>主播</h4>
                    <div class="flex dj_head">
                        <div class="dj_img">
                            <img :src="djInfo.dj.avatarUrl" alt="">
                        </div>
                        <div>
                            <p class="djname">{{djInfo.dj.nickname}}</p>
                            <p class="signature">{{djInfo.dj.signature}}</p>
                        </div>
                    </div>
                    <h4>电台内容简介</h4>
                    <p class="dj_intr">分类: <span class="category">{{djInfo.category}}</span></p>
                    <p class="dj_intr">专辑介绍: {{djInfo.desc}}</p>
                </div>
            </van-tab>
            <van-tab :title="'节目'+count">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    :error.sync="netError"
                    error-text="点击重新加载"
                >
                    <div class="pylst_list">
                        <div class="list_item" v-for="(item,index) of djList" :key="item.id" @click="play(item.mainSong.id)">
                            <div class="sgfl">{{index+1}}</div>
                            <div class="sgfr f-bd f-bd-btm">
                                <div class="sgchfl">
                                    <div class="f-thide sgt1">{{item.name}}</div>
                                    <div class="f-thide sginfo flex">
                                        <em>{{computedTime(item.createTime)}}</em>
                                        <em><van-icon name="play-circle-o"></van-icon>{{item.listenerCount}}</em>
                                        <em><van-icon name="clock-o">{{computedDuration(item.duration)}}</van-icon></em>
                                    </div>
                                </div>
                                <div class="sgchfr">
                                    <van-icon name="play-circle-o"></van-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-tab>
        </van-tabs>
        <Masks :loadover='loadover' />
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
import {mapGetters} from 'vuex';
import { Tab, Tabs, Icon, Lazyload, Toast, Button ,List} from 'vant';
import Masks from '../components/mask'
Vue.use(Tab)
    .use(Tabs)
    .use(Icon)
    .use(Lazyload)
    .use(Toast)
    .use(List);
export default {
    name: 'Dj',
    data(){
        return{
            did: null,
            djList: [],
            active: 1,
            djInfo: {
                dj: {}
            },
            infoNetErr: false,
            loading: false,
            finished: false,
            netError: false,
            count: '',

            loadover: false
        }
    },
    created(){
        this.did = this.$route.params.id;
        this.loadDjInfo();
        // this.loadDJ();
    },
    methods: {
        computedTime(time){
            return new Date(time).getFullYear() + '.' + (Number(new Date(time).getMonth()) + 1) + '.' + new Date(time).getDate();
        },
        computedDuration(duration){
            return (duration/60000<10?'0'+parseInt(duration/60000):parseInt(duration/60000)) + ':' + (duration/1000%60<10?'0'+parseInt(duration/1000%60):parseInt(duration/1000%60))
        },
        loadDJ(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/dj/program?rid=${this.did}&offset=${this.djList.length}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.loading = false;
                    if(res.data.programs.length > 0){
                        this.djList = this.djList.concat(res.data.programs);
                        this.count = res.data.count;
                    }else{
                        this.finished = true;
                    }
                }else{
                    Toast.fail('网络请求错误');
                    this.netError = true;
                    this.loading = false;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.netError = true;
                this.loading = false;
            })
        },
        loadDjInfo(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/dj/detail?rid=${this.did}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.infoNetErr = false;
                    this.djInfo = res.data.djRadio;
                }else{
                    Toast.fail('网络请求错误');
                    this.infoNetErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                this.infoNetErr = true;
            })
        },
        onLoad(){
            this.loadDJ();
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
    },
    computed:{
        ...mapGetters(['getMyApi'])
    },
    components: {Masks}
}
</script>
<style scoped>
    .sginfo>em{
        margin-right: 12px;
    }
    .pylst_list{
        margin-bottom: 0;
    }
    .reloadbtn{
        margin-top: 20px;
    }
    .dj_wrap{
        padding: 10px;
    }
    .dj_img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .dj_img>img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .dj_head{
        align-items: center;
        margin: 10px 0 20px;
    }
    .djname{
        color: #333;
        font-size: 14px;
    }
    .signature{
        color: #999;
        font-size: 12px;
    }
    .dj_intr{
        color: #999;
        font-size: 13px;
        line-height: 2em;
    }
    .category{
        color: red;
        font-size: 10px;
        border: 1px solid red;
        padding: 2px;
    }
    .dj_wrap h4{
        line-height: 2em;
    }
</style>