const express = require('express');
const router = express.Router({ mergeParams: true }); // дозволяє доступ до :roomId з батьківського роутера
const protect = require('../middlewares/protect');
const validate = require('../middlewares/validate');
const { createBookingSchema } = require('../validators/bookingValidator');
const { getBookings, createBooking, deleteBooking } = require('../controllers/bookingController');

router.get('/', getBookings);                                              // публічний
router.post('/', protect, validate(createBookingSchema), createBooking);   // авторизований + валідація
router.delete('/:id', protect, deleteBooking);                             // автор або admin

module.exports = router;