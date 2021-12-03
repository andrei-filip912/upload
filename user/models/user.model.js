const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    movies: [{
        name: {type: String, required: true},
        fileType: {type: String, required: true},
        size:{type: Number, required: true},
        url: {type: String, required: true},
    }]
}, { timestamps: true});

const  UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;