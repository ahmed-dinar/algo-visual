<template>
  <div id="app">
    <h1 class="text-center">Algo Visual</h1>
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
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
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

</style>
