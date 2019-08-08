<template>
    <div>
        <Head :child="true">
            <span slot="hname">迪爷新歌</span>
        </Head>
        <div class="songmain">
            <van-tabs v-model="active" sticky :offset-top="50" animated swipeable>
                <van-tab title="推荐">
                    <div class="songbg rcmd">
                        <div class="songintr">
                            <h3>推荐</h3>
                            <p>Recommend</p>
                        </div>
                    </div>
                    <div>
                        <div class="res_cell flex" v-for="item of rcmd" v-waves @click="play(item.id)">
                            <div class="album_pic">
                                <img v-lazy="item.album.picUrl" alt="">
                            </div>
                            <div class="album_info elp">
                                <p class="album_name elp">{{item.name}}<span class="alias" v-if="item.album.alias[0]">({{item.album.alias[0]}})</span></p>
                                <p class="elp">
                                    <em class="album_owner">{{item.album.artists[0].name}}</em>
                                </p>
                            </div>
                        </div>
                        <p class="text-center reloads">
                            <van-button type="info" v-show="rcmdErr" @click="loadRcmd(0)">重新加载</van-button>
                        </p>
                    </div>
                </van-tab>
                <van-tab title="华语">
                    <div class="songbg hy">
                        <div class="songintr">
                            <h3>华语</h3>
                            <p>Mandarin Music</p>
                        </div>
                    </div>
                    <div>
                        <div class="res_cell flex" v-for="item of hy" v-waves @click="play(item.id)">
                            <div class="album_pic">
                                <img v-lazy="item.album.picUrl" alt="">
                            </div>
                            <div class="album_info elp">
                                <p class="album_name elp">{{item.name}}<span class="alias" v-if="item.album.alias[0]">({{item.album.alias[0]}})</span></p>
                                <p class="elp">
                                    <em class="album_owner">{{item.album.artists[0].name}}</em>
                                </p>
                            </div>
                        </div>
                        <p class="text-center reloads">
                            <van-button type="info" v-show="hyErr" @click="loadRcmd(7)">重新加载</van-button>
                        </p>
                    </div>
                </van-tab>
                <van-tab title="欧美">
                    <div class="songbg om">
                        <div class="songintr">
                            <h3>欧美</h3>
                            <p>Western Music</p>
                        </div>
                    </div>
                    <div>
                        <div class="res_cell flex" v-for="item of om" v-waves @click="play(item.id)"> 
                            <div class="album_pic">
                                <img v-lazy="item.album.picUrl" alt="">
                            </div>
                            <div class="album_info elp">
                                <p class="album_name elp">{{item.name}}<span class="alias" v-if="item.album.alias[0]">({{item.album.alias[0]}})</span></p>
                                <p class="elp">
                                    <em class="album_owner">{{item.album.artists[0].name}}</em>
                                </p>
                            </div>
                        </div>
                        <p class="text-center reloads">
                            <van-button type="info" v-show="omErr" @click="loadRcmd(96)">重新加载</van-button>
                        </p>
                    </div>
                </van-tab>
                <van-tab title="韩国">
                    <div class="songbg hg">
                        <div class="songintr">
                            <h3>韩国</h3>
                            <p>Korean Music</p>
                        </div>
                    </div>
                    <div>
                        <div class="res_cell flex" v-for="item of hg" v-waves @click="play(item.id)">
                            <div class="album_pic">
                                <img v-lazy="item.album.picUrl" alt="">
                            </div>
                            <div class="album_info elp">
                                <p class="album_name elp">{{item.name}}<span class="alias" v-if="item.album.alias[0]">({{item.album.alias[0]}})</span></p>
                                <p class="elp">
                                    <em class="album_owner">{{item.album.artists[0].name}}</em>
                                </p>
                            </div>
                        </div>
                        <p class="text-center reloads">
                            <van-button type="info" v-show="hgErr" @click="loadRcmd(16)">重新加载</van-button>
                        </p>
                    </div>
                </van-tab>
                <van-tab title="日本">
                    <div class="songbg rb">
                        <div class="songintr">
                            <h3>日本</h3>
                            <p>Japanese Music</p>
                        </div>
                    </div>
                    <div>
                        <div class="res_cell flex" v-for="item of rb" v-waves @click="play(item.id)">
                            <div class="album_pic">
                                <img v-lazy="item.album.picUrl" alt="">
                            </div>
                            <div class="album_info elp">
                                <p class="album_name elp">{{item.name}}<span class="alias" v-if="item.album.alias[0]">({{item.album.alias[0]}})</span></p>
                                <p class="elp">
                                    <em class="album_owner">{{item.album.artists[0].name}}</em>
                                </p>
                            </div>
                        </div>
                        <p class="text-center reloads">
                            <van-button type="info" v-show="rbErr" @click="loadRcmd(8)">重新加载</van-button>
                        </p>
                    </div>
                </van-tab>
            </van-tabs>
            <Masks :loadover="loadover" />
        </div>
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex';
import axios from 'axios';
import Vue from 'vue';
import Head from '../components/head';
import Masks from '../components/mask';
import { Swipe,SwipeItem,Lazyload,Toast,Grid,GridItem,Image,Icon,List,Button,Search,Tab,Tabs} from 'vant';

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
    .use(Search)
    .use(Tab)
    .use(Tabs);
export default {
    name: 'MainSong',
    data(){
        return {
            active: 0,
            rcmd: [],
            hy: [],
            om: [],
            hg: [],
            rb: [],

            rcmdErr: false,
            hyErr: false,
            omErr: false,
            hgErr: false,
            rbErr: false,

            loadover: false
        }
    },
    created(){
        this.loadRcmd(0);
        this.loadRcmd(7);
        this.loadRcmd(96);
        this.loadRcmd(8);
        this.loadRcmd(16);
    },
    computed: {
        ...mapGetters(['getMyApi'])
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
        loadRcmd(type){
            this.loadover = false;
            if(type == 0){
                this.rcmdErr = false;
            }
            if(type == 7){
                this.hyErr = false;
            }
            if(type == 96){
                this.omErr = false;
            }
            if(type == 8){
                this.rbErr = false;
            }
            if(type == 16){
                this.hgErr = false;
            }
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/song?type=${type}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadover = true;
                if(res.data.code == 200){
                    if(type == 0){
                        this.rcmd = res.data.data;
                    }
                    if(type == 7){
                        this.hy = res.data.data;
                    }
                    if(type == 96){
                        this.om = res.data.data;
                    }
                    if(type == 8){
                        this.rb = res.data.data;
                    }
                    if(type == 16){
                        this.hg = res.data.data;
                    }
                }else{
                    Toast.fail('网络请求错误');
                    if(type == 0){
                        this.rcmdErr = true;
                    }
                    if(type == 7){
                        this.hyErr = true;
                    }
                    if(type == 96){
                        this.omErr = true;
                    }
                    if(type == 8){
                        this.rbErr = true;
                    }
                    if(type == 16){
                        this.hgErr = true;
                    }
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求错误');
                if(type == 0){
                    this.rcmdErr = true;
                }
                if(type == 7){
                    this.hyErr = true;
                }
                if(type == 96){
                    this.omErr = true;
                }
                if(type == 8){
                    this.rbErr = true;
                }
                if(type == 16){
                    this.hgErr = true;
                }
            })
        }
    },
    components: {Head,Masks}
}
</script>
<style scoped>
    .songmain{
        margin: 50px 0;
    }
    .songbg{
        padding-top: 40%;
        position: relative;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        background-color: rgba(0,0,0,.2);
    }
    .songintr{
        position: absolute;
        left: 10px;
        bottom: 10px;
    }
    .songintr>h3{
        color: #fff;
    }
    .songintr>p{
        color: #eee;
        font-size: 12px;
    }
    .rcmd{
        background-image: url(../../static/img/1.png);
    }
    .hy{
       background-image: url(../../static/img/2.png); 
    }
    .om{
        background-image: url(../../static/img/3.png);
    }
    .hg{
        background-image: url(../../static/img/4.png);
    }
    .rb{
        background-image: url(../../static/img/5.png);
    }
    .res_cell{
        padding: 10px;
    }
    .album_pic,.singer_pic{
        width: 40px;
        height: 40px;
        /* margin-right: 10px; */
        background: url(../../static/img/user.png) no-repeat;
        background-size: contain;
        background-position: center;
    }
    .album_pic img{
        border-radius: 5px;
        width: 100%;
        height: 100%;
    }
    .reloads{
        margin-top: 20px;
    }
</style>