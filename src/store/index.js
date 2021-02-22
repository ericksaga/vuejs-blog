import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: '',
  },
  getters: {
    homePosts(state) {
      return state.posts.filter(post => !post.drafted && !post.deleted)
    },
    getPost(state, payload) {
      return state.posts.find(post => post.id == payload.id)
    },
    getUser(state) {
      return state.user
    },
    getUserPosts(state) {
      return state.posts.filter(post => post.authorId == state.user.id && !post.drafted && !post.deleted)
    },
    getMyDraftedPosts(state) {
      return state.posts.filter(post => post.authorId == state.user.id && post.drafted)
    },
    getMyDeletedPosts(state) {
      return state.posts.filter(post => post.authorId == state.user.id && post.deleted)
    }
  },
  mutations: {
    uploadPosts(state, payload) {
      state.posts = payload.posts
    },
    updateUser(state, payload) {
      state.user = payload.user
    }
  },
  actions: {
    fetchPosts(context) {
      axios.get('/posts').then((response) => {
        response.data.sort((a, b) => {
          let aDate = new Date(a.publicationDate?a.publicationDate:a.creationDate)
          let bDate = new Date(b.publicationDate?b.publicationDate:b.creationDate)
          return bDate - aDate
        })
        context.commit('uploadPosts', {
          posts: response.data
        })
      })
    },
    logIn(context, args) {
      return new Promise( function(resolve, reject) {
        axios.get(`/users?email=${args.email}`).then((resUser) => {
          if(resUser.data[0]) {
            axios.get(`/pass?id=${resUser.data[0].id}&password=${args.pass}`).then((passRes) => {
              if(passRes.data[0]) {
                context.commit('updateUser', {
                  user: resUser.data[0]
                })
                resolve('')
              } else {
                reject('Contraseña incorrecta')
              }
            })
          } else {
            reject('El usuario no fue encontrado')
          }
        })
      })
    },
    updateUser(context, args) {
      axios.put(`/users/${args.user.id}`, args.user).then(() => {
        context.commit('updateUser', {
          user: args.user
        })
      })
    },
    registerUser(context, args) {
      axios.post('/users', args.user).then((resUser) => {
        context.commit('updateUser', {
          user: resUser.data
        })
        axios.post('/pass', {
          id: resUser.data.id,
          password: args.password
        })
      })
    }
    
  },
  modules: {
  }
})
