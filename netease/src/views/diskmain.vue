<template>
    <div>
        <Head :child="true">
            <span slot="hname">迪爷新碟</span>
        </Head>
        <div class="diskmain">
            <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="loadDisk"
                        :error.sync="err"
                        error-text="点击重新加载"
                >
            <van-grid :column-num="2" :gutter="10">
                
                    <van-grid-item v-for="item of disk" :key="'dk'+item.id" :to="'/album/'+item.id">
                        <div class="cmd_box">
                            <van-image lazy-load :src="item.picUrl" />
                            <p class="disk_name">{{item.name}}<em v-if="item.alias[0]">({{item.alias[0]}})</em></p>
                            <p class="disk_owner">{{item.artist.name}}</p>
                        </div>
                    </van-grid-item>
                
            </van-grid>
            </van-list>
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
    name: 'MainDisk',
    data(){
        return {
            disk: [],
            loading: false,
            finished: false,
            err: false,

        }
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        loadDisk(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/top/album?offset=${this.disk.length}&limit=30`,
                timeout: 15000
            }).then(res=>{
                this.loading = false;
                console.log(res);
                if(res.data.code == 200){
                    this.err = false;
                    if(res.data.albums&&res.data.albums.length>0){
                        this.disk = this.disk.concat(res.data.albums);
                    }else{
                        this.finished = true;
                    }
                }else{
                    Toast.fail('网络请求错误');
                    this.err = true;
                }
            }).catch(err=>{
                this.loading = false;
                Toast.fail('网络请求错误');
                this.err = true;
            })
        }
    },
    components: {Head}
}
</script>
<style scoped>
    .diskmain{
        margin: 50px 0;
    }
    .disk_name,.disk_owner{
        -webkit-line-clamp: 1;
        color: #333;
        display: -webkit-box;             
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .disk_owner{
        font-size: 12px;
        color: #999;
    }
    .cmd_box,.dk{
        position: relative;
    }
    .msk{
        background: url(../../static/img/coverall.png) no-repeat;
        background-position: 0 -570px;
        position: absolute;
        width: 118%;
        height: 100%;
        top: 0;
        left: 0;
        background-size: cover;
    }
</style>