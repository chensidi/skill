<template>
    <div class="home">
        <Head :isArt='false' />
        <Menu :menu='menu' @newapi='reload' />
        <div class="wrap">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                
                <Banner :recommend='recommend' />
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                <List v-for="(item,i) of top" :key="i" :listObj='item' />
                </van-list>
            </van-pull-refresh>
        </div>
        <Loading :loaded='loadover' />
    </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex'
import Head from '../components/head'
import Menu from '../components/menu'
import Banner from '../components/banner'
import List from '../components/list'
import Loading from '../components/loading'
import $ from 'jquery'
export default {
    name: 'Home',
    data() {
        return {
            menu: [],
            head: null,
            recommend: [],
            top: [],
            isLoading: false,
            loading: false,
            finished: false,
            nextUrl: '',
            loadover: false,
            idx: 1
        }
    },
    beforeRouteEnter (to, from,next) {
        store.dispatch('setState',0);
        next();
    },
    created(){
        this.setState(0);
        // this.homeData();
        // this.homehead();
        $.when(this.homeData(),this.homehead()).then(()=>{
            setTimeout(()=>{
                this.loadover = true;
            },1500)
        })
    },
    methods: {
        ...mapActions(['setState']),
        onRefresh() {
            setTimeout(() => {
                this.$toast('refresh success');
                this.isLoading = false;
            }, 500);
        },
        homeData(){
            $.get(`${this.getMyApi}/home`).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    this.menu = result.menus.news;
                    console.log(result)
                }
            })
        },
        homehead(){
            $.get(`${this.getMyApi}/homehead`).then(dt=>{
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    this.head = result;
                    this.recommend = result.recommend;
                    this.top = result.articles;
                    this.nextUrl = result.next;
                }
            })
        },
        onLoad() {
            // 异步更新数据
            if(!this.nextUrl){
                this.loading = false;
                return;
            };
            $.post(`${this.getMyApi}/data_ranking`,{url:this.nextUrl}).then(dt=>{
                this.loading = false;
                if(dt.code == 200){
                    let result = JSON.parse(dt.result);
                    if(this.idx == 0){
                        let temp = [];
                        result.contents.map(arr=>{
                            temp = temp.concat(arr.articles);
                        })
                        this.top = this.top.concat(temp);
                        console.log(temp)
                    }else{
                        this.top = this.top.concat(result.articles);
                    }
                    this.nextUrl = result.next;
                }else{
                    this.finished = true;
                }
                
            })
            // setTimeout(() => {
            //     for (let i = 0; i < 10; i++) {
            //         this.list.push(this.list.length + 1);
            //     }
            //     // 加载状态结束
            //     this.loading = false;

            //     // 数据全部加载完成
            //     if (this.list.length >= 40) {
            //         this.finished = true;
            //     }
            // }, 500);
        },
        reload(api,idx){
            console.log(api,idx);
            this.idx = idx;
            this.top = [];
            this.loadover = false;
            this.finished = false;
            $.post(`${this.getMyApi}/data_ranking`,{url:api}).then(dt=>{
                // this.loading = false;
                if(dt.code == 200){
                    setTimeout(()=>{
                        this.loadover = true;
                    },1000)
                    let result = JSON.parse(dt.result);
                    if(idx==0){
                        let temp = [];
                        result.contents.map(arr=>{
                            temp = temp.concat(arr.articles);
                        })
                        this.top = temp;
                    }else{
                        this.top = result.articles;
                    }
                    console.log(result);
                    // this.top.pop();
                    this.nextUrl = result.next;
                    // this.top = this.top.concat(result.articles);
                    // this.nextUrl = result.next;
                }else{
                    // this.finished = true;
                }
                
            })
        }
    },
    components: {Head,Menu,Banner,List,Loading},
    computed: {
        ...mapGetters(['getMyApi'])
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    .home{
        background: rgba(0,0,0,.5);
    }
    
</style>