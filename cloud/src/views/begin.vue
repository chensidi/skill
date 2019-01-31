<template>
    <div class="begin" v-show="begins">
        <div class="time_circel" @click="goHome">
            <van-circle
                v-model="currentRate"
                color="#07c160"
                fill="#fff"
                size="35px"
                layer-color="#ebedf0"
                :text="text"
                :rate="rate"
                :speed="100"
                :clockwise="false"
                :stroke-width="60"
            />
        </div>
        <div class="begin_tt">
            <h3 class="logo_title">年少不听张学友</h3>
            <h3 class="logo_title">听懂已是狱中人</h3>
        </div>
    </div>
</template>
<script>
let timeout;
export default {
    name: 'Begin',
    data(){
        return{
            currentRate: 0,
            rate: 0,
            begins: true
        }
    },
    computed: {
        text() {
            return '跳过'
        }
    },
    methods: {
        goHome(){
            this.begins = false;
        }
    },
    mounted(){
        timeout = setInterval(()=>{
            this.rate += 1;
            if(this.rate >= 100){
                clearInterval(timeout);
                this.begins = false;
            }
        },50)
    }
}
</script>
<style scoped>
    .begin{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1001;
        background: url(/static/img/jacky.png) no-repeat;
        background-position: center;
        background-size: cover;
    }
    .time_circel{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .begin_tt{
        position: absolute;
        bottom: 20%;
        width: 100%;
        text-align: center;
    }
    .logo_title{
        font-size: 20px;
        color: #eee;
        margin: 10px 0;
    }
</style>
