<template>
  <div id="app" :style="{'background':this.getColorObj[this.getColor].bgMain}">
    <router-view/>
    <Playbar />
    <Play v-if="getShowPlay" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Playbar from './components/playbar';
import Play from './components/play';

export default {
  name: 'App',
  data(){
    return {
    }
  },
  created(){
  },

  computed: {
    ...mapGetters(['getColor','getColorObj','getShowPlay'])
  },
  components: {Playbar,Play}
}
</script>

<style>
  #app{
    height: 100%;
  }
</style>
