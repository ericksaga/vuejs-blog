<template>
    <div class="myPublishedPosts">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th @click="postOrder = titleOrder">Titulo</th>
                    <th @click="postOrder = commentOrder">Cantidad de comentarios</th>
                    <th @click="postOrder = likeOrder">Cantidad de likes</th>
                    <th @click="postOrder = creationDateOrder">Fecha de creacion</th>
                    <th @click="postOrder = publishDateOrder">Fecha de publicacion</th>
                </tr>
            </thead>
            <tbody>
                <post-summary 
                    v-for="deletedPost in pageSlice"
                    :key="deletedPost.id"
                    :post="deletedPost"
                >
                </post-summary>
            </tbody>
        </table>
        <nav>
            <ul class="pagination">
                <li class="page-item" :class="page <= 0?'disabled':''">
                    <router-link :to="{
                            name: 'MyDeletedPosts',
                            params: {
                                page: page
                            }
                        }" 
                        class="page-link" :aria-disabled="page <= 0" @click="page--">
                        <i class="bi bi-arrow-left"></i>
                    </router-link>
                </li>
                <li class="page-item">
                    <router-link :to="{
                            name: 'MyDeletedPosts',
                            params: {
                                page: page
                            }
                        }" class="page-link" v-if="page > 0 " >{{page}}</router-link>
                </li>
                <li class="page-item active">
                    <a class="page-link">{{page + 1}}</a>
                </li>
                <li class="page-item">
                    <router-link :to="{
                            name: 'MyDeletedPosts',
                            params: {
                                page: page + 2
                            }
                        }" class="page-link" v-if="page < Math.floor(postOrder.length/25)">{{page + 2}}</router-link>
                </li>
                <li class="page-item" :class="page >= Math.floor(postOrder.length/25)?'disabled':''">
                    <router-link :to="{
                            name: 'MyDeletedPosts',
                            params: {
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
    name:'deleted-posts',
    data: function() {
        return {
            posts: {},
            postOrder: {},
            page: 0
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.posts = [...this.getMyDeletedPosts];
        this.fetchPostsData();
        this.postOrder = this.creationDateOrder;
        this.page = Number(to.params.page) - 1
        next()
    },
    computed: {
        ...mapGetters([
            'getMyDeletedPosts',
            'getUser'
        ]),
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
        this.posts = [...this.getMyDeletedPosts];
        this.fetchPostsData();
        this.postOrder = this.creationDateOrder;
    }
}
</script>