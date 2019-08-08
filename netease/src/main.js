// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'vant/lib/index.css';
import '../static/css/public.css';

import VueLazyload from 'vue-lazyload'
 
Vue.use(VueLazyload, {
  preLoad: 1,
  error: require('@/assets/logo.png'),   //请求失败后显示的图片
  loading: require('@/assets/logo.png'),   //加载的loading过渡图片
  attempt: 1     // 加载图片数量
})

import vueWaves from './wave'
Vue.use(vueWaves)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
