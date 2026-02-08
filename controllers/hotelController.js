const { validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hotels with filters
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      minRating,
      checkInDate,
      checkOutDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // If dates provided, check availability
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Find hotels with available rooms
      const bookedRooms = await Booking.find({
        status: { $ne: 'cancelled' },
        $or: [
          {
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn },
          },
        ],
      }).distinct('roomId');

      const availableRooms = await Room.find({
        _id: { $nin: bookedRooms },
        isAvailable: true,
      }).distinct('hotelId');

      filter._id = { $in: availableRooms };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const hotels = await Hotel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Hotel.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    // Delete associated rooms and bookings
    await Room.deleteMany({ hotelId: hotel._id });
    await Booking.deleteMany({ hotelId: hotel._id });

    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
};
