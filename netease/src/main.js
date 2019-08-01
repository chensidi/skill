// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'vant/lib/index.css';
import '../static/css/public.css';

import WXConfig from './assets/js/wx.jsapi'
Vue.prototype.WXConfig = WXConfig;

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
