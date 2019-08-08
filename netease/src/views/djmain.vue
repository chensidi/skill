<template>
    <div>
        <Head :child="true">
            <span slot="hname">迪爷电台</span>
        </Head>
        <div class="djmain">
            <div>    
                <h3 class="top_title flex-c s-between">
                    <em>电台推荐</em>
                    <van-button round size="mini" @click="changeC"><van-icon name="replay"></van-icon>换一换</van-button>
                </h3>
                <van-grid :border="false" :column-num="3" :center="false">
                    <van-grid-item v-for="item of showRcmd" :key="'djm'+item.id" :to="'/dj/'+item.id">
                        <div class="itemcover">
                            <!-- <van-image lazy-load :src="item.picUrl"></van-image> -->
                            <img v-lazy="item.picUrl">
                            <span class="msk elp">{{item.copywriter}}</span>
                        </div>
                        <p class="itemname">{{item.name}}</p>
                    </van-grid-item>
                </van-grid>
                <p class="text-center" v-show="rcmdErr||otherErr">
                    <van-button type="info" @click="()=>{loadRcmd(),loadCate()}">重新加载</van-button>
                </p>
            </div> 
            <div v-for="(item,i) of newList">
                <h3 class="top_title flex-c s-between">
                    <em>{{item.name}}</em>
                    <router-link :to="'/main/djlist/'+item.id">
                        <van-button round size="mini"><van-icon name="replay"></van-icon>换一换</van-button>
                    </router-link>
                </h3>
                <van-grid :border="false" :column-num="3" :center="false">
                    <van-grid-item v-for="(items,j) of item.sub" :key="'djc'+items.id" :to="'/dj/'+items.id">
                        <div class="itemcover">
                            <!-- <van-image lazy-load :src="items.picUrl"></van-image> -->
                            <img v-lazy="items.picUrl">
                            <span class="msk elp">{{items.copywriter}}</span>
                        </div>
                        <p class="itemname">{{items.name}}</p>
                    </van-grid-item>
                </van-grid>
            </div>

            <div>
                <h3 class="top_title">
                    <em>热门分类</em>
                </h3>
                <van-grid :column-num="2">
                    <van-grid-item v-for="item of cates.slice(0,6)" :to="'/main/djlist/'+item.id" :key="'tb'+item.id">
                        <div class="flex-c" style="min-width:8em;">
                            <img v-lazy="item.pic84x84IdUrl" :alt="item.name" width="30">
                            <span class="tb_title">{{item.name}}</span>
                        </div>
                    </van-grid-item>
                </van-grid>

                <h3 class="top_title">
                    <em>更多分类</em>
                </h3>
                <van-grid :column-num="2">
                    <van-grid-item v-for="item of cates.slice(6)" :to="'/main/djlist/'+item.id" :key="'tb'+item.id">
                        <div class="flex-c" style="min-width:8em;">
                            <img v-lazy="item.pic84x84IdUrl" :alt="item.name" width="30">
                            <span class="tb_title">{{item.name}}</span>
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>
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
    name: 'MainDj',
    data(){
        return{
            rcmd: [],
            showRcmd: [],
            rcmdIndex: 0,
            cates: [],
            cateList: [],
            newList: [],
            loadover: false,
            rcmdErr: false,
            otherErr: false
        }
    },
    created(){
        this.loadRcmd();
        this.loadCate();
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    methods: {
        loadRcmd(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/dj/recommend`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                this.loadover = true;
                if(res.data.code == 200){
                    this.rcmdErr = false;
                    this.rcmd = res.data.djRadios;
                    this.showRcmd = this.rcmd.slice(0,3);
                }else{
                    this.rcmdErr = true;
                    Toast.fail('网络加载错误');
                }
            }).catch(err=>{
                this.rcmdErr = true;
                this.loadover = true;
                Toast.fail('网络加载错误');
            })
        },
        changeC(){
            this.rcmdIndex += 3;
            if(this.rcmdIndex >= this.rcmd.length){
                this.rcmdIndex = 0;
            }
            this.showRcmd = this.rcmd.slice(this.rcmdIndex,this.rcmdIndex+3);
        },
        loadCate(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/dj/catelist`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.cates = res.data.categories;
                    this.cateList = res.data.categories;

                    this.otherErr = false;

                    this.cates.map(obj=>{
                        this.loadRcmdDj(obj.id);
                    })
                }else{
                    Toast.fail('网络加载错误');
                    this.otherErr = true;
                }
            }).catch(err=>{
                Toast.fail('网络加载错误');
                this.loadover = true;
                this.otherErr = true;
            })
        },
        loadRcmdDj(type){
            axios({
                method: 'get',
                url: `${this.getMyApi}/dj/recommend/type?type=${type}`,
                timeout: 15000
            }).then(res=>{
                // console.log(res);
                if(res.data.code == 200){
                    for(let i = 0; i < this.cateList.length; i ++){
                        if(this.cateList[i].id == type){
                            this.cateList[i].data = res.data.djRadios;
                            let obj = this.cateList[i];
                            obj.index = 0;
                            obj.sub = obj.data.slice(obj.index,obj.index+3);
                            this.newList.splice(i,1,obj);
                            break;
                        }
                    }
                }
            })
        },
        changeM(index){
            console.log(this.newList[index].index)
            // this.newList[index].index += 3;
            // if(this.newList[index].index >= this.newList[index].data.length){
            //     this.newList[index].index = 0;
            // }
            let i = this.newList[index].index;
            i += 3;
            if(i >= this.newList[index].data.length){
                i = 0;
            }
            // Vue.set(this.newList[index],'index',i)
            this.newList[index].index = i;
            let d = this.newList;
            this.newList = Object.assign([], this.newList)
            // this.newList[index].sub.splice(0,1)
            console.log(this.newList[index].sub)
            // console.log(this.newList[index].sub)
            // this.newList[index].sub.pop();
            // this.newList[index].sub = this.newList[index].data.slice(this.newList[index].index,this.newList[index].index+3)
        }
    },
    components: {Head,Masks}
}
</script>
<style scoped>
    .djmain{
        margin: 50px 0;
        padding: 0 10px;
    }
    .top_title{
        color: #000;
        line-height: 3em;
        font-weight: bold;
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
    .tb_title{
        margin-left: 5px;
    }
</style>