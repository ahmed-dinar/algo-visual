import Vue from 'vue';
import Router from 'vue-router';
import DirectedGraph from '@/components/DirectedGraph';
import HomeComponent from '@/components/HomeComponent';

Vue.use(Router);

export default new Router({
	mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'HomeComponent',
      component: HomeComponent
    },
    {
      path: '/graph/directed',
      name: 'DirectedGraph',
      component: DirectedGraph
    }
  ]
});
