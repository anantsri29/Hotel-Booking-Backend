const express = require('express');
const { body, query } = require('express-validator');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  checkAvailability,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const bookingValidation = [
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('checkInDate')
    .isISO8601()
    .withMessage('Please provide a valid check-in date'),
  body('checkOutDate')
    .isISO8601()
    .withMessage('Please provide a valid check-out date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkInDate)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
];

router.post('/', protect, bookingValidation, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/admin', protect, admin, getAllBookings);
router.put('/cancel/:id', protect, cancelBooking);
router.get(
  '/availability',
  [
    query('roomId').notEmpty().withMessage('Room ID is required'),
    query('checkInDate')
      .isISO8601()
      .withMessage('Please provide a valid check-in date'),
    query('checkOutDate')
      .isISO8601()
      .withMessage('Please provide a valid check-out date'),
  ],
  checkAvailability
);

module.exports = router;
