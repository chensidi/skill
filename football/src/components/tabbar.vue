<template>
    <div>
        <van-tabbar 
            v-model="active"
            active-color="#07c160"
            :z-index="1000"
        >
            <van-tabbar-item icon="wap-home" to="/home">home</van-tabbar-item>            
            <van-tabbar-item icon="play-circle-o" to='/match'>match</van-tabbar-item>
            <van-tabbar-item icon="bar-chart-o" to="/data">data</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    name: 'Tabbar',
    data() {
        return {
            active: this.getTabbarState
        }
    },
    computed: {
        ...mapGetters(['getTabbarState'])
    }
}
</script>
