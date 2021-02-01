<template>
  <div class="home">
    <home-posts v-for="post in homePosts" 
    v-bind:key="post.id" 
    v-bind:post="post"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex'
import HomePosts from '../components/HomePosts.vue'

export default {
  name: 'Home',
  components: {
    HomePosts
  },
  methods: {
    ...mapActions([
      'fetchPosts'
    ])
  },
  computed: {
    ...mapGetters([
      'homePosts'
    ])
  },
  data: function() {
    return {
      posts: []
    }
  },
  beforeMount() {
    this.fetchPosts()
  }
}
</script>
