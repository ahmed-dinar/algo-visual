import Vue from 'vue';
import Router from 'vue-router';
import TraverseGraph from '@/components/TraverseGraph';
import DirectedGraph from '@/components/DirectedGraph';
import HomeComponent from '@/components/HomeComponent';
import EdgeOffset from '@/components/EdgeOffset';
import GraphSimulate from '@/components/GraphSimulate';
import EditGraph from '@/components/EditGraph';
import BfsDfs from '@/components/BfsDfs';
import Graph from '@/components/Graph';
import MultiEdge from '@/components/MultiEdge';

Vue.use(Router);

const router = new Router({
	mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'HomeComponent',
      component: HomeComponent,
      meta: { title: 'Algo Visual' }
    },
    {
      path: '/graph',
      name: 'Graph',
      component: Graph,
      meta: { title: 'Graph - Algo Visual' }
    },
    {
      path: '/graph/directed',
      name: 'DirectedGraph',
      component: DirectedGraph,
      meta: { title: 'Directed Graph - Algo Visual' }
    },
    {
      path: '/graph/traverse',
      name: 'TraverseGraph',
      component: TraverseGraph,
      meta: { title: 'Traverse Graph - Algo Visual' }
    },
    {
      path: '/graph/offset',
      name: 'EdgeOffset',
      component: EdgeOffset,
      meta: { title: 'Traverse Graph - Algo Visual' }
    },
    {
      path: '/graph/simulate',
      name: 'GraphSimulate',
      component: GraphSimulate,
      meta: { title: 'Graph Simulate - Algo Visual' }
    },
    {
      path: '/graph/edit',
      name: 'EditGraph',
      component: EditGraph,
      meta: { title: 'Edit Graph - Algo Visual' }
    },
    {
      path: '/graph/bfsdfs',
      name: 'BfsDfs',
      component: BfsDfs,
      meta: { title: 'BFS DFS - Algo Visual' }
    },
    {
      path: '/graph/multi',
      name: 'MultiEdge',
      component: MultiEdge,
      meta: { title: 'Multi Edge - Algo Visual' }
    }
  ]
});


router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  progressbar.start();
  next();
});

router.afterEach((to,from) => {
  progressbar.done();
  progressbar.remove();
});


export default router;