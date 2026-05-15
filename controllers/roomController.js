const Room = require('../models/Room');
const AppError = require('../utils/AppError');

// GET /api/rooms — отримати всі кімнати (публічний)
exports.getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find().populate('createdBy', 'name email');
        res.status(200).json({ success: true, count: rooms.length, data:
            rooms });
    } catch (err) {
        next(err);
    }
};

// GET /api/rooms/:id — отримати одну кімнату (публічний)
exports.getRoom = async (req, res, next) => {
    try {
        const room = await
            Room.findById(req.params.id).populate('createdBy', 'name');
        if (!room) return next(new AppError('Room not found', 404));
        res.status(200).json({ success: true, data: room });
    } catch (err) {
        next(err);
    }
};

// POST /api/rooms — створити кімнату (тільки авторизований)
exports.createRoom = async (req, res, next) => {
    try {
        const room = await Room.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json({ success: true, data: room });
    } catch (err) {
        next(err);
    }
};

// PUT /api/rooms/:id — оновити кімнату (тільки авторизований)
exports.updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!room) return next(new AppError('Room not found', 404));
        res.status(200).json({ success: true, data: room });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/rooms/:id — видалити кімнату (тільки admin)
exports.deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return next(new AppError('Room not found', 404));
        res.status(200).json({ success: true, message: 'Room deleted' });
    } catch (err) {
        next(err);
    }
};
