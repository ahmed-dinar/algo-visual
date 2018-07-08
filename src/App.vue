<template>
  <div id="app">
    <div class="container-fluid header">
      <h3 class="text-center heading">Algo Visual</h3>
    </div>
    <router-view/>
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
}


.form-check-input{
  width: 18px;
  height: 18px;
      margin-top: .2rem;
    margin-left: -1.4rem;

}

.heading{
  font-family: 'Satisfy', cursive;
  padding-top: 5px;
  padding-bottom: 10px;
  font-weight: 600;
  color: #464649;
}

.header{
  background: #fff;
      box-shadow: 0 2px 3px hsla(0,0%,7%,.1), 0 0 0 1px hsla(0,0%,7%,.1);
  border: none;
}

</style>
