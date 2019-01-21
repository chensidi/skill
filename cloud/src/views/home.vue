<template>
    <div>
        <Topbar @skin='go' />
        <van-actionsheet
            v-model="show"
            :actions="actions"
            @select="onSelect"
        />
        <Switchs :act='this.getOn' />
        <div class="main">
            <div class="mui-scroll-wrapper">
				<div class="mui-scroll">
                    <Slider />

				</div>
            </div>
        </div>
        <wv-icon type="success"></wv-icon>
        
    </div>
</template>
<script>
import Topbar from '../components/topbar';
import Switchs from '../components/switchbar';
import Slider from '../components/slider';
import {mapActions, mapGetters} from 'vuex';
export default {
    name: 'Home',
    created(){
        if(localStorage.getItem('color')){
            this.setColor(localStorage.getItem('color'));
        }
    },
    data() {
        return {
            show: false,
            actions: [
                {
                    name: '皮肤中心',
                    id: 0
                },
                {
                    name: '取消',
                    id: 1
                }
            ]
        };
    },
    computed: {
        ...mapGetters(['getOn'])
    },
    methods: {
        ...mapActions(['setColor']),
        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show = false;
            if(item.id==0){
                location.href = '#/skin'
            }
        },
        go(info){
            this.show = info;
        }
    },
    mounted(){
        mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
    },
    components: {Topbar,Switchs,Slider}
}

</script>
<style scoped>
    
</style>