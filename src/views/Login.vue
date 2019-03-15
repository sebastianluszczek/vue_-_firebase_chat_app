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
import firebase from "firebase/app";

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
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          return firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(user => {
              firebase
                .firestore()
                .collection("users")
                .where("email", "==", user.user.email)
                .get()
                .then(user => {
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(user.docs[0].id)
                    .update({
                      isOnline: true
                    })
                    .then(() => this.$router.replace("home"));
                });
            })
            .catch(err => alert("Ops... " + err.message));
        });
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
