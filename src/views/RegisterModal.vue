<template>
    <div class="registerModal">
        <h1>Register</h1>
        <ValidationObserver v-slot="{ invalid }">
            <form>
                <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="email|required">
                    <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="text" placeholder="Email" v-model="email">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </ValidationProvider>
                <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required">
                    <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Password" v-model="password">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </ValidationProvider>
                <ValidationProvider class="input-group mb3" v-slot="{ errors }" :rules="'required|validatePassword:'+ password">
                    <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Confirm password" v-model="confirmPass">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </ValidationProvider>
                <button type="submit" :disabled="invalid" class="btn btn-primary" @click="submitRegister">Registrarse</button>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
// @ is an alias to /src
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Cookies from 'js-cookie'
export default {
  name: 'register-modal',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    submitRegister: function() {
      this.axios.get(`/users?email=${this.email}`).then((resUser) => {
        if(resUser.data.lenght > 0) {
          this.$toast.error({
            title:'Error',
            message:'El email esta en uso.'
          })
        } else {
          let expire1h = 1/24;
          if(!Cookies.get("registerUser")){
            Cookies.set("registerUser", {
              email: this.email,
              password: this.password
            }, {expires: expire1h});
          } else {
            Cookies.remove("registerUser")
            Cookies.set("registerUser", {
              email: this.email,
              password: this.password
            }, {expires: expire1h});
          }
          this.axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: 'service_jy90qmj',
            template_id: 'template_ooidvlo',
            user_id: 'user_tmMKNd0N6HwyyuEJf1CfU',
            template_params: {
              'email': this.email,
              'link': `http://localhost:8080/#/completeRegistration`
            }
          }).then(() => {
            this.$toast.info({
              title:'Informacion',
              message:'El Correo ha sido enviado.'
            })
            this.$modal.hide('login-register')
          })
        }
      })
    }
  },
  computed: {
    
  },
  data: function() {
    return {
      email: '',
      password: '',
      confirmPass: ''
    }
  },
  beforeMount() {
    
  }
}
</script>
