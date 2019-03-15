<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import "@/assets/main.scss";

export default {
  name: "app"
};
</script>


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
    width: 140px;
    height: 40px;
    color: #fff;
    background-color: #7b1fa2;
    border: none;
    box-shadow: none;
    border-radius: 20px;
    transition: 0.2s;
    text-transform: uppercase;

    &:hover {
      transform: scale(0.95);
    }
  }
}
</style>
