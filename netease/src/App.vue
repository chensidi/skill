<template>
  <div id="app">
      <keep-alive v-if="$route.meta.keep">
          <router-view @playStart='go' />
          <!-- <Playbar :listenInfo='songInfo' /> -->
      </keep-alive>
      <router-view @playStart='go' v-if="!$route.meta.keep" />
      <Playbar :listenInfo='songInfo' />
  </div>
</template>

<script>
import Playbar from './components/playbar'
export default {
  name: 'App',
  components: {Playbar},
  data(){
    return{
      songInfo: {}
    }
  },
  methods: {
    go(songInfo){
      this.songInfo = songInfo;
    }
  }
}
</script>
