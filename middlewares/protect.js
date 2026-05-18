const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
    // 1. Спочатку перевіряємо cookie, потім — заголовок (для Postman)
    let token = req.cookies.token;

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return next(new AppError('Доступ заборонено. Токен відсутній', 401));
    }

    // 2. Верифікувати токен
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Термін дії токена вийшов. Увійдіть знову', 401));
        }
        return next(new AppError('Невірний токен. Увійдіть знову', 401));
    }

    // 3. Знайти користувача за id з токена
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('Користувача не знайдено', 401));

    // 4. Додати користувача до запиту
    req.user = user;
    next();
});

module.exports = protect;
