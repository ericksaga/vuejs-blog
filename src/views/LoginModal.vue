<template>
    <div class="loginModal container">
        <div class="row">
            <div class="col-6">
                <h1>Login</h1>
                <div class="input-group mb3">
                    <input class="form-control" type="text" placeholder="Email" :value="username">
                </div>
                <div class="input-group mb3">
                    <input class="form-control" type="password" placeholder="Password" :value="password">
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" :value="rememberMe" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                        Recuerdame
                    </label>
                </div>
                <button class="btn btn-primary">Entrar</button>
            </div>
            <div class="col-6">
                <register-modal></register-modal>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import RegisterModal from '../views/RegisterModal.vue'
export default {
  name: 'login-modal',
  components: {
    RegisterModal
    
  },
  methods: {
    
  },
  computed: {
    
  },
  data: function() {
    return {
      username: '',
      password: '',
      rememberMe: false
    }
  },
  beforeMount() {
    
  }
}
</script>
