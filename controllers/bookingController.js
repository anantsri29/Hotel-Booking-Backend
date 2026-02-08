const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// Helper function to calculate nights
const calculateNights = (checkIn, checkOut) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.ceil((checkOut - checkIn) / oneDay);
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room belongs to hotel
    if (room.hotelId.toString() !== hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Room does not belong to the specified hotel',
      });
    }

    // Check if room is available
    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available',
      });
    }

    // Check for existing bookings (prevent double booking)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const existingBooking = await Booking.findOne({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the selected dates',
      });
    }

    // Calculate total price
    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.pricePerNight * nights;

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      hotelId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'confirmed',
    });

    // Populate related data
    await booking.populate('hotelId', 'name city address');
    await booking.populate('roomId', 'roomNumber roomType maxGuests');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name city address images')
      .populate('roomId', 'roomNumber roomType maxGuests')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('hotelId', 'name city address')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/cancel/:id
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns the booking or is admin
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability
// @route   GET /api/bookings/availability
// @access  Public
const checkAvailability = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.query;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const existingBooking = await Booking.findOne({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    const isAvailable = !existingBooking;

    res.status(200).json({
      success: true,
      data: {
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        isAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  checkAvailability,
};
