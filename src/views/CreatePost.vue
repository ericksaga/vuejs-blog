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
            post : '',
            postBody: '',
            title: '',
            preview: false,
            acceptComments: false
        }
    },
    methods: {
        submitPost: function() {
            this.axios.post(`/posts`, {
                authorId: this.getUser.id,
                title: this.title,
                message: this.postBody,
                creationDate: new Date().toISOString(),
                publicationDate: new Date().toISOString(),
                edited: false,
                drafted: false,
                deleted: false,
                acceptComments: this.acceptComments,
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
        },
        draftPost: function() {
            this.axios.post(`/posts`, {
                authorId: this.getUser.id,
                title: this.title,
                message: this.postBody,
                creationDate: new Date().toISOString(),
                publicationDate: null,
                edited: false,
                deleted: false,
                drafted: true,
                acceptComments: this.acceptComments,
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
