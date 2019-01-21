<template>
    <nav>
        <div :style="{'color':this.getColor==1?'#fff':'#333'}" :class="on==0?'tab_item '+clArr[this.getColor]:'tab_item'" @click="change(0)">
            <span>推荐</span>
        </div>
        <div :style="{'color':this.getColor==1?'#fff':'#333'}" :class="on==1?'tab_item '+clArr[this.getColor]:'tab_item'" @click="change(1)">
            <span>排行榜</span>
        </div>
        <div :style="{'color':this.getColor==1?'#fff':'#333'}" :class="on==2?'tab_item '+clArr[this.getColor]:'tab_item'" @click="change(2)">
            <span>歌手</span>
        </div>
        <div :style="{'color':this.getColor==1?'#fff':'#333'}" :class="on==3?'tab_item '+clArr[this.getColor]:'tab_item'" @click="change(3)">
            <span>搜索</span>
        </div>
    </nav>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name: 'Switchs',
    props: ['act'],
    created(){
        this.on = this.$props.act;
    },
    data(){
        return{
            on: 0,
            clArr: ['yellowon','blackon','blueon','redon','greenon']
        }
    },
    computed: {
        ...mapGetters(['getColor'])
    },
    methods: {
        change(n){
            this.on = n;
            this.setOn(n);
        },
        ...mapActions(['setOn'])
    }
}
</script>
