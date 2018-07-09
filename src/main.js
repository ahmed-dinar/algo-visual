// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import NProgress from 'nprogress';
import ToggleButton from 'vue-js-toggle-button';

import App from './App';
import router from './router';
import VueNoty from './components/custom/VueNoty';

import 'animate.css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'nprogress/nprogress.css';
import './assets/noty.css';

import 'particles.js';


Vue.config.productionTip = false;

if(!window.progressbar){
  window.progressbar = NProgress;
}

Vue.use(ToggleButton);
Vue.use(VueNoty);
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
