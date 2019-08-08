<template>
    <div>
        <Head :child="true">
            <span slot="hname">电台分类</span>
        </Head>
        <div class="djlist">  
            <van-grid :border="false" :column-num="3" :center="false">
                <van-grid-item v-for="(items,j) of djlist" :key="'djl'+items.id" :to="'/dj/'+items.id">
                    <div class="itemcover">
                        <!-- <van-image lazy-load :src="items.picUrl" class="mpc" fit="contain"></van-image> -->
                        <img v-lazy="items.picUrl">
                        <span class="msk elp">{{items.copywriter}}</span>
                        <!-- <img src="/static/img/blank.png" alt="" class="zw"> -->
                    </div>
                    <p class="itemname">{{items.name}}</p>
                </van-grid-item>
            </van-grid>  
            <p class="text-center" v-show="error" style="margin-top:20px;">
                <van-button type="info" @click="loadRadios">
                    重新加载
                </van-button>
            </p>
        </div>
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
    name: 'DjList',
    components: {Head,Masks},
    data(){
        return {
            djid: this.$route.params.id,
            loadover: false,
            error: false,
            djlist: []
        }
    },
    created(){
        this.loadRadios();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
       loadRadios(){
           this.loadover = false;
           axios({
               method: 'get',
               url: `${this.getMyApi}/dj/recommend/type?type=${this.djid}`,
               timeout: 15000
           }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.djlist = res.data.djRadios;
                    this.error = false;
                }else{
                    this.error = true;
                    Toast.fail('网路请求错误');
                }
           }).catch(err=>{
               this.loadover = true;
               this.error = true;
               Toast.fail('网路请求错误');
           })
       }
    }
}
</script>
<style scoped>
    .djlist{
        margin: 50px 0;
    }
    .itemcover{
        position: relative;
        overflow: hidden;
        background: url(../../static/img/blank.png) no-repeat;
        background-size: contain;
        background-position: center;
    }
    .itemcover img{
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
    .zw{
        position: absolute;
        left: 0;
        top: -4px;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .mpc{
        z-index: 2;
    }
</style>