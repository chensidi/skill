import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Skin from '@/views/skin'
import Album from '@/views/album'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/skin',
      name: 'Skin',
      component: Skin
    },
    {
      path: '/album',
      name: 'Album',
      component: Album
    }
  ]
})
