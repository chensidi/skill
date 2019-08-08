<template>
    <div>
        <div class="album_head">
            <i class="back"><van-icon name="arrow-left" color="#fff" @click="$router.go(-1)"></van-icon></i>
            <div class="album_head_bg" :style="{'background-image':`url(${pyList.coverImgUrl})`}">
            </div>
            <div class="flex album_head_wrap">
                <div class="album_pic">
                    <img :src="pyList.coverImgUrl" alt="">
                </div>
                <div class="album_info">
                    <h3 class="album_title">{{pyList.name}}</h3>
                    <h4 class="album_owner flex"><img class="avatar" :src="pyList.creator.avatarUrl" alt="">{{pyList.creator.nickname}}</h4>
                    <h4 class="album_owner">标签：{{computedTags(pyList.tags)}}</h4>
                    <p class="album_intr" @click="showAllInfos">{{pyList.description}} <i class="moreIntr"><van-icon name="arrow" /></i></p>
                </div>
            </div>
        </div>
        <div class="pylst_list">
            <div class="list_item" v-waves v-for="(item,index) of list" :key="item.id" @click="play(item.id)">
                <div class="sgfl">{{index+1}}</div>
                <div class="sgfr f-bd f-bd-btm">
                    <div class="sgchfl">
                        <div class="f-thide sgt1">{{item.name}}</div>
                        <div class="f-thide sginfo">{{item.ar[0].name}}</div>
                    </div>
                    <div class="sgchfr">
                        <van-icon name="play-circle-o"></van-icon>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-center" v-if="netErr">
            <van-button type="info" @click="loadPyList">重新加载</van-button>
        </p>
        <div class="album_details" v-show="showAllInfo" :style="{'opacity':opacity}">
            <section class="dts_wrap"><div class="dts_bg" :style="{'background-image':`url(${pyList.coverImgUrl})`}"></div></section>
            <img class="album_cover" :src="pyList.coverImgUrl" alt="">
            <p class="text-center">
                <van-button type="info" round size="small" @click="savePoster(pyList.coverImgUrl,pyList.name)">保存封面</van-button>
            </p>
            <div class="album_content">
                <h3 class="album_title text-center">{{pyList.name}}</h3>
                <div class="make_info">
                    <h4 class="album_owner">标签：{{computedTags(pyList.tags)}}</h4>
                    <p>{{pyList.description}}</p>
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
import Masks from '../components/mask';
import axios from 'axios';
Vue.use(Icon)
   .use(Toast)
   .use(Button)
export default {
    name: 'PlayList',
    data(){
        return{
            pid: null,
            pyList: {
                coverImgUrl: 'static/img/blank.png',
                name: '',
                creator: {},
                description: '',
                tags: []
            },
            list: [],
            showAllInfo: false,
            opacity: 0,
            netErr: false,
            loadover: false
        }
    },
    created(){
        this.pid = this.$route.params.id;
        this.loadPyList();
    },
    methods: {
        loadPyList(){
            this.loadover = false;
            axios({
                method: 'get',
                url: `${this.getMyApi}/playlist/detail?id=${this.pid}`,
                timeout: 15000
            }).then(res=>{
                this.loadover = true;
                // console.log(res);
                if(res.data.code == 200){
                    this.netErr = false;
                    this.pyList = res.data.playlist;
                    this.list = res.data.playlist.tracks;
                }else{
                    this.netErr = true;
                    Toast.fail('网络请求错误');
                }
            }).catch(err=>{
                this.loadover = true;
                this.netErr = true;
                Toast.fail('网络请求错误');
            })
        },
        computedTags(tagArr){
            let tagStr = '';
            tagArr.map(obj=>{
                tagStr += obj + ' ';
            })
            return tagStr;
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
    components: {Masks}
}
</script>
<style scoped>
    .avatar{
        border-radius: 50%;
        width: 15px;
        height: 15px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .album_owner, .album_intr, .album_alias {
        color: #ccc;
        font-size: 12px;
    }
</style>