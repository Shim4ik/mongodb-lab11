const Room = require('../models/Room');
const AppError = require('../utils/AppError');

exports.getAllRooms = async (query) => {
    const { page = 1, limit = 10, type, available } = query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Фільтрація
    const filter = {};
    if (type) {
        const allowed = ['single', 'double', 'suite', 'deluxe'];
        if (!allowed.includes(type)) throw new AppError(`Invalid type. Must be one of: ${allowed.join(', ')}`, 400);
        filter.type = type;
    }
    if (available !== undefined) {
        filter.available = available === 'true';
    }

    const [rooms, total] = await Promise.all([
        Room.find(filter)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(limitNum),
        Room.countDocuments(filter)
    ]);

    return {
        data: rooms,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum)
        }
    };
};

exports.getRoomById = async (id) => {
    const room = await Room.findById(id).populate('createdBy', 'name');
    if (!room) throw new AppError('Room not found', 404);
    return room;
};

exports.createRoom = async (data, userId) => {
    return await Room.create({ ...data, createdBy: userId });
};

exports.updateRoom = async (id, data, currentUser) => {
    const room = await Room.findById(id);
    if (!room) throw new AppError('Room not found', 404);

    if (
        room.createdBy.toString() !== currentUser._id.toString() &&
        currentUser.role !== 'admin'
    ) {
        throw new AppError('You do not have permission to edit this record', 403);
    }

    Object.assign(room, data);
    await room.save();
    return room;
};

exports.deleteRoom = async (id) => {
    const room = await Room.findByIdAndDelete(id);
    if (!room) throw new AppError('Room not found', 404);
    return room;
};