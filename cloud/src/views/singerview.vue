<template>
    <div>
        <van-nav-bar
            :title="name"
            left-arrow
            :fixed='true'
            :z-index='10'
            @click-left="back"
        />
        <div class="mui-scroll-wrapper">
            <div class="mui-scroll">
                    <div class="album_wrap">
                        <div class="ab_bg" :style="{'background-image':`url(${img})`}">
                            <div class="ab_mask"></div>
                            <div class="playall">
                                <wv-button type="primary"  :mini="true">播放全部</wv-button>
                            </div>
                        </div>
                        <div class="ab_box" :style="{'background':this.getColorObj[this.getColor].bgMain}">
                            <h1 class="song_total" :style="{'color':getColor==1?'#ddd':'#333'}">热门歌曲 共{{songs.length}}首</h1>
                            <div>
                                <ul class="mui-table-view"> 
                                    <li class="mui-table-view-cell mui-collapse">
                                        <a class="mui-navigate-right" href="#">简介</a>
                                        <div class="mui-collapse-content">
                                            <p>{{des}}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <ul class="ab_song">
                                <li v-for="(obj,i) of songs" :key="i" @click="goPlay(obj)">
                                    <router-link to="">
                                        <p class="elp s_name" :style="{'color':getColor==1?'#ddd':'#000'}">{{obj.name}}</p>
                                        <p class="elp s_singer" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{name}}</p>
                                    </router-link>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
            </div>
        </div>  
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Singerview',
    data(){
        return {
            id: this.$route.params.id,
            name: '',
            des: '',
            img: '',
            songs: []
        }
    },
    created(){
        this.delNoEffect();
        this.getSingerInfo();
    },
    computed: {
        ...mapGetters(['getColorObj','getColor','getMyApi'])
    },
    methods: {
        ...mapActions(['setKey','setPlay','setMp3','setCover','setInfo','setIndex']),
        back(){
            history.go(-1);
        },
        delNoEffect(){
            for(var i = mui.hooks.inits.length-1,item;i >= 0;i --){//解决mui上拉加载后scroll失效
				item = mui.hooks.inits[i];
				if(item.name=="pullrefresh"){
				    item.repeat = true;
				}
            }
            
        },
        getSingerInfo(){
            $.get(`${this.getMyApi}/artists?id=${this.id}`).then(dt=>{
                this.name = dt.artist.name;
                this.img = dt.artist.picUrl;
                this.des = dt.artist.briefDesc;
                this.songs = dt.hotSongs;
            })
        },
        goPlay(obj){
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                this.setKey(false);
                this.setPlay(true);
                this.setMp3(dt.data[0].url);
                this.setCover(obj.al.picUrl);
                this.setInfo({m:obj.name,n:this.name});
                this.save({id:obj.id,cover:obj.al.picUrl,name:obj.name,singer:this.name});
            })
        },
        save(obj){
            var hist = JSON.parse(localStorage.getItem('hist'))||[];
            for(let i = 0; i < hist.length; i ++){
                if(hist[i].id==obj.id){
                    this.setIndex(i);
                    return;
                }
            }
            hist.unshift({id:obj.id,cover:obj.cover,name:obj.name,singer:obj.singer});
            localStorage.setItem('hist',JSON.stringify(hist));
            this.setIndex(0);
        }
    },
    mounted(){
        mui('.mui-scroll-wrapper').scroll({
	        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
}
</script>
<style scoped>
    .ab_song li a{
        display: block;
    }
    .song_total{
        margin-bottom: 10px;
    }
    .mui-table-view-cell.mui-active{
        background: #fff;
    }
</style>
