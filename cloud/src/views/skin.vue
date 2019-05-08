<template>
    <div class="music-skin" id="music-skin">
        <div class="mui-bar mui-bar-nav mui-bar-transparent">
            <h1 class="mui-title skin_title">皮肤中心</h1>
            <router-link to="/" class="cancel" id="cancel_skin">取消</router-link>
        </div>
        <div class="skin_info">推荐皮肤</div>
        <div class="skin_list">
            <div class="skin_block">
                <div class="yellow" @click="chnageSkin(0)"><wv-icon type="success" v-show="this.getColor==0"></wv-icon></div>
                <p>芒果黄</p>
            </div>
            <div class="skin_block">
                <div class="black" @click="chnageSkin(1)"><wv-icon type="success" v-show="this.getColor==1"></wv-icon></div>
                <p>炫酷黑</p>
            </div>
            <div class="skin_block">
                <div class="blue" @click="chnageSkin(2)"><wv-icon type="success" v-show="this.getColor==2"></wv-icon></div>
                <p>酷狗蓝</p>
            </div>
            <div class="skin_block">
                <div class="red" @click="chnageSkin(3)"><wv-icon type="success" v-show="this.getColor==3"></wv-icon></div>
                <p>网易红</p>
            </div>
            <div class="skin_block">
                <div class="green" @click="chnageSkin(4)"><wv-icon type="success" v-show="this.getColor==4"></wv-icon></div>
                <p>QQ绿</p>
            </div>
        </div>
	</div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'; 

export default {
    name: 'Skin',
    data(){
        return {
           curColor: 4 
        }
    },
    computed: {
        ...mapGetters(['getColor'])
    },
    methods: {
        ...mapActions(['setColor']),
        chnageSkin(n){
            this.setColor(n);
            localStorage.setItem('color',n);
            history.go(-1);
        }
    }
}
</script>
