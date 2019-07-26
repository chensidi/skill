<template>
    <div class="wraper">
        <h3>hot search</h3>
        <section>
            <div class="reload_wraper" v-show="netErr">
                <span class="reload">
                    <van-button type="default" @click="reload">重新加载</van-button>
                </span>
            </div>
            <router-link :to="{path:'/search',query:{kw:obj.searchWord}}" v-for="(obj,i) of list" :key="i" class="hotlist flex">
                <em :class="['s_number',i+1<4?'s_most':'']">{{i+1}}</em>
                <div class="elp">
                    <div>
                        <span class="s_title elp">{{obj.searchWord}}</span>
                        <span class="s_count">{{obj.score}}</span>
                    </div>
                    <p class="elp s_desc">{{obj.content}}</p>
                </div>
            </router-link>
        </section>
    </div>
</template>
<script>
import axios from 'axios';
import {mapGetters} from 'vuex';
import { Toast } from 'vant';
import Vue from 'vue';
import { Button } from 'vant';
Vue.use(Button);
Vue.use(Toast);
export default {
    name: 'Hot',
    props: ['data'],
    created(){
        this.getHot();
    },
    data(){
        return {
            list: [],
            netErr: false
        }
    },
    methods:{
        getHot(){
            this.$emit('beginLoad');
            axios({
                url: `${this.getMyApi}/search/hot/detail`,
                method: 'get',
                timeout: 15000
            }).then(res=>{
                if(res.data.code == 200){
                    this.list = res.data.data;
                    this.$emit('loaded');
                    this.netErr = false;
                }else{
                    Toast.fail('网络错误请重试');
                    this.netErr = true;
                    this.$emit('loaded');
                }
            }).catch(err=>{
                Toast.fail('网络错误请重试');
                this.netErr = true;
                this.$emit('loaded');
            })
        },
        reload(){
            this.getHot();
        }
    },
    computed:{
        ...mapGetters(['getMyApi'])
    }
}
</script>
<style scoped>
    .wraper{
        padding: 0 15px;
    }
    .hotlist{
        align-items: center;
        padding: 10px 0;
    }
    .s_number{
        padding: 10px;
        color: #666;
        margin-right: 15px;
        font-size: 1.2rem;
    }
    .s_title{
        max-width: 10rem;
        font-size: 1.2rem;
        vertical-align: bottom;
        color: #333;
    }
    .s_count{
        font-size: 12px;
        color: #999;
    }
    .s_desc{
        font-size: 12px;
        color: #999;
    }
    .s_most{
        color: rgb(212, 60, 51);
    }
    .s_most+div .s_title{
        font-weight: 700;
    }
    .reload{
        margin: auto;
    }
    .reload_wraper{
        display: flex;
        width: 100%;
        height: 15rem;
    }
</style>
