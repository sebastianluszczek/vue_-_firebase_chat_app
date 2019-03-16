<template>
  <div class="login">
    <div class="container">
      <h3>Login</h3>
      <div class="input-wrapper">
        <i class="fas fa-envelope"></i>
        <input type="text" placeholder="Email" v-model="email">
      </div>
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input type="password" placeholder="Password" v-model="password">
      </div>

      <button class="btn" @click="logIn">Sign In</button>
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
