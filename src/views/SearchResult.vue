<template>
    <div class="searchResult">
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
                            name: 'SearchResult',
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
                            name: 'SearchResult',
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
                            name: 'SearchResult',
                            params: {
                                page: page + 2
                            }
                        }" class="page-link" v-if="page < Math.floor(posts.length/25)">{{page + 2}}</router-link>
                </li>
                <li class="page-item" :class="page >= Math.floor(posts.length/25)?'disabled':''">
                    <router-link :to="{
                            name: 'SearchResult',
                            params: {
                                page: page + 2
                            }
                        }" class="page-link" :aria-disabled="page >= Math.floor(posts.length/25)">
                        <i class="bi bi-arrow-right"></i>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import PostSummary from '../components/PostSummary.vue'
export default {
    name: 'search-result',
    components: { PostSummary },
    data: function() {
        return {
            posts: [],
            page: 0,
            searchParam: this.$route.query.search,
            searchValue: this.$route.query.value
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.fetchPosts();
        this.page = Number(to.params.page) - 1
        this.searchParam = to.query.search,
        this.searchValue = to.query.value
        next()
    },
    computed: {
        publishDateOrder() {
            let posts = [...this.posts]
            return posts.sort((a, b) => {
                let aDate = new Date(a.publicationDate)
                let bDate = new Date(b.publicationDate)
                return bDate - aDate
            })
        },
        pageSlice() {
            return this.publishDateOrder.slice(25*this.page, 25*(this.page+1))
        }
    },
    methods: {
        async fetchUsers() {
            let users = await this.axios.get(`/users`)
            return users.data
        },
        async fetchPosts() {
            let posts = await this.axios.get("/posts?drafted=false&deleted=false")
            let users = await this.fetchUsers()
            let searchPost = []
            for(let post of posts.data) {
                let user = users.find((user) => user.id = post.authorId)
                if(user){
                    searchPost.push({...post, author: user.username})
                }
            }
            this.posts = searchPost.filter(post => {
                return post[this.searchParam].includes(this.searchValue)
            })
        }
    },
    beforeMount() {
        this.fetchPosts();
    }
}
</script>