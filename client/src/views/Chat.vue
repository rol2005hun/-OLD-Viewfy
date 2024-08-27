<template>
  <div class="chatApp">
<!--    <br><h1 style="text-align: center;">Csatlakozva mint: {{ username }}</h1> <p>Aktív <green>{{ users.length }} felhasználó</green></p>-->

    <div class="chatHeading">
<!--      <p v-if="!username">Loading, please wait</p>-->
      <p>Üdvözlünk a chaten, {{ username }}, a chat törlődik a szerver frissülésekor</p>
      <p class="green">Jelenleg <span>{{ users.length }} aktív felhasználó van</span></p>
    </div>


    <div class="activeUsersHeading">
      <p>Aktív felhasználók</p>
      <p>Helytelenül töltenek be az adatok? <a @click="refreshData">Kattints ide</a></p>
    </div>
    <Chatroom v-bind:messages="messages" v-on:sendMessage="this.sendMessage"></Chatroom>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Chatroom from '@/components/ChatRoom';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    Chatroom
  },
  computed: {
    ...mapGetters({
      userFromMapGetters: 'user',
    })
  },
  data: function() {
    return {
      username: "",
      socket: io('http://localhost:3000'),
      messages: [],
      users: []
    }
  },
  methods: {
    refreshData: function () {
      this.$router.replace('/home');
      // this.$router.go(0);
        setTimeout(this.goToChat, 400);
    },

    goToChat: function () {
      this.$router.replace('/chat');
    },

    scrollToChatEnd: function() {
      let messagesContainer = document.getElementsByClassName('messages')[0];
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      // alert('Görgetés vége.');
    },
    joinServer: function() {
      this.socket.on('loggedIn', data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit('newUser', this.username);
      });
      this.listen();
    },
    listen: function() {
      this.socket.on('userOnline', user => {
        this.users.push(user);
      });
      this.socket.on('userLeft', user => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on('msg', message => {
        this.messages.push(message);
      });
    },
    sendMessage: function(message) {
      this.socket.emit('msg', message);
      this.scrollToChatEnd();

      //  elküldött üzenet
      let sentMessage = document.getElementsByClassName('messages')[0];
      sentMessage.insertAdjacentHTML('beforeend',
          `<div class="blueMessageBubble"><div class="username">${this.username}: </div><div class="message">${message}</div></div>`);
    }
  },
  beforeMount() {
    this.username = this.userFromMapGetters.username;
    // if(!this.username) {
    //   this.username = "Anonymous";
    // }

    this.joinServer();
  },
  mounted() {
    // setTimeout(function() {
    //   if(this.username !== this.userFromMapGetters.username) {
    //     alert('A felhasználóneved nem található az adatbázisban.');
    //   } else {
    //     alert(this.username + "\n" + this.userFromMapGetters.username);
    //   }
    // }, 2000);
  },

}
</script>

<style>
</style>