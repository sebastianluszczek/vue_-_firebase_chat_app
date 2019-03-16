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
  width: 100%;
  height: 100vh;
  background-color: transparent;
  position: relative;

  &::before {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url("./assets/back.jpg");
    filter: brightness(0.3);
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
