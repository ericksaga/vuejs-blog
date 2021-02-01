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
                <img alt="user logo" v-if="author.avatar" v-bind:src="author.avatar" class="img-thumbnail">
                <img alt="user logo" v-else src="../assets/placeholder.jpg" class="img-thumbnail">
                <p>{{ author.username }}</p>
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
export default {
  name: 'home-posts',
  props: {
    post:Object
  },
  data:function() {
      return {
          author:{},
          comments: {}
      }
  },
  methods: {
  },
  computed: {
      postDate: function() {
          //modify it in a readable way
          return this.publicationDate;
      },
      likesCount: function() {
          return this.post.likes.length
      },
      commentsCount: function() {
          return this.comments.length
      }
  },
  beforeMount: function() {
      fetch(`http://localhost:3000/users?id=${this.post.authorId}`).then((response) => {
          response.json().then((resUser) => {
              this.author = resUser[0]
          })
      })
      fetch(`http://localhost:3000/comments?postId=${this.post.id}`).then((response) => {
          response.json().then((resComments) => {
              this.comments = resComments
          })
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
