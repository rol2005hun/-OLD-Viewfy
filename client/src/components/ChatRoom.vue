<template>
  <div class="mainChatContainer">
<!--    <br><h1 style="text-align: center;">Üdv újra, {{ userFromMapGetters.username }}, itt van, amiről lemeradhadtál:</h1>-->

    <div class="chatContainer">
<!--      <div class="chatHeading">-->
<!--        <p>Üdv a chaten, a chat tartalma 24 óránként törlődik</p>-->
<!--      </div>-->
      <div class="chatClass">
        <div class="chatWindow">
          <div class="messages">
            <div class="greyMessageBubble" v-for="message in messages" v-bind:key="message.index">
              <div class="username"> {{ message.username }}: </div>
              <div class="messageText">{{ message.msg }}</div>
            </div>
          </div>
          <form class="inputContainer" v-on:submit="sendMessage">
            <input class="messageInput" type="text" v-model="msg" required minlength="2" placeholder="Ide írd az üzeneted">
            <button v-on:click="sendMessage" v-bind:disabled="!msg">Üzenet küldése</button>
          </form>
        </div>
      </div>
    </div>
    <div class="activeUsersContainer">
      <div class="activeUsers">
        <div class="users">
          <p> {{ users.username }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'chatroom',
  props: ['messages'],

  data: function() {
    return {
      msg: ""
    }
  },

  computed: {
    ...mapGetters({
      userFromMapGetters: 'user',
    })
  },

  methods: {
    sendMessage: function() {
      if(!this.msg) {
        alert('Kérlek írj egy üzenetet.');
        return;
      }
      this.$emit('sendMessage', this.msg);
      this.msg = "";
    }
  },
}
</script>

<style>
</style>