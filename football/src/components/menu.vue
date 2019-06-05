<template>
    <div class="subnav-bar-wrapper">
        <div class="subnav-bar">
            <em v-for="(item,i) of menus" :class="{'sub-link-active':on==i}" :key="i" @click="switchs(i,item.api)">{{item.label}}</em>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import {mapGetters} from 'vuex'
export default {
    name: 'Menu',
    props: ['menu'],
    data(){
        return{
            menus: [],
            on: 1
        }
    },
    created(){
        this.menus = this.$props.menu;
    },
    methods: {
        switchs(idx,api){
            if(idx == this.on)return;
            this.on = idx;
            this.$emit('newapi',api,idx);
        }
    },
    mounted(){
        
    },
    watch: {
        menu(nv,ov){
            this.menus = nv;
        }
    }
}
</script>
<style scoped>
    .subnav-bar-wrapper{
        height: 2rem;
        color: #333;
        position: fixed;
        overflow: hidden;
        border-bottom: 1px solid #e9e9e9;
        background: #fff;
        top: 50px;
        width: 100%;
        z-index: 100;
    }
    .subnav-bar{
        height: 100%;
        width: 100%;
        overflow: auto;
        display: block;
        white-space: nowrap;
        text-align: center;
    } 
    .subnav-bar em{
        margin: 0 .8rem;
        font-size: .9rem;
        height: 1.9rem;
        line-height: 2rem;
        display: inline-block;
        text-align: center;
        position: relative;
        white-space: nowrap;
        border-bottom: .1rem solid transparent;
    }
    .sub-link-active{
        color: #16b13a;
        border-bottom-color: #16b13a !important;
    }
</style>