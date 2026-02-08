const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();

    console.log('Cleared existing data...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
    });

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      phone: '+1234567891',
      role: 'user',
    });

    console.log('Created users...');

    // Create hotels
    const hotel1 = await Hotel.create({
      name: 'Grand Plaza Hotel',
      city: 'New York',
      address: '123 Broadway, New York, NY 10001',
      description:
        'Luxurious hotel in the heart of Manhattan with stunning city views and world-class amenities.',
      pricePerNight: 250,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      ],
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking'],
      totalRooms: 50,
      availableRooms: 45,
    });

    const hotel2 = await Hotel.create({
      name: 'Oceanview Resort',
      city: 'Miami',
      address: '456 Ocean Drive, Miami Beach, FL 33139',
      description:
        'Beachfront resort with direct access to the ocean and tropical paradise atmosphere.',
      pricePerNight: 350,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      ],
      amenities: ['WiFi', 'Pool', 'Beach Access', 'Spa', 'Restaurant', 'Bar'],
      totalRooms: 80,
      availableRooms: 70,
    });

    const hotel3 = await Hotel.create({
      name: 'Mountain Lodge',
      city: 'Denver',
      address: '789 Mountain View Road, Denver, CO 80202',
      description:
        'Cozy mountain lodge perfect for nature lovers and outdoor enthusiasts.',
      pricePerNight: 150,
      rating: 4.2,
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      ],
      amenities: ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
      totalRooms: 30,
      availableRooms: 28,
    });

    console.log('Created hotels...');

    // Create rooms for hotel1
    const rooms1 = await Room.insertMany([
      {
        hotelId: hotel1._id,
        roomNumber: '101',
        roomType: 'single',
        pricePerNight: 200,
        maxGuests: 1,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'AC'],
      },
      {
        hotelId: hotel1._id,
        roomNumber: '102',
        roomType: 'double',
        pricePerNight: 250,
        maxGuests: 2,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
      },
      {
        hotelId: hotel1._id,
        roomNumber: '201',
        roomType: 'suite',
        pricePerNight: 400,
        maxGuests: 4,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'],
      },
    ]);

    // Create rooms for hotel2
    const rooms2 = await Room.insertMany([
      {
        hotelId: hotel2._id,
        roomNumber: '101',
        roomType: 'double',
        pricePerNight: 300,
        maxGuests: 2,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'AC', 'Ocean View', 'Balcony'],
      },
      {
        hotelId: hotel2._id,
        roomNumber: '102',
        roomType: 'suite',
        pricePerNight: 500,
        maxGuests: 4,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'AC', 'Ocean View', 'Balcony', 'Jacuzzi'],
      },
    ]);

    // Create rooms for hotel3
    const rooms3 = await Room.insertMany([
      {
        hotelId: hotel3._id,
        roomNumber: '101',
        roomType: 'single',
        pricePerNight: 120,
        maxGuests: 1,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'Fireplace'],
      },
      {
        hotelId: hotel3._id,
        roomNumber: '102',
        roomType: 'double',
        pricePerNight: 150,
        maxGuests: 2,
        isAvailable: true,
        amenities: ['WiFi', 'TV', 'Fireplace', 'Mountain View'],
      },
    ]);

    console.log('Created rooms...');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@hotel.com');
    console.log('Password: admin123');
    console.log('\nUser credentials:');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    console.log('\nTotal Hotels:', 3);
    console.log('Total Rooms:', rooms1.length + rooms2.length + rooms3.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
