import { extend } from "vee-validate"
import { email, required } from "vee-validate/dist/rules"

extend('email', {
    ...email,
    message: "La entrada no es un correo valido"
})
extend('required', {
    ...required,
    message: "La entrada debe tener algun valor"
})
extend('validatePassword', {
    validate(value, args) {
        return value == args.password?true:'Las contraseñas no coinciden'
    },
    params: ['password']
})