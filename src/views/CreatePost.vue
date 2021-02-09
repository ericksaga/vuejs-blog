<template>
    <div class="createPost container">
        <h1>Crear post</h1>
        <div class ="row">  
            <div class="col-12">
                <ValidationObserver v-slot="{ invalid }">
                    <form>
                        <ValidationProvider class="input-group mb3" v-slot="{ errors }" rules="required">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="text" placeholder="Titulo" v-model="title">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </ValidationProvider>
                        <div class="text-start">
                            <div class="btn" :class="!preview?'btn-primary':'btn-light'" @click="preview=false">Escribir</div>
                            <div class="btn" :class="preview?'btn-primary':'btn-light'" @click="preview=true">Visualizar</div>
                        </div>
                        <div v-if="!preview">
                            <froala :tag="'textarea'" :config="config" v-model="postBody"></froala>
                        </div>
                        <froalaView v-else v-model="postBody"></froalaView>
                        <div class="form-check form-switch text-start">
                            <input class="form-check-input" type="checkbox" v-model="acceptComments" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">Aceptar comentarios</label>
                        </div>
                        <div class="btn-group float-start" role="group">
                            <button class="btn btn-primary" type="submit" :disabled="invalid&&getUser" @click="submitPost">Crear</button>
                            <button class="btn btn-secondary" type="submit" :disabled="invalid&&getUser" @click="draftPost">Borrador</button>
                            <button class="btn btn-danger" type="reset" @click="cancelPost">Cancelar</button>
                        </div>
                    </form>
                </ValidationObserver>
            </div>
        </div>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
    name:'create-post',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data: function() {
        return {
            config: {
                events: {
                    'froalaEditor.initialized': function () {
                    console.log('initialized')
                    }
                }
            },
            postId: this.$route.params.postId,
            post : '',
            postBody: '',
            title: '',
            preview: false,
            acceptComments: false
        }
    },
    methods: {
        submitPost: function() {
            if(this.postId) {
                this.post.message = this.postBody
                this.post.title = this.title
                this.post.acceptComments = this.acceptComments
                this.post.edited = true
                this.post.drafted = false
                this.post.deleted = false
                this.post.publicationDate = this.post.publicationDate?this.post.publicationDate:new Date().toISOString()
                fetch(`http://localhost:3000/posts/${this.postId}`, {
                    method:'Put',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.post)
                }).then(() => {
                    this.$toast.success({
                        title:'Exito',
                        message:'El post ha sido publicado.'
                    })
                    this.$router.push({name:'MyPosts'})
                }, () => {
                    this.$toast.error({
                        title:'Error',
                        message:'El post no se ha podido publicar.'
                    })
                })
            }
            else {
                fetch("http://localhost:3000/posts", {
                    method:'Post',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        authorId: this.getUser.id,
                        title: this.title,
                        message: this.postBody,
                        creationDate: new Date().toISOString(),
                        publicationDate: new Date().toISOString(),
                        edited: false,
                        drafted: false,
                        deleted: false,
                        acceptComments: this.acceptComments,
                    })
                }).then(() => {
                    this.$toast.success({
                        title:'Exito',
                        message:'El post ha sido publicado.'
                    })
                    this.$router.push({name:'MyPosts'})
                }, () => {
                    this.$toast.error({
                        title:'Error',
                        message:'El post no se ha podido publicar.'
                    })
                })
            }
        },
        draftPost: function() {
            if(this.postId && this.post.drafted) {
                this.post.message = this.postBody
                this.post.title = this.title
                this.post.acceptComments = this.acceptComments
                this.post.edited = true
                fetch(`http://localhost:3000/posts/${this.postId}`, {
                    method:'Put',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.post)
                })
            }
            else if(!this.postId) {
                fetch("http://localhost:3000/posts", {
                    method:'Post',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        authorId: this.getUser.id,
                        title: this.title,
                        message: this.postBody,
                        creationDate: new Date().toISOString(),
                        publicationDate: null,
                        edited: false,
                        deleted: false,
                        drafted: true,
                        acceptComments: this.acceptComments,
                    })
                }).then(() => {
                    this.$toast.success({
                        title:'Exito',
                        message:'El post se ha guardado.'
                    })
                    this.$router.push({name:'MyPosts'})
                }, () => {
                    this.$toast.error({
                        title:'Error',
                        message:'El post no se ha podido guardar.'
                    })
                })
            } else {
                this.$toast.warn({
                        title:'Advertencia',
                        message:'El post ya ha sido publicado.'
                    })
            }
        },
        cancelPost: function() {
            this.$router.push({name:'MyPosts'})        
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
    },
    beforeMount: function() {
        if(this.postId) {
            fetch(`http://localhost:3000/posts/${this.postId}`).then((response) => {
                response.json().then((resPost) => {
                    this.post = resPost;
                    this.postBody = resPost.message;
                    this.title = resPost.title;
                    this.acceptComments = resPost.acceptComments;
                })
            })
        }
    },
    mounted: function() {
        if(!this.getUser) {
            this.$toast.error({
                title: 'Error',
                message: 'Debe registrarse antes de escribir un post'
            })
        }
    }
}
</script>
