<template>
    <div>
        <van-nav-bar
            :title="datas.name"
            left-arrow
            :fixed='true'
            :z-index='10'
            @click-left="back"
        />
        <div class="album_wrap">
            <div class="ab_bg" :style="{'background-image':`url(${datas.picUrl})`}">
                <div class="ab_mask"></div>
                <div class="playall">
                    <wv-button type="primary"  :mini="true">播放全部</wv-button>
                </div>
            </div>
            <div class="ab_box" :style="{'background':this.getColorObj[this.getColor].bgMain}">
                <h1 class="song_total" :style="{'color':getColor==1?'#ddd':'#333'}">专辑 共{{songs.length}}首</h1>
                <ul class="ab_song">
                    <li v-for="(obj,i) of songs" :key="i" @click="goPlay(obj)">
                        <router-link to="" >
                            <p class="elp s_name" :style="{'color':getColor==1?'#ddd':'#000'}">{{obj.name}}</p>
                            <p class="elp s_singer" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{obj.ar[0].name}}</p>
                        </router-link>
                    </li>
                </ul>
                <div>
                    <h1 class="des" :style="{'color':getColor==1?'#ddd':'#333)'}">简介</h1>
                    <p :style="{'color':getColor==1?'#ddd':'#333'}">{{des}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Album',
    data(){
        return {
            datas: {},
            songs: [],
            des: ''
        }
    },
    created(){
        this.datas = this.$route.params.obj;
        this.getSongs();
    },
    computed: {
        ...mapGetters(['getColor','getMyApi','getColorObj','getDuration'])
    },
    methods: {
        ...mapActions(['setPlay','setMp3','setCover','setInfo','setDuration','setKey']),
        back(){
            history.go(-1);
        },
        getSongs(){
            $.get(`${this.getMyApi}/album?id=${this.datas.id}`).then(dt=>{
                this.des = dt.album.description;
                this.songs = dt.songs;
            })
        },
        goPlay(obj){
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                this.setKey(false);
                this.setPlay(true);
                this.setMp3(dt.data[0].url);
                this.setCover(this.datas.picUrl);
                this.setInfo({m:obj.name,n:obj.ar[0].name});
            })
        }
    }
}
</script>
<style scoped>
    .ab_song li a{
        display: block;
    }
</style>
