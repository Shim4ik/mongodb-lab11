const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const {
    getAllRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

// Публічні маршрути
router.get('/', getAllRooms);
router.get('/:id', getRoom);

// Тільки авторизовані
router.post('/', protect, createRoom);
router.put('/:id', protect, updateRoom);

// Тільки адмін
router.delete('/:id', protect, restrictTo('admin'), deleteRoom);
module.exports = router;