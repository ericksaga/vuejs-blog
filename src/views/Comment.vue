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
                        <i class="bi bi-x-circle"></i>
                        <i class="bi bi-pencil-square"></i>
                    </div>
                    <p>{{ comment.message }}</p>
                </div>
                <div v-else> 
                    <vue-editor id="commentEditor" v-model="comment.message"></vue-editor>
                    <button type="button" class="btn btn-primary" @click="submitComment">Crear</button>
                    <button type="button" class="btn btn-danger" @click="clearEditor">Cancelar</button>
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
            edit: false
        }
    },
    computed: {
        likesCount: function() {
            return this.comment.likes.length
        }
    },
    methods: {
        clearEditor: function() {
            this.newComment = ''
        },
        submitComment: function() {
            fetch("http://localhost:3000/comments", {
                method:'Post',
                body: JSON.stringify({
                    authorId: 1,
                    postId: this.postId,
                    creationDate: Date().toUTCString,
                    message: this.newComment,
                    likes: []
                })
            })
        }
    },
    beforeMount: function() {
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