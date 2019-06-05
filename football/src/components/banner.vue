<template>
    <div class="banner">
        <!-- <van-swipe :autoplay="3000" indicator-color='#16b13a'>
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <div class="img_wrap">
                    <img :src="image.thumb" :style='{"height":h+"px"}' />
                    <p class="elp">{{image.title}}</p>
                </div>
            </van-swipe-item>
        </van-swipe> -->
        <wv-swipe :autoplay="4000">
            <wv-swipe-item v-for="(image, index) in images" :key="index">
                <div class="img_wrap">
                    <img :src="image.thumb" :style='{"height":h+"px"}' />
                    <p class="elp">{{image.title}}</p>
                </div>
            </wv-swipe-item>
        </wv-swipe>
    </div>
</template>
<script>
export default {
    name: 'Baner',
    props: ['recommend'],
    data() {
        return {
            images: [],
            h: window.innerWidth*.4
        }
    },
    created(){
    },
    watch:{
        recommend(nv,ov){
            this.images = nv;
        }
    }
}
</script>
<style scoped>
    .banner{
        margin-top: 2rem;
    }
    .banner img{
        width: 100%;
        height: 100%;
    }
    .img_wrap{
        position: relative;
    }
    .img_wrap p{
        position: absolute;
        bottom: 15px;
        width: 100%;
        color: #fff;
    }
</style>