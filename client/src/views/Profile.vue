<template>
  <div class="profileHeading" v-if="user">
      <img :src="user.image">
      <h2>{{ user.name }}</h2>
      <p>{{ user.biography }}</p>
      <p>{{ user.location }}</p>
      <button class="profileSettingsButton" @click="goToProfileSettings">Profil beállítások</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  computed: mapGetters(['user']),

  methods: {
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

<style>
</style>
