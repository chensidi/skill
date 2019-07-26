import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Result from '@/views/result'
import PlayList from '@/views/playlist'
import Album from '@/views/Album'
import Singer from '@/views/singer'
import Dj from '@/views/dj'
import Video from '@/views/video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        keep: true
      }
    },
    {
      path: '/search',
      name: 'Result',
      component: Result,
      meta: {
        keep: false
      }
    },
    {
      path: '/album/:id',
      name: 'Album',
      component: Album,
      meta: {
        keep: false
      }
    },
    {
      path: '/singer/:id',
      name: 'Singer',
      component: Singer,
      meta: {
        keep: false
      }
    },
    {
      path: '/pylist/:id',
      name: 'PlayList',
      component: PlayList,
      meta: {
        keep: false
      }
    },
    {
      path: '/dj/:id',
      name: 'Dj',
      component: Dj,
      meta: {
        keep: false
      }
    },
    {
      path: '/video/:id',
      name: 'Video',
      component: Video,
      meta: {
        keep: false
      }
    },
    {
      path: '/videos/:id',
      name: 'Video',
      component: Video,
      meta: {
        keep: false
      }
    }
  ]
})
