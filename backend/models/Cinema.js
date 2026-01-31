const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    screens: [{
        screenNumber: {
            type: Number,
            required: true
        },
        seatLayout: [{
            row: String, // e.g., "A"
            seats: [{
                number: Number,
                type: { type: String, enum: ['Standard', 'Premium'], default: 'Standard' },
                price: Number,
                isBooked: { type: Boolean, default: false } // This might be better managed per show, but structural template here
            }]
        }]
    }]
});

module.exports = mongoose.model('Cinema', cinemaSchema);
