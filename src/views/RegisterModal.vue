<template>
    <div class="registerModal">
        <h1>Register</h1>
        <ValidationObserver v-slot="{ invalid }">
            <form>
                <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="email|required">
                    <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="text" placeholder="Email" v-model="username">
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
                <button type="submit" :disabled="invalid" class="btn btn-primary">Registrarse</button>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
// @ is an alias to /src
import { ValidationObserver, ValidationProvider } from 'vee-validate'
export default {
  name: 'register-modal',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    
  },
  computed: {
    
  },
  data: function() {
    return {
      username: '',
      password: '',
      confirmPass: ''
    }
  },
  beforeMount() {
    
  }
}
</script>
