<template>
  <div class="profileSettingsHeading">
    <div class="settingsTitleHeading">
      <h1>Profil beállítások</h1>
    </div>
    <div class="leftSection">

      <img :src="user.image">
      <p class="userNameParagraph"> {{ user.name }}</p>
      <div class="settingsOptions">
        <button @click="showSelectedPage('buttonHighlighter', 'aboutSection', 'sectionClass', 'rightAboutSection')"><div class="buttonHighlighter" id="aboutSection"></div><p>Rólam</p></button>
      </div>
      <div class="settingsOptions">
        <button @click="showSelectedPage('buttonHighlighter', 'profileSection', 'sectionClass', 'rightProfileSection')"><div class="buttonHighlighter" id="profileSection"></div><p>Profil</p></button>
      </div>
      <div class="settingsOptions">
        <button @click="showSelectedPage('buttonHighlighter', 'preferencesSection', 'sectionClass', 'rightPreferencesSection')"><div class="buttonHighlighter" id="preferencesSection"></div><p>Preferenciák</p></button>
      </div>
      <div class="settingsOptions">
        <button @click="showSelectedPage('buttonHighlighter', 'notificationsSection', 'sectionClass', 'rightNotificationsSection')"><div class="buttonHighlighter" id="notificationsSection"></div><p>Értesítések</p></button>
      </div>
      <div class="settingsOptions">
        <button @click="showSelectedPage('buttonHighlighter', 'securitySection', 'sectionClass', 'rightSecuritySection')"><div class="buttonHighlighter" id="securitySection"></div><p>Biztonság</p></button>
      </div>
    </div>


    <div class="rightSection">
      <div id="sectionsContainer">
        <div id="rightAboutSection" class="sectionClass">
          <br><h2>Rólam</h2><br>
          Nevem: <br><input type="text" v-model="user.name"><br><br>
          Biográfiám: <br><input type="text" v-model="user.biography"><br><br>
          Lakóhely: <br><input type="text" v-model="user.location"><br><br>
          <button v-if="hasBeenUpdated" @click="patchProfileSettings(user._id)">Mentés</button><br><br>
          <p style="color: #2BAE66FF; text-align: left;">{{ statusMessage }}</p>
        </div>

        <div id="rightProfileSection" class="sectionClass">
          <br><h2>Profil</h2><br>
        </div>

        <div id="rightPreferencesSection" class="sectionClass">
          <br><h2>Preferenciák</h2><br>
        </div>

        <div id="rightNotificationsSection" class="sectionClass">
          <br><h2>Értesítések</h2><br>
        </div>

        <div id="rightSecuritySection" class="sectionClass">
          <br><h2>Biztonság</h2><br>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      bio: "",
      loc: "",
      statusMessage: "",
    }
  },

  computed: {
    ...mapGetters({
      user: 'user',
    }),
    hasBeenUpdated() {
      return this.user.biography !== "" && this.user.location !== "";
    }

  },

  methods: {
    ...mapActions(['patchUser']),

    patchProfileSettings(userId) {
      let patchedUserSettings = {
        name: this.user.name,
        biography: this.user.biography,
        location: this.user.location,
      };

      this.patchUser([userId, patchedUserSettings]).then(res => {
        if (res.data) {
          console.log(res.data.status);
          this.statusMessage = res.data.status;
        }
      }).catch(() => {
        alert('Siker.');
      });
    },

    showSelectedPage: function(elementClass, elementId, rightSectionClass, rightSectionContent) {
      // nodeok az azonos nevű osztályok csomópontjai között
      const items = document.getElementsByClassName(elementClass);
      for (let i=0; i < items.length; i++) {
        // eltávolítja a kijelölt jelölőt/kiemelőt minden osztályhoz
        items[i].style.visibility = "hidden";
      }
      // kijelöli a kijelöltet a megadott azonosítóval
      const selectedSettingsHighlighter = document.getElementById(elementId);
      selectedSettingsHighlighter.style.visibility = "visible";

      if (window.getComputedStyle(selectedSettingsHighlighter).visibility === "visible") {
        // nodeok az azonos nevű osztályok csomópontjai között
        const rightSectionClassDefiner = document.getElementsByClassName(rightSectionClass);
        for (let a = 0; a < rightSectionClassDefiner.length; a++) {
          // kijelöli a kijelöltet a megadott azonosítóval
          rightSectionClassDefiner[a].style.display = "none";
        }
      }
      const selectedSettingsContent = document.getElementById(rightSectionContent);
      selectedSettingsContent.style.display = "block";
    },

    ...mapActions(['getProfile']),

    goToProfileSettings: function() {
      this.$router.replace('/profilesettings');
    }
  },
  created() {
    // getProfile kérés
    this.getProfile();
  }
}
</script>
