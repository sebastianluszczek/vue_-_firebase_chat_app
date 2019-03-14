<template>
  <div class="login">
    <div class="container">
      <h3>Register</h3>
      <input type="text" placeholder="Email" v-model="email">
      <input type="password" placeholder="Password" v-model="password">
      <button class="btn" @click="register">Register</button>
      <p>You have an account?
        <router-link :to="{name: 'login'}">Log in!</router-link>
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
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => alert("Your account has been created!"))
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
