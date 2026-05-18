const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middlewares/protect');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');


router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;