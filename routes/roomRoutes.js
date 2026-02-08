const express = require('express');
const { body } = require('express-validator');
const {
  createRoom,
  getRoomsByHotel,
  updateRoom,
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const roomValidation = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('roomType')
    .isIn(['single', 'double', 'suite'])
    .withMessage('Room type must be single, double, or suite'),
  body('pricePerNight')
    .isFloat({ min: 0 })
    .withMessage('Price per night must be a positive number'),
  body('maxGuests')
    .isInt({ min: 1 })
    .withMessage('Max guests must be at least 1'),
];

router
  .route('/:hotelId')
  .post(protect, admin, roomValidation, createRoom)
  .get(getRoomsByHotel);

router.route('/:id').put(protect, admin, roomValidation, updateRoom);

module.exports = router;
