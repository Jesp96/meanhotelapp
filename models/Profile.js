const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        unique: true,
        require: true,
        max: 70
    },
    bio: {
        type: String,
        require: true,
        max: 250
    },
    skills: {
        // array of strings
        type: [String]
    },
    website: {
        type: String
    },
    social: {
        type: [String]
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile =  mongoose.model('profile', UserSchema);