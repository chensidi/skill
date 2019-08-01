<template>
    <div>
        <van-nav-bar
            :title="videoInfo.name||videoInfo.title"
            left-arrow
            @click-left="$router.go(-1)"
            :fixed="true"
        />
        <div class="video-box" v-if="ready">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="false" :options="playerOptions"></video-player>
            <van-button @click="playerOptions.sources[0].src = brs.src" v-for="brs of br" :key="brs.br+'p'">{{brs.br+'p'}}</van-button>
        </div>
        <p class="reloadbtn text-center">
            <van-button v-show="netErr" @click="loadVideoInfo" type="info">重新加载MV</van-button>
        </p>
        <div class="mvcmt_wrap">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :error.sync="error"
            >
                <h4 class="cmt_title" v-if='hotCmts.length'>热门评论</h4>
                <ul class="cmt_list_hot">
                    <li v-for="cmtItem of hotCmts">
                        <div class="cmt_head">
                            <img v-lazy="cmtItem.user.avatarUrl" alt="" class="lazy">
                        </div>
                        <div class="cmt_info">
                            <div class="cmt_header">
                                <div class="cmt_meta">
                                    <span class="cmt_user">{{cmtItem.user.nickname}}</span>
                                    <div class="cmt_time">{{convertTime(cmtItem.time)}}</div>
                                </div>
                                <div class="cmt_like">
                                    <span class="cmt_likearea">
                                        <span class="cmt_count">{{cmtItem.likedCount}}</span>
                                        <i class="zan">
                                            <van-icon name="like" />
                                        </i>
                                    </span>
                                </div>
                            </div>
                            <div class="cmt_content" v-if="!cmtItem.beReplied.length">
                                {{cmtItem.content}}
                            </div>
                            <div class="cmt_content" v-if="cmtItem.beReplied.length">
                                    回复<span class="touser">{{cmtItem.beReplied[0].user.nickname}}:</span> {{cmtItem.beReplied[0].content}}
                            </div>
                            <div class="recmt" v-if="cmtItem.beReplied.length">
                                <span>@{{cmtItem.beReplied[0].user.nickname}}:</span>{{cmtItem.content}}
                            </div>
                        </div>
                    </li>
                </ul>

                <h4 class="cmt_title" v-if="cmts.length">全部评论</h4>
                <ul class="cmt_list">
                    <li v-for="cmtItem of cmts">
                        <div class="cmt_head">
                            <img v-lazy="cmtItem.user.avatarUrl" alt="" class="lazy">
                        </div>
                        <div class="cmt_info">
                            <div class="cmt_header">
                                <div class="cmt_meta">
                                    <span class="cmt_user">{{cmtItem.user.nickname}}</span>
                                    <div class="cmt_time">{{convertTime(cmtItem.time)}}</div>
                                </div>
                                <div class="cmt_like">
                                    <span class="cmt_likearea">
                                        <span class="cmt_count">{{cmtItem.likedCount}}</span>
                                        <i class="zan">
                                            <van-icon name="like" />
                                        </i>
                                    </span>
                                </div>
                            </div>
                            <div class="cmt_content" v-if="!cmtItem.beReplied.length">
                                {{cmtItem.content}}
                            </div>
                            <div class="cmt_content" v-if="cmtItem.beReplied.length">
                                    回复<span class="touser">{{cmtItem.beReplied[0].user.nickname}}:</span> {{cmtItem.beReplied[0].content}}
                            </div>
                            <div class="recmt" v-if="cmtItem.beReplied.length">
                                <span>@{{cmtItem.beReplied[0].user.nickname}}:</span>{{cmtItem.content}}
                            </div>
                        </div>
                    </li>
                </ul>
            </van-list>
            <p class="text-center" v-show="error">
                <van-button @click="loadCmt" type="info">重新加载评论</van-button>
            </p>
        </div>
    <Masks :loadover='loadover' />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import axios from 'axios';
import VueVideoPlayer from 'vue-video-player';
import 'video.js/dist/video-js.css';
import Vue from 'vue';
import {Button,PullRefresh,NavBar,Cell,List,Lazyload, Toast } from 'vant';
import Masks from '../components/mask';
Vue.use(VueVideoPlayer)
    .use(Button)
    .use(PullRefresh)
    .use(List)
    .use(Cell)
    .use(Lazyload)
export default {
    name: 'Video',
    data() {
         return {
            ready: false,
            loadover: false,
            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                height: 300,
                sources: [{
                    type: "",
                    src: "" //视频url地址
                }],
                poster: "../../static/img/blank.png", //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请下拉刷新再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: true,
                    fullscreenToggle: true  //全屏按钮
                },
                loading: false,

            },
            vid: null,
            videoInfo: {},
            br: [],
            isLoading: false,
            finished: false,
            loading: false,
            list: [],
            hotCmts: [],
            cmts: [],
            error: false,
            netErr: false
        }
    },
    created(){
        this.vid = this.$route.params.id;
        if(this.$route.path.startsWith('/videos')){
            this.waitInfoAndUrl();
        }else if(this.$route.path.startsWith('/video')){
            this.loadVideoInfo();
            this.loadCmt();
        } 
        
        
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        loadVideoInfo(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/mv/detail?mvid=${this.vid}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                // this.loadover = true;
                if(res.data.code == 200){
                    this.netErr = false;
                    // this.isLoading = false;
                    this.videoInfo = res.data.data;
                    this.playerOptions.poster = this.videoInfo.cover;
                    this.br = [];
                    for(let i in this.videoInfo.brs){
                        this.br.push({
                            'src': this.videoInfo.brs[i],
                            'br': i
                        })
                    }
                    this.playerOptions.sources[0].src = this.br[this.br.length-1].src;
                    this.ready = true;
                }else{
                    this.isLoading = false;
                    this.netErr = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.netErr = true;
                this.isLoading = false;
                this.loadover = true;
                Toast.fail('网络请求错误');
            })
        },
        onRefresh(){
            this.loadVideoInfo();
        },
        onLoad() {
            this.loadCmt();
        },
        loadCmt(){
            this.loadover = false;
            let type = this.$route.path.startsWith('/videos')?'video':'mv';
            axios({
                method: 'get',
                url: `${this.getMyApi}/comment/${type}?id=${this.vid}&offset=${this.cmts.length}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadover = true;
                if(res.data.code == 200){
                    this.error = false;
                    this.loading = false;
                    if(res.data.comments.length>0){
                        this.cmts = this.cmts.concat(res.data.comments);
                    }else{
                        this.finished = true;
                    }

                    if(res.data.hotComments && res.data.hotComments.length>0){
                        this.hotCmts = res.data.hotComments;
                    }
                }else{
                    this.loading = false;
                    this.error = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.loadover = true;
                this.loading = false;
                this.error = true;
                Toast.fail('网络请求错误');
            })
        },
        convertTime(time){
            return new Date(time).getFullYear() + '.' 
                    + String(new Date(time).getMonth() + 1).padStart(2,'0') + '.' 
                    + String(new Date(time).getDate()).padStart(2,'0');
        },
        loadVideoInfos(){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/video/detail?id=${this.vid}`,
                timeout: 15000
            })
        },
        loadVideoUrl(){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/video/url?id=${this.vid}`,
                timeout: 15000
            })
        },
        waitInfoAndUrl(){
            let self = this;
            axios.all([this.loadVideoInfos(), this.loadVideoUrl()])
                 .then(axios.spread(function (info,url) {
                    //  console.log(info,url);
                     if(info.data.code == 200 && url.data.code == 200){
                        self.videoInfo = info.data.data;
                        self.playerOptions.poster = self.videoInfo.coverUrl;
                        self.playerOptions.sources[0].src = url.data.urls[0].url;
                        self.ready = true;
                        self.netErr = false;
                     }else{
                         self.netErr = true;
                         Toast.fail('网络请求错误');
                     }
                 })).catch(err=>{
                    self.netErr = true;
                    Toast.fail('网络请求错误');
                 })
        }
    },
    
    components: {Masks},
    beforeRouteEnter (to, from, next) {
        // console.log(to);
        next();
    }
}
</script>
<style scoped>
    .mvcmt_wrap{
        margin-bottom: 50px;
        /* position: absolute;
        top: calc(255px);
        width: 100%;
        left: 0;
        z-index: 10000; */
        margin-top: 302px;
        background: #001938;
    }
    .video-box{
        position: fixed;
        width: 100%;
        top: 46px;
        left: 0;
        z-index: 100;
        background: #001938;
    }
    .reloadbtn{
        margin-top: 50px;
    }
</style>