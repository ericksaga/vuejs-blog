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
                    <p>{{ post.publicationDate }}</p>
                </router-link>
            </div>
            <div class="col-8"> 
                <div v-html="post.message"/>
            </div>
        </div>
        <p v-if="post.edited">edited</p>
        <div class="row">
            <div class="col-6" @click="likePost">
                <i v-if="userLiked" class="bi bi-hand-thumbs-up-fill"> {{ likesCount }} </i>
                <i v-else class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
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
import { mapGetters } from 'vuex'
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
      fetchLikes: function() {
          this.axios.get(`/likes?postId=${this.post.id}`).then((resLikes) => {
              this.likes = resLikes.data.filter((like) => like.valid);
          }) 
      },
      fetchComments: function() {
          this.axios.get(`/comments?postId=${this.post.id}`).then((resComments) => {
              this.comments = resComments.data
          })
      },
      fetchAuthor: function() {
          this.axios.get(`/users?id=${this.post.authorId}`).then((resUser) => {
              this.author = resUser.data[0]
              this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.author.email)}?d=${this.author.avatar?this.author.avatar:'mp'}&&f=y`
          })
      },
      likePost: function() {
          this.axios.get(`/likes?postId=${this.post.id}&userId=${this.getUser.id}`).then((resLike) => {
              if(resLike.data.length > 0) {
                  resLike.data[0].valid = !resLike.data[0].valid;
                  this.axios.put(`/likes/${resLike.data[0].id}`, resLike.data[0]).then(() => {
                      this.fetchLikes()
                  })
              } else {
                  this.axios.post(`/likes`, {
                      userId: this.getUser.id,
                      postId: this.post.id,
                      valid: true,
                      creationDate: new Date().toISOString()
                  }).then(() => {
                      this.fetchLikes()
                  })
              }
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
    this.fetchAuthor()
    this.fetchComments()
    this.fetchLikes()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
