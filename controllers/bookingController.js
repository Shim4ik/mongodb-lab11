const catchAsync = require('../utils/catchAsync');
const bookingService = require('../services/bookingService');

exports.getBookings = catchAsync(async (req, res) => {
    const bookings = await bookingService.getBookingsByRoom(req.params.roomId);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

exports.createBooking = catchAsync(async (req, res) => {
    const booking = await bookingService.createBooking(
        req.body,
        req.params.roomId,
        req.user._id
    );
    res.status(201).json({ success: true, data: booking });
});

exports.deleteBooking = catchAsync(async (req, res) => {
    await bookingService.deleteBooking(req.params.id, req.user);
    res.status(200).json({ success: true, message: 'Booking deleted' });
});