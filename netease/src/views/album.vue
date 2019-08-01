<template>
    <div>
        <div class="album_head">
            <i class="back"><van-icon name="arrow-left" color="#fff" @click="back"></van-icon></i>
            <div class="album_head_bg" :style="{'background-image':`url(${album.picUrl})`}">
            </div>
            <div class="flex album_head_wrap">
                <div class="album_pic">
                    <img :src="album.picUrl" alt="">
                </div>
                <div class="album_info">
                    <h3 class="album_title">{{album.name+`${album.alias[0]?album.alias[0]:''}`}}</h3>
                    <h4 class="album_owner">{{album.artist.name}}</h4>
                    <p class="album_intr" @click="showAllInfos">{{album.description}} <i class="moreIntr"><van-icon name="arrow" /></i></p>
                </div>
            </div>
        </div>
        <div class="pylst_list">
            <div class="list_item" v-waves v-for="(item,index) of list" :key="item.id" @click="play(item.id)">
                <div class="sgfl">{{index+1}}</div>
                <div class="sgfr f-bd f-bd-btm">
                    <div class="sgchfl">
                        <div class="f-thide sgt1">{{item.name}}</div>
                        <div class="f-thide sginfo">{{item.ar.name}}</div>
                    </div>
                    <div class="sgchfr">
                        <van-icon name="play-circle-o"></van-icon>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-center" v-if="netErr">
            <van-button type="info" @click="loadAlbumInfo">重新加载</van-button>
        </p>
        <div class="album_details" v-show="showAllInfo" :style="{'opacity':opacity}">
            <section class="dts_wrap"><div class="dts_bg" :style="{'background-image':`url(${album.picUrl})`}"></div></section>
            <img class="album_cover" :src="album.picUrl" alt="">
            <div class="album_content">
                <p class="text-center">
                    <van-button type="info" round size="small" @click="savePoster(album.picUrl,album.name)">保存封面</van-button>
                </p>
                <h3 class="album_title text-center">{{album.name}}</h3>
                
                <h5 class="album_alias text-center">{{album.alias[0]?album.alias[0]:''}}</h5>
                
                <div class="make_info">
                    <p>发行公司: {{album.company}}</p>
                    <p>专辑类别: {{album.subType}}</p>
                    <p>{{album.description}}</p>
                </div>
            </div>
            <i class="close_dts">
                <van-icon name="cross" size="20" @click="hideAllInfos"></van-icon>
            </i>
        </div>
        <Masks :loadover='loadover' />
    </div>
</template>
<script>
import { Icon,Toast,Button } from 'vant';
import {mapGetters} from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import Masks from '../components/mask';
Vue.use(Icon)
   .use(Toast)
   .use(Button)
export default {
    name: 'Album',
    data(){
        return {
            aid: {},
            album: {
                name: '',
                alias: [],
                artist: {},
                picUrl: '../../static/img/blank.png'
            },
            list: [],
            showAllInfo: false,
            opacity: 0,
            netErr: false,
            loadover: false
        }
    },
    created(){
        this.aid = this.$route.params.id;
        this.loadAlbumInfo();
    },
    methods: {
        loadAlbumInfo(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/album?id=${this.aid}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                if(res.data.code == 200){
                    this.album = res.data.album;
                    this.list = res.data.songs;
                    this.netErr = false; 
                }else{
                    Toast.fail('网络请求失败');
                    this.netErr = true;
                }
            }).catch(err=>{
                this.loadover = true;
                Toast.fail('网络请求失败');
                this.netErr = true;
            })
        },
        getSongUrl(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/url?id=${id}`,
                timeout: 15000
            })
        },
        getAlbumInfo(id){
            return axios({
                method: 'get',
                url: `${this.getMyApi}/song/detail?ids=${id}`,
                timeout: 15000
            })
        },
        play(id){
            let self = this;
            axios.all([this.getSongUrl(id), this.getAlbumInfo(id)])
                .then(axios.spread(function (url, info) {
                if(url.data.code == 200 && info.data.code == 200){
                    let songInfo = {
                        url: url.data.data[0].url,
                        name: info.data.songs[0].name,
                        pic: info.data.songs[0].al.picUrl,
                        artist: info.data.songs[0].ar[0].name,
                        id: id
                    }

                    self.$emit('playStart',songInfo)
                }
            })).catch(err=>{
                Toast.fail('网络错误请重试')
            })
        },
        showAllInfos(){
            var self = this;
            this.showAllInfo = true;
            add();
            function add(){
                if(self.opacity < 1){
                    setTimeout(()=>{
                        self.opacity += .02;
                        add();
                    },10)
                }
            }
        },
        hideAllInfos(){
            var self = this;
            down();
            function down(){
                if(self.opacity > 0){
                    setTimeout(()=>{
                        self.opacity -= .02;
                        down();
                    },10)
                }else{
                    self.showAllInfo = false;
                }
            }
        },
        back(){
            this.$router.go(-1);
        },
        savePoster(imgsrc, name){
            let image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function() {
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                let a = document.createElement("a"); // 生成一个a元素
                let event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            };
            image.src = imgsrc;
        }
    },
    computed: {
        ...mapGetters(['getMyApi'])
    },
    // beforeRouteEnter (to, from, next) {
    //     if(from.name == "Result"){
    //         from.meta.keep = true;
    //     }
    //     next();
    // },
    // beforeRouteLeave (to, from, next) {
    //     if(to.name == "Result"){
    //         to.meta.keep = false;
    //     }
    //     next();
    // }
    components: {Masks}
}
</script>
<style scoped>
    .album_head{
        position: relative;
        padding: 30px 10px 30px 15px;
        overflow: hidden;
    }
    .album_head_bg,.dts_bg{
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        -webkit-filter: blur(20px);
        filter: blur(20px);
        -webkit-transform: scale(1.5);
        -ms-transform: scale(1.5);
        transform: scale(1.5);
        background-image: url(../../static/img/blank.png);
    }
    .album_head_bg,.album_head_bg::after{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .album_head_bg::after{
        content: "";
        background-color: rgba(0,0,0,.25);
    }
    .album_head_wrap{
        position: relative;
        z-index: 2;
    }
    .album_pic{
        width: 126px;
        height: 126px;
    }
    .album_pic>img{
        width: 100%;
        height: 100%;
    }
    .album_info{
        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        width: 1%;
        margin-left: 16px;
        position: relative;
    }
    .album_title{
        padding-top: 1px;
        font-size: 17px;
        line-height: 1.3;
        color: #fefefe;
        height: 44px;
        display: -webkit-box;
        -webkit-box-pack: center;
        
    }
    .album_owner,.album_intr,.album_alias{
        color: #ccc;
        font-size: 12px;
    }
    .album_intr,.album_title{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .album_intr{
        position: absolute;
        width: 100%;
        bottom: 0;
        padding-right: 7px;
    }
    .moreIntr{
        position: absolute;
        right: 0;
        bottom: 0;
    }
    .pylst_list{
        padding: 10px 0;
        margin-bottom: 50px;
    }
    .list_item{
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        padding-left: 10px;
        margin: 10px 0;
    }
    .sgfl{
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 40px;
        font-size: 17px;
        color: #999;
        margin-left: -10px;

        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .sgfr {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;

        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
    }

    .sgchfl{
        padding: 6px 0;
        width: 0;

        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
    }

    .f-thide {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
    }

    .sginfo {
        font-size: 12px;
        color: #888;
    }

    .sgtl {
        font-size: 17px;
    }

    .sgchfr {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 10px;
    }
    .back{
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 100;
    }
    .album_details{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 0;
        z-index: 100;
        overflow: auto;
        /* display: none; */
    }

    .showAllInfo{
        animation: show .5s linear;
        display: block;
    }

    .dts_bg,.dts_wrap{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #000;
    }
    .dts_bg{
        transform: scale(2.5);
    }
    .album_cover{
        display: block;
        width: 200px;
        height: 200px;
        margin: 50px auto 15px;
        position: relative;
        z-index: 200;
    }
    .album_content{
        position: relative;
        z-index: 200;
        padding: 20px;
        color: #fff;
        line-height: 2em;
    }
    .make_info{
        padding: 5px;
        margin-top: 10px;
        margin-bottom: 30px;
        /* background: rgba(0,0,0,.4); */
    }
    .dts_wrap{
        overflow: hidden;
    }
    .close_dts{
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 200;
        color: #fff;
    }
    @keyframes show{
        from{
            opacity: 0;
        }to{
            opacity: 1;
        }
    }
</style>