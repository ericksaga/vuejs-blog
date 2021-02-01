<template>
  <div class="home">
    <button class="btn btn-primary" @click="testModal">test modal</button>
    <home-posts v-for="post in homePosts" 
    v-bind:key="post.id" 
    v-bind:post="post"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from 'vuex'
import HomePosts from '../components/HomePosts.vue'
import LoginModalVue from './LoginModal.vue'

export default {
  name: 'Home',
  components: {
    HomePosts
  },
  methods: {
    ...mapActions([
      'fetchPosts'
    ]),
    testModal: function() {
      this.$modal.show(LoginModalVue)
    }
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
