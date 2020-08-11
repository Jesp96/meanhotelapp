const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateResgisterInpuut(data) {
    let errors= {};

    data.name = !isEmpty(data.name) ? data.name: '';
    data.email = !isEmpty(data.email) ? data.email: '';
    data.password = !isEmpty(data.password) ? data.password: '';
    data.password2 = !isEmpty(data.password2) ? data.password2: '';

    if(!validator.isLength(data.name, { min:1, max:80})){
        errors.name = 'name must be between 1 - 80 characters'
    }
    if(!validator.isEmpty(data.name)){
        errors.name = 'name is required'
    }
    if(!validator.isEmpty(data.email)){
        errors.email = 'email is required'
    }
    if(!validator.isEmpty(data.password)){
        errors.password = 'password is required'
    }
    if(!validator.isEmpty(data.password2)){
        errors.password2 = 'password is required'
    }
    if(!validator.isLength(data.password, { min:8})){
        errors.password = 'password muct be at least 8 characters and must contain special character such as !?<@#'
    }
    if(!validator.equals(data.password, data.password2)){
        errors.password2 = 'password muct match'
    }
    if(!validator.isValid(data.email)){
        errors.email = 'email is invalid'
    }
    return {
        errors, 
        isValid: isEmpty(errors)
    }
}
