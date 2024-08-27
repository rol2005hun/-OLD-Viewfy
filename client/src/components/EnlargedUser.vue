<template>
  <div class="app">
    <div class="enlargedUser" v-for="u of enlargedUser" :key="u._id">
      <div class="content">
        <div class="userHeading">
          <p><span>{{ u.name }}</span> üdvözöl a profilján</p>
        </div>
        <p class="userStats"><strong>{{ u.posts.length }}</strong> bejegyzés <strong>{{ u.followers.length }}</strong>
          követő <strong>{{ u.following.length }}</strong> követés</p><br>

        <div class="userPosts">
          <div class="heading">
            <p>Bejegyzések</p>
          </div>
          <p class="desertedParagraph" v-if="userPosts !== undefined && userPosts.length < 1">Hmm, ez a hely még üres 😞<br>Gyere vissza később!</p>
          <div v-else class="post" v-for="(up, index) in userPosts" :key="index" :style="{'background-image': 'url(' + up.image + ')'}">
            <div class="postContent">
              <p style="font-style: italic">Bejegyzés #{{ index + 1 }}</p>
              <p><strong>{{ up.name }}</strong></p>
              <p>{{ up.description }}</p>
              <p>Közzétéve ekkor: {{ formatDate(up.date) }}</p><br>
              <label class="totalCommentsLabel"><i class="fas fa-comment-dots"></i> {{ up.comments.length }}</label>
            </div>
          </div>
        </div>

        <div class="userFollowersFollowing">
          <div class="heading">
            <p>Felhasználók</p>
          </div>
          <div class="followFollowersContainer">

            <div class="userFollowers">
              <p v-if="u.followers.length !== undefined && u.followers.length > 0">Követők</p>
              <p v-else>{{ u.username }} még nem rendelkezik követőkkel</p>
              <div class="follower" v-for="(follower, index) in u.followers" :key="index" :style="{'background-image': 'url(' +  + ')'}">
                <div class="followerContent">
                  <p style="font-style: italic">Kővető #{{ index + 1 }}</p>
                  <p><strong>{{ follower }}</strong></p>
                </div>
              </div>
            </div>

            <div class="userFollowing">
              <p v-if="u.following.length !== undefined && u.following.length > 0">Követések</p>
              <p v-else>{{ u.username }} még nem követ senkit</p>
              <div class="following" v-for="(following, index) in u.following" :key="index" :style="{'background-image': 'url(' +  + ')'}">
                <div class="followingContent">
                  <p style="font-style: italic">Követés #{{ index + 1 }}</p>
                  <p><strong>{{ following }}</strong></p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <span @click="closeEnlargedContent('user')"><i class="fas fa-times closeContentButton"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnlargedUser',
  props: ['enlargedUser', 'userPosts', 'closeEnlargedContent', 'formatDate'],
  data() {
    return {
    }
  },
}
</script>

<style scoped>
</style>
