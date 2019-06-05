import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home'
import Article from '../views/article'
import Match from '../views/match'
import MatchDts from '../views/matchdetails'
import Data from '../views/data'
import Start from '../components/start'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
      meta: { index: 0,keepAlive: false }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { index: 1,keepAlive: false }
    },
    {
      path: '/article',
      name: 'Article',
      component: Article,
      meta: { index: 2,keepAlive: false }
    },
    {
      path: '/match',
      name: 'Match',
      component: Match,
      meta: { index: 1,keepAlive: false }
    },
    {
      path: '/matchdts/:mid',
      name: 'MatchDts',
      component: MatchDts,
      meta: { index: 2,keepAlive: false }
    },
    {
      path: '/data',
      name: 'Data',
      component: Data,
      meta: { index: 1,keepAlive: false }
    }
  ]
})
