const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
    // 1. Отримати токен з заголовка
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Access denied. Token missing', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2. Верифікувати токен
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Token expired. Please log in again', 401));
        }
        return next(new AppError('Invalid token. Please log in again', 401));
    }

    // 3. Знайти користувача за id з токена
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User not found', 401));

    // 4. Додати користувача до запиту
    req.user = user;
    next();
});

module.exports = protect;