<template>
    <div class="load_modal" v-show="!$props.loaded">
        <img src="../../static/img/load.gif" class="loadgif" alt="">
    </div>
</template>
<script>
export default {
    name: 'Loading',
    props: ['loaded'],
    data(){
        return{
            loadover: this.$props.loaded
        }
    }
}
</script>
<style scoped>
    .load_modal{
        position: fixed;
        top: 50px;
        width: 100%;
        bottom: 50px;
        display: flex;
        background: #eee;
    }
    .loadgif{
        margin: auto;
        width: 50px;
        height: 50px;
    }
</style>