<template>
    <div class="editPost container">
        <h1>Modificar post</h1>
        <div class ="row">  
            <div class="col-12">
                <validation-observer v-slot="{ invalid }">
                    <form>
                        <validation-provider class="input-group mb3" v-slot="{ errors }" rules="required">
                            <input class="form-control" :class="[errors[0]?'is-invalid':'']" type="text" placeholder="Titulo" v-model="title">
                            <div class="invalid-feedback">{{ errors[0] }}</div>
                        </validation-provider>
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
                            <button class="btn btn-primary" type="submit" :disabled="invalid&&getUser" @click="submitPost" v-if="post.drafted">Publicar</button>
                            <button class="btn btn-success" type="submit" :disabled="invalid&&getUser" @click="updatePost">Actualizar</button>
                            <button class="btn btn-secondary" type="reset" @click="cancelPost">Cancelar</button>
                            <button class="btn btn-danger" type="reset" :disabled="!getUser" @click="deletePost">Eliminar</button>
                        </div>
                    </form>
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mapGetters } from 'vuex'
export default {
    name:'edit-post',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
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
        submitPost() {
            this.post.message = this.postBody
            this.post.title = this.title
            this.post.acceptComments = this.acceptComments
            this.post.drafted = false
            this.post.publicationDate = this.post.publicationDate?this.post.publicationDate:new Date().toISOString()
            this.axios.put(`/posts/${this.postId}`, this.post).then(() => {
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
        },
        updatePost() {
            this.post.message = this.postBody
            this.post.title = this.title
            this.post.acceptComments = this.acceptComments
            this.post.edited = this.post.drafted?false:true
            this.axios.put(`/posts/${this.postId}`, this.post)
        },
        cancelPost() {
            this.$router.push({name:'MyPosts'})
        },
        deletePost() {
            this.post.drafted = false
            this.post.deleted = true;
            this.axios.put(`/posts/${this.postId}`, this.post).then(() => {
                this.$toast.success({
                    title:'Exito',
                    message:'El post ha sido eliminado.'
                })
                this.$router.push({name:'MyPosts'})
            })
        }
    },
    computed: {
        ...mapGetters([
            'getUser'
        ]),
    },
    beforeMount() {
        this.axios.get(`/posts/${this.postId}`).then((resPost) => {
            if(this.getUser?.id == resPost.data.authorId) {
                this.post = resPost.data;
                this.postBody = resPost.data.message;
                this.title = resPost.data.title;
                this.acceptComments = resPost.data.acceptComments;
            } else {
                this.$toast.error({
                    title: 'Error',
                    message: 'No tiene permiso para modificar este post'
                })
            }
        })
    },
    mounted() {
        if(!this.getUser) {
            this.$toast.error({
                title: 'Error',
                message: 'Debe registrarse antes de escribir un post'
            })
        }
    }
}
</script>