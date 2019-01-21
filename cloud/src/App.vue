<template>
  <div id="app" :style="{'background':this.getColorObj[this.getColor].bgMain}">
    <router-view/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'App',
  data(){
    return {
    }
  },
  created(){
  },

  computed: {
    ...mapGetters(['getColor','getColorObj'])
  }
}
</script>

<style>
  #app{
    height: 100%;
  }
</style>
