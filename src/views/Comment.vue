<template>
    <div class="comment container">
        <div class="row">
            <div class="col-4">
                <img alt="user logo" v-if="author.avatar" v-bind:src="author.avatar" class="img-thumbnail">
                <img alt="user logo" v-else src="../assets/placeholder.jpg" class="img-thumbnail">
                <p>{{ author.username }}</p>
                <p>{{ comment.creationDate }}</p>
            </div>
            <div class="col-8">
                <div v-if="!edit">
                    <div class="text-end">
                        <i class="bi bi-x-square"></i>
                        <i class="bi bi-pencil-square" @click="edit=true"></i>
                    </div>
                    <div v-html="comment.message"></div>
                </div>
                <div v-else-if="getUser.id == comment.authorId"> 
                    <vue-editor id="commentEditor" v-model="updatedComment"></vue-editor>
                    <button type="button" class="btn btn-primary" @click="updateComment">Actualizar</button>
                    <button type="button" class="btn btn-danger" @click="cancelModification">Cancelar</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <!-- <i class="bi bi-hand-thumbs-up-fill"></i> !-->
                <i class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
            </div>
      </div>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'
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
            edit: false,
            updatedComment: ''
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
        likesCount: function() {
            return this.comment.likes.length
        }
    },
    methods: {
        updateComment: function() {
            fetch("http://localhost:3000/comments", {
                method:'Put',
                body: JSON.stringify({
                    id: this.comment.id,
                    authorId: 1,
                    postId: this.postId,
                    creationDate: Date().toUTCString,
                    message: this.updatedComment,
                    likes: []
                })
            }).then(() => {
                this.comment.message = this.updatedComment
            })
        },
        cancelModification: function() {
            this.edit = false;
            this.updatedComment = this.comment.message
        }
    },
    beforeMount: function() {
        this.updatedComment = this.comment.message
        fetch(`http://localhost:3000/users?id=${this.comment.authorId}`).then((response) => {
            response.json().then((resUser) => {
                this.author = resUser[0];
            })
        })
    }
}
</script>

<style scoped>

</style>