import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: {},
  },
  getters: {
    homePosts: state => {
      return state.posts.filter(post => !post.drafted && !post.deleted)
    },
    getPost(state, payload) {
      return state.posts.find(post => post.id == payload.id)
    }
  },
  mutations: {
    uploadPosts(state, payload) {
      state.posts = payload.posts
    }
  },
  actions: {
    fetchPosts(context) {
      fetch("http://localhost:3000/posts").then((response) => {
        response.json().then((resPost) => {
          context.commit('uploadPosts', {
            posts: resPost
          })
        })
      }, () => {

      })
    }
  },
  modules: {
  }
})
