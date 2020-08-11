const mongoose = require('mongoose');
const crypto = require('crypto');
const { match } = require('assert');

// i am creaating the user model 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// virtual method to asscess user schema to store hash password into db

UserSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//methods for hash password 

UserSchema.methods = {
    comparePassword: function(plainText) {
        return this.encryptPassword(plainText) = this.hashed_password
    },

    encryptPassword: function(password) {
        if(!password) return ""
        try {
            return crypto.createHmac('sha1', secret)
                .update(password)
                .digest('hex');
        } catch(err) {
            return ''
        }
    },
// create the salt 
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = User =  mongoose.model('users', UserSchema);