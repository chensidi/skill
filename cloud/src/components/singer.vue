<template>
    <div id="singers">
        <div class="kind">
            <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                <div class="mui-scroll" id="type">
                    <a v-for='(obj,i) of types' :style="{'color':getColor==1?'#fff':'#333'}" :key="i" :class="i==type?className[getColor]:''" @click="changeType(i,obj.id)">{{obj.info}}</a>
                </div>
            </div>
            <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                <div class="mui-scroll" id="index">
                    <a v-for="(item,j) of indexs" :style="{'color':getColor==1?'#fff':'#333'}" :key="j" :class="j==index?className[getColor]:''" @click="changeIndex(j,item.tag)">{{item.txt}}</a>
                </div>
            </div>
        </div>
        <ul class="singers">
            <li v-for="(obj,i) of res" :key="i">
                <router-link to="" v-lazy-container="{ selector: 'img' }">
                    <img class="s_img" :data-src="obj.img1v1Url" data-loading='../../static/img/lazy.png' alt="">
                    <span class="s_name" :style="{'color':getColor==1?'#ddd':'#333'}">{{obj.name}}</span>
                </router-link>
            </li>
        </ul>
        <div class="mask" id="singer_mask" v-show="loading">
            <div class="load">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { setTimeout } from 'timers';
export default {
    name: 'Singer',
    data(){
        return{
            types: [
			  {info:'入驻歌手',id:5001},
			  {info:'华语男',id:1001},
			  {info:'华语女',id:1002},
			  {info:'华语组合',id:1003},
			  {info:'欧美男',id:2001},
			  {info:'欧美女',id:2002},
			  {info:'欧美组合',id:2003},
			  {info:'日本男',id:6001},
			  {info:'日本女',id:6002},
			  {info:'日本组合',id:6003},
			  {info:'韩国男',id:7001},
			  {info:'韩国女',id:7002},
			  {info:'韩国组合',id:7003},
			  {info:'其他男',id:4001},
			  {info:'其他女',id:4002},
			  {info:'其他组合',id:4003}
          ],
          className: ['k','y','b','r','g'],
          type: 0,
          index: 0,
          indexs: [],
          addr: `/top/artists?offset=0&limit=30`,
          res: [],
          loading: true,
          cat: '',
          initial: ''
        }
    },
    created(){
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
        for(let i = 64; i <= 90; i ++){
			var txt = i==64?'推荐':String.fromCharCode(i),
                tag = i==64?'':String.fromCharCode(i);
            this.indexs.push({txt,tag})
        }
        this.topSingers();
    },
    methods: {
        changeType(i,cat){
            this.type = i;
            this.cat = cat;
            this.loading = true;
            $.get(`${this.getMyApi}/artist/list?cat=${cat}&initial=${this.initial}`).then((dt)=>{
                this.res = dt.artists;
                setTimeout(()=>{
                    this.loading = false;
                },500)
            })
        },
        changeIndex(i,initial){
            this.index = i;
            this.initial = initial;
            this.loading = true;
            $.get(`${this.getMyApi}/artist/list?cat=${this.cat}&initial=${initial}`).then((dt)=>{
                this.res = dt.artists;
                setTimeout(()=>{
                    this.loading = false;
                },500)
            })
        },
        topSingers(){
            // `/artist/list?cat=${cat}&initial=${initial}`;
            this.loading = true;
            $.get(`${this.getMyApi}${this.addr}`).then((dt)=>{
                setTimeout(()=>{
                    this.loading = false;
                },500)
                // console.log(dt);
                this.res = dt.artists;
            })
        }
    },
    computed: {
        ...mapGetters(['getColor','getMyApi'])
    },
    mounted(){
        mui('.mui-scroll-wrapper').scroll({
			scrollY: false, 
			scrollX: true,
			deceleration:0.0006,
			bounce: true
		})
    }
}
</script>
<style scoped>
    .kind{
        padding: 10px 20px;
        font-size: 14px;
    }
    .kind a{
        padding: 3px 8px;
        text-decoration: none;
        color: inherit;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 10px;
        color: #333;
        font-size: 14px;
        line-height: 1;
    }
    .kind a.k{
        color: #FFA500 !important;
        border: 1px solid #FFA500 !important;   
    }
    .kind a.y{
        color: #FFD700 !important;
        border: 1px solid #FFD700 !important;
    }
    .kind a.b{
        color: #2CA2F9 !important;
        border: 1px solid #2CA2F9 !important;
    }
    .kind a.r{
        color: #D43C33 !important;
        border: 1px solid #D43C33 !important;
    }
    .kind a.g{
        color: #31C27C !important;
        border: 1px solid #31C27C !important;
    }
    .singers{
        padding: 0 15px;
    }
    .singers li{
        margin-bottom: 10px;
    }
    .singers a{
        display: flex;
        width: 100%;
        align-items: center;
    }
    .s_img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
    }
    .s_name{
        font-size: 16px;
    }
</style>

