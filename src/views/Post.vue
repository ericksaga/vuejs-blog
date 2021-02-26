<template>
<div class="post container">
    <a @click="$router.back()">Volver al listado</a>
    <div class="row" @mouseenter="focus=true" @mouseleave="focus= false">
        <div class="col-12">
            <div class="float-end" v-if="postFocus">
                <i class="bi bi-x-square float-end" @click="deletePost"></i>
                <i class="bi bi-pencil-square" @click="$router.push({name:'EditPost', params:{'postId':postId}})"></i>
            </div>
            <h1> {{ post.title }} </h1>
        </div>
        <div class="col-4"> 
            <router-link v-if="author.id" :to="{
                name:'UserPosts',
                params: {
                    userId: author.id,
                    page: 1
                }
            }"> 
                <img alt="user logo" v-bind:src="avatarSource" class="img-thumbnail">
                <p>{{ author.username }}</p>
            </router-link>
            <p>{{ post.publicationDate }}</p>
        </div>
        <div class="col-8"> 
            <div v-html="post.message"/>
        </div>
    <p v-if="post.edited">edited</p>
        <div class="col-6" @click="likePost">
            <i v-if="userLiked" class="bi bi-hand-thumbs-up-fill"> {{ likesCount }} </i>
            <i v-else class="bi bi-hand-thumbs-up"> {{ likesCount }}</i>
        </div>
        <div class="col-6">
            <i class="bi bi-chat-left-dots"> {{ commentsCount }}</i>
        </div>
    </div>
    <div v-if="post.acceptComments">
        <h2>Agregar comentario</h2>
        <div v-if="getUser">
            <vue-editor id="postComment" v-model="newComment"></vue-editor>
            <div class="row">
                <div class="d-grid gap-2 col-6">
                    <button type="button" class="btn btn-primary" @click="submitComment">Crear</button>
                </div>
                <div class="d-grid gap-2 col-6">
                    <button type="button" class="btn btn-danger" @click="clearEditor">Cancelar</button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Ingrese a su cuenta para poder comentar</p>
        </div>
    </div>
    <h2>Comentarios</h2>
    <a @click="ascending=!ascending">
        orden: {{ascending?'ascendente':'descendente'}}
    </a>
    <div v-if="ascending">
        <comment v-for="uComment in ascendingComments" 
        :comment="uComment"
        v-on:updateComments="fetchPostComments"
        :key="uComment.id"/>
    </div>
    <div v-else>
        <comment v-for="uComment in descendingComments" 
        :comment="uComment"
        v-on:updateComments="fetchPostComments"
        :key="uComment.id"/>
    </div>
  </div>
</template>

<script>
import Comment from '../components/Comment.vue';
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex';
import CryptoJS from 'crypto-js'
import * as Pusher from "pusher"
const pusher = new Pusher({
  appId: "1156345",
  key: "be9000b34828b60eba12",
  secret: "e6fff20c15e91723fa72",
  cluster: "us2"
});
export default {
    components: { 
        Comment,
        VueEditor
    },
    name: 'post',
    data:function() {
        return {
            postId:this.$route.params.postId,
            author:{},
            post: {},
            likes: [],
            comments: [],
            newComment: '',
            focus: false,
            avatarSource: '',
            ascending: true,
            backPath: ''
        }
    },
    methods: {
        clearEditor: function() {
            this.newComment = ''
        },
        async submitComment() {
            let body = await this.addMentions();
            this.axios.post(`/comments`, {
                authorId: Number(this.getUser.id),
                postId: Number(this.postId),
                creationDate: new Date().toISOString(),
                message: body,
                likes: []
            }).then(() => {
                this.fetchPostComments()
                this.clearEditor()
            })
        },
        fetchPostComments: function(){
            this.axios.get(`/comments?postId=${this.postId}`).then((resComments) => {
                this.comments = resComments.data
            })
        },
        fetchPostLikes: function() {
            this.axios.get(`/likes?postId=${this.postId}&valid=true`).then((resLikes) => {
                this.likes = resLikes.data
            })
        },
        fetchPostAuthor: function() {
            this.axios.get(`/users?id=${this.post.authorId}`).then((resUser) => {
                this.author = resUser.data[0]
                this.avatarSource = `https://www.gravatar.com/avatar/${CryptoJS.MD5(this.author.email)}?d=${this.author.avatar?this.author.avatar:'mp'}&&f=y`
            })
        },
        likePost: function() {
            this.axios.get(`/likes?postId=${this.post.id}&userId=${this.getUser.id}`).then((resLike) => {
                if(resLike.data.length > 0) {
                    resLike.data[0].valid = !resLike.data[0].valid;
                    this.axios.put(`/likes/${resLike.data[0].id}`, resLike.data[0]).then(() => {
                        this.fetchPostLikes()
                    })
                } else {
                    this.axios.post(`/likes`,{
                        userId: this.getUser.id,
                        postId: this.post.id,
                        valid: true,
                        creationDate: new Date().toISOString()
                    }).then(() => {
                        this.fetchPostLikes()
                    })
                }
            })
        },
        deletePost() {
            this.post.deleted = true;
            this.axios.put(`/posts/${this.postId}`, this.post).then(() => {
                this.$toast.success({
                    title:'Exito',
                    message:'El post ha sido eliminado.'
                })
                this.$router.push({name:'MyPosts'})
            })
        },
        addMentions() {
            let mentionRegex = /@([a-zA-Z_0-9]+)/g
            let body = this.newComment.slice();
            let userPromisesArray = []
            for(let mention of this.newComment.matchAll(mentionRegex)) {
                userPromisesArray.push(new Promise((resolve) => {
                    this.axios.get(`/users?username=${mention[1]}`).then((resUser) => {
                        resolve({
                            username: mention[0],
                            id: resUser.data[0]?.id
                        })
                    })
                }))
            }
            return new Promise((resolve) => {
                Promise.all(userPromisesArray).then((val) => {
                    for(let user of val) {
                        if(user.id) {
                            body = body.replace(user.username, `<a href="/#/profile/${user.id}">${user.username}</a>`)
                            pusher.trigger("my-channel", "my-event", {
                                url: `localhost:8080/#/post/${this.post.id}`
                            }).then((success) => {
                                console.log(success)
                            }, (error) => {
                                console.log(error)
                            });
                        }
                    }
                    resolve(body)
                })
            })
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
        likesCount: function() {
            return this.likes.length
        },
        commentsCount: function() {
            return this.comments.length
        },
        userLiked: function() {
            return this.likes.find((like) => like.userId == this.getUser.id)
        },
        postFocus() {
            return this.focus && this.getUser.id == this.post.authorId
        },
        ascendingComments() {
            let comment = [...this.comments]
            comment.sort((a, b) => a.id - b.id)
            return comment;
        },
        descendingComments() {
            let comment = [...this.comments]
            comment.sort((a, b) => b.id - a.id)
            return comment;
        }
    },
    beforeMount: function() {
        this.axios.get(`/posts?id=${this.postId}`).then((resPost) => {
            this.post = resPost.data[0]
            this.fetchPostAuthor()
            this.fetchPostComments()
            this.fetchPostLikes()
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
