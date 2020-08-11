const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateLoginInpuut(data) {
    let errors= {};

    data.handle= !isEmpty(data.handle) ? data.handle: '';
    data.bio = !isEmpty(data.bio) ? data.bio: '';

    if(!validator.isLength(data.handle, { min:1, max:15})){
        errors.name = 'name must be between 1 - 15 characters'
    }        
    if(!validator.isLength(data.bio, { min:1, max:300})){
        errors.name = 'name must be between 1 - 300 characters'
    }        

    if(!validator.isEmpty(data.handle)){
        errors.email = 'handle is required'
    }
    if(!validator.isValid(data.bio)){
        errors.email = 'bio is invalid'
    }
    return {
        errors, 
        isValid: isEmpty(errors)
    }
}
