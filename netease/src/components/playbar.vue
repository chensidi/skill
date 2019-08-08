<template>
    <footer>
        <div class="playbar flex" @click.stop="showPlayUI">
            <div>
                <img :src="defaultPic||logos" alt="" :class="['p_img',playStatus?'rot_animate':'']">
            </div>
            <div class="p_info elp">
                <van-progress 
                    :percentage="progress" 
                    :show-pivot='false'
                    :color="'rgb(212, 60, 51)'"
                />
                <p class="elp">{{defaultSong||'未知歌曲'}}</p>
                
                <van-notice-bar
                    color="#999"
                    background="transparent"
                    >
                    {{playStatus?(curLyric?curLyric:defaultArt):defaultArt}}
                </van-notice-bar>
                
            </div>
            <div>
                <van-icon :name="!playStatus?'play-circle-o':'pause-circle-o'" @click="playPause" size="25" />
            </div>
            <div>
                <van-icon name="bars" @click="showMyList" size="25" />
            </div>
        </div>
        <!-- play视图层 -->
        <div :class="{'play_wrap':true,'hide_wrap':!showPlayPage}">
            <div class="play_bg" :style="{'background-image':`url(${defaultPic})`}"></div>
            <i class="back">
               <van-icon name="arrow-left" size="25" color="#fff" @click="hidePlayPage" /> 
            </i>
            <div class="play_template">
                <div :class="{'play_disc':true,'play_discs':!playStatus}">
                    <div class="play_turn">
                        <div class="play_poster">
                            <img :src="defaultPic" :class="{'rot_animate':playStatus}" alt="">
                            <div class="play_light"></div>
                        </div>
                    </div>
                    <span class="play_btn" v-show="!playStatus"></span>
                </div>
            </div>
            <div class="play_info">
                <h2 class="play_title">
                    <span class="play_sname">{{defaultSong||'未知歌曲'}}</span>
                    <span class="play_gap">-</span>
                    <span class="play_auth">{{defaultArt||'未知艺术家'}}</span>
                </h2>
                <p class="text-center" style="margin-top:20px">
                    <van-button type="info" size="small" round @click="downloadMp3(defaultSrc,defaultSong)">下载</van-button>
                </p>
            </div>
            <div class="timebar flex">
                <time class="stime">{{computedDuration(this.audio.currentTime)}}</time>
                <div class="timeSlider">
                    <van-slider v-model="progress" @change="onChangeTime" />
                </div>
                <time class="etime">{{computedDuration(this.audio.duration)}}</time>
            </div>
            <div class="optionbar flex">
                <van-icon name="comment-o" :info="cmtTotal" size="35" @click="showCmt=true" />
                <span style="transform:rotate(180deg)">
                    <van-icon name="play-circle-o" size="35" @click="playCut('-')" />
                </span>
                <van-icon :name="playStatus?'pause-circle-o':'stop-circle-o'" @click.stop="playPause" size="35" />
                <van-icon name="play-circle-o" size="35" @click="playCut('+')" />
                <van-icon name="bars" size="35" @click="showSongList=true" />
            </div>
            <p class="text-center" v-show="lyricNetErr"><van-button type="info" @click="loadLyric">重新加载歌词</van-button></p>
            <p class="text-center" v-show="cmtNetErr"><van-button type="info" @click="loadCmt">重新加载评论</van-button></p>            
        </div>
        <!-- 评论层 -->
        <div :class="{'cmt_wrap':true,'hideCmt':!showCmt}">
            <div class="cmt_bg" :style="{'background-image':`url(${defaultPic})`}"></div>
            <van-nav-bar
                title="评论"
                left-arrow
                @click-left="showCmt=false"
                :fixed='true'
                :z-index="2005"
            />
            <div class="cmt_box">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    :error.sync="netErr"
                    error-text="点击重新加载"
                >
                    <h4 class="cmt_title" v-if='hotCmts.length'>热门评论</h4>
                    <ul class="cmt_list_hot">
                        <li v-for="cmtItem of hotCmts">
                            <div class="cmt_head">
                                <img v-lazy="cmtItem.user.avatarUrl" alt="" class="lazy">
                            </div>
                            <div class="cmt_info">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <span class="cmt_user">{{cmtItem.user.nickname}}</span>
                                        <div class="cmt_time">{{convertTime(cmtItem.time)}}</div>
                                    </div>
                                    <div class="cmt_like">
                                        <span class="cmt_likearea">
                                            <span class="cmt_count">{{cmtItem.likedCount}}</span>
                                            <i class="zan">
                                                <van-icon name="like" />
                                            </i>
                                        </span>
                                    </div>
                                </div>
                                <div class="cmt_content" v-if="!cmtItem.beReplied.length">
                                    {{cmtItem.content}}
                                </div>
                                <div class="cmt_content" v-if="cmtItem.beReplied.length">
                                        回复<span class="touser">{{cmtItem.beReplied[0].user.nickname}}:</span> {{cmtItem.beReplied[0].content}}
                                </div>
                                <div class="recmt" v-if="cmtItem.beReplied.length">
                                    <span>@{{cmtItem.beReplied[0].user.nickname}}:</span>{{cmtItem.content}}
                                </div>
                            </div>
                        </li>
                    </ul>
                    <h4 class="cmt_title" v-if="cmts.length">全部评论</h4>
                    <ul class="cmt_list">
                        <li v-for="cmtItem of cmts">
                            <div class="cmt_head">
                                <img v-lazy="cmtItem.user.avatarUrl" alt="" class="lazy">
                            </div>
                            <div class="cmt_info">
                                <div class="cmt_header">
                                    <div class="cmt_meta">
                                        <span class="cmt_user">{{cmtItem.user.nickname}}</span>
                                        <div class="cmt_time">{{convertTime(cmtItem.time)}}</div>
                                    </div>
                                    <div class="cmt_like">
                                        <span class="cmt_likearea">
                                            <span class="cmt_count">{{cmtItem.likedCount}}</span>
                                            <i class="zan">
                                                <van-icon name="like" />
                                            </i>
                                        </span>
                                    </div>
                                </div>
                                <div class="cmt_content" v-if="!cmtItem.beReplied.length">
                                    {{cmtItem.content}}
                                </div>
                                <div class="cmt_content" v-if="cmtItem.beReplied.length">
                                        回复<span class="touser">{{cmtItem.beReplied[0].user.nickname}}:</span> {{cmtItem.content}}
                                </div>
                                <div class="recmt" v-if="cmtItem.beReplied.length">
                                    <span>@{{cmtItem.beReplied[0].user.nickname}}:</span>{{cmtItem.beReplied[0].content}}
                                </div>
                            </div>
                        </li>
                    </ul>
                </van-list>
            </div>
        </div>
        <van-action-sheet
            v-model="showSongList"
            title="记录"
        >
        <div class="memory_item flex" v-for="memoryItem of memory" @click="onSelect(memoryItem)" v-waves>
            <p class="elp">{{memoryItem.name + '-' + memoryItem.art}}</p>
            <van-icon name="close" @click="delSong($event,memoryItem)"></van-icon>
        </div>
        </van-action-sheet>
    </footer>
</template>
<script>
import Vue from 'vue';
import { Icon,Progress,Slider,NavBar,Lazyload,List,Toast,ActionSheet,Button,NoticeBar } from 'vant';
import '../../static/css/play.css';
import bg from '../../static/img/bhh.png';
import logos from '../assets/logo.png';
import axios from 'axios';
import {mapGetters} from 'vuex';

Vue.use(Icon);
Vue.use(Progress)
   .use(Slider)
   .use(NavBar)
   .use(List)
   .use(ActionSheet)
   .use(Button)
   .use(NoticeBar);
export default {
    name: 'Playbar',
    props: ['listenInfo'],
    data(){
        return {
            playStatus: false,
            audio: new Audio(),
            progress: 0,
            duration: 'NaN',
            curTime: 0,
            time: null,
            ended: false,
            defaultArt: 'Jacky Cheung',
            defaultSong: '不后悔',
            defaultSrc: 'static/audio/bhh.mp3',
            defaultPic: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000000W50Ni1rt0ep.jpg?max_age=2592000',
            bg: bg,
            logos: logos,
            playIcon: 'stop-circle-o',
            showPlayPage: false,
            showCmt: false,
            defaultId: 188967,
            hotCmts: [],
            cmts: [],
            loading: false,
            finished: false,
            netErr: false,
            cmtTotal: 0,
            showSongList: false,
            memory: [],
            autoNext: null,
            autoLast: null,
            lyric: [],
            curLyric: '',
            lyricNetErr: false,
            cmtNetErr: false
        }
    },
    created(){
        this.audio.src = this.defaultSrc;
        let songList = localStorage.getItem('songList');
            songList = JSON.parse(songList) || [];
        this.memory = songList;
    },
    methods: {
        onLoad(){
            this.loadCmt();
            this.loadLyric();
        },
        playPause(e){
            e.stopPropagation();
            this.playStatus = !this.playStatus;
            if(this.playStatus){
                this.audio.play();
                this.timer();
                this.playIcon = 'pause-circle-o';
            }else{
                this.audio.pause();
                clearInterval(this.time);
                this.playIcon = 'stop-circle-o';
            }
            this.duration = Math.ceil(this.audio.duration);
            this.curTime = Math.floor(this.audio.currentTime);
        },
        timer(){
            let self = this;
            this.duration = Math.ceil(this.audio.duration);
            this.curTime = Math.floor(this.audio.currentTime);
            this.progress = this.curTime/this.duration*100;
            if(this.audio.ended){
                console.log('end')
                clearInterval(this.time);
                let targetId;
                for(let i = 0; i < this.memory.length; i ++){
                    if(this.memory[i].id == this.defaultId){
                        if(i == this.memory.length - 1){
                            targetId = this.memory[0].id;
                            this.defaultSong = this.memory[0].name;
                            this.defaultArt = this.memory[0].art;
                        }else{
                            targetId = this.memory[i+1].id;
                            this.defaultSong = this.memory[i+1].name;
                            this.defaultArt = this.memory[i+1].art;
                        }
                        this.defaultId = targetId;
                        break;
                    }
                }
                if(!targetId&&this.memory.length>0){
                    if(this.defaultId!=188967){
                        if(this.autoNext){
                            this.defaultId = targetId = this.autoNext.id;
                            this.defaultSong = this.autoNext.name;
                            this.defaultArt = this.autoNext.art;
                        }
                    }else{
                        targetId = this.memory[0].id;
                        this.defaultId = targetId;
                        this.defaultSong = this.memory[0].name;
                        this.defaultArt = this.memory[0].art;
                    }
                    
                }
                if(targetId){
                    this.waitUrlAndInfo(targetId);
                }else{
                    this.progress = 0;
                    this.playStatus = false;
                    this.audio.currentTime = 0;
                    this.audio.pause();
                }
            }

            for(let i = 0; i < this.lyric.length; i ++){
                if(parseInt(this.curTime) == this.lyric[i].timePoint){
                    this.curLyric = this.lyric[i].content;
                    break;
                }
            }
            // console.log(this.progress)
            this.time = setTimeout(()=>{
                this.timer();
            },1000)
        },
        onChangeTime(num){
            if(!isNaN(this.audio.duration)){
                this.audio.currentTime = num/100*this.audio.duration;
                this.progress = num;
            }else{
                this.progress = 0;
            }
        },
        computedDuration(duration){
            return (duration/60<10?'0'+parseInt(duration/60):parseInt(duration/60)) + ':' + (duration%60<10?'0'+parseInt(duration%60):parseInt(duration%60))
        },
        hidePlayPage(){
            this.showPlayPage = false;
        },
        showPlayUI(e){
            e.stopPropagation();
            e.preventDefault()
            this.showPlayPage = true;
        },
        loadCmt(){
            axios({
                method: 'get',
                url: `${this.getMyApi}/comment/music?id=${this.defaultId}&offset=${this.cmts.length}`,
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    this.cmtNetErr = false;
                    if(res.data.hotComments&&res.data.hotComments.length>0){
                        this.hotCmts = res.data.hotComments;
                    }
                    if(res.data.comments&&res.data.comments.length>0){
                        this.cmts = this.cmts.concat(res.data.comments);
                    }
                    this.cmtTotal = res.data.total;
                    this.loading = false;
                    if(res.data.comments==0){
                        this.finished = true;
                    }
                    this.netErr = false;
                }else{
                    Toast.fail('网络错误请重试');
                    this.netErr = true;
                    this.loading = false;
                    this.cmtNetErr = true;
                }
            }).catch(err=>{
                Toast.fail('网络错误请重试');
                this.netErr = true;
                this.loading = false;
                this.cmtNetErr = true;
            })
        },
        convertTime(time){
            return new Date(time).getFullYear() + '.' 
                    + String(new Date(time).getMonth() + 1).padStart(2,'0') + '.' 
                    + String(new Date(time).getDate()).padStart(2,'0');
        },
        showMyList(e){
            e.stopPropagation();
            this.showSongList = true;
        },
        onSelect(item){
            let self = this;
            this.defaultId = item.id;
            this.defaultSong = item.name;
            this.defaultArt = item.art;
            this.showSongList = false;
            this.waitUrlAndInfo(item.id)
        },
        getSongUrl(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/url?id=${id}`,
                timeout: 18000
            })
        },
        getAlbumInfo(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/detail?ids=${id}`,
                timeout: 18000
            })
        },
        playCut(flag){
            let self = this;
            let sameFlag = false,tagId;
            if(this.memory.length>0){
                for(let i = 0; i < this.memory.length; i ++){
                    if(this.memory[i].id == this.defaultId){
                        if(flag=='-'){
                            if(i==0){
                                tagId = this.memory[this.memory.length-1].id;
                                this.defaultSong = this.memory[this.memory.length-1].name;
                                this.defaultArt = this.memory[this.memory.length-1].art;
                            }else{
                                tagId = this.memory[i-1].id;
                                this.defaultSong = this.memory[i-1].name;
                                this.defaultArt = this.memory[i-1].art;
                            }
                        }else{
                            if(i==this.memory.length-1){
                                tagId = this.memory[0].id;
                                this.defaultSong = this.memory[0].name;
                                this.defaultArt = this.memory[0].art;
                            }else{
                                tagId = this.memory[i+1].id;
                                this.defaultSong = this.memory[i+1].name;
                                this.defaultArt = this.memory[i+1].art;
                            }
                        }
                        
                        this.defaultId = tagId;
                        sameFlag = true;
                        break;
                    }
                }
                if(!sameFlag){
                    if(this.defaultId != 188967){
                        if(flag=='-'){
                            tagId = this.autoLast.id;
                            this.defaultSong = this.autoLast.name;
                            this.defaultArt = this.autoLast.art;
                        }else{
                            tagId = this.autoNext.id;
                            this.defaultSong = this.autoNext.name;
                            this.defaultArt = this.autoNext.art;
                        }
                        this.defaultId = tagId;
                    }else{
                        if(flag=='-'){
                            tagId = this.memory[this.memory.length-1].id;
                            this.defaultSong = this.memory[this.memory.length-1].name;
                            this.defaultArt = this.memory[this.memory.length-1].art;
                        }else{
                            tagId = this.memory[0].id;
                            this.defaultSong = this.memory[0].name;
                            this.defaultArt = this.memory[0].art;
                        }
                        this.defaultId = tagId;
                    }
                                        
                }
                
                this.waitUrlAndInfo(tagId)
            }
        },
        waitUrlAndInfo(tagId){
            let self = this;
            axios.all([this.getSongUrl(tagId), this.getAlbumInfo(tagId)])
                        .then(axios.spread(function (url, info) {
                            if(url.data.code == 200 && info.data.code == 200){
                                // let songInfo = {
                                //     url: url.data.data[0].url,
                                //     name: info.data.songs[0].name,
                                //     pic: info.data.songs[0].al.picUrl,
                                //     artist: info.data.songs[0].ar[0].name,
                                //     id: id
                                // }
                                self.defaultSrc = url.data.data[0].url;
                                self.defaultPic = info.data.songs[0].al.picUrl;
                                self.progress = 0;

                                clearInterval(self.time);
                                self.audio.src = self.defaultSrc;
                                self.playStatus = true;
                                self.audio.play();
                                self.timer();
                            }
                    })).catch(err=>{
                        Toast.fail('网络错误请重试')
                    })
            this.loading = false;
            this.finished = false;
            this.cmts = [];
            this.hotCmts = [];
            this.loadCmt();
            this.loadLyric();
        },
        delSong(e,item){
            e.stopPropagation();
            for(let i = 0; i < this.memory.length; i ++){
                if(this.memory[i].id == item.id){
                    if(this.defaultId == item.id){
                        if(i == this.memory.length-1){
                            if(this.memory.length > 1){
                                this.autoNext = this.memory[0];
                                this.autoLast = this.memory[i-1];
                            }else{  
                                this.autoNext = this.autoLast = {
                                    id: 188967,
                                    art: 'Jacky Chueng',
                                    name: '不后悔'
                                }
                            }
                        }else if(i == 0){
                            this.autoNext = this.memory[i+1];
                            this.autoLast = this.memory[this.memory.length-1];
                        }else{
                            this.autoNext = this.memory[i+1];
                            this.autoLast = this.memory[i-1];
                        }
                    }
                    this.memory.splice(i,1);
                    localStorage.setItem('songList',JSON.stringify(this.memory));
                    break;
                }
            }
        },
        loadLyric(){
            this.lyric = [];
            axios({
                method: 'get',
                url: `${this.getMyApi}/lyric?id=${this.defaultId}`,
                timeout: 20000
            }).then(res=>{
                if(res.data.code == 200){
                    this.lyricNetErr = false;
                    if(res.data.lrc&&res.data.lrc.lyric){
                        this.lyric = res.data.lrc.lyric;
                        // console.log(this.lyric.split('\n'));
                        let lyricArr = res.data.lrc.lyric.split('\n'),
                            tempLyc = [];
                        lyricArr.map(item=>{
                            // console.log(item)
                            // console.log(item.match(/[^\[\]]+/g));

                            // let oneContent = item.match(/(?<=\])[^\[]+/g),
                            //     timeArr = item.match(/(?<=\[).+?(?=\])/g);

                            let matchRes = item.match(/[^\[\]]+/g);
                            if(matchRes&&matchRes.length > 1){
                                let oneContent = matchRes[matchRes.length - 1],
                                timeArr = matchRes.slice(0,matchRes.length - 1);
                                // console.log(timeArr,oneContent)
                                if(timeArr&&oneContent){
                                    timeArr.map(items=>{
                                        let timePoint = items.split(':');
                                        tempLyc.push({
                                            timePoint:  parseInt(timePoint[0])*60 + parseInt(timePoint[1]),
                                            content: oneContent?oneContent:''
                                        })
                                    })
                                }
                            }
                            
                        })
                        this.lyric = tempLyc;
                    }
                }else{
                    Toast.fail('歌词加载失败');
                    this.lyricNetErr = true;
                }
            }).catch(err=>{
                console.log(err)
                Toast.fail('歌词加载失败');
                this.lyricNetErr = true;
            })
        },
        downloadMp3(filePath,name){ //js保存mp3
            fetch(filePath).then(res => res.blob()).then(blob => {
                const a = document.createElement('a');
                document.body.appendChild(a)
                a.style.display = 'none'
                // 使用获取到的blob对象创建的url
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                // 指定下载的文件名
                a.download = name || '语音音频.mp3';
                a.click();
                document.body.removeChild(a)
                // 移除blob对象的url
                window.URL.revokeObjectURL(url);
            });
        }
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    mounted(){
        
    },
    watch: {
        listenInfo(newVal,oldVal){
            this.defaultSrc = newVal.url;
            this.defaultArt = newVal.artist;
            this.defaultPic = newVal.pic;
            this.defaultSong = newVal.name;
            this.defaultId = newVal.id;
            this.loading = false;
            this.finished = false;
            this.progress = 0;
            this.cmts = [];
            this.hotCmts = [];

            clearInterval(this.time);
            this.audio.src = this.defaultSrc;
            this.playStatus = true;
            this.audio.play();
            this.timer();
            this.loadCmt();
            this.loadLyric();

            let songList = localStorage.getItem('songList'), sameFlag = false;
            songList = JSON.parse(songList) || [];
            for(let i = 0; i < songList.length; i ++){
                if(songList[i].id == this.defaultId){
                    sameFlag = true;
                    break;
                }
            }
            if(!sameFlag){
                let song = {
                    id: this.defaultId,
                    art: this.defaultArt,
                    name: this.defaultSong
                }
                songList.unshift(song);
                localStorage.setItem('songList',JSON.stringify(songList));
                this.memory = songList;
            }
        }
    }
}
</script>
<style scoped>
    .playbar{
        height: 50px;
        align-items: center;
        position: fixed;
        width: 100%;
        z-index: 1000;
        bottom: 0;
        left: 0;
        background: rgb(248, 248, 255);
        box-shadow: 0 -1px 2px 0 rgba(0,0,0,.1);
    }
    .playbar>div{
        margin: 0 10px;
    }
    .p_img{
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }
    .p_info{
        flex: auto;
    }
    .p_info p:nth-child(2){
        color: #333;
        font-size: 13px;
        margin-top: 2px;
    }
    .p_info p:nth-child(3){
        color: #999;
        font-size: 12px;
    }
    footer{
        padding: 0;
        text-align: left;
    }
    .play_wrap{
        z-index: 2000;
        transition: all .3s;
        position: fixed;
    }
    .timebar,.optionbar{
        padding: 10px 15px;
        align-items: center;
    }
    .timeSlider{
        flex: 1;
        margin: 0 15px;
    }
    .optionbar{
        color: #fff;
        justify-content: space-between;
    }
    .back{
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .hide_wrap{
        transform: translateY(100%);
    }
    .cmt_wrap,.cmt_bg{
        z-index: 2001;
    }
    .cmt_box{
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 2002;
        padding-top: 46px;
    }
    .cmt_count {
        vertical-align: top;
    }
    .cmt_wrap{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-width: 320px;
        overflow: auto;
        transition: all .3s;
    }
    .hideCmt{
        transform: translateX(100%);
    }
    .memory_item{
        justify-content: space-between;
        padding: 10px 10px;
        align-items: center;
    }
    .memory_item>p{
        width: 80%;
    }
    .play_bg{
        background-color: #fff;
    }
    .rot_animate{
        animation: rot 20s linear infinite;
    }
    @keyframes rot{
        from{
            transform: rotate(0deg);
        }to{
            transform: rotate(360deg);
        }
    }
    .van-notice-bar {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        height: 12px;
        padding: 0;
        color: #ed6a0c;
        font-size: 12px;
        line-height: 24px;
        background-color: #fffbe8;
    }
    .play_disc::after{
        transition: all .3s;
        transform-origin: top;
    }
    .play_discs::after{
        transform: rotate(-25deg);
    }
</style>