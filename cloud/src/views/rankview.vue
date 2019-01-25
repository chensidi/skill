<template>
    <div>
        <van-nav-bar
            :title="datas.h1"
            left-arrow
            :fixed='true'
            :z-index='10'
            @click-left="back"
        />
        <div class="album_wrap">
            <div class="ab_bg" :style="{'background-image':`url(${datas.img})`}">
                <div class="ab_mask"></div>
                <div class="playall">
                    <wv-button type="primary"  :mini="true">播放全部</wv-button>
                </div>
            </div>
            <div class="ab_box" :style="{'background':this.getColorObj[this.getColor].bgMain}">
                <h1 class="song_total" :style="{'color':getColor==1?'#ddd':'#333'}">专辑 共{{datas.dts.length}}首</h1>
                <ul class="ab_song">
                    <li v-for='(item,i) of datas.dts' :key="i" @click='goPlay(item)'>
                        <a>
                            <div :class="i==0?'number n1':(i==1?'number n2':(i==2?'number n3':'number'))">{{i+1}}</div>
                            <div>
                                <p class="elp s_name" :style="{'color':getColor==1?'#ddd':'#000'}">{{item.name}}</p>
                                <p class="elp s_singer" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{item.ar[0].name}}</p>
                            </div>
                        </a>
                    </li>
                </ul>
                <div>
                    <h1 class="des" :style="{'color':getColor==1?'#ddd':'#333)'}">简介</h1>
                    <p :style="{'color':getColor==1?'#ddd':'#333'}">{{datas.des}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Rankview',
    data(){
        return {
            datas: null
        }
    },
    created(){
        this.datas = this.$route.params.datas;
    },
    computed: {
        ...mapGetters(['getColorObj','getColor','getMyApi'])
    },
    methods: {
        ...mapActions(['setKey','setPlay','setMp3','setCover','setInfo']),
        back(){
            history.go(-1);
        },
        goPlay(obj){
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                this.setKey(false);
                this.setPlay(true);
                this.setMp3(dt.data[0].url);
                this.setCover(obj.al.picUrl);
                this.setInfo({m:obj.name,n:obj.ar[0].name});
            })
        }
    }
}
</script>
<style scoped>
    
</style>
