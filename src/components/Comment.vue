<template>
    <div class="comment container" @mouseenter="focus=true" @mouseleave="focus=false">
        <div class="row">
            <div class="col-4">
                <router-link v-if="author.id" :to="{
                    name:'UserPosts',
                    params: {
                        userId: author.id
                    }
                }"> 
                    <img alt="user logo" v-bind:src="avatarSource" class="img-thumbnail">
                    <p>{{ author.username }}</p>
                </router-link>
                <p>{{ comment.creationDate }}</p>
            </div>
            <div class="col-8">
                <div v-if="!edit">
                    <div class="float-end" v-if="commentFocus">
                        <i class="bi bi-x-square" @click="deleteComment"></i>
                        <i class="bi bi-pencil-square" @click="edit=true"></i>
                    </div>
                    <div class="text-start" v-html="comment.message"></div>
                </div>
                <div v-else-if="getUser.id == comment.authorId"> 
                    <vue-editor id="commentEditor" v-model="updatedComment"></vue-editor>
                    <button type="button" class="btn btn-primary" @click="updateComment">Actualizar</button>
                    <button type="button" class="btn btn-danger" @click="cancelModification">Cancelar</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6" @click="likeComment">
                <i v-if="userLiked" class="bi bi-hand-thumbs-up-fill"> {{ likesCount }} </i>
                <i v-else class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
            </div>
      </div>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'
import CryptoJS from 'crypto-js'
export default {
    components: {
        VueEditor
    },
    name: 'comment',
    props: {
        comment:Object
    },
    data: function() {
        return {
            author: {},
            focus: false,
            edit: false,
            updatedComment: '',
            avatarSource:'',
            commentLikes: []
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
        likesCount: function() {
            return this.commentLikes.length
        },
        userLiked: function() {
            return this.commentLikes.find((like) => like.userId == this.getUser.id)
        },
        commentFocus() {
            return this.focus && this.getUser.id == this.comment.authorId
        }
    },
    methods: {
        updateComment: function() {
            this.axios.put(`/comments/${this.comment.id}`, {
                id: this.comment.id,
                authorId: this.comment.authorId,
                postId: this.comment.postId,
                creationDate: this.comment.creationDate,
                message: this.updatedComment,
                likes: this.comment.likes
            }).then(() => {
                this.comment.message = this.updatedComment
                this.edit = false;
            })
        },
        cancelModification: function() {
            this.edit = false;
            this.updatedComment = this.comment.message
        },
        deleteComment: function() {
            this.axios.delete(`/comments/${this.comment.id}`).then(() => {
                this.$emit('updateComments')
            })
        },
        fetchCommentLikes() {
            this.axios.get(`/commentLikes?commentId=${this.comment.id}&valid=true`).then((resLikes) => {
                this.commentLikes = resLikes.data
            })
        },
        likeComment() {
            this.axios.get(`/commentLikes?commentId=${this.comment.id}&userId=${this.getUser.id}`).then((resLike) => {
                if(resLike.data.length > 0) {
                    resLike.data[0].valid = !resLike.data[0].valid;
                    this.axios.put(`/commentLikes/${resLike.data[0].id}`, resLike.data[0]).then(() => {
                        this.fetchCommentLikes()
                    })
                } else {
                    this.axios.post(`/commentLikes`,{
                        userId: this.getUser.id,
                        commentId: this.comment.id,
                        valid: true,
                        creationDate: new Date().toISOString()
                    }).then(() => {
                        this.fetchCommentLikes()
                    })
                }
            })
        }
    },
    beforeMount: function() {
        this.updatedComment = this.comment.message
        this.axios.get(`/users?id=${this.comment.authorId}`).then((resUser) => {
            this.author = resUser.data[0]
            this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.author.email)}?d=${this.author.avatar?this.author.avatar:'mp'}&&f=y`
        })
        this.fetchCommentLikes()
    }
}
</script>

<style scoped>

</style>