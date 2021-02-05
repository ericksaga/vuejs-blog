<template>
<div class="post container">
    <div class="row" @mouseenter="focus=true" @mouseleave="focus= false">
        <div class="col-12">
            <i class="bi bi-x-square float-end" v-if="focus && getUser.id==post.authorId"></i>
            <h1> {{ post.title }} </h1>
        </div>
        <div class="col-4"> 
            <router-link v-if="author.id" :to="{
                name:'UserPosts',
                params: {
                    userId: author.id
                }
            }"> 
                <img alt="user logo" v-if="author.avatar" v-bind:src="author.avatar" class="img-thumbnail">
                <img alt="user logo" v-else src="../assets/placeholder.jpg" class="img-thumbnail">
                <p>{{ author.username }}</p>
            </router-link>
            <p>{{ post.creationDate }}</p>
        </div>
        <div class="col-8"> 
            <div v-html="post.message"/>
        </div>
    <p v-if="post.edited">edited</p>
        <div class="col-6">
            <!-- <i class="bi bi-hand-thumbs-up-fill"></i> !-->
            <i class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
        </div>
        <div class="col-6">
            <i class="bi bi-chat-left-dots"> {{ commentsCount }}</i>
        </div>
    </div>
    <div v-if="post.acceptComments">
        <h2>Agregar comentario</h2>
        <div v-if="getUser">
            <vue-editor id="postComment" v-model="newComment"></vue-editor>
            <div class="row">
                <div class="d-grid gap-2 col-6">
                    <button type="button" class="btn btn-primary" @click="submitComment">Crear</button>
                </div>
                <div class="d-grid gap-2 col-6">
                    <button type="button" class="btn btn-danger" @click="clearEditor">Cancelar</button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Ingrese a su cuenta para poder comentar</p>
        </div>
        <h2>Comentarios</h2>
        <comment v-for="uComment in comments" 
        :comment="uComment"
        :key="uComment.id"/>
    </div>
  </div>
</template>

<script>
import Comment from './Comment.vue';
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex';
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
          post: {},
          likes: [],
          comments: [],
          newComment: '',
          focus: false
      }
  },
  methods: {
      clearEditor: function() {
          this.newComment = ''
      },
      submitComment: function() {
        fetch("http://localhost:3000/comments", {
            method:'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorId: +this.getUser.id,
                postId: +this.postId,
                creationDate: new Date().toISOString(),
                message: this.newComment,
                likes: []
            })
        }).then(() => {
            this.fetchPostComments()
        })
      },
      fetchPostComments: function(){
        fetch(`http://localhost:3000/comments?postId=${this.postId}`).then((response) => {
            response.json().then((resComments) => {
                this.comments = resComments
            })
        })
      },
      fetchPostLikes: function() {
        fetch(`http://localhost:3000/likes?postId=${this.postId}`).then((response) => {
            response.json().then((resLikes) => {
                this.likes = resLikes
            })
        })
      },
      fetchPostAuthor: function() {
        fetch(`http://localhost:3000/users?id=${this.post.authorId}`).then((response) => {
            response.json().then((resUser) => {
                this.author = resUser[0]
            })
        })
      }
  },
  computed: {
      ...mapGetters([
          'getUser'
      ]),
      likesCount: function() {
          return this.likes.length
      },
      commentsCount: function() {
          return this.comments.length
      }
  },
  beforeMount: function() {
    fetch(`http://localhost:3000/posts?id=${this.postId}`).then((response) => {
        response.json().then((resPost) => {
            this.post = resPost[0]
            this.fetchPostAuthor()
            this.fetchPostComments()
            this.fetchPostLikes()
        })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
