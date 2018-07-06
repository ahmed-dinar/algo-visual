import Vue from 'vue';
import Router from 'vue-router';
import TraverseGraph from '@/components/TraverseGraph';
import DirectedGraph from '@/components/DirectedGraph';
import HomeComponent from '@/components/HomeComponent';
import EdgeOffset from '@/components/EdgeOffset';
import Graph from '@/components/Graph';

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
    },
    {
      path: '/graph/traverse',
      name: 'TraverseGraph',
      component: TraverseGraph
    },
    {
      path: '/graph/offset',
      name: 'EdgeOffset',
      component: EdgeOffset
    },
    {
      path: '/graph/simulate',
      name: 'Graph',
      component: Graph
    }
  ]
});
