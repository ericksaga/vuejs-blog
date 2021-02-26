<template>
    <div class="resetPassword">
        <h1>Restablecer contraseña</h1>
        <validation-observer v-slot="{ invalid }">
            <form>
                <validation-provider name="password" class="input-group mb-3" v-slot="{ errors }" rules="required">
                    <span class="input-group-text" id="passwordSpan">Contraseña</span>
                    <input type="password" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Contraseña" v-model="newPassword" aria-describedby="passwordSpan">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
                <validation-provider class="input-group mb-3" v-slot="{ errors }" rules="required|validatePassword:@password">
                    <span class="input-group-text" id="validationSpan">Validar Contraseña</span>
                    <input type="password" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Validar Contraseña" v-model="validatePassword" aria-describedby="validationSpan">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
                <button type="submit" class="btn btn-primary" :disabled="invalid" @click="changePassword">Confirmar</button>
            </form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver} from 'vee-validate'
import CryptoJS from 'crypto-js'
import env from '../environment'
export default {
    name:'reset-password',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            newPassword: '',
            validatePassword: '',
            encryptedEmail: this.$route.query.q
        }
    },
    methods: {
        async changePassword() {
            let email = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(this.encryptedEmail, env.cryptoKey))
            let resUser = await this.axios.get(`/users?email=${email}`)
            if(resUser.data.length > 0) {
                await this.axios.put(`/pass/${resUser.data[0].id}`, {
                    id: resUser.data[0].id,
                    password: this.newPassword
                })
                this.$toast.success({
                    title:'Exito',
                    message:'La contraseña se ha cambiado con exito.'
                })
                this.$router.push({name:'Home'})
            }
        }
    },
    beforeMount() {
        this.encryptedEmail = this.encryptedEmail.replaceAll(' ', '+')
    }
}
</script>