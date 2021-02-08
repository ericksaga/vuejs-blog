<template>
    <div class="posts container">
        <div class="row">
            <router-link :to="{
                name:'Post',
                params: {
                    postId: post.id
                }
            }">
                <h1> {{ post.title }} </h1>
            </router-link>
        </div>
        <div class="row">
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
                <router-link :to="{
                    name:'Post',
                    params: {
                        postId: post.id
                    }
                }">
                    <p>{{ post.creationDate }}</p>
                </router-link>
            </div>
            <div class="col-8"> 
                <div v-html="post.message"/>
            </div>
        </div>
        <p v-if="post.edited">edited</p>
        <div class="row">
            <div class="col-6">
                <!-- <i class="bi bi-hand-thumbs-up-fill"></i> !-->
                <i class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
            </div>
            <div class="col-6">
                <router-link :to="{
                    name:'Post',
                    params: {
                        postId: post.id
                    }
                }">
                    <i class="bi bi-chat-left-dots"> {{ commentsCount }}</i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  name: 'home-posts',
  props: {
    post:Object
  },
  data:function() {
      return {
          author:{},
          comments: [],
          likes: [],
          avatarSource: ''
      }
  },
  methods: {
  },
  computed: {
      likesCount: function() {
          return this.likes.length
      },
      commentsCount: function() {
          return this.comments.length
      }
  },
  beforeMount: function() {
    fetch(`http://localhost:3000/users?id=${this.post.authorId}`).then((response) => {
        response.json().then((resUser) => {
            this.author = resUser[0]
            this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.author.email)}?d=${this.author.avatar?this.author.avatar:'mp'}&&f=y`
        })
    })
    fetch(`http://localhost:3000/comments?postId=${this.post.id}`).then((response) => {
        response.json().then((resComments) => {
            this.comments = resComments
        })
    })
    fetch(`http://localhost:3000/likes?postId=${this.post.id}`).then((response) => {
        response.json().then((resLikes) => {
            this.likes = resLikes;
        })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
