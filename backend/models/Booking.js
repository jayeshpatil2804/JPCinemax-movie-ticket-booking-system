const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    // Explicitly define seats as an array of objects to prevent CastError
    seats: [{
        _id: false, // Disable auto-ID for subdocuments if not needed, but safe to keep default
        row: { type: String, required: true },
        number: { type: Number, required: true },
        price: { type: Number, required: true },
        type: { type: String, default: 'STANDARD' }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    bookingId: {
        type: String,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    qrCode: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
