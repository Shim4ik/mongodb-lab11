const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required']
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'At least 1 guest is required'],
        max: [10, 'Cannot exceed 10 guests']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Один користувач — одне активне бронювання на кімнату
bookingSchema.index({ room: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);