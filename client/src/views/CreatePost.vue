<template>
  <div class="mainPostContainer">
    <div class="headingClass">
      <h1>Bejegyzés készítése</h1>
    </div>
    <div class="createPostForm">
      <form @submit.prevent="publishPost(user._id)">
        <label>Kép</label>
        <input type="file" id="postImage" required @change="uploadImage" accept="image/*">
        <label class="customFileUpload" id="customFileUpload" for="postImage">{{ uploadProgress }}</label>

        <label for="postName">Bejegyzés neve</label>
        <input type="text" id="postName" v-model="name" required minlength="6">

        <label for="postDescription">Bejegyzés leírása</label>
        <input type="text" id="postDescription" v-model="description" required  minlength="6">

        <label for="postPrivacy">Bejegyzés adatvédelme</label><br>
        <select id="postPrivacy" v-model="privacy" required>
          <option  value="public">Nyilvános</option>
          <option value="private">Privát</option>
        </select><br><br>

        <div class="buttonContainer">
          <input type="submit" class="button" value="Közzétesz"><br><br>
        </div>
        <!-- mapGetter hibaüzenetek -->
        <div id="errorMessage"></div>
        <div id="successMessage"></div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { fb } from '../../firebase';

export default {
  data() {
    return {
      name: "",
      description: "",
      image: "",
      privacy: "",
      uploadProgress: "",
    }
  },

  computed: {
    ...mapGetters({
      storePostError: 'postError',
      storePostStatus: 'postStatus',

      gettersUser: 'user',
    }),
    postError: {
      get() {
        return this.storePostError
      },
      set(name) {
        return name
      }
    },

    postStatus: {
      get() {
        return this.storePostStatus
      },
      set(name) {
        return name
      }
    },

    user: {
      get() {
        return this.gettersUser
      },
      set(name) {
        return name
      }
    },
  },


  methods: {
    ...mapActions(['post']),

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
      let storageRef = fb.storage().ref(`images/${this.user.username}-${dateTime}-${file.name}`);

      let uploadTask = storageRef.put(file);

      uploadTask.on('state_changed',
          (snapshot) => {
          },
          (error) => {
            // sikertelen feltöltések
          },
          () => {
            // sikeres feltöltések
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('A fájl elérhetősége:', downloadURL);
              const fileProgressLabel = document.getElementById('customFileUpload');
              fileProgressLabel.classList.add('noBefore');
              fileProgressLabel.classList.add('fileUploaded');
              this.uploadProgress = 'Sikeres fájlfeltöltés.';
              this.image = downloadURL;
            });
          }
      );
    },

    publishPost(id) {
        let post = {
          name: this.name,
          description: this.description,
          privacy: this.privacy,
          image: this.image
        };

        this.post([post, id]).then(res => {
          if (res.data.success) {
            this.$router.replace('/home');
          }
        }).catch(() => {
          this.displayErrorMessage();
        });
    },

    // hibaüzenetek
    displaySuccessfulMessage() {
      let focusedElement = document.getElementById('successMessage');
      let unfocusedElement = document.getElementById('errorMessage');
      this.successfulMessage(focusedElement, unfocusedElement);
    },

    displayErrorMessage() {
      let focusedElement = document.getElementById('errorMessage');
      let unfocusedElement = document.getElementById('successMessage');
      if(this.postError) {
        this.failureMessage(focusedElement, unfocusedElement);
      }
    },

    successfulMessage(focusedElement, unfocusedElement) {
      unfocusedElement.innerText = "";

      focusedElement.innerHTML = this.postStatus;
    },

    failureMessage(focusedElement, unfocusedElement) {
      unfocusedElement.innerText = "";
      focusedElement.innerHTML = this.postError;
    },

  },
  created() {

  }
}
</script>