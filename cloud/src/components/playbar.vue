<template>
    <footer :style='{"background-color":this.getColorObj[this.getColor].tb}'>
        <div class="player-img rotate">
            <img src="http://y.gtimg.cn/music/photo_new/T002R300x300M000000W50Ni1rt0ep.jpg?max_age=2592000" alt="">
        </div>
        <div class="player-center">
            <div class="weui-progress">
                    <div class="weui-progress__bar">
                        <div class="weui-progress__inner-bar js_progress" style="width: 80%;"></div>
                    </div>
            </div>
            <span class="song" :style="{'color':getColor==1?'#fff':'#333'}">不后悔</span>
            <span class="singer" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">张学友</span>
            <div class="play-right">
                <div class="play"><van-icon :style="{'color':this.getColorObj[this.getColor].title}" :name="isPlay?'pause':'play'" @click="play" /></div>
            </div>
        </div>
    </footer>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'Playbar',
    data(){
        return {
            isPlay: false
        }
    },
    created(){
    },
    computed: {
        ...mapGetters(['getColor','getColorObj'])
    },
    methods: {
       play(){
           this.isPlay = !this.isPlay;
       } 
    }
}
</script>
<style scoped>
    .song,.singer{
        line-height: 1;
    }
    .song{
        margin-top: 5px;
    }
    .singer{
        margin-top: 2px;
    }
    .play-right{
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 1px;
        font-size: 26px;
    }
</style>