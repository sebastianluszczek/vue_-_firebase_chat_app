<template>
  <div class="home">
    <h1>Home Page</h1>
    <div class="profile-info">
      <p>Current User: {{currentUser.name}}</p>
      <button @click="logOut" class="send-btn">LogOut</button>
    </div>
    <div class="board">
      <ul class="usersList">
        <li v-for="user in otherUsers" :key="user.created" @click="chooseListener(user)">
          {{user.name}}
          <span v-if="user.isOnline"></span>
        </li>
      </ul>
      <div class="chatWindow">
        <div class="listener">
          <p>{{listener.name}}</p>
        </div>
        <div class="messagesArea">
          <div
            class="message"
            v-for="message in currentConv"
            :key="message.uuid"
            :class="{ownMessage: message.creator == currentUser.uuid}"
          >{{message.message}}</div>
        </div>
        <div class="inputArea">
          <input type="text" placeholder="Message here..." v-model="message">
          <button class="send-btn" @click="send">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { uuid } from "vue-uuid";
import { setTimeout } from "timers";

export default {
  name: "home",
  data() {
    return {
      users: [],
      currentUser: "",
      listener: "",
      message: "",
      currentConv: null,
      currentConvId: null
    };
  },
  created() {
    this.getUsers();
    const userRef = firebase.firestore().collection("users");

    userRef
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(users => {
        users.forEach(user => {
          this.currentUser = user.data();
        });
      });
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase
            .firestore()
            .collection("users")
            .where("email", "==", this.currentUser.email)
            .get()
            .then(user => {
              firebase
                .firestore()
                .collection("users")
                .doc(user.docs[0].id)
                .update({
                  isOnline: false
                })
                .then(() => this.$router.push("/login"));
            });
        });
    },
    getUsers() {
      firebase
        .firestore()
        .collection("users")
        .onSnapshot(users => {
          this.users = [];

          users.forEach(user => {
            this.users.push(user.data());
          });
        });
    },
    chooseListener(user) {
      this.listener = user;
      this.currentConv = null;
      this.currentConvId = null;

      firebase
        .firestore()
        .collection("conversations")
        .where("participants", "array-contains", this.currentUser.uuid)
        .onSnapshot(conversations => {
          conversations.forEach(conv => {
            if (conv.data().participants.includes(this.listener.uuid)) {
              this.currentConv = conv.data().messages;
              this.currentConvId = conv.id;
            }
          });
        });
    },
    send() {
      const msgObject = {
        uuid: uuid.v1(),
        creator: this.currentUser.uuid,
        time: Date.now(),
        message: this.message
      };

      const convRef = firebase.firestore().collection("conversations");

      if (this.currentConvId) {
        convRef
          .doc(this.currentConvId)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion(msgObject)
          })
          .then(() => {
            this.message = "";
          });
      } else {
        convRef
          .add({
            messages: [msgObject],
            participants: [this.currentUser.uuid, this.listener.uuid]
          })
          .then(docRef => {
            this.message = "";
            this.currentConvId = docRef.id;
          })
          .catch(err => {
            console.log("Error adding doc: " + err);
          });
      }
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
<style lang="scss">
.home {
  position: relative;
  .board {
    display: grid;
    grid-template-columns: 200px 500px;
    width: 700px;
    margin: 50px auto;
    height: 500px;
  }
  .usersList {
    overflow: auto;
    border: 1px solid #333;
    list-style: none;
    padding: 20px;
    height: 100%;
    margin: 0;

    li {
      text-align: left;
      padding: 3px 10px;
      position: relative;

      span {
        width: 6px;
        height: 6px;
        background-color: green;
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        top: calc(50% - 3px);
        right: 10px;
      }
    }
  }
  .chatWindow {
    border: 1px solid #333;
    position: relative;

    .inputArea {
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #333;
      padding: 5px;

      input {
        height: 30px;
        width: 70%;
        border-radius: 15px;
        box-shadow: none;
        border: 1px solid #555;
        padding: 0 10px;
        margin-right: 30px;
      }
    }
    .messagesArea {
      margin-top: 50px;
      margin-bottom: 50px;
      height: 400px;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;

      .message {
        padding: 5px;
        margin: 5px;
        border: 1px solid #333;
        border-radius: 10px;
        width: fit-content;
        max-width: 70%;
        text-align: left;
        align-self: flex-start;
      }

      .message.ownMessage {
        text-align: right;
        position: relative;
        align-self: flex-end;
      }
    }

    .listener {
      position: absolute;
      width: 100%;
      background-color: lightgreen;
      height: 40px;
    }
  }
  .send-btn {
    width: 100px;
    height: 30px;
    color: #fff;
    background-color: #2c3e50;
    border: none;
    box-shadow: none;
    border-radius: 15px;
    transition: 0.2s;
    text-transform: uppercase;

    &:hover {
      transform: scale(0.95);
    }
  }

  .profile-info {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 40px;
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}
</style>

