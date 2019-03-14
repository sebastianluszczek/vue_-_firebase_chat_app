<template>
  <div class="home">
    <h1>Home Page</h1>
    <button @click="logOut">LogOut</button>
    <ul>
      <li v-for="user in otherUsers" :key="user.created">{{user.name}}</li>
    </ul>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "home",
  data() {
    return {
      users: []
    };
  },
  created() {
    this.getUsers();
    console.log(firebase.auth().currentUser.email);
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    },
    getUsers() {
      firebase
        .firestore()
        .collection("users")
        .get()
        .then(users => {
          users.forEach(user => {
            this.users.push(user.data());
          });
        });
    }
  },
  computed: {
    otherUsers() {
      return this.users.filter(user => {
        return user.email != firebase.auth().currentUser.email;
      });
    }
  }
};
</script>
