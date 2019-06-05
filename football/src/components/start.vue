<template>
    <div :class="['startBg']">
        <div :class="['whiteBg',{'over':over}]"></div>
    </div>
</template>
<script>
export default {
    name: 'Start',
    data(){
        return{
            over: false
        }
    },
    mounted(){
        setTimeout(()=>{
            this.over = true;
        },100)

        setTimeout(()=>{
            this.$router.history.push('/home');
        },3000)
    }
}
</script>
<style scoped>
    .startBg{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        background: url('../../static/img/start.jpg') no-repeat;
        background-size: cover;
        background-position: center;
        z-index: 1001;
    }
    .over{
        opacity: 0 !important;
        transition: all 1s;
    }
    .whiteBg{
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 1001;
        opacity: 1;
    }
</style>