// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'


import Vant from 'vant';
import 'vant/lib/index.css';

import WeVue from 'we-vue'
import 'we-vue/lib/style.css'

import '../static/css/jquery-weui.css';
import '../static/css/mui.css';
import '../static/css/public.css';
import '../static/css/index.css';
import * as mui from '../static/js/mui';
import $ from '../static/js/jquery-2.1.4';

global.mui = mui;
global.$ = $;

Vue.use(Vant);
Vue.use(WeVue);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
