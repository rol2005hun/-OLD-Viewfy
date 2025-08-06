<template>
<div class="app">
  <div class="postsContainer">
    <br>
    <h1 style="text-align: center">Bejegyzések</h1>
    <p v-if="posts === undefined || posts.length < 1">Hmm, ez a hely még üres 😞<br>Miért nem teszel közzé valamit?</p>
    <div v-else class="grid-container" v-for="post in posts" :key="post._id">
      <div class="posts">
        <div class="postsGridItem" :style="{'background-image': 'url(' + post.image + ')'}">
          <div class="postContent" @click="enlargePost(post); getComments(post._id)">
            <p><strong>{{ post.name }}</strong></p>
            <p>{{ post.description }}</p>
            <p>{{ post.ownerName }} által közzétéve ekkor: {{ formatDate(post.date) }}</p>
            <label class="totalCommentsLabel"><i class="fas fa-comment-dots"></i> {{ post.comments.length }}</label>
          </div>
        </div>
        <button v-on:click="enlargePost(post); getComments(post._id)">Bejegyzés megnyitása</button>
        <button v-if="isPostOwner(post.ownerId)" @click="removePost(post._id)" class="red-background">Bejegyzés törlése</button>
      </div>
    </div>
    <div class="createPostButton">
      <button @click="goToCreatePost">Bejegyzés készítése</button>
    </div>
  </div>

  <div class="usersContainer">
    <br>
    <h1 style="text-align: center">Ajánlott felhasználók</h1>
    <p v-if="explorableUsers  === undefined || explorableUsers.length < 1">Elnézést, de nincsenek elérhető felhasználók<br>Gyere vissza később</p>
    <div v-else class="grid-container" v-for="u in explorableUsers" :key="u._id">
      <div class="users">
        <div class="usersGridItem">
          <div class="userContent" @click="enlargeUser(u); getPosts(u._id);">
            <img :src="u.image">
            <p><strong>{{ u.name }}</strong></p>
            <p>{{ u.username }}</p>
          </div>
        </div>
        <button @click="enlargeUser(u); getPosts(u._id)">Profil megtekintése</button><br>
        <button v-if="!u.followers.includes(user.username)" @click="connect(u._id, 'follow')">Követés</button>
        <button class="white-background" v-else @click="connect(u._id, 'unfollow')">Követés visszavonása</button><br>
        <!--          <button class="red-background">Tiltás</button><br>-->
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
name: 'RecommendedContent',
  props: ['posts', 'enlargePost', 'getComments', 'formatDate', 'isPostOwner', 'removePost', 'goToCreatePost',
    'explorableUsers', 'enlargeUser', 'getPosts', 'user', 'connect'],

}
</script>

<style scoped>

</style>