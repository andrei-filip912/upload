const { Double } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_to_movieSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    movies: [{
        title: String,
        url: String,
        length: Double
    }]
}, { timestamps: true});

const  User_to_movie = mongoose.model('User_to_movie', user_to_movieSchema);

module.exports = User_to_movie;