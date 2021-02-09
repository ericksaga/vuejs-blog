<template>
<div class="post container">
    <div class="row" @mouseenter="focus=true" @mouseleave="focus= false">
        <div class="col-12">
            <div class="float-end" v-if="focus && getUser.id==post.authorId">
                <i class="bi bi-x-square float-end"></i>
                <i class="bi bi-pencil-square" @click="$router.push({name:'EditPost', params:{'postId':postId}})"></i>
            </div>
            <h1> {{ post.title }} </h1>
        </div>
        <div class="col-4"> 
            <router-link v-if="author.id" :to="{
                name:'UserPosts',
                params: {
                    userId: author.id
                }
            }"> 
                <img alt="user logo" v-bind:src="avatarSource" class="img-thumbnail">
                <p>{{ author.username }}</p>
            </router-link>
            <p>{{ post.publicationDate }}</p>
        </div>
        <div class="col-8"> 
            <div v-html="post.message"/>
        </div>
    <p v-if="post.edited">edited</p>
        <div class="col-6" @click="likePost">
            <i v-if="userLiked" class="bi bi-hand-thumbs-up-fill"> {{ likesCount }} </i>
            <i v-else class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
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
    </div>
    <h2>Comentarios</h2>
    <comment v-for="uComment in comments" 
    :comment="uComment"
    v-on:updateComments="fetchPostComments"
    :key="uComment.id"/>
  </div>
</template>

<script>
import Comment from '../components/Comment.vue';
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex';
import CryptoJS from 'crypto-js'
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
          focus: false,
          avatarSource: ''
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
            this.clearEditor()
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
                this.likes = resLikes.filter((like) => like.valid)
            })
        })
      },
      fetchPostAuthor: function() {
        fetch(`http://localhost:3000/users?id=${this.post.authorId}`).then((response) => {
            response.json().then((resUser) => {
                this.author = resUser[0]
                this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.author.email)}?d=${this.author.avatar?this.author.avatar:'mp'}&&f=y`
            })
        })
      },
      likePost: function() {
          fetch(`http://localhost:3000/likes?postId=${this.post.id}&userId=${this.getUser.id}`).then((response) => {
              response.json().then((resLike) => {
                  if(resLike.length > 0) {
                    resLike[0].valid = !resLike[0].valid;
                    fetch(`http://localhost:3000/likes/${resLike[0].id}`, {
                        method:'Put',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(resLike[0])
                    }).then(() => {
                        this.fetchPostLikes()
                    })
                  } else {
                      fetch(`http://localhost:3000/likes`, {
                        method:'Post',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: this.getUser.id,
                            postId: this.post.id,
                            valid: true,
                            creationDate: new Date().toISOString()
                        })
                    }).then(() => {
                        this.fetchPostLikes()
                    })
                  }
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
      },
      userLiked: function() {
          return this.likes.find((like) => like.userId == this.getUser.id)
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
