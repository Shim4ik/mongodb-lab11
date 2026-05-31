const Booking = require('../models/booking');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

exports.getBookingsByRoom = async (roomId) => {
    return await Booking.find({ room: roomId })
        .populate('user', 'name email');
};

exports.createBooking = async (data, roomId, userId) => {
    // Перевіряємо що кімната існує і доступна
    const room = await Room.findById(roomId);
    if (!room) throw new AppError('Room not found', 404);
    if (!room.available) throw new AppError('Room is not available', 400);

    let booking;
    try {
        booking = await Booking.create({
            ...data,
            room: roomId,
            user: userId
        });
    } catch (err) {
        if (err.code === 11000) {
            throw new AppError('You have already booked this room', 400);
        }
        throw err;
    }

    // Позначаємо кімнату як недоступну
    room.available = false;
    await room.save();

    return booking;
};

exports.deleteBooking = async (bookingId, currentUser) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    if (
        booking.user.toString() !== currentUser._id.toString() &&
        currentUser.role !== 'admin'
    ) {
        throw new AppError('You do not have permission to delete this booking', 403);
    }

    const roomId = booking.room; // зберігаємо до видалення
    await booking.deleteOne();

    // Повертаємо кімнату в доступний стан після скасування бронювання
    await Room.findByIdAndUpdate(roomId, { available: true });

    return booking;
};