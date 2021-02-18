<template>
    <div class="completeRegister">
        <div class="row">
            <div class="col-12">
                <ValidationObserver v-slot="{ invalid }">
                    <form>
                        <ValidationProvider class="input-group mb-3" v-slot="{ errors }" rules="required">
                            <span class="input-group-text" id="usernameSpan">Nombre de usuario</span>
                            <input type="text" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Nombre de usuario" v-model="newUsername" aria-describedby="usernameSpan">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <ValidationProvider class="input-group mb-3" v-slot="{ errors }" rules="required">
                            <span class="input-group-text" id="firstNameSpan">Nombre</span>
                            <input type="text" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Nombre" v-model="newFirstName" aria-describedby="firstNameSpan">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <ValidationProvider class="input-group mb-3" v-slot="{ errors }" rules="required">
                            <span class="input-group-text" id="lastNameSpan">Apellido</span>
                            <input type="text" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Apellido" v-model="newLastName" aria-describedby="lastNameSpan">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <div class="row row-cols-1 row-cols-md-3 g-4">
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'mp'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="defaultPhoto" id="defaultPhoto" value="mp" v-model="newAvatar">
                                            <label class="form-check-label" for="defaultPhoto">
                                                Generico
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'identicon'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="pattern" id="pattern" value="identicon" v-model="newAvatar">
                                            <label class="form-check-label" for="pattern">
                                                Patrones
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'monsterid'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="Monster" id="monster" value="monsterid" v-model="newAvatar">
                                            <label class="form-check-label" for="monster">
                                                Monstruo
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'wavatar'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="wavatar" id="wavatar" value="wavatar" v-model="newAvatar">
                                            <label class="form-check-label" for="wavatar">
                                                Personalizado
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'retro'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="retro" id="retro" value="retro" v-model="newAvatar">
                                            <label class="form-check-label" for="retro">
                                                Retro
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <img :src="avatarSourceRoot+'robohash'" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="robot" id="robot" value="robohash" v-model="newAvatar">
                                            <label class="form-check-label" for="robot">
                                                Robot
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ValidationProvider class="input-group mb-3" v-slot="{ errors }" rules="required">
                            <span class="input-group-text">Descripcion</span>
                            <textarea type="text" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Descripcion" aria-label="Descripcion" v-model="newDescription"></textarea>
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="privacy" v-model="privacy">
                            <label class="form-check-label" for="privacy">
                                Privado
                            </label>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <button type="Submit" class="btn btn-primary" :disabled="invalid" @click="submitUser">Registrarse</button>
                            </div>
                            <div class="col-6">
                                <button type="button" class="btn btn-danger" @click="resetInput">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions } from 'vuex'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
export default {
    name:'complete-register',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data: function() {
        return {
            email: '',
            password: '',
            newUsername: '',
            newFirstName: '',
            newLastName: '',
            newDescription: '',
            privacy: '',
            avatarSourceRoot: '',
            newAvatar: '',
        }
    },
    computed: {
    },
    methods: {
        ...mapActions([
            'registerUser'
        ]),
        submitUser: function() {
            this.axios.get(`/users?username=${this.newUsername}`).then((resUser) => {
                if(resUser.data > 0) {
                    this.$notify({
                        group: 'foo',
                        title: 'Usuario en uso',
                        text: 'El nombre de usuario que coloco ya esta en uso',
                        type: 'error'
                    })   
                } else {
                    this.registerUser({
                        user: {
                            email: this.email,
                            username: this.newUsername,
                            firstName: this.newFirstName,
                            lastName: this.newLastName,
                            description: this.newDescription,
                            private: this.privacy,
                            avatar: this.newAvatar
                        },
                        password: this.password
                    })
                    this.$router.push({
                        name: 'CreatePost'
                    })
                }
            })
        },
        resetInput: function() {
            this.privacy = ''
            this.newUsername = ''
            this.newDescription = ''
            this.newFirstName = ''
            this.newLastName = ''
            this.newAvatar = 'mp'
        }
    },
    beforeMount: function() {
        if(!Cookies.get("registerUser")) {
            this.$toast.error({
                title:'Error',
                message:'El registro expiro.'
            })
            this.$router.push({name:'Home'})
        }
        else {
            this.email = Cookies.getJSON("registerUser").email
            this.password = Cookies.getJSON("registerUser").password
            this.avatarSourceRoot = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.email)}?f=y&&d=`
            this.resetInput();
        }
    }
}
</script>