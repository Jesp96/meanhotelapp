const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validatePostInpuut(data){
    let errors= {};

    data.text = !isEmpty(data.text) ? data.text: '';
    
    if(!validator.isLength(data.text, { min:1, max:300})){
        errors.text = "bruh you've been writting too much or too little, gotta be between 1 to 300 character"
    }
    if(!validator.isEmpty(data.text)){
        errors.text = 'gotta write sometthing'
    }
    return {
        errors, 
        isValid: isEmpty(errors)
    }
}