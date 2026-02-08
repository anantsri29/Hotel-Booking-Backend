const express = require('express');
const { body } = require('express-validator');
const {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const hotelValidation = [
  body('name').trim().notEmpty().withMessage('Hotel name is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('pricePerNight')
    .isFloat({ min: 0 })
    .withMessage('Price per night must be a positive number'),
  body('totalRooms')
    .isInt({ min: 1 })
    .withMessage('Total rooms must be at least 1'),
  body('availableRooms')
    .isInt({ min: 0 })
    .withMessage('Available rooms cannot be negative'),
];

router
  .route('/')
  .post(protect, admin, hotelValidation, createHotel)
  .get(getHotels);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, admin, hotelValidation, updateHotel)
  .delete(protect, admin, deleteHotel);

module.exports = router;
