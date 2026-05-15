const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: {
        type: String,
        required: [true, 'Room number is required'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Room type is required'],
        enum: {
            values: ['single', 'double', 'suite', 'deluxe'],
            message: 'Type must be one of: single, double, suite, deluxe'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1'],
        max: [10, 'Capacity cannot exceed 10']
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);