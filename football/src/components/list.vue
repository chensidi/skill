<template>
     <router-link :to="{'path':'/article','query':{id:obj.id,total:obj.comments_total}}" class="news-list-item">
        <div class="news-list-img-side">
            <img v-lazy="obj.thumb||obj.topic.thumb" alt="" >
        </div>
        <div class="news-list-info">
            <h3>{{obj.title}}</h3>
            <div class="news-list-tag">
                <span class="news-list-comment">{{obj.comments_total}}评论</span>
                <span class="news-list-tag-item news-list-tag-common" v-show="obj.top">置顶</span>
                <span class="news-list-tag-item news-list-tag-common" v-show="obj.label">{{obj.label}}</span>
            </div>
            <span class="author" v-show="obj.author||obj.topic">{{(obj.author)?(obj.author.name):(obj.topic?obj.topic.author.username+'发表于'+obj.topic.group.title+'圈':'')}}</span>
        </div>
    </router-link>
</template>
<script>
export default {
    name: 'List',
    props: ['listObj'],
    data(){
        return{
            obj: this.$props.listObj
        }
    }
}
</script>
<style scoped>
    .news-list-item{
        padding: .75rem;
        border-bottom: 1px solid #e9e9e9;
        background: #f7f7f7;
        position: relative;
        box-sizing: border-box;
        display: -webkit-box;
        width: 100%;
        /* overflow: hidden; */
        min-height: 4.2rem;
    }
    .news-list-img-side{
        width: 5.6rem;
        /* float: left; */
        margin-right: 1rem;
        position: relative;
        line-height: 0;
        /* margin-bottom: .2rem; */
        height: 4.2rem;
    }
    .news-list-img-side img{
        display: block;
        width: 100%;
        height: 100%;
    }
    .news-list-info{
        /* overflow: hidden; */
        height: 4.2rem;
        position: relative;
        flex: auto;
    }
    .news-list-info h3{
        font-size: 1rem;
        line-height: 1.3rem;
        color: #333;
        margin-bottom: .3rem;
    }
    .news-list-tag{
        position: absolute;
        right: .75rem;
        bottom: 0;
        font-size: .6rem;
        line-height: .9rem
    }
    .news-list-comment{
        color: #8c9399;
    }
    .news-list-tag .news-list-tag-item {
        display: inline-block;
        border: 1px solid transparent;
        padding: 0 .2rem;
        margin-left: .2rem;
        color: rgb(71, 130, 196);
        border-color: rgb(71, 130, 196);
    }
    .author{
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: .6rem;
        color: #8c9399;
        line-height: .9rem;
    }
</style>
