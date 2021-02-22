<template>
    <div class="configurateUser container">
        <div class="row">
            <div class="col-12">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="usernameSpan">Nombre de usuario</span>
                    <input type="text" class="form-control" placeholder="Nombre de usuario" v-model="newUsername" aria-describedby="usernameSpan" required>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="firstNameSpan">Nombre</span>
                    <input type="text" class="form-control" placeholder="Nombre" v-model="newFirstName" aria-describedby="firstNameSpan" required>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="lastNameSpan">Apellido</span>
                    <input type="text" class="form-control" placeholder="Apellido" v-model="newLastName" aria-describedby="lastNameSpan" required>
                </div>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <div class="col">
                        <div class="card">
                            <img :src="this.avatarSourceRoot+'mp'" class="card-img-top" alt="...">
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
                            <img :src="this.avatarSourceRoot+'identicon'" class="card-img-top" alt="...">
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
                            <img :src="this.avatarSourceRoot+'monsterid'" class="card-img-top" alt="...">
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
                            <img :src="this.avatarSourceRoot+'wavatar'" class="card-img-top" alt="...">
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
                            <img :src="this.avatarSourceRoot+'retro'" class="card-img-top" alt="...">
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
                            <img :src="this.avatarSourceRoot+'robohash'" class="card-img-top" alt="...">
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
                <div class="input-group mb-3">
                    <span class="input-group-text">Descripcion</span>
                    <textarea type="text" class="form-control" placeholder="Descripcion" aria-label="Descripcion" v-model="newDescription"></textarea>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="privacy" v-model="privacy">
                    <label class="form-check-label" for="privacy">
                        Privado
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="submitUser">Actualizar</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-danger" @click="resetInput">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CryptoJS from 'crypto-js'
export default {
    name:'configurate-user',
    data: function() {
        return {
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
        ...mapGetters([
            'getUser'
        ])
    },
    methods: {
        ...mapActions([
            'updateUser'
        ]),
        submitUser: function() {
            this.axios.get(`/users?username=${this.newUsername}`).then((resUser) => {
                if(resUser.data.length > 0 && resUser.data[0].id != this.getUser.id) {
                    this.$notify({
                        group: 'foo',
                        title: 'Usuario en uso',
                        text: 'El nombre de usuario que coloco ya esta en uso',
                        type: 'error'
                    })
                } else {
                    this.updateUser({
                        user: {
                            id: this.getUser.id,
                            email: this.getUser.email,
                            username: this.newUsername,
                            firstName: this.newFirstName,
                            lastName: this.newLastName,
                            description: this.newDescription,
                            private: this.privacy,
                            avatar: this.newAvatar
                        }
                    })
                    this.$router.push({
                        name: 'Profile',
                        params: {
                            userId:this.getUser.id
                        }
                    })
                }
            })
        },
        resetInput: function() {
            this.privacy = this.getUser.private
            this.newUsername = this.getUser.username
            this.newDescription = this.getUser.description
            this.newFirstName = this.getUser.firstName
            this.newLastName = this.getUser.lastName
            this.newAvatar = this.getUser.avatar?this.getUser.avatar:'mp'
        }
    },
    beforeMount: function() {
        this.avatarSourceRoot = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.getUser.email)}?f=y&&d=`
        this.resetInput();
    }
}
</script>