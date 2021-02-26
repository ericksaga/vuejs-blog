<template>
    <div class="resetModal">
        <h1>Restablecer contraseña</h1>
        <validation-observer v-slot="{ invalid }">
            <form>
                <validation-provider class="input-group mb-3" v-slot="{ errors }" rules="required|email">
                    <span class="input-group-text" id="emailSpan">Correo</span>
                    <input type="text" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Correo" v-model="email" aria-describedby="emailSpan">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
                <button type="submit" class="btn btn-primary" :disabled="invalid" @click="requestChange">Solicitar</button>
            </form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import CryptoJS from 'crypto-js'
import env from '../environment'
export default {
    name:'reset-modal',
    components: {
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            email: ''
        }
    },
    methods: {
        async requestChange() {
            let encryptedEmail = CryptoJS.AES.encrypt(this.email, env.cryptoKey)
            let resEmail = await this.axios.get(`/users?email=${this.email}`)
            if(resEmail.data.length > 0) {
                await this.axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                    service_id: 'service_jy90qmj',
                    template_id: 'template_ywr4jh8',
                    user_id: 'user_tmMKNd0N6HwyyuEJf1CfU',
                    template_params: {
                        'email': this.email,
                        'link': `http://localhost:8080/#/resetPassword?q=${encryptedEmail}`
                    }
                })
                this.$toast.info({
                    title:'Informacion',
                    message:'El Correo ha sido enviado.'
                })
                this.$modal.hide('reset-password')
            } else {
                this.$toast.error({
                    title:'Error',
                    message:'No existe un usuario con este correo.'
                })
            }
        }
    }
}
</script>