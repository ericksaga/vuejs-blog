<template>
    <div class="configurateSecurity container">
        <div class="row">
            <div class="col-12">
                <h1>Login</h1>
                <ValidationObserver v-slot="{ invalid }">
                    <form @submit.prevent="changePassword()">
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Nueva contraseña" v-model="newPassword">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" :rules="'required|validatePassword:'+newPassword">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Reescriba la contraseña" v-model="newPasswordValidation">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="password" placeholder="Contraseña anterior" v-model="oldPassword">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <button type="submit" :disabled="invalid" class="btn btn-primary">Entrar</button>
                    </form>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
    name:'configurate-security',
    components: {
        ValidationObserver,
        ValidationProvider
    },
    data: function() {
        return {
            newPassword: '',
            newPasswordValidation: '',
            oldPassword: ''
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ])
    },
    methods: {
        changePassword: function() {
            fetch(`http://localhost:3000/pass?id=${this.getUser.id}&password=${this.oldPassword}`).then((response) => {
                response.json().then((resPass)=> {
                    if(resPass.length > 0) {
                        fetch(`http://localhost:3000/pass/${this.getUser.id}`, {
                            method:'Put',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: this.getUser.id,
                                password: this.newPassword
                            })
                        }).then((response) => {
                            if(response.status != 404) {
                                this.$notify({
                                    group: 'foo',
                                    title: 'exito',
                                    text: 'La contraseña se ha cambiado con exito',
                                    type: 'success'
                                })
                                this.$router.push({
                                    name: 'Profile',
                                    params: {
                                        userId:this.getUser.id
                                    }
                                })
                            }
                        })
                    } else {
                        this.$notify({
                            group: 'foo',
                            title: 'Contraseña incorrecta',
                            text: 'La contraseña colocada no es correcta',
                            type: 'error'
                        })
                    }
                })
            })
        }
    }
}
</script>