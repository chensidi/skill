<template>
    <div>
        <div class="ser_box">
            <wv-search-bar 
                :autofocus="true" 
                v-model="value" 
                @search='search'
            />
        </div>
        <div class="hotser" v-show="value==''">
            <div class="hots">
                <h1 class="hot_title" :style="{'color':getColorObj[getColor].title}">热门搜索</h1>
                <div class="hot_list clearfix">
                    <div :class="getColor==1?'hot_item bd2':'hot_item bd1'" v-for='(obj,i) of hots' :key="i" @click="autoFilter(obj.first)">{{obj.first}}</div>
                </div>
            </div>
        </div>
        <div id="refreshContainer" class="mui-content mui-scroll-wrapper" v-show="value!=''">
            <div class="mui-scroll">
                <div class="ser_result mui-table-view mui-table-view-chevron">
                    <div @click="goPlay(item)" class="result_item" :style="{'background':getColor==1?'#212121':'#fff'}" v-for="(item,j) of res" :key="j">
                        
                            <img src="static/img/lazy.png" alt="">
                            <div>
                                <p class="s_song elp" :style="{'color':getColor==1?'#ddd':'#333'}">{{item.name}}</p>
                                <p class="s_singer elp" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.6)'}">{{item.artists[0].name}}</p>
                            </div>
                       
                    </div>
                </div>
            </div>
            <div class="mask" v-show="loading">
                <div class="load">
                    <i class="weui-loading"></i>
                    <span class="weui-loadmore__tips">正在加载</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Search',
    data(){
        return {
            value: '',
            loading: false,
            hots: [],
            res: [],
            total: null,
            page: 0
        }
    },
    created(){
        this.getHots();
        this.delNoEffect();
    },
    computed: {
        ...mapGetters(['getColor','getColorObj','getMyApi'])
    },
    methods: {
        ...mapActions(['setPlay','setMp3','setCover','setInfo','setDuration','setKey','setIndex','setSid']),
        search(){
            this.getRes(this.value)
        },
        getHots(){
            $.ajax({
                url: `${this.getMyApi}/search/hot`,
                success: (dt)=>{
                    this.hots = dt.result.hots;
                },
                error: ()=>{
                    console.log('err');
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                    this.page -= 1;
                },
                timeout: 10000
            })
        },
        getRes(value){
            if(this.page==0){
                this.loading = true;
            }
            $.get(`${this.getMyApi}/search?keywords= ${value}&offset=${this.page*30}`).then(dt=>{
                setTimeout(()=>{
                    this.loading = false;
                },500)
                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                mui("#refreshContainer").on('tap', 'div', function (event) {
                    this.click();
                });
                this.res = this.res.concat(dt.result.songs);
                this.total = Math.floor(dt.result.songCount/30);
            })
        },
        delNoEffect(){
            for(var i = mui.hooks.inits.length-1,item;i >= 0;i --){//解决mui上拉加载后scroll失效
				item = mui.hooks.inits[i];
				if(item.name=="pullrefresh"){
				    item.repeat = true;
				}
			}
        },
        goPlay(obj){
            // console.log(obj)
            $.get(`${this.getMyApi}/song/url?id=${obj.id}`).then(dt=>{
                // console.log(dt.data[0].url);
                this.setPlay(true);
                this.setMp3(dt.data[0].url);
                // this.setCover(this.datas.picUrl);
                this.setInfo({m:obj.name,n:obj.artists[0].name});
                this.setDuration(0);
                this.setKey(false);
                this.setSid(obj.id);
            })
            $.get(`${this.getMyApi}/song/detail?ids=${obj.id}`).then(dt=>{
                this.setCover(dt.songs[0].al.picUrl);
                this.save({id:obj.id,cover:dt.songs[0].al.picUrl,name:obj.name,singer:obj.artists[0].name});
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
        },
        autoFilter(txt){
            this.value = txt;
            $('.weui-search-bar__label').hide();
            $('input[type="text"]').focus();
        }
    },
    watch: {
        value(now,old){
            if(now==''){
                // $('.weui-search-bar__label').show();
                mui('#refreshContainer').scroll().scrollTo(0,0);
                this.res = [];
                this.page = 0;
            }
        }
    },
    mounted(){
        mui.init({
            pullRefresh : {
                container: '#refreshContainer',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
                up: {
                    height: 50,//可选.默认50.触发上拉加载拖动距离
                    auto: false,//可选,默认false.自动上拉加载一次
                    callback: ()=>{
                        if(this.page >= this.total){
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            return;
                        }
                        this.page += 1;
                        this.getRes(this.value);
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                }
            }
        });
    }
}
</script>
<style scoped>
    .ser_box{
        position: fixed;
        top: 84px;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    .hotser,.ser_result{
        margin-top: 44px;
    }
    .hots{
        padding: 10px 15px;
    }
    .hot_title{
        font-size: 14px;
    }
    .hot_item{
        float: left;
        padding: 5px 8px;
        margin-right: 10px;
        margin-top: 10px;
        border-radius: 10px;
        font-size: 14px;
        line-height: 1;
    }
    .bd1{
        border: 1px solid rgba(0, 0, 0, .7);
        color: #000000;
        background-color: #FFFFFF;
    }
    .bd2{
        border: 1px solid transparent;
        color: #DDDDDD;
        background-color: #333333;
    }
    .result_item{
        padding: 5px 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid #E5E5E5;
    }
    .result_item>img{
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 42px;
        text-align: center;
        margin-right: 10px;
    }
    .result_item>div{
        max-width: 80%;
    }
    .s_song,.s_singer{
        padding: 3px 0 1px;
        font-size: 12px;
        margin-bottom: 0;
    }
    .s_song{
        margin-top: 5px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
    }
    .mask{
        display: flex;
        top: 44px;
    }
    .load{
        margin: auto;
    }
</style>