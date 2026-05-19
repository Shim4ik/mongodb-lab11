const Booking = require('../models/booking');
const AppError = require('../utils/AppError');

exports.getBookingsByRoom = async (roomId) => {
    return await Booking.find({ room: roomId })
        .populate('user', 'name email');
};

exports.createBooking = async (data, roomId, userId) => {
    try {
        return await Booking.create({
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

    await booking.deleteOne();
    return booking;
};