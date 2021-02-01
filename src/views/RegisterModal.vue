<template>
    <div class="registerModal container">
        <div class="row">
            <div class="col-12">
                <h1>Register</h1>
                <div class="input-group mb3">
                    <input class="form-control" type="text" placeholder="Email" :value="username">
                </div>
                <div class="input-group mb3">
                    <input class="form-control" type="password" placeholder="Password" :value="password">
                </div>
                <div class="input-group mb3">
                    <input class="form-control" type="password" placeholder="Confirm password" :value="confirmPass">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'register-modal',
  components: {
    
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
