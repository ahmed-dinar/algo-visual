<template>
  <div class="container-fluid">
      <div id="home-particle"></div>

      <div class="algo-ds">

         
          <article class="card mb-2" style="max-width: 20rem;">
            <b-link class="card-link" :to="{ path: '/graph/edit' }">
            <div class="card-body">
              <img  src="../assets/dfs-bfs.png" alt="Image" class="card-img-top" width="400">
              <h4 class="card-title">Graph</h4>
              <p class="card-text">
                DFS, BFS
              </p>
            </div>
             </b-link>
          </article>
       

      </div>

  </div>
</template>

<script>

import particles from '../config/particles';

export default {
  name: 'HomeComponent',
  data(){
    return {
      
    }
  },
  methods: {
    initParticles(){
      particlesJS('home-particle', particles());
    }
  },
  mounted(){
    this.$nextTick(() => {
      console.log('tada');
      this.initParticles();
    });
  }
}
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#home-particle canvas {
  display: block;
  vertical-align: bottom;
  opacity: 1;
}


#home-particle{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -10;
  top: 0;
  left: 0;
  background-color: #0099e5;
}

.algo-ds{
  margin-top: 20px;
}

.card{
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
}



.card-body{
  color: #ffffff;
}

</style>
