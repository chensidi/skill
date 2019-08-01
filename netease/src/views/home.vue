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
import { Search,Toast } from 'vant';
import axios from 'axios';
import {mapGetters,mapActions} from 'vuex';
Vue.use(Search).use(Toast);

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
        ...mapActions(['setKw']),
        onSearch(){
            if(this.svalue==''||this.svalue==null){
                Toast.fail('请输入内容')
                return;
            }
            this.setKw(this.svalue);
            this.$router.push(`/search`);
        },
        loadDataOver(){
            this.loadover = true;
        },
        beginLoad(){
            this.loadover = false;
        }
    },
    computed:{
        ...mapGetters(['getMyApi','getKw'])
    }
}
</script>
<style scoped>
    .wrap{
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>