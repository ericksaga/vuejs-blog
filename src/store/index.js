import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: '',
  },
  getters: {
    homePosts: state => {
      return state.posts.filter(post => !post.drafted && !post.deleted)
    },
    getPost(state, payload) {
      return state.posts.find(post => post.id == payload.id)
    },
    getUser: state => {
      return state.user
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
      fetch("http://localhost:3000/posts").then((response) => {
        response.json().then((resPost) => {
          context.commit('uploadPosts', {
            posts: resPost
          })
        })
      }, () => {
        //in case of fail
      })
    },
    logIn(context, args) {
      return new Promise( function(resolve, reject) {
        fetch(`http://localhost:3000/users?email=${args.email}`).then((response) => {
          response.json().then((resUser) => {
            if(resUser[0]){
              fetch(`http://localhost:3000/pass?id=${resUser[0].id}&pass=${args.pass}`).then((passResponse) => {
                passResponse.json().then((res) => {
                  if(res[0]) {
                    console.log(resUser)
                    context.commit('updateUser', {
                      user: resUser[0]
                    })
                    resolve('')
                  } else {
                    reject('Contraseña incorrecta')
                  }
                })
              })
            } else {
              reject('El usuario no fue encontrado')
            }
          })
        })
      })
      
    }
    
  },
  modules: {
  }
})
