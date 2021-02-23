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
                    v-for="activePost in pageSlice"
                    :key="activePost.id"
                    :post="activePost"
                >
                </post-summary>
            </tbody>
        </table>
        <nav>
            <ul class="pagination">
                <li class="page-item" :class="page <= 0?'disabled':''">
                    <router-link :to="{
                            name: 'UserCommentedPosts',
                            params: {
                                userId: userId,
                                page: page
                            }
                        }"
                        class="page-link" :aria-disabled="page <= 0" @click="page--">
                        <i class="bi bi-arrow-left"></i>
                    </router-link>
                </li>
                <li class="page-item">
                    <router-link :to="{
                            name: 'UserCommentedPosts',
                            params: {
                                userId: userId,
                                page: page
                            }
                        }" class="page-link" v-if="page > 0 " >{{page}}</router-link>
                </li>
                <li class="page-item active">
                    <a class="page-link">{{page + 1}}</a>
                </li>
                <li class="page-item">
                    <router-link :to="{
                            name: 'UserCommentedPosts',
                            params: {
                                userId: userId,
                                page: page + 2
                            }
                        }" class="page-link" v-if="page < Math.floor(commentedPosts.length/25)">{{page + 2}}</router-link>
                </li>
                <li class="page-item" :class="page >= Math.floor(commentedPosts.length/25)?'disabled':''">
                    <router-link :to="{
                            name: 'UserCommentedPosts',
                            params: {
                                userId: userId,
                                page: page + 2
                            }
                        }" class="page-link" :aria-disabled="page >= Math.floor(commentedPosts.length/25)">
                        <i class="bi bi-arrow-right"></i>
                    </router-link>
                </li>
            </ul>
        </nav>
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
            commentedPosts: [],
            page: 0
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.page = Number(to.params.page) - 1
        next()
    },
    computed: {
        ...mapGetters([
            'homePosts'
        ]),
        sortedPosts() {
            let posts = [...this.commentedPosts]
            return posts.sort((a, b) => {
                let aDate = new Date(a.publicationDate)
                let bDate = new Date(b.publicationDate)
                return bDate - aDate
            })
        },
        pageSlice() {
            return this.sortedPosts.slice(25*this.page, 25*(this.page + 1))
        }
    },
    methods: {
        async fetchCommentedPosts() {
            let comments = await this.axios.get(`/comments?authorId=${this.userId}`)
            for(let comment of comments.data) {
                if(!this.commentedPosts.find((post) => post.id == comment.postId)) {
                    let post = await this.axios.get(`/posts/${comment.postId}`)
                    this.commentedPosts.push(post.data);
                }
            }
            
        }
    },
    beforeMount() {
        this.fetchCommentedPosts()
    }
}
</script>