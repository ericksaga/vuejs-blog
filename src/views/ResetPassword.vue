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
                <validation-provider class="input-group mb-3" v-slot="{ errors }" rules="required|validatePassword@password">
                    <span class="input-group-text" id="validationSpan">Contraseña</span>
                    <input type="password" class="form-control" :class="[errors[0]?'is-invalid':'']" placeholder="Contraseña" v-model="validatePassword" aria-describedby="validationSpan">
                    <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
                <button type="submit" class="btn btn-primary" :disabled="invalid" @click="changePassword"> </button>
            </form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver} from 'vee-validate'
export default {
    name:'reset-password',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    methods: {
        changePassword() {

        }
    }
}
</script>