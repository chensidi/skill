<template>
    <header class="red">
        <i class="nav_back" v-if="$props.child">
            <van-icon name="arrow-left" size="20" @click="back" />
        </i>
        <h1>
            <img src="data:image/png;base64,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" alt="">
            迪爷音乐
        </h1>       
    </header>
</template>
<script>
import Vue from 'vue';
import {Icon,Dialog} from 'vant';
Vue.use(Icon).use(Dialog);
export default {
    name: 'Head',
    props: ['child'],
    created(){
        // this.show = false;
    },
    data(){
        return {
            show: false
        }
    },
    methods: {
        share(){
            this.show = !this.show;
            if(this.show){
                this.side();
                this.bottome();
            }
        },
        back(){
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>
    .red {
        background-color: rgb(212, 60, 51);
        box-shadow: rgb(212, 60, 51) 0px 0px 3px;
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: relative;
        color: #fff;
        background-color: #31C27C;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    header h1 {
        height: 50px;
        font-size: 18px;
        font-weight: 300;
        margin: 0;
        line-height: 50px;
    }
    header img {
        width: 30px;
        height: 25px;
        vertical-align: middle;
        margin-top: -5px;
    }
    .nav_back {
        font-size: 20px;
        position: absolute;
        left: 15px;
        line-height: 50px;
    }
    .appshare{
        font-size: 20px;
        position: absolute;
        right: 15px;
        line-height: 50px;
    }
    .bdsharebuttonbox{
        position: fixed;
        top: 30%;
        left: 50%;
        margin-left: calc(-138px / 2);
        padding: 20px 10px;
        background: rgba(0,0,0,.7);
        color: #fff;
        /* display: none; */
    }
</style>