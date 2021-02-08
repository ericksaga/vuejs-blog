<template>
    <div class="Configuration">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <router-link :to="{
                    name:'configurateUser',
                }" 
                v-slot="{ isExactActive , navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Perfil</a>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{
                    name:'UserCommentedPosts',
                    params: {
                        userId: 1
                    }
                }"
                v-slot="{ isExactActive, navigate }" custom>
                    <a class="nav-link" :class="isExactActive ?'active':''" aria-current="page" @click="navigate">Seguridad</a>
                </router-link>
            </li>
        </ul>
        <router-view v-if="getUser"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'configuration',
    data: function() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ])
    }
}
</script>