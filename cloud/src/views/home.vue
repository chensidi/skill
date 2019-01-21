<template>
    <div>
        <Topbar @skin='go' />
        <van-actionsheet
            v-model="show"
            :actions="actions"
            @select="onSelect"
        />
        <wv-icon type="success"></wv-icon>
    </div>
</template>
<script>
import Topbar from '../components/topbar';
import {mapActions} from 'vuex';
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
    components: {Topbar}
}

</script>
<style scoped>
    
</style>