<template>
    <div class="userPosts">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titulo</th>
                    <th>Cantidad de comentarios</th>
                    <th>Cantidad de likes</th>
                    <th>Fecha de creacion</th>
                    <th>Fecha de publicacion</th>
                </tr>
            </thead>
            <tbody>
                <post-summary 
                    v-for="activePost in userPosts"
                    :key="activePost.id"
                    :post="activePost"
                >
                </post-summary>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PostSummary from '../components/PostSummary.vue'
export default {
  components: { PostSummary },
    name:'user-posts',
    data: function() {
        return {
            userId: this.$route.params.userId
        }
    },
    computed: {
        ...mapGetters([
            'homePosts'
        ]),
        userPosts: function() {
            return this.homePosts.filter((post) => post.authorId == this.userId)
        }
    }
}
</script>