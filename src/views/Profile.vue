<template>
    <div class="Profile container">
        <div class="row">
            <h2>{{user.username}}</h2>
            <div class="col-4">
                <img alt="user logo" v-bind:src="avatarSource" class="img-thumbnail">
            </div>
            <div class="col-8" v-if="userStatus">
                <p>Nombre: {{user.firstName}}</p>
                <p>Apellido: {{user.lastName}}</p>
                <router-link to="/configuration" v-if="getUser.id == user.id">Configuracion</router-link>
                <br>
                <router-link to="/myPosts/myPublishedPosts/1" v-if="getUser.id == user.id">Posts</router-link>
            </div>
            <div class="col-8" v-else>
                El perfil de este usuario es privado.
            </div>
        </div>
        <div class="row" v-if="userStatus">
            <div class="col-12">
                Descripcion:
                <p>{{user.description}}</p>
            </div>
        </div>
        <ul class="nav nav-pills nav-fill" v-if="userStatus">
            <li class="nav-item">
                <router-link :to="'/profile/'+userId+'/userPosts'" v-slot="{ isActive }" custom>
                    <router-link :to="{
                        name:'UserPosts',
                        params: {
                            userId: userId,
                            page: 1
                        }
                    }"
                    v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Posts</a>
                    </router-link>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="'/profile/'+userId+'/userCommentedPosts'" v-slot="{ isActive }" custom>
                    <router-link :to="{
                        name:'UserCommentedPosts',
                        params: {
                            userId: userId,
                            page: 1
                        }
                    }"
                    v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Posts comentados</a>
                    </router-link>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="'/profile/'+userId+'/userLikedPosts'" v-slot="{ isActive }" custom>
                    <router-link :to="{
                        name:'UserLikedPosts',
                        params: {
                            userId: userId,
                            page: 1
                        }
                    }"
                    v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Posts que me gustan</a>
                    </router-link>
                </router-link>
            </li>
        </ul>
        <router-view v-if="userStatus"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CryptoJS from 'crypto-js'
export default {
    name:'profile',
    data: function() {
        return {
            userId: this.$route.params.userId,
            user: {},
            avatarSource: ''
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
        userStatus() {
            return this.getUser.id == this.user.id || !this.user.private
        }
    },
    methods: {
        ...mapActions([
            'fetchPosts'
        ])
    },
    beforeMount: function() {
        this.fetchPosts();
        this.axios.get(`/users/${this.userId}`).then((resUser) => {
            if(resUser.data) {
                this.user = resUser.data
                this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.user.email)}?d=${this.user.avatar?this.user.avatar:'mp'}&&f=y`
            }
        })
    }
}
</script>