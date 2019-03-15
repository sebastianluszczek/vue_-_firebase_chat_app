import Vue from "vue";
import UUID from 'vue-uuid';
import firebase from 'firebase/app';
import firebaseConfig from '@/firebase/firebaseConfig'
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(UUID);

firebase.initializeApp(firebaseConfig);
let app;

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});