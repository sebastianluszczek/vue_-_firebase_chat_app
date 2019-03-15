<template>
  <div class="home">
    <h1>Vue.js Chat App</h1>
    <div class="profile-info">
      <p>Current User: {{currentUser.name}}</p>
      <button @click="logOut" class="btn">LogOut</button>
    </div>
    <div class="board">
      <ul class="usersList">
        <li
          v-for="user in otherUsers"
          :key="user.created"
          @click="chooseListener(user)"
          :class="{active: user.uuid == listener.uuid}"
        >
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
          <button class="btn" @click="send">Send</button>
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
      currentConvId: null,
      userRef: firebase.firestore().collection("users"),
      convRef: firebase.firestore().collection("conversations")
    };
  },
  created() {
    this.getUsers();

    this.userRef
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(users => {
        users.forEach(user => {
          this.currentUser = user.data();
        });
      });
  },
  destroyed() {
    this.logOut();
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.userRef
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
      this.userRef.onSnapshot(users => {
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

      this.convRef
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

      if (this.currentConvId) {
        this.convRef
          .doc(this.currentConvId)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion(msgObject)
          })
          .then(() => {
            this.message = "";
          });
      } else {
        this.convRef
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
    border-right: none;
    list-style: none;
    padding: 30px 4px;
    height: 100%;
    margin: 0;
    background-color: #ba68c8;

    li {
      text-align: left;
      padding: 10px 20px;
      position: relative;
      color: #fff;

      span {
        width: 8px;
        height: 8px;
        background-color: #8bc34a;
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        top: calc(50% - 4px);
        right: 10px;
      }

      &.active {
        background-color: #7b1fa2;
        border-radius: 5px;
      }
    }
  }
  .chatWindow {
    border: 1px solid #333;
    position: relative;

    .inputArea {
      width: 100%;
      height: 50px;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #333;
      padding: 5px;

      input {
        height: 30px;
        width: 60%;
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
        padding: 5px 15px;
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
        background-color: #f3e5f5;
      }
    }

    .listener {
      position: absolute;
      width: 100%;
      background-color: #7b1fa2;
      height: 40px;
      color: #fff;
      text-align: left;
      font-weight: bold;
      padding: 5px 20px;
      font-size: 20px;

      p {
        margin: 4px;
      }
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

