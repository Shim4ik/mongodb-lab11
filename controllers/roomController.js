const catchAsync = require('../utils/catchAsync');
const roomService = require('../services/roomService');

exports.getAllRooms = catchAsync(async (req, res) => {
    const result = await roomService.getAllRooms(req.query);
    res.status(200).json({ success: true, ...result });
});

exports.getRoom = catchAsync(async (req, res) => {
    const room = await roomService.getRoomById(req.params.id);
    res.status(200).json({ success: true, data: room });
});

exports.createRoom = catchAsync(async (req, res) => {
    const room = await roomService.createRoom(req.body, req.user._id);
    res.status(201).json({ success: true, data: room });
});

exports.updateRoom = catchAsync(async (req, res) => {
    const room = await roomService.updateRoom(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: room });
});

exports.deleteRoom = catchAsync(async (req, res) => {
    await roomService.deleteRoom(req.params.id);
    res.status(200).json({ success: true, message: 'Room deleted' });
});