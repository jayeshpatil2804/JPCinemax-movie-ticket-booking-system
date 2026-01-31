const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true
    },
    screenNumber: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: { // Optional, can be calculated
        type: Date
    },
    // We need to track seat availability PER SHOW, independent of the physical cinema structure
    seats: [{
        row: String,
        number: Number,
        type: { type: String, enum: ['Standard', 'Premium', 'PLATINUM', 'GOLD', 'EXECUTIVE', 'SPECIAL', 'STANDARD'] },
        price: Number,
        isBooked: { type: Boolean, default: false },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
    }]
});

module.exports = mongoose.model('Show', showSchema);
