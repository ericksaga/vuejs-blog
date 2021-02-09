<template>
    <div class="Profile container">
        <div class="row">
            <h2>{{user.username}}</h2>
            <div class="col-4">
                <img alt="user logo" v-bind:src="avatarSource" class="img-thumbnail">
            </div>
            <div class="col-8" v-if="getUser.id == user.id || !user.private">
                <p>Nombre: {{user.firstName}}</p>
                <p>Apellido: {{user.lastName}}</p>
                <router-link to="/configuration" v-if="getUser.id == user.id">Configuracion</router-link>
                <br>
                <router-link to="/myPosts/myPublishedPosts" v-if="getUser.id == user.id">Posts</router-link>
            </div>
            <div class="col-8" v-else>
                El perfil de este usuario es privado.
            </div>
        </div>
        <div class="row" v-if="getUser.id == user.id || !user.private">
            <div class="col-12">
                Descripcion:
                <p>{{user.description}}</p>
            </div>
        </div>
        <ul class="nav nav-pills nav-fill" v-if="getUser.id == user.id || !user.private">
            <li class="nav-item">
                <router-link :to="{
                    name:'UserPosts',
                    params: {
                        userId: userId
                    }
                }" 
                v-slot="{ isExactActive , navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Posts</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{
                    name:'UserCommentedPosts',
                    params: {
                        userId: userId
                    }
                }"
                v-slot="{ isExactActive, navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Posts comentados</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{
                    name:'UserLikedPosts',
                    params: {
                        userId: userId
                    }
                }"
                v-slot="{ isExactActive, navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Posts que me gustan</a>
                </router-link>
            </li>
        </ul>
        <router-view v-if="getUser.id == user.id || !user.private"/>
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
        ])
    },
    methods: {
        ...mapActions([
            'fetchPosts'
        ])
    },
    beforeMount: function() {
        this.fetchPosts();
        fetch(`http://localhost:3000/users/${this.userId}`).then((response) => {
            response.json().then((resUser) => {
                if(resUser) {
                    this.user = resUser
                    this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.user.email)}?d=${this.user.avatar?this.user.avatar:'mp'}&&f=y`
                }
            })
        })
    }
}
</script>