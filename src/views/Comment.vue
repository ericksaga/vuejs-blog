<template>
    <div class="comment container" @mouseenter="focus=true" @mouseleave="focus=false">
        <div class="row">
            <div class="col-4">
                <img alt="user logo" v-if="author.avatar" v-bind:src="author.avatar" class="img-thumbnail">
                <img alt="user logo" v-else src="../assets/placeholder.jpg" class="img-thumbnail">
                <p>{{ author.username }}</p>
                <p>{{ comment.creationDate }}</p>
            </div>
            <div class="col-8">
                <div v-if="!edit">
                    <div class="float-end" v-if="focus && getUser.id == comment.authorId">
                        <i class="bi bi-x-square"></i>
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
            focus: false,
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
            fetch(`http://localhost:3000/comments/${this.comment.id}`, {
                method:'Put',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.comment.id,
                    authorId: this.comment.authorId,
                    postId: this.comment.postId,
                    creationDate: this.comment.creationDate,
                    message: this.updatedComment,
                    likes: this.comment.likes
                })
            }).then(() => {
                this.comment.message = this.updatedComment
                this.edit = false;
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