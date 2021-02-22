<template>
    <div class="myDraftedPosts">
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
                    v-for="draftedPost in postOrder"
                    :key="draftedPost.id"
                    :post="draftedPost"
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
    name:'drafted-posts',
    data: function() {
        return {
            posts: {},
            postOrder: {}
        }
    },
    computed: {
        ...mapGetters([
            'getMyDraftedPosts',
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
        this.posts = [...this.getMyDraftedPosts];
        this.fetchPostsData();
        this.postOrder = this.creationDateOrder;
    }
}
</script>