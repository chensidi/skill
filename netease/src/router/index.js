import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Result from '@/views/result'
import PlayList from '@/views/playlist'
import Album from '@/views/Album'
import Singer from '@/views/singer'
import Dj from '@/views/dj'
import Video from '@/views/video'
import Start from '@/views/start'
import Main from '@/views/main'
import MainPy from '@/views/pylistmain'
import MainDisk from '@/views/diskmain'
import MainSong from '@/views/songmain'
import TopList from '@/views/toplist'
import MainDj from '@/views/djmain'
import DjList from '@/views/djlist'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      meta: {
        keep: true
      }
    },
    {
      path: '/home',
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
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/mainpys',
      name: 'mainpys',
      component: MainPy,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/maindisks',
      name: 'maindisks',
      component: MainDisk,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/mainsongs',
      name: 'mainsongs',
      component: MainSong,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/toplists',
      name: 'toplists',
      component: TopList,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/djmain',
      name: 'maindj',
      component: MainDj,
      meta: {
        keep: true
      }
    },
    {
      path: '/main/djlist/:id',
      name: 'DjList',
      component: DjList,
      meta: {
        keep: false
      }
    }
  ]
})
