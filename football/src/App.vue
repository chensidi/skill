<template>
  <div id="app">
      
      
          <!-- <transition :name="transitionName"> -->
            <keep-alive>
              <router-view v-transition v-if="$route.meta.keepAlive" />
            </keep-alive>
          <!-- </transition> -->
      
          <!-- <transition :name="transitionName"> -->
              <router-view v-transition v-if="!$route.meta.keepAlive" />
          <!-- </transition> -->
      <Tabbar />
  </div>
</template>

<script>
import Tabbar from './components/tabbar'
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  components: {Tabbar},
  watch: {
    $route (to, from) {
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>

<style scoped>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  /*  启用硬件加速 */
  will-change: transform;
  transition: all 300ms;
  position: fixed;
}
.slide-right-enter {
  transform: translate(-100%, 0);
  transition-timing-function: ease-in;
}
.slide-left-enter {
  transform: translate(100%, 0);
  transition-timing-function: ease-in;
}
</style>
