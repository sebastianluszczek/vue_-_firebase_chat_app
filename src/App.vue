<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;

  h3 {
    color: #607d8b;
    font-size: 2rem;
  }

  .btn {
    width: 160px;
    height: 40px;
    line-height: 40px;
    color: #607d8b;
    border: 1px solid;
    background-color: #fff;
    font-size: 1rem;
    text-transform: uppercase;
  }
}
</style>
