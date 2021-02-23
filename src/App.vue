<template>
  <div id="app">
    <div class="container">
      <div class="row justify-content-between">
        <div v-if="!getUser" class="col-3 d-grid gap-2">
          <button class="btn btn-light" @click="openModal">login</button>
        </div>
        <div v-else class="col-3">
          <router-link v-if="getUser.id" :to="{
            name:'UserPosts',
            params: {
              userId: getUser.id,
              page: 1
            }
          }"> 
            {{ getUser.username }}
          </router-link>
        </div>
        <div class="col-6">
          <router-link to='/'>Inicio</router-link>
        </div>
        <div class="col-3">
          <router-link v-if="getUser" to='/createPost'>Crear un post</router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <button class="btn btn-danger" v-if="getUser" @click="logout">Salir</button>
        </div>
      </div>
    </div>
    <router-view/>
    <modal name="login-register">
      <login-modal/>
    </modal>
    <notifications group="foo" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import LoginModal from './views/LoginModal.vue'
import Cookies from 'js-cookie'
export default {
  components: { LoginModal },
  methods: {
    ...mapMutations([
      'updateUser'
    ]),
    openModal: function() {
      this.$modal.show('login-register')
    },
    logout: function() {
      Cookies.remove("userId")
      this.updateUser({user: ''})
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
  },
  watch: {
    getUser: function() {
      if(this.getUser) {
        this.$modal.hide('login-register')
      }
    }
  },
  beforeMount: function() {
    if(Cookies.get("userId")) {
      this.axios.get(`/users/${Number(Cookies.get("userId"))}`).then((resUser) => {
        this.updateUser({user: resUser.data})
      })
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
