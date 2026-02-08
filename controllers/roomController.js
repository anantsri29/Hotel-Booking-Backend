const { validationResult } = require('express-validator');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Create room
// @route   POST /api/rooms/:hotelId
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    const room = await Room.create({
      ...req.body,
      hotelId: req.params.hotelId,
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rooms by hotel
// @route   GET /api/rooms/:hotelId
// @access  Public
const getRoomsByHotel = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate } = req.query;
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    let rooms = await Room.find({ hotelId: req.params.hotelId });

    // If dates provided, filter available rooms
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const Booking = require('../models/Booking');
      const bookedRooms = await Booking.find({
        status: { $ne: 'cancelled' },
        roomId: { $in: rooms.map((r) => r._id) },
        $or: [
          {
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn },
          },
        ],
      }).distinct('roomId');

      rooms = rooms.filter(
        (room) => !bookedRooms.includes(room._id.toString()) && room.isAvailable
      );
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRoomsByHotel,
  updateRoom,
};
