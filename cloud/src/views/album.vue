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
                    <li v-for="(obj,i) of songs" :key="i">
                        <router-link to="">
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
import {mapGetters} from 'vuex';
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
        // console.log(this.$route.query);
        this.datas = this.$route.query.obj;
        this.getSongs();
    },
    computed: {
        ...mapGetters(['getColor','getMyApi','getColorObj'])
    },
    methods: {
        back(){
            history.go(-1);
        },
        getSongs(){
            $.get(`${this.getMyApi}/album?id=${this.datas.id}`).then(dt=>{
                // console.log(dt);
                this.des = dt.album.description;
                this.songs = dt.songs;
            })
        }
    }
}
</script>
<style scoped>
    .album_wrap{
        position: relative;
        margin-top: 46px;
        margin-bottom: 55px;
    }
    .ab_bg{
        position: relative;
        z-index: 1;
        width: 100%;
        padding-top: 70%;
        background-repeat: no-repeat;
        background-size: cover;
        transform-origin: top center;
        transition: transform;
        transform: scale(1, 1);
    }
    .ab_mask{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0,0,0,.3);
    }
    .ab_box{
        padding: 25px 25px 0;
    }
    .song_total{
        font-size: 14px;
        margin: 0;
    }
    .ab_song{
        margin-top: 20px;
    }
    .ab_song li{
        padding-bottom: 25px;
    }
    .ab_song li a{
        display: block;
    }
    .s_name{
        font-size: 16px;
        margin-bottom: 0;
    }
    .s_singer{
        font-size: 14px;
        margin-bottom: 0;
    }
    .playall{
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        color: gold;
    }
    .des{
        font-size: 18px;
        font-weight: 100;
        text-align: center;
        margin-bottom: 15px;
        line-height: 1;
    }
</style>
