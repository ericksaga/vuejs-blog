<template>
    <div class="userlikedPosts">
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
                    v-for="activePost in likedPosts"
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
    name:'user-liked-posts',
    data: function() {
        return {
            userId: this.$route.params.userId,
            likedPosts: []
        }
    },
    computed: {
        ...mapGetters([
            'homePosts'
        ])
    },
    beforeMount: function() {
        this.axios.get(`/likes?userId=${this.userId}&valid=true`).then((resLikes) => {
            for(let like of resLikes.data) {
                this.axios.get(`/posts/${like.postId}`).then((resPost) => {
                    this.likedPosts.push(resPost.data)
                })
            }
        })
    }
}
</script>