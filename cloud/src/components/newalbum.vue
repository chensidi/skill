<template>
    <div class="album-container mui-scroll-wrapper">
        <div class="mui-scroll">
            <Slider />
            <h1 class="skin-recommend-title" :style="{'color':this.getColorObj[this.getColor].title}">最新专辑</h1>   
            <div class="weui-panel__bd" id="recommand">
                <router-link :to="{path:'/album',query:{obj:obj}}" class="weui-media-box weui-media-box_appmsg" v-for="(obj,i) of albums" :key="i">
                    <div class="weui-media-box__hd" v-lazy-container="{ selector: 'img' }">
                        <img class="weui-media-box__thumb" data-loading='../../static/img/lazy.png' :data-src='obj.artist.picUrl'>
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" :style="{'color':getColor==1?'#fff':'#333'}">{{obj.name}}</h4>
                        <p class="weui-media-box__desc" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{obj.artist.name}}</p>
                    </div>
                    <div class="weui-panel__ft"><time class="pub_time" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{pubTime(obj.publishTime)}}</time></div>
                </router-link>
                <div class="mask" id="newmask" v-show="loading">
                    <div class="load">
                        <i class="weui-loading"></i>
                        <span class="weui-loadmore__tips">正在加载</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import Slider from './slider';
export default {
    name: 'NewAlbum',
    data(){
        return{
            albums: [],
            loading: true
        }
    },
    created(){
        $.get(`${this.getMyApi}/top/album?limit=20`).then((dt)=>{
            setTimeout(()=>{
                this.loading = false;
            },500)
            this.albums = dt.albums;
        })
    },
    computed: {
        ...mapGetters(['getColor','getColorObj','getMyApi'])
    },
    methods: {
        pubTime(time){
            var t = new Date(time);
            return t.getFullYear() + '-' + Number(t.getMonth()+1) + '-' + t.getDate();
	    }
    },
    mounted(){
        // mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
        mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
    },
    components: {Slider}
}
</script>
<style scoped>
    .mask{
        display: flex;
    }
    .load{
        /* margin: auto */
    }
    #recommand{
        transform: translateY(-10px)
    }
    #recommand a{
        padding: 10px 15px;
    }
    #recommand a img{
        height: 100%;
    }
</style>