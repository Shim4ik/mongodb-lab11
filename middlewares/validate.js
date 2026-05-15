const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const messages = error.details.map((d) => d.message).join('; ');
        return next(new AppError(messages, 400));
    }

    req.body = value; // підставляємо очищені та приведені значення
    next();
};

module.exports = validate;