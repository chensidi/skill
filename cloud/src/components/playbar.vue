<template>
    <footer :style='{"background-color":this.getColorObj[this.getColor].tb}'>
        <div class="player-img rotate">
            <img :src="getCover" alt="">
        </div>
        <div class="player-center">
            <div class="weui-progress">
                    <div class="weui-progress__bar">
                        <div class="weui-progress__inner-bar js_progress" :style="{'width': width}"></div>
                    </div>
            </div>
            <span class="song" :style="{'color':getColor==1?'#fff':'#333'}">{{getInfo.name}}</span>
            <span class="singer" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{getInfo.singer}}</span>
            <div class="play-right">
                <div class="play"><van-icon :style="{'color':this.getColorObj[this.getColor].title}" :name="getPlay?'pause':'play'" @click="play" /></div>
            </div>
        </div>
        <audio id="mp3"></audio>
    </footer>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
let timer;
export default {
    name: 'Playbar',
    data(){
        return {
            isPlay: this.getPlay,
            mp3: $('#mp3')[0],
            duration: '',
            cur: this.getDuration,
            width: '0%',
            timer: null
        }
    },
    created(){
    },
    computed: {
        ...mapGetters(['getColor','getColorObj','getMp3','getPlay','getCover','getInfo','getDuration'])
    },
    methods: {
        ...mapActions(['setPlay','setDuration']),
        play(){
            this.isPlay = this.getPlay;
            this.setPlay(!this.getPlay);
        },
        progress(){
            clearInterval(timer);
            if(this.cur>=Math.floor(this.duration)){
                clearInterval(timer);
                this.width = '0%';
                this.cur = 0;
                $('#mp3')[0].currentTime = 0;
            }
            timer = setInterval(()=>{
                this.cur += 1;
                this.width = this.cur/this.duration*100+'%'
            },1000)
        } 
    },
    updated(){
        clearInterval(timer);
        if(this.getPlay){           
                this.duration = document.getElementById('mp3').duration;
                // console.log(this.duration)
            
            $('#mp3').attr('src',this.getMp3);
            $('#mp3')[0].play();
            this.progress();
        }else{
            $('#mp3')[0].pause()
        }
    },
    watch: {
        isPlay(now,old){
            // console.log(old);
            // if(old){
            //     $('#mp3')[0].play()
            //     // this.progress();
            // }else{
            //     clearInterval(timer);
            //     $('#mp3')[0].pause()
                
            // }
        }
    },
    mounted(){       
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
    #mp3{
        /* display: none; */
    }
</style>