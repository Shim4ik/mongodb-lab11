const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1. Перевірка наявності всіх полів
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // 2. Перевірка збігу паролів
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // 3. Перевірка довжини пароля
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // 4. Перевірка унікальності email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // 5. Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Створення користувача
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 7. Відповідь (без пароля)
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        next(err);
    }
};

// Генерація токена
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Вхід користувача
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 1. Перевірка наявності полів
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Введіть email та пароль'
            });
        }

        // 2. Пошук користувача (з паролем, бо select: false)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Невірний email або пароль'
            });
        }

        // 3. Перевірка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Невірний email або пароль'
            });
        }

        // 4. Генерація токена
        const token = generateToken(user._id, user.role);

        // 5. Відповідь
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};

// Отримати профіль поточного користувача
exports.getMe = async (req, res, next) => {
    try {
        // req.user встановлюється middleware protect
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        next(err);
    }
};
