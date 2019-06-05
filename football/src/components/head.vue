<template>
    <div class="hd">
        <wv-header title="迪爷足球" background-color="#16b13a">
            <div class="btn-back" slot="left" v-if="flag">
                <van-icon name="arrow-left" size='2rem' @click="back" />
            </div>
            <div class="btn-menu" slot="right" v-if="flag">
                <em class="cmt_count">{{totals}}评论</em>
            </div>
        </wv-header>
    </div>
</template>
<script>
export default {
    name: 'Head',
    props: ['isArt','total'],
    data(){
        return{
            flag: this.$props.isArt,
            totals: this.$props.total
        }
    },
    methods: {
        back(){
            this.$router.history.go(-1)
        }
    }
}
</script>
<style scoped>
    .wv-header{
        z-index: 1000;
    }
    .cmt_count{
        border: 1px solid #fff;
        padding: 0 3px;
        line-height: 1.2rem;
    }
</style>