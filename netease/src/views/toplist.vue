<template>
    <div>
        <Head :child="true">
            <span slot="hname">迪爷排行榜</span>
        </Head>
        <div class="toplist">
            <div v-for="item of topLists.slice(0,1)" :key="'top'+item.id">
                <h3 class="top_title">{{item.name}}</h3>
                <div>
                    <router-link :to="'/pylist/'+item.id" class="flex listitem">
                        <div class="itemcover">
                            <!-- <van-image lazy-load width="120" height="120" :src="item.coverImgUrl"></van-image> -->
                            <img v-lazy="item.coverImgUrl" style="width:110px">
                            <span class="msk">{{item.updateFrequency}}</span>
                        </div>
                        <div class="listtrack">
                            <p class="elp" v-for="(obj,i) of item.tracks">{{i+1+' '}}{{obj.first+'-'+obj.second}}</p>
                        </div>
                    </router-link>
                </div>
            </div>

            <div>
                <h3 class="top_title">官方榜</h3>
                <div v-for="item of topLists.slice(1,7)" :key="'top'+item.id">
                    <router-link :to="'/pylist/'+item.id" class="flex listitem">
                        <div class="itemcover">
                            <!-- <van-image lazy-load width="120" height="120" :src="item.coverImgUrl"></van-image> -->
                            <img v-lazy="item.coverImgUrl" style="width:110px">
                            <span class="msk">{{item.updateFrequency}}</span>
                        </div>
                        <div class="listtrack">
                            <p class="elp" v-for="(obj,i) of item.tracks">{{i+1+' '}}{{obj.first+'-'+obj.second}}</p>
                        </div>
                    </router-link>
                </div>
            </div>

            <div>
                <h3 class="top_title">推荐榜</h3>
                <van-grid :column-num="3" :center="false">
                    <van-grid-item v-for="item of topLists.slice(7,13)" :key="'top'+item.id" :to="'/pylist/'+item.id">
                        <div class="itemcover">
                            <!-- <van-image lazy-load :src="item.coverImgUrl"></van-image> -->
                            <img v-lazy="item.coverImgUrl" width="90">
                            <span class="msk">{{item.updateFrequency}}</span>
                        </div>
                        <p class="itemname">{{item.name}}</p>
                    </van-grid-item>
                </van-grid>
            </div>

            <div>
                <h3 class="top_title">全球榜</h3>
                <van-grid :column-num="3" :center="false">
                    <van-grid-item v-for="item of topLists.slice(13,19)" :key="'top'+item.id" :to="'/pylist/'+item.id">
                        <div class="itemcover">
                            <!-- <van-image lazy-load :src="item.coverImgUrl"></van-image> -->
                            <img v-lazy="item.coverImgUrl">
                            <span class="msk">{{item.updateFrequency}}</span>
                        </div>
                        <p class="itemname">{{item.name}}</p>
                    </van-grid-item>
                </van-grid>
            </div>

            <div>
                <h3 class="top_title">更多榜单</h3>
                <van-grid :column-num="3" :center="false">
                    <van-grid-item v-for="item of topLists.slice(19)" :key="'top'+item.id" :to="'/pylist/'+item.id">
                        <div class="itemcover">
                            <!-- <van-image lazy-load :src="item.coverImgUrl"></van-image> -->
                            <img v-lazy="item.coverImgUrl">
                            <span class="msk">{{item.updateFrequency}}</span>
                        </div>
                        <p class="itemname">{{item.name}}</p>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <p class="text-center" v-show="error" style="margin-top: 20px;">
            <van-button type="info" @click="loadTopList">重启加载</van-button>
        </p>
        <Masks :loadover="loadover" />
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex';
import axios from 'axios';
import Vue from 'vue';
import Head from '../components/head';
import Masks from '../components/mask';
import { Swipe,SwipeItem,Toast,Grid,GridItem,Image,Icon,List,Button,Search,Tab,Tabs} from 'vant';

Vue.use(Swipe)
    .use(SwipeItem)
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
    name: 'TopList',
    data(){
        return{
            topLists: [],
            loadover: false,
            error: false
        }
    },
    created(){
        this.loadTopList();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        loadTopList(){
            this.loadover = false;
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/toplist/detail`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadover = true;
                if(res.data.code == 200){
                    this.topLists = res.data.list;
                    this.error = false;
                }else{
                    this.error = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.error = true;
                this.loadover = true;
                Toast.fail('网络请求错误');
            })
        }
    },
    components: {Head,Masks}
}
</script>
<style scoped>
    .toplist{
        margin: 50px 0;
        padding: 0 10px;
    }
    .top_title{
        color: #000;
        line-height: 3em;
        font-weight: bold;
    }
    .listitem{
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .listtrack{
        flex: 1;
        margin-left: 10px;
        color: #999;
        overflow: hidden;
    }
    .listtrack p{
        line-height: 2em;
    }
    .itemcover{
        position: relative;
        overflow: hidden;
        background: url(../../static/img/blank.png) no-repeat;
        background-size: contain;
        background-position: center;
    }
    .itemcover>img{
        width: 100%;
    }
    .msk{
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        height: 30px;
        background: linear-gradient(to top,rgba(0,0,0,.3),rgba(0,0,0,.01));
        display: block;
        color: #eee;
        font-size: 12px;
        line-height: 30px;
        text-indent: 1em;
    }
    .itemname{
        overflow: hidden;
        text-overflow:ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
</style>
