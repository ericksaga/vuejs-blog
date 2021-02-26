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
                            name: 'UserPosts',
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
                            name: 'UserPosts',
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
                            name: 'UserPosts',
                            params: {
                                userId: userId,
                                page: page + 2
                            }
                        }" class="page-link" v-if="page < Math.floor(postOrder.length/25)">{{page + 2}}</router-link>
                </li>
                <li class="page-item" :class="page >= Math.floor(postOrder.length/25)?'disabled':''">
                    <router-link :to="{
                            name: 'UserPosts',
                            params: {
                                userId: userId,
                                page: page + 2
                            }
                        }" class="page-link" :aria-disabled="page >= Math.floor(postOrder.length/25)">
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
    name:'user-posts',
    data: function() {
        return {
            userId: this.$route.params.userId,
            posts: [],
            postOrder: [],
            page: 0
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.posts = [...this.userPosts];
        this.fetchPostsData();
        this.postOrder = this.creationDateOrder;
        this.page = Number(to.params.page) - 1
        next()
    },
    computed: {
        ...mapGetters([
            'homePosts'
        ]),
        userPosts: function() {
            return this.homePosts.filter((post) => post.authorId == this.userId)
        },
        publishDateOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => {
                let aDate = new Date(a.publicationDate)
                let bDate = new Date(b.publicationDate)
                return bDate - aDate
            })
        },
        creationDateOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => {
                let aDate = new Date(a.creationDate)
                let bDate = new Date(b.creationDate)
                return bDate - aDate
            })
        },
        commentOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => b.comments - a.comments)
        },
        likeOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => b.likes - a.likes)
        },
        titleOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => a.title.localeCompare(b.title))
        },
        pageSlice() {
            return this.postOrder.slice(25*this.page, 25*(this.page+1))
        }
    },
    methods: {
        fetchLikes() {
            let userPost = [];
            let userPromisesArray = []
            for(let post of this.posts) {
                userPromisesArray.push(new Promise((resolve) => {
                    this.axios.get(`/likes?postId=${post.id}&valid=true`).then((resLikes) => {
                        resolve({
                            ...post,
                            likes:resLikes.data.length
                        })
                    })
                }))
            }
            return new Promise((resolve) => {
                Promise.all(userPromisesArray).then((posts) => {
                    for(let post of posts) {
                        userPost.push(post)
                    }
                    resolve(userPost)
                })
            })
        },
        fetchComments() {
            let userPost = [];
            let userPromisesArray = []
            for(let post of this.posts) {
                userPromisesArray.push(new Promise((resolve) => {
                    this.axios.get(`/comments?postId=${post.id}`).then((resComments) => {
                        resolve({
                            ...post,
                            comments:resComments.data.length
                        })
                    })
                }))
            }
            return new Promise((resolve) => {
                Promise.all(userPromisesArray).then((posts) => {
                    for(let post of posts) {
                        userPost.push(post)
                    }
                    resolve(userPost)
                })
            })
        },
        async fetchPostsData() {
            this.posts = await this.fetchLikes();
            this.posts = await this.fetchComments();
        }
    },
    beforeMount() {
        this.posts = [...this.userPosts];
        this.fetchPostsData();
        this.postOrder = this.creationDateOrder;
    }
}
</script>