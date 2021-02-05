<template>
    <tr class="PostSummary">
        <td> {{ post.id }} </td>
        <td> {{ post.title }} </td>
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
            fetch(`http://localhost:3000/comments?postId=${this.post.id}`).then((response) => {
                response.json().then((resComments) => {
                    this.comments = resComments;
                })
            })
        },
        getLikes: function() {
            fetch(`http://localhost:3000/likes?postId=${this.post.id}`).then((response) => {
                response.json().then((resLikes) => {
                    this.likes = resLikes;
                })
            })
        }
    },
    beforeMount: function() {
        this.getComments();
        this.getLikes();
    }
}
</script>