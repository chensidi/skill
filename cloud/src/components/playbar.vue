<template>
    <footer :style='{"background-color":this.getColorObj[this.getColor].tb}' @click="setShowPlay(true)">
        <div class="player-img rotate">
            <img :class="{playbar_img:rot}" :src="getCover||'static/img/lazy.png'" alt="">
        </div>
        <div class="player-center">
            <div class="weui-progress">
                    <div class="weui-progress__bar" :style="{'background':this.getColor==1?'rgba(0, 0, 0, 0.3)':'rgba(0, 0, 0, 0.1)'}">
                        <div class="weui-progress__inner-bar js_progress" :style="{'width': width,'background':this.getColorObj[this.getColor].title}"></div>
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
            duration: this.getDuration,
            cur: 0,
            width: '0%',
            timer: null,
            current: this.getDuration,
            key: false,
            rot: false
        }
    },
    created(){
        this.current = this.getDuration;
    },
    computed: {
        ...mapGetters(['getMyApi','getColor','getColorObj','getMp3','getPlay','getCover','getInfo','getDuration','getKey','getIndex'])
    },
    methods: {
        ...mapActions(['setPlay','setDuration','setKey','setShowPlay','setPc','setIndex','setMp3','setCover','setInfo','setSid']),
        play(e){
            if(e){
                e.stopPropagation();
            }
            this.isPlay = this.getPlay;
            if(this.getMp3){
                this.setPlay(!this.getPlay);
                this.setKey(false);
            }
        },
        progress(){
            var self = this;
            clearInterval(timer);
            this.setKey(true);
            
            timer = setInterval(()=>{
                if($('#mp3')[0].currentTime>=Math.floor(this.duration)){
                    clearInterval(timer);
                    this.width = '0%';
                    $('#mp3')[0].currentTime = 0;
                    this.setPlay(false);
                    var hist = JSON.parse(localStorage.getItem('hist'))||[],
                        index = this.getIndex;
                    if(hist.length){
                        if(index < hist.length-1){
                            index ++;
                        }else{
                            index = 0;
                        }

                        var obj = hist[index];
                        // console.log(this.getMyApi);
                        $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                            // console.log(dt);
                            this.setKey(false);
                            this.setPlay(false);
                            this.setMp3(dt.data[0].url);
                            this.setCover(obj.cover);
                            this.setInfo({m:obj.name,n:obj.singer});
                            this.play();
                            this.setIndex(index);
                            this.setSid(obj.id);
                        })
                    } 
                }
                this.width = $('#mp3')[0].currentTime/this.duration*100+'%';
                this.setPc($('#mp3')[0].currentTime/this.duration);
            },1000)
        } 
    },
    updated(){
        this.duration = document.getElementById('mp3').duration;
        this.setDuration(document.getElementById('mp3').duration);
        if(this.getKey){
            return;
        }
        clearInterval(timer);
        if(this.getPlay){  
            if($('#mp3').attr('src')!=this.getMp3){
                this.width = '0%';
                $('#mp3').attr('src',this.getMp3);
            }
            if($('#mp3').attr('src')==undefined){
                $('#mp3').attr('src',this.getMp3);
            } 
            if(this.getMp3){
                $('#mp3')[0].play();
                this.progress();
                this.rot = true;
            }    
        }else{
            $('#mp3')[0].pause();
            this.rot = false;
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
        this.duration = document.getElementById('mp3').duration;
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
    .playbar_img{
        animation: rot 10s linear infinite;
        animation-fill-mode: forwards;
    }
    @keyframes rot {
        from{
            transform: rotate(0deg);
        }to{
            transform: rotate(360deg);
        }
    }
</style>