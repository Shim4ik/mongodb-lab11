const Joi = require('joi');

exports.createBookingSchema = Joi.object({
    checkIn: Joi.date().greater('now').required().messages({
        'date.greater': 'Check-in date must be in the future',
        'any.required': 'Check-in date is required'
    }),
    checkOut: Joi.date().greater(Joi.ref('checkIn')).required().messages({
        'date.greater': 'Check-out date must be after check-in date',
        'any.required': 'Check-out date is required'
    }),
    guests: Joi.number().integer().min(1).max(10).required().messages({
        'number.min': 'At least 1 guest is required',
        'number.max': 'Cannot exceed 10 guests',
        'any.required': 'Number of guests is required'
    })
});