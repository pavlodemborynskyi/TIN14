const { ObjectID } = require('mongodb')
const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    genre: {
        type: ObjectID,
        ref: 'Genre'
    },
    director:{
        type: String,
    },
    country:{
        type: String
    }
},{ collection : 'Film' });


const Film = mongoose.model('Film',filmSchema);

module.exports = Film;