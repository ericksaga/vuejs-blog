<template>
    <div class="userCommentedPosts">
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
                    v-for="activePost in commentedPosts"
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
    name:'user-commented-posts',
    data: function() {
        return {
            userId: this.$route.params.userId,
            commentedPosts: []
        }
    },
    computed: {
        ...mapGetters([
            'homePosts'
        ])
    },
    beforeMount: function() {
        this.axios.get(`/comments?authorId=${this.userId}`).then((resComments) => {
            for(let comment of resComments.data) {
                if(!this.commentedPosts.find((post) => post.id == comment.postId)) {
                    this.commentedPosts.push(this.homePosts.find((post) => post.id == comment.postId));
                }
            }
        })
    }
}
</script>