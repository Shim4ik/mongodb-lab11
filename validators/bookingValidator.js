const Joi = require('joi');

exports.createBookingSchema = Joi.object({
    checkIn: Joi.date()
        .custom((value, helpers) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                return helpers.error('date.past');
            }
            return value;
        })
        .required()
        .messages({
            'date.base':    'Check-in must be a valid date',
            'date.past':    'Check-in date cannot be in the past',
            'any.required': 'Check-in date is required'
        }),

    checkOut: Joi.date()
        .greater(Joi.ref('checkIn'))
        .required()
        .messages({
            'date.base':    'Check-out must be a valid date',
            'date.greater': 'Check-out date must be after check-in date',
            'any.required': 'Check-out date is required'
        }),

    guests: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required()
        .messages({
            'number.base':    'Guests must be a number',
            'number.integer': 'Guests must be a whole number',
            'number.min':     'At least 1 guest is required',
            'number.max':     'Cannot exceed 10 guests',
            'any.required':   'Number of guests is required'
        })
});