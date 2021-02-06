const { ObjectID } = require('mongodb')
const mongoose = require('mongoose');

const performanceSchema = mongoose.Schema({
    film: {
        type: ObjectID,
        ref: 'Film'
    },
    cinemaHall: {
        type: ObjectID,
        ref: 'CinemaHall'
    },
    date: {
        type: Date,
    }
},{ collection : 'Performance' });


const Performance = mongoose.model('Performance',performanceSchema);

module.exports = Performance;