<template>
    <tr class="PostSummary">
        <td> {{ post.id }} </td>
        <td> 
            <router-link :to="'/post/'+post.id">
                {{ post.title }} 
            </router-link>
        </td>
        <td> {{ commentsCount }} </td>
        <td> {{ likesCount }} </td>
        <td> {{ post.creationDate }} </td>
        <td> {{ post.publicationDate }} </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name:'post-summary',
    props: {
        post: Object,
        draft: Boolean
    },
    data: function() {
        return {
            comments: [],
            likes: []
        }
    },
    computed:{
        ...mapGetters([
            'getUser'
        ]),
        commentsCount: function() {
            return this.comments.length;
        },
        likesCount: function() {
            return this.likes.length;
        }
    },
    methods: {
        getComments: function() {
            this.axios.get(`/comments?postId=${this.post.id}`).then((resComments) => {
                this.comments = resComments.data
            })
        },
        getLikes: function() {
            this.axios.get(`/likes?postId=${this.post.id}&valid=true`).then((resLikes) => {
                this.likes = resLikes.data
            })
        }
    },
    beforeMount: function() {
        this.getComments();
        this.getLikes();
    }
}
</script>