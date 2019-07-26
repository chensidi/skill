<template>
    <div class="mask" v-show="!$props.loadover">
        <i class="loading">
            <van-loading size="24px" color="#fff" vertical>加载中...</van-loading>
        </i>
    </div>
</template>

<script>
    import { Loading } from 'vant';
    import Vue from 'vue';
    Vue.use(Loading);
    export default {
        name: 'Masks',
        props: ['loadover']
    }
</script>
<style scoped>
    .mask{
        display: flex;
        position: fixed;
        top: 0;
        width: 100%;
        bottom: 0;
        z-index: 1001;
        background: rgba(0,0,0,.75);
    }
    .loading{
        display: inline-block;
        margin: auto;
    }
</style>