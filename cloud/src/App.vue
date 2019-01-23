<template>
  <div id="app" :style="{'background':this.getColorObj[this.getColor].bgMain}">
    <router-view/>
    <Playbar />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Playbar from './components/playbar';

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
  },
  components: {Playbar}
}
</script>

<style>
  #app{
    height: 100%;
  }
</style>
