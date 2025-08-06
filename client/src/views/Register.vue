<template>
  <div class="registerForm">
    <form @submit.prevent="registerUser">
      <h1>Regisztráció</h1><br>
      <label>Profilkép</label><br>
      <input type="file" id="displayImage" required @change="uploadImage" accept="image/*">
      <label style="width: 100%; margin-bottom: 2%" class="customFileUpload" id="customFileUpload" for="displayImage">{{ uploadProgress }}</label>

      <label for="username">Felhasználónév</label>
      <input type="text" placeholder="pl., appleman129" v-model="username" class="form-control" id="username"  autocomplete="username" required minlength="6">

      <label for="name">Teljes név</label>
      <input type="text" placeholder="pl., Példa Péter" v-model="name" class="form-control" id="name"  autocomplete="name" required minlength="6">
      
      <label for="email">Email cím</label>
      <input type="text" placeholder="pl., peldapeti@gmail.com" v-model="email" class="form-control" id="email"  autocomplete="email" required>

      <label for="password">Jelszó</label>
      <input type="password" placeholder="pl., Titok19@$" v-model="password" class="form-control" id="password"  autocomplete="current-password" required minlength="6">

      <label for="password">Jelszó mégegyszer</label>
      <input type="password" v-model="confirm_password" class="form-control" id="confirm_password"  autocomplete="new-password" required minlength="6">

      <div class="buttonContainer">
          <input type="submit" class="button" value="Regisztráció"><br><br>
          <router-link to="/login" tag="button" id="loginInsteadLink">Bejelentkezés</router-link>
      </div>
      <!-- mapGetter hibaüzenetek -->
      <div id="errorMessage"></div>
      <div id="successMessage"></div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { fb } from "../../firebase";

export default {
  data(){
    return {
      username: "",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      image: "",
      uploadProgress: "",
    };
  },
  created: function () {

  },
  mounted() {
      // call the function under methods that gets saved theme from localstorage
      this.clearErrorMessage();
  },
  computed: {
    ...mapGetters(['userError'])
  },
  methods: {
    uploadImage(e) {
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date+time;

      let file = e.target.files[0];
      if(!(file.name.endsWith('jpeg') || file.name.endsWith('png') || file.name.endsWith('jpg'))) {
        console.log('Kérlek válassz egy megfelelő fájlformátumot.');
        document.getElementById('customFileUpload').classList.add('fileUploadError');
        this.uploadProgress = ' sikertelen';
        return
      }
      let storageRef = fb.storage().ref(`images/${dateTime}-${file.name}`);

      let uploadTask = storageRef.put(file);

      uploadTask.on('state_changed',
          (snapshot) => {
          },
          (error) => {
            // sikertelen feltöltés
          },
          () => {
            // sikeres feltöltés
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('A fájl elérhetősége', downloadURL);
              const fileProgressLabel = document.getElementById('customFileUpload');
              fileProgressLabel.classList.add('noBefore');
              fileProgressLabel.classList.add('fileUploaded');
              this.uploadProgress = 'Sikeres fájlfeltöltés';
              this.image = downloadURL;
            });
          }
      );

    },

    clearErrorMessage() {
      let focusedElement = document.getElementById('errorMessage');
      focusedElement.innerHTML = '';
    },

    displayErrorMessage() {
      let focusedElement = document.getElementById('errorMessage');
      if(this.userError) {
        focusedElement.innerHTML = this.userError;
      }
    },

    ...mapActions(['register']),

    registerUser() {
      let user = {
        username: this.username,
        password: this.password,
        confirm_password: this.confirm_password,
        email: this.email,
        name: this.name,
        image: this.image
      };
      this.register(user).then(res => {
        if(res.data.success) {
          this.$router.push('login');
        }
      }).catch(err => {
        this.displayErrorMessage();
      });
    }
  }
}
</script>

<style>
</style>
