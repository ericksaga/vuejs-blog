<template>
    <div class="myPosts">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <router-link to="/myPosts/myPublishedPosts" v-slot="{ isExactActive , navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Publicados</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/myPosts/MyDrafts" v-slot="{ isExactActive, navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Borradores</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/myPosts/MyDeletedPosts" v-slot="{ isExactActive, navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Eliminados</a>
                </router-link>
            </li>
        </ul>
        <router-view/>
    </div>    
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name:'my-posts',
    data: function() {
        return({
            
        })
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
    mounted: function() {
        this.fetchPosts();
    }
}
</script>