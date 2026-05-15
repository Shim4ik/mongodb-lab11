const bcrypt = require('bcryptjs');
const User = require('../models/user');
const AppError = require('../utils/AppError');

exports.registerUser = async ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword) {
        throw new AppError('All fields are required', 400);
    }

    if (password !== confirmPassword) {
        throw new AppError('Passwords do not match', 400);
    }

    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('User with this email already exists', 409);

    // Пароль хешується автоматично через pre-save hook у моделі
    const user = await User.create({ name, email, password });
    return user;
};

exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    return user;
};