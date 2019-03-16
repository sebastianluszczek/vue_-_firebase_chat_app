<template>
  <div class="login">
    <div class="container">
      <h3>Register</h3>
      <div class="input-wrapper">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Name" v-model="name">
      </div>
      <div class="input-wrapper">
        <i class="fas fa-envelope"></i>
        <input type="text" placeholder="Email" v-model="email">
      </div>
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input type="password" placeholder="Password" v-model="password">
      </div>

      <button class="btn" @click="register">Register</button>
      <p>You have an account?
        <router-link :to="{name: 'login'}">Log in!</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { uuid } from "vue-uuid";

export default {
  name: "login",
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  methods: {
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          let db = firebase.firestore();

          db.collection("users")
            .add({
              uuid: uuid.v1(),
              name: this.name,
              email: this.email,
              created: Date.now(),
              conversations: []
            })
            .then(docRef => {
              console.log("Document written with ID: ", docRef.id);
              this.$router.replace("home");
            })
            .catch(error => console.error("Error adding document: ", error));
        })
        .catch(err => alert("Ops... " + err.message));
    }
  }
};
</script>

<style lang="scss">
.login {
  .container {
    position: relative;
    top: 100px;
    width: 400px;
    margin: 0px auto;
    padding: 20px;

    h3 {
      font-size: 36px;
      text-align: left;
      color: #fff;
      padding: 10px 0;
      border-bottom: 5px solid #00e676;
      width: fit-content;
      margin-bottom: 60px;
    }

    p {
      margin-top: 10px;
      color: #fff;
      text-align: left;

      a {
        color: #00e676;
      }
    }
  }
  .input-wrapper {
    display: grid;
    grid-template-columns: 30px auto;
    margin: 0 auto;
    border-bottom: 1px solid #00e676;
    margin-bottom: 20px;

    .fas {
      align-self: center;
      font-size: 18px;
      color: #fff;
    }
    input {
      align-self: center;
      padding: 5px 10px;
      width: 100%;
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
  }

  p {
    font-size: 13px;
  }
}
</style>
