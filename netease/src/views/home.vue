<template>
    <div>
        <Head />
        <div class="wrap">
            <van-search
                v-model="svalue"
                placeholder="请输入搜索关键词"
                show-action
                @search="this.onSearch"
            />
            <Hot @loaded='loadDataOver' @beginLoad='beginLoad' />
        </div>
        <Masks :loadover='loadover' />
    </div>
</template>
<script>
import Vue from 'vue'
import Head from '../components/head';
import Hot from '../components/hot';
import Masks from '../components/mask'
import { Search } from 'vant';
import axios from 'axios';
import {mapGetters} from 'vuex';
Vue.use(Search);

export default {
    name: 'Home',
    components: {Head,Hot,Masks},
    data(){
        return {
            svalue: '',
            hot: [],
            loadover: false
        }
    },
    created(){
    },
    methods: {
        onSearch(){
            this.$router.push(`/search?kw=${this.svalue}`)
        },
        loadDataOver(){
            this.loadover = true;
        },
        beginLoad(){
            this.loadover = false;
        }
    },
    computed:{
        ...mapGetters(['getMyApi'])
    }
}
</script>
<style scoped>
    .wrap{
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>