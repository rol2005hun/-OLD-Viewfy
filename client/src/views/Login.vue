<template>
  <div class="loginForm">
    <form @submit.prevent="loginUser">
      <h1>Bejelentkezés</h1><br>
      <label for="username">Felhasználónév</label>
      <input type="text" v-model="username" class="form-control" id="username" autocomplete="username" required><br>

      <label for="password">Jelszó</label>
      <input type="password" v-model="password" class="form-control" id="password" autocomplete="current-password" required><br>
      <div class="buttonContainer">
        <input type="submit" class="button" tag="button" value="Bejelentkezés"><br><br>
        <router-link to="/register" tag="button" id="signUpInsteadLink">Regisztráció</router-link><br>
      </div>
        <div id="errorMessage"></div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
export default {
  data(){
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
      this.clearErrorMessage();
  },
  computed: {
    ...mapGetters(['userError'])
  },
  methods: {
    ...mapActions(['login']),

    clearErrorMessage() {
      let focusedElement = document.getElementById('errorMessage');
      focusedElement.innerHTML = '';
    },

    displaySuccessMessage() {
      let focusedElement = document.getElementById('successMessage');
      if(this.userError) {
        focusedElement.innerHTML = this.userError;
      }
    },

    displayErrorMessage() {
      let focusedElement = document.getElementById('errorMessage');
      if(this.userError) {
        focusedElement.innerHTML = this.userError;
      }
    },

    // az alábbi sorban található mapActions a UserREST.js fájlban lévő const műveletekből, az alkalmazott módszer válaszából származik
    // auth.js innen származik, és a munka belőle történik, a token és a felhasználó létrehozása egyaránt auth.js és
    // "auth_success" néven, az említett két paraméter mellett
    loginUser(){
      let user = {
        username: this.username,
        password: this.password
      };
      this.login(user)
      .then(res => {
        if(res.data.success) {
          // ha a bejelentkezési adatok helyesek a homera irányít
          this.$router.push('/home');
          this.displaySuccessMessage();
        }
      }).catch(err => {
        // this.error = "A megadott adatok nem egyeznek.";
        // alert("A megadott adatok nem egyeznek.");
        console.log(err);
        this.displayErrorMessage();
      });
    }
  }
}
</script>

<style>
</style>
