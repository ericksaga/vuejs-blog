<template>
    <div class="loginModal container">
        <div class="row">
            <div class="col-6">
                <h1>Login</h1>
                <ValidationObserver v-slot="{ invalid }">
                    <form @submit.prevent="submitLogin({'email':email, 'pass':password})">
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required|email">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="text" placeholder="Email" v-model="email">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Password" v-model="password">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="rememberMe" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Recuerdame
                            </label>
                        </div>
                        <div class="text-danger">{{loginError}}</div>
                        <button type="submit" :disabled="invalid" class="btn btn-primary">Entrar</button>
                    </form>
                </ValidationObserver>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions } from 'vuex'
export default {
  name: 'login-modal',
  components: {
    RegisterModal,
    ValidationObserver,
    ValidationProvider
  },
  methods: {
    ...mapActions([
        'logIn'
    ]),
    submitLogin: function(user) {
        this.logIn(user).then(() => {
            this.loginError = ''
        }, (error) => {
            console.log(error)
            this.loginError = error
        })
    }
  },
  computed: {
    
  },
  data: function() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      loginError: ''
    }
  }
}
</script>
