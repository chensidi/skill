<template>
    <div>
        <Head :child="true">
            <span slot="hname">迪爷歌单</span>
        </Head>
        <div class="mpy">
            <van-tabs v-model="active" sticky :offset-top="50" animated swipeable @change="changes">
                <van-tab :title="cats" v-for="(cats,i) of typeArr" :name="i" :key="'tp'+i">
                    <van-list
                        v-model="loadingAll"
                        :finished="finishedAll"
                        finished-text="没有更多了"
                        @load="onLoadData(i)"
                        :error.sync="errAll"
                        error-text="点击重新加载"
                    >
                        <van-grid :column-num="3" :gutter="0">
                            <van-grid-item
                                v-for="item of allList[i]"
                                :key="'apy'+item.id"
                                text="文字"
                                :to="'/pylist/'+item.id"
                            >
                                <div class="cmd_box">
                                    <!-- <van-image :src="item.coverImgUrl" lazy-load /> -->
                                    <img v-lazy="item.coverImgUrl">
                                    <p class="cmd_name">{{item.name}}</p>
                                    <i class="play_sub">
                                        <van-icon name="play" color='#fff' />
                                        {{(item.playCount/10000).toFixed(0)+'万'}}
                                    </i>
                                </div>
                            </van-grid-item>
                        </van-grid>
                    </van-list>
                </van-tab>

            </van-tabs>
        </div>
        
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
    name: 'MainPy',
    components: {Head},
    data(){
        return {
            active: this.getPy,
            // allList: [],
            loadingAll: false,
            finishedAll: false,
            errAll: false,
            typeArr: ['全部','华语','民谣','电子','轻音乐','影视原声','ACG','怀旧','治愈'],
            allList: [[],[],[],[],[],[],[],[],[]],
            loadingArr: [false,false,false,false,false,false,false,false,false],
            finishedArr: [false,false,false,false,false,false,false,false,false],
            errArr: [false,false,false,false,false,false,false,false,false]
        }
    },
    created(){
    },
    methods: {
        onLoadAll(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/playlist?offset=${this.allList.length}&limit=30`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadingAll = false;
                if(res.data.code == 200){
                    this.errAll = false;
                    if(res.data.playlists&&res.data.playlists.length>0){
                        this.allList = this.allList.concat(res.data.playlists);
                    }else{
                        this.finishedAll = true;
                    }
                }else{
                    Toast.fail('网络请求错误');
                    this.errAll = true;
                }
            }).catch(err=>{
                this.loadingAll = false;
                Toast.fail('网络请求错误');
                this.errAll = true;
            })
        },
        onLoadData(type){
            let cat = this.typeArr[type];
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/playlist?offset=${this.allList[type].length}&limit=30&cat=${cat}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadingAll = false;
                if(res.data.code == 200){
                    this.errAll = false;
                    if(res.data.playlists&&res.data.playlists.length>0){
                        this.allList[type] = this.allList[type].concat(res.data.playlists);
                    }else{
                        this.finishedAll = true;
                    }
                }else{
                    Toast.fail('网络请求错误');
                    this.errAll = true;
                }
            }).catch(err=>{
                this.loadingAll = false;
                Toast.fail('网络请求错误');
                this.errAll = true;
            })
        },
        changes(name,index){
            this.setPy(name);
        },
        ...mapActions(['setPy'])
    },
    computed: {
        ...mapGetters(['getMyApi','getPy'])
    }
}
</script>
<style scoped>
    .mpy{
        margin-top: 50px;
        margin-bottom: 50px;
    }
    .lunbo{
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
        /* width: 100%; */
        height: 100%;
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
</style>
