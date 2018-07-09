<template>
  <div id="app">
    <div style="min-height: 700px;">
    <div class="container-fluid header-wrap">
      <div class="row nav-container">
          <nav class="navbar navbar-light navbar-expand-lg bg-white mr-auto" toggleable>

            <b-link class="navbar-brand" :to="{ path: '/' }">
              <img src="./assets/icon.png" width="35px" alt="" class="d-inline-block align-top">
              Algo Visual
            </b-link>

            <!-- <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
            <b-collapse is-nav id="nav_dropdown_collapse">
              <b-navbar-nav>
                <b-nav-item :to="{ path: '/graph/edit' }">
                  Edit
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse> -->

          </nav>
          <div class="navbar ml-auto">
            <a class="text-secondary" href="https://github.com/ahmed-dinar/algo-visual" target="_blank">
              <i class="fab fa-github fa-2x"></i>
            </a>
          </div>
      </div>
    </div>

    <router-view></router-view>

    </div>

    <div class="container-fluid copy-right">
      <div class="row">
        <div class="container text-center">
          <p class="text-center">&copy; Ahmed Dinar, 2018</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>



export default {
  name: 'App'
}
</script>

<style>

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
}


body{
  font-family: 'Noto Sans',  Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #2c3e50;
}

input[type="text" i] {
    padding: 1px 5px;
    border: 1px solid #babdc1;

}


.form-check-input{
  width: 18px;
  height: 18px;
  margin-top: .2rem;
  margin-left: -1.4rem;
}

.navbar-brand{
  font-family: 'Megrim', cursive;
  font-weight: 600;
  color: #2d3239;
  font-size: 26px;
}

.navbar-brand img{
  margin-top: 2px;
}

.navbar{
  padding: .1rem 1rem;
}

.nav-container{
  border: none;
}

.copy-right{
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 10px;
  color: #ffffff;
}




/* boostrap */
.custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: none;
}

.custom-control-label::before{
  background-color: #cdd3d8;
}

.header-wrap{
  box-shadow: 0 2px 2px -2px rgba(0,0,0,.2);
  margin-bottom: 1px;
  background: #fff;
}

.navbar-brand{
  margin-right: 80px;
}

.card-link{
  text-decoration: none;
}

</style>
