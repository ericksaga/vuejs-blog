<template>
    <div class="myPublishedPosts">
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
                    v-for="deletedPost in getMyDeletedPosts"
                    :key="deletedPost.id"
                    :post="deletedPost"
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
    name:'deleted-posts',
    data: function() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'getMyDeletedPosts',
            'getUser'
        ])
    }
}
</script>