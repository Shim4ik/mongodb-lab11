const Joi = require('joi');

const createRoomSchema = Joi.object({
    number: Joi.string().trim().required().messages({
        'any.required': 'Room number is required'
    }),
    type: Joi.string()
        .valid('single', 'double', 'suite', 'deluxe')
        .required()
        .messages({
            'any.only': 'Type must be one of: single, double, suite, deluxe',
            'any.required': 'Room type is required'
        }),
    price: Joi.number().min(0).required().messages({
        'number.min': 'Price cannot be negative',
        'any.required': 'Price is required'
    }),
    capacity: Joi.number().integer().min(1).max(10).required().messages({
        'number.min': 'Capacity must be at least 1',
        'number.max': 'Capacity cannot exceed 10',
        'any.required': 'Capacity is required'
    }),
    available: Joi.boolean().default(true)
});

module.exports = { createRoomSchema };