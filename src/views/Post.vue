<template>
<div class="post container">
    <div class="row">
        <div class="col-12">
            <h1> {{ post.title }} </h1>
            <i class="bi bi-x-square text-end"></i>
        </div>
    </div>
    <div class="row">
        <div class="col-4"> 
            <img alt="user logo" v-if="author.avatar" v-bind:src="author.avatar" class="img-thumbnail">
            <img alt="user logo" v-else src="../assets/placeholder.jpg" class="img-thumbnail">
            <p>{{ author.username }}</p>
            <p>{{ post.creationDate }}</p>
        </div>
        <div class="col-8"> 
            <p>{{ post.message }}</p>
        </div>
    </div>
    <p v-if="post.edited">edited</p>
    <div class="row">
        <div class="col-6">
            <!-- <i class="bi bi-hand-thumbs-up-fill"></i> !-->
            <i class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
        </div>
        <div class="col-6">
            <i class="bi bi-chat-left-dots"> {{ commentsCount }}</i>
        </div>
    </div>
    <h2>Agregar comentario</h2>
    <vue-editor id="postComment" v-model="newComment"></vue-editor>
    <div class="row">
        <div class="d-grid gap-2 col-6">
            <button type="button" class="btn btn-primary" @click="submitComment">Crear</button>
        </div>
        <div class="d-grid gap-2 col-6">
            <button type="button" class="btn btn-danger" @click="clearEditor">Cancelar</button>
        </div>
    </div>
      <h2>Comentarios</h2>
      <comment v-for="uComment in comments" 
      :comment="uComment"
      :key="uComment.id"/>
  </div>
</template>

<script>
import Comment from './Comment.vue';
import { VueEditor } from 'vue2-editor'
export default {
  components: { 
      Comment,
      VueEditor
    },
  name: 'post',
  data:function() {
      return {
          postId:this.$route.params.postId,
          author:{},
          post: {
              likes: []
          },
          comments: [],
          newComment: ''
      }
  },
  methods: {
      clearEditor: function() {
          this.newComment = ''
      },
      submitComment: function() {
        fetch("http://localhost:3000/comments", {
            method:'Post',
            body: JSON.stringify({
                authorId: 1,
                postId: this.postId,
                creationDate: Date().toUTCString,
                message: this.newComment,
                likes: []
            })
        })
      }
  },
  computed: {
      likesCount: function() {
          return this.post.likes.length
      },
      commentsCount: function() {
          return this.comments.length
      }
  },
  beforeMount: function() {
    fetch(`http://localhost:3000/posts?id=${this.postId}`).then((response) => {
        response.json().then((resPost) => {
            this.post = resPost[0]
            fetch(`http://localhost:3000/users?id=${this.post.authorId}`).then((response) => {
                response.json().then((resUser) => {
                    this.author = resUser[0]
                })
            })
            fetch(`http://localhost:3000/comments?postId=${this.postId}`).then((response) => {
                response.json().then((resComments) => {
                    this.comments = resComments
                })
            })
        })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
