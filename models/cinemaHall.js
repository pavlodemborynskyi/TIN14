const mongoose = require('mongoose');

const cinemaHallSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    nOfSeats: {
        type: Number
    }},{ collection : 'CinemaHall' });


const CinemaHall = mongoose.model('CinemaHall', cinemaHallSchema);

module.exports = CinemaHall;