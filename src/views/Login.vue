<template>
  <div class="login">
    <div class="container">
      <h3>Sign In</h3>
      <input type="text" placeholder="Email" v-model="email">
      <input type="password" placeholder="Password" v-model="password">
      <button class="btn" @click="logIn">Connection</button>
      <p>You dont have an account?
        <router-link :to="{name: 'register'}">You can create one!</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    logIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => alert("Well done! You are now connected!"))
        .catch(err => alert("Ops... " + err.message));
    }
  }
};
</script>

<style lang="scss">
.login {
  .container {
    width: 500px;
    margin: 50px auto;
    border: 1px solid #333;
  }
  input {
    display: block;
    padding: 5px 10px;
    width: 90%;
    margin: 10px auto;
    border: 1px solid #333;
    box-shadow: none;
  }

  p {
    font-size: 13px;
  }
}
</style>
