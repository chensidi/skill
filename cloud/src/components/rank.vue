<template>
    <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
            <div class="mask" id="sort_mask" v-show="loading">
                <div class="load">
                    <i class="weui-loading"></i>
                    <span class="weui-loadmore__tips">正在加载</span>
                </div>
            </div>
            <ul class="sort_list">
                <li v-for="(obj,i) of ranks" :key="i">
                    <router-link :to="{name:'Rankview',params:{datas:obj.obj}}" :style="{'background':getColor==1?'#333':'#fff'}">
                        <div class="left" v-lazy-container="{ selector: 'img' }">
                            <img :data-src="obj.img" data-loading='static/img/lazy.png' alt="">
                            <div class="cover"></div>
                        </div>
                        <div class="right">
                            <h1 class="elp" :style="{'color':getColor==1?'#fff':'#333'}">{{obj.h1}}</h1>
                            <p class='elp' v-for="(item,j) of obj.ps" :key="j">
                                <em class="index" :style="{'color':getColor==1?'#ddd':'#333'}">{{j+1}}</em>
                                <span class="s_name" :style="{'color':getColor==1?'#ddd':'#333'}">{{item.name}}</span> -
                                <span class="sg" :style="{'color':getColor==1?'rgba(221, 221, 221, 0.7)':'rgba(0, 0, 0, 0.5)'}">{{item.ar[0].name}}</span>
                            </p>
                            <i class="arrow mui-icon mui-icon-arrowright"></i>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { setTimeout } from 'timers';
export default {
    name: 'Rank',
    data(){
        return {
            ranks: [],
            loading: true
        }
    },
    created(){
        this.createRank();
    },
    computed: {
        ...mapGetters(['getColor','getMyApi'])
    },
    methods: {
        getRank(id){
            $.get(`${this.getMyApi}/top/list?idx=${id}`).then((dt)=>{
                // console.log(dt);
                setTimeout(()=>{
                    this.loading = false;
                },500)
                this.ranks.splice(id,0,{  img: dt.playlist.coverImgUrl,
                                    h1: dt.playlist.name,
                                    ps: dt.playlist.tracks.slice(0,3),
                                    obj: {img:dt.playlist.coverImgUrl,
                                          dts: dt.playlist.tracks,
                                          h1: dt.playlist.name,
                                          des: dt.playlist.description
                                         }   
                                });
            })
        },
        createRank(){
            for(let i = 0; i < 24; i ++){
                this.getRank(i)
            }
        }
    },
    mounted(){
        // mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
        mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
    }
}
</script>
<style scoped>
    .cover{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 10;
        background: rgba(0,0,0,.3);
    }
    .load{
        margin: 20px auto;
    }
</style>