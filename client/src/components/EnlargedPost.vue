<template>
  <div class="app">
    <div class="enlargedPost" v-for="p of post" :key="p._id">
      <div class="content">
        <div class="postHeading">
          <p><span>{{ p.ownerName }}</span> bejegyzése <i>{{ p.name }}</i> ekkor <span>{{ formatDate(p.date) }}</span></p>
        </div>
        <p>{{ p.description }}</p>
        <img :src="p.image">
        <div class="comments">
          <textarea :value="commentDetails" @input="changeCommentDetails" placeholder="Hozzászólás" style="resize: none" required minlength="20"></textarea><br>
          <button class="postDataButton white-background" @click="addComment(p._id)">Közzétesz</button>
          <br>
          <div id="errorMessage"></div>

          <p v-if="recentComments.length">Nemrég közölt hozzászólások</p>
          <div class="previousComments" v-for="c in recentComments" :key="c._id">
            <div class="comment">
              <p class="poster"><span>{{ c.ownerName }}</span> on <span>{{ formatDate(c.date) }}</span> at <span>{{ formatTime(c.date) }}</span></p>
              <p class="details">{{ c.comment }}</p>
            </div>
            <br>
          </div>

          <p v-if="comments !== undefined && comments.length !== 0">Előző hozzászólás</p>
          <div class="previousComments" v-for="c in comments" :key="c._id">
            <div class="comment">
              <p class="poster"><span>{{ c.ownerName }}</span> on <span>{{ formatDate(c.date) }}</span> at <span>{{ formatTime(c.date) }}</span></p>
              <p class="details">{{ c.comment }}</p>
              <p><i class="fas fa-comment-dots"></i> {{ c.replies.length }}</p>
              <div class="ratings">
                <span @click="rateComment(c._id, c.postId, c.upvotes, 'upvote')"><i class="fas fa-heart upvote"></i><span>{{ c.upvotes }}</span></span>
                <span @click="rateComment(c._id, c.postId, c.downvotes, 'downvote')"><i class="fas fa-thumbs-down downvote"></i><span>{{ c.downvotes }}</span></span>
              </div>
            </div>
            <button class="blue-background" @click="showReplies(c._id)">Válasz</button>
            <button class="blue-background" @click="showReplies(c._id)">Válaszok megtenkintése</button>
            <button v-if="isCommentOwner(c.ownerId)" @click="removeComment(c._id, c.postId)" class="red-background">Hozzászólás törlése</button>
            <br><br>
          </div>
        </div>
      </div>
      <span @click="closeEnlargedContent('post')"><i class="fas fa-times closeContentButton"></i></span>
    </div>

    <div id="repliesContainer">
      <div class="main">
        <p v-for="(fc, index) in focusedCommentInfo" :key="index">Válaszok {{ fc.ownerName }} hozzászólására</p>
        <div class="replies">
          <div v-for="r in replies" :key="r._id" class="reply">
            <p class="details" style="color: #1e2020">{{ r.ownerName }}: {{ r.reply }}</p>
            <div class="ratings">
              <span @click="rateReply(r._id, r.commentId, r.upvotes, 'upvote')"><i class="fas fa-heart upvote"></i><span>{{ r.upvotes }}</span></span>
              <span @click="rateReply(r._id, r.commentId, r.upvotes, 'downvote')"><i class="fas fa-thumbs-down downvote"></i><span>{{ r.downvotes }}</span></span>
            </div>
          </div>
        </div>
        <div class="replyContainer">
          <textarea :value="replyDetails" @input="changeReplyDetails" placeholder="Add a reply" style="resize: none" required minlength="6"></textarea>
          <p v-if="replyErrorStatus" class="red-colour" style="margin-top: 5%">{{ replyErrorStatus }}</p><br>

          <button v-for="(fc, index) in focusedCommentInfo" :key="index" class="postDataButton" @click="addReply(fc._id)">Közzétesz</button>
        </div>
        <button v-for="fc in focusedCommentInfo" :key="fc.postId" class="red-background" @click="hideReplies(fc.postId)">Vissza</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
name: 'EnlargedPost',
  props: ['post', 'formatDate', 'formatTime', 'commentDetails', 'addComment', 'recentComments', 'comments',
    'rateComment', 'showReplies', 'isCommentOwner', 'removeComment', 'closeEnlargedContent', 'focusedCommentInfo',
    'rateReply', 'replies', 'replyDetails', 'addReply', 'hideReplies', 'replyErrorStatus'],

  computed: {

  },

  data() {
    return {
      childCommentDetails: "",
    }
  },

  methods: {
    changeCommentDetails(event) {
      this.childCommentDetails = event.target.value;
      this.$emit('commentDetailsChanged', this.childCommentDetails);
    },

    changeReplyDetails(event) {
      this.childReplyDetails = event.target.value;
      this.$emit('replyDetailsChanged', this.childReplyDetails);
    },
  },
}
</script>

<style scoped>

</style>