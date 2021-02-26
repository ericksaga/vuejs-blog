<template>
    <div class="myPosts">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <router-link to="/myPosts/myPublishedPosts" v-slot="{ isActive }" custom>
                    <router-link to="/myPosts/myPublishedPosts/1" v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Publicados</a>
                    </router-link>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/myPosts/myDrafts" v-slot="{ isActive }" custom>
                    <router-link to="/myPosts/myDrafts/1" v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Borradores</a>
                    </router-link>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/myPosts/myDeletedPosts" v-slot="{ isActive }" custom>
                    <router-link to="/myPosts/myDeletedPosts/1" v-slot="{ navigate }" custom>
                        <a class="nav-link" :class="isActive ?'active':''" aria-current="page" @click="navigate">Eliminados</a>
                    </router-link>
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