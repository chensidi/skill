<template>
    <div>
        <van-swipe :autoplay="3000" :height='160' :indicator-color='"#eee"'>
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img :src="image" />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'Slider',
    created(){
        $.get(`${this.getMyApi}/banner`).then((dt)=>{
            dt.banners.map((obj,i)=>{
                this.images.push(obj.imageUrl);
            })
        })
    },
    data() {
        return {
            images: [
                
            ]
        }
    },
    computed: {
        ...mapGetters(['getMyApi'])
    }
}
</script>
<style scoped>
    img{
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
