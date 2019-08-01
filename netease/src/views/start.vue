<template>
    <div class="startbg">
        <div class="timerCount">
            倒计时：{{second}}秒
        </div>
        <div class="zuoyoumin">
            <h3>年少不听张学友</h3>
            <h3>听懂已是狱中人</h3>
        </div>
    </div>
</template>
<script>
import {Circle} from 'vant';
import Vue from 'vue';
Vue.use(Circle);
export default {
    name: 'Start',
    data() {
        return {
            second: 5
        }
    },
    mounted(){
        down();
        let self = this;
        function down(){
            setTimeout(()=>{
                if(self.second > 1){
                    self.second -= 1;
                    down();
                }else{
                    self.$router.push('/home');
                }
            },1000)
        }
    }
}
</script>
<style scoped>
    .startbg{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(../../static/img/start.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 2000;
    }
    .timerCount{
        position: absolute;
        right: 10px;
        top: 10px;
        color: #fff;
    }
    .zuoyoumin{
        position: absolute;
        bottom: 20%;
        width: 100%;
    }
    .zuoyoumin h3{
        text-align: center;
        color: #fff;
        line-height: 2em;
        font-size: 20px;
    }
</style>
